"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { formatINR } from "@/lib/currency";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  CreditCard,
  FileText,
  Home,
  MapPin,
  Phone,
  Printer,
  ReceiptText,
  ShoppingBag,
  ShoppingCart,
  User,
} from "lucide-react";

interface MedicationLineItem {
  medicine: string;
  strength: string;
  morning: boolean;
  afternoon: boolean;
  night: boolean;
  duration: string;
  quantity: string;
  price: number;
  total: number;
}

interface InvoiceDocument {
  invoice: {
    number: string;
    date: string;
    orderId: string;
    paymentMethod: string;
    paymentStatus: string;
  };
  patient: {
    name: string;
    id: string;
    age: string | number;
    gender: string;
    phone: string;
    email: string;
    address: string;
  };
  doctor: {
    name: string;
    registrationNo: string;
    consultationDate: string;
  };
  medications: MedicationLineItem[];
  instructions: string[];
  additionalNotes: string;
  billing: {
    subtotal: number;
    discount: number;
    gst: number;
    shipping: number;
    grandTotal: number;
  };
  payment: {
    transactionId: string;
    paymentDate: string;
  };
  followUp: {
    date: string;
    time: string;
    mode: string;
  };
  support: {
    phone: string;
    email: string;
    website: string;
  };
}

interface InvoiceApiResponse {
  invoice: InvoiceDocument;
}

const fetchInvoiceFromApi = async (userId: string): Promise<InvoiceApiResponse | null> => {
  try {
    const { data: orders, error: orderError } = await supabase
      .from("orders")
      .select("*, payments(*), order_items(*)")
      .eq("user_id", userId)
      .eq("payment_status", "paid")
      .order("created_at", { ascending: false })
      .limit(1);

    if (orderError || !orders || orders.length === 0) {
      console.log("No paid orders found for user", orderError);
      return null;
    }

    const order = orders[0];
    const payment = order.payments && order.payments.length > 0 ? order.payments[0] : null;

    const { data: profile } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    // Fetch shipping address using user_id
    let patientAddress = "N/A";
    const { data: address, error: addressError } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", userId)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
      
    if (addressError) {
      console.error("DEBUG: Error fetching address for user:", userId, addressError);
    }
      
    if (address) {
      patientAddress = [
        address.house_no,
        address.address_line_1,
        address.address_line_2,
        address.landmark,
        address.city,
        address.state,
        address.postal_code,
        address.country,
      ].filter(Boolean).join(", ");
    }

    const invoiceDoc: InvoiceDocument = {
      invoice: {
        number: order.invoice_no || `INV-${order.id.slice(0, 8)}`,
        date: order.created_at,
        orderId: order.id,
        paymentMethod: payment?.payment_method || "Razorpay",
        paymentStatus: "PAID",
      },
      patient: {
        name: profile?.name || "Patient",
        id: userId.slice(0, 12),
        age: (profile?.metadata as any)?.age || "N/A",
        gender: (profile?.metadata as any)?.gender || "N/A",
        phone: profile?.phone || "N/A",
        email: profile?.email || "N/A",
        address: patientAddress,
      },
      doctor: {
        name: "Dr. Hemant Gupta",
        registrationNo: "DMC/R/2025/001234",
        consultationDate: order.created_at,
      },
      medications: [], // Will be populated when doctor prescribes
      instructions: [
        "Patient has been evaluated.",
        "Follow-up scheduled as per protocol.",
      ],
      additionalNotes: "Medication timing may be adjusted after doctor review during the next follow-up.",
      billing: {
        subtotal: order.original_amount - (order.discount_amount || 0),
        discount: order.discount_amount || 0,
        gst: order.tax_amount || 0,
        shipping: 0,
        grandTotal: order.grand_total,
      },
      payment: {
        transactionId: payment?.provider_payment_id || "N/A",
        paymentDate: payment?.created_at || order.created_at,
      },
      followUp: {
        date: "TBD",
        time: "TBD",
        mode: "Video Consultation",
      },
      support: {
        phone: "+91 98765 43210",
        email: "support@genestac.com",
        website: "www.genestac.com",
      },
    };

    return { invoice: invoiceDoc };
  } catch (error) {
    console.error("Failed to fetch invoice:", error);
    return null;
  }
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const DoseCheck = ({ active }: { active: boolean }) => (
  <span
    className={`mx-auto flex h-5 w-5 items-center justify-center rounded border text-[10px] ${
      active
        ? "border-blue-600 bg-blue-600 text-white"
        : "border-slate-300 bg-white text-transparent"
    }`}
  >
    ✓
  </span>
);

const Page = () => {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isBypassed, setIsBypassed] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceDocument | null>(null);

  useEffect(() => {
    const fetchCartCount = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;
      try {
        const res = await fetch("/api/cart", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok) {
          const items = await res.json();
          setCartCount(Array.isArray(items) ? items.length : 0);
        }
      } catch { setCartCount(0); }
    };
    fetchCartCount();
  }, []);

  useEffect(() => {
    const loadPage = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const bypassed = urlParams.get("bypassAuth") === "true";
      setIsBypassed(bypassed);

      if (bypassed) {
        setUser({
          id: "mock-user-7788",
          email: "patient@genestac.com",
          user_metadata: { full_name: "Amit Sharma" },
        });
      } else {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          router.push("/login");
          return;
        }

        setUser(session.user);
        const response = await fetchInvoiceFromApi(session.user.id);
        if (response) {
          setInvoiceData(response.invoice);
        }
      }
      setLoading(false);
    };

    loadPage();
  }, [router]);

  const displayName: string =
    user?.user_metadata?.full_name ?? user?.email ?? "User";
  const initials = displayName.slice(0, 2).toUpperCase();
  const userId = user?.id?.slice(0, 8) ?? "";

  const NAV = [
    {
      label: "Dashboard",
      icon: <Home className="w-4 h-4" />,
      href: `/dashboard${isBypassed ? "?bypassAuth=true" : ""}`,
    },
    {
      label: "Cart",
      icon: <ShoppingCart className="w-4 h-4" />,
      href: `/dashboard/cart${isBypassed ? "?bypassAuth=true" : ""}`,
      badge: cartCount > 0 ? cartCount : undefined,
    },
    {
      label: "Orders",
      icon: <ShoppingBag className="w-4 h-4" />,
      href: `/dashboard/orders${isBypassed ? "?bypassAuth=true" : ""}`,
    },
    {
      label: "Track Order",
      icon: <MapPin className="w-4 h-4" />,
      href: `/dashboard/track${isBypassed ? "?bypassAuth=true" : ""}`,
    },
    {
      label: "Invoices",
      icon: <ReceiptText className="w-4 h-4" />,
      href: `/dashboard/invoices${isBypassed ? "?bypassAuth=true" : ""}`,
      active: true,
    },
  ];

  if (loading || !invoiceData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">
          Loading invoice summary...
        </p>
      </div>
    );
  }

  return (
    <>
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 shadow-sm z-30 shrink-0 sticky top-0">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
              Patient Portal
            </span>
            {isBypassed && (
              <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                Inspection Mode
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard${isBypassed ? "?bypassAuth=true" : ""}`}
              className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-3 py-2 rounded-xl border border-slate-200 shadow-sm transition text-xs"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500" /> Back to Portal
            </Link>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-2 rounded-xl shadow-sm transition text-xs"
            >
              <Printer className="w-4 h-4" /> Print
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-md">
                {initials}
              </div>
              <span className="text-xs font-bold text-slate-700 hidden sm:block">
                {displayName}
              </span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-slate-50/40">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider">
                  <ReceiptText className="w-3.5 h-3.5" />
                  API Demo Payload
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-3">
                  Tax Invoice & Medication Summary
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Combined patient billing and medicine instruction sheet.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3">
                  <p className="font-bold text-slate-400 uppercase tracking-wider">
                    Invoice No.
                  </p>
                  <p className="font-black text-slate-900 mt-1">
                    {invoiceData.invoice.number}
                  </p>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3">
                  <p className="font-bold text-emerald-700 uppercase tracking-wider">
                    Payment
                  </p>
                  <p className="font-black text-emerald-800 mt-1">
                    {invoiceData.invoice.paymentStatus}
                  </p>
                </div>
              </div>
            </div>

            <article className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
              <div className="p-6 md:p-8 border-b border-slate-100 bg-gradient-to-r from-slate-900 to-blue-950 text-white flex flex-col md:flex-row md:items-start md:justify-between gap-5">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-white p-1 shadow-lg">
                    <Image
                      src="/logo.jpeg"
                      alt="Genestac logo"
                      width={64}
                      height={64}
                      className="h-full w-full object-contain"
                      priority
                    />
                  </div>
                  <div>
                    <p className="text-sm font-black tracking-[0.25em] uppercase text-blue-100">
                      GENESTAC
                    </p>
                    <h2 className="text-2xl font-black mt-2">
                      Tax Invoice & Medication Summary
                    </h2>
                    <p className="text-xs text-slate-300 mt-2 max-w-xl">
                      This document summarizes payment, services, medicine
                      timing, duration, and support details for the patient.
                    </p>
                  </div>
                </div>
                <div className="text-left md:text-right text-xs space-y-1">
                  <p className="font-bold text-slate-300">Invoice Date</p>
                  <p className="text-lg font-black">
                    {formatDate(invoiceData.invoice.date)}
                  </p>
                  <p className="text-slate-300">
                    Order ID: {invoiceData.invoice.orderId}
                  </p>
                </div>
              </div>

              <section className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-5 border-b border-slate-100">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                  <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                    <FileText className="w-4 h-4 text-blue-600" />
                    Invoice Information
                  </div>
                  <dl className="mt-4 space-y-3 text-xs">
                    <div className="flex justify-between gap-4">
                      <dt className="text-slate-500 font-bold">Invoice No.</dt>
                      <dd className="text-slate-900 font-black">
                        {invoiceData.invoice.number}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-slate-500 font-bold">
                        Payment Method
                      </dt>
                      <dd className="text-slate-900 font-black">
                        {invoiceData.invoice.paymentMethod}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-slate-500 font-bold">
                        Payment Status
                      </dt>
                      <dd className="text-emerald-700 font-black">
                        {invoiceData.invoice.paymentStatus}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                  <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                    <User className="w-4 h-4 text-blue-600" />
                    Patient Details
                  </div>
                  <dl className="mt-4 space-y-3 text-xs">
                    {[
                      ["Patient Name", invoiceData.patient.name],
                      ["Patient ID", invoiceData.patient.id],
                      [
                        "Age / Gender",
                        `${invoiceData.patient.age} / ${invoiceData.patient.gender}`,
                      ],
                      ["Phone", invoiceData.patient.phone],
                      ["Email", invoiceData.patient.email],
                      ["Address", invoiceData.patient.address],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <dt className="text-slate-500 font-bold">{label}</dt>
                        <dd className="text-slate-900 font-black mt-0.5">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                  <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    Consulting Doctor
                  </div>
                  <dl className="mt-4 space-y-3 text-xs">
                    <div>
                      <dt className="text-slate-500 font-bold">Doctor Name</dt>
                      <dd className="text-slate-900 font-black mt-0.5">
                        {invoiceData.doctor.name}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500 font-bold">
                        Registration No.
                      </dt>
                      <dd className="text-slate-900 font-black mt-0.5">
                        {invoiceData.doctor.registrationNo}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500 font-bold">
                        Consultation Date
                      </dt>
                      <dd className="text-slate-900 font-black mt-0.5">
                        {formatDate(invoiceData.doctor.consultationDate)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </section>

              <section className="p-6 md:p-8 border-b border-slate-100">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-4">
                  Medication Summary
                </h3>
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full min-w-[600px] md:min-w-full text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-4 py-3 text-left font-black">
                          Medicine
                        </th>
                        <th className="px-4 py-3 text-left font-black">
                          Strength
                        </th>
                        <th className="px-4 py-3 text-center font-black">
                          Morning
                        </th>
                        <th className="px-4 py-3 text-center font-black">
                          Afternoon
                        </th>
                        <th className="px-4 py-3 text-center font-black">
                          Night
                        </th>
                        <th className="px-4 py-3 text-right font-black">
                          Duration
                        </th>
                        <th className="px-4 py-3 text-right font-black">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-right font-black">
                          Price
                        </th>
                        <th className="px-4 py-3 text-right font-black">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {invoiceData.medications.map((medication) => {
                        const medicationTotal =
                          medication.total ?? medication.price ?? 0;

                        return (
                          <tr key={medication.medicine}>
                            <td className="px-4 py-3 font-black text-slate-900">
                              {medication.medicine}
                            </td>
                            <td className="px-4 py-3 font-bold text-slate-600">
                              {medication.strength}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <DoseCheck active={medication.morning} />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <DoseCheck active={medication.afternoon} />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <DoseCheck active={medication.night} />
                            </td>
                            <td className="px-4 py-3 text-right font-bold text-slate-700">
                              {medication.duration}
                            </td>
                            <td className="px-4 py-3 text-right font-bold text-slate-700">
                              {medication.quantity}
                            </td>
                            <td className="px-4 py-3 text-right font-bold text-slate-700">
                              {formatINR(medication.price)}
                            </td>
                            <td className="px-4 py-3 text-right font-black text-slate-900">
                              {formatINR(medicationTotal)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-4">
                    Instructions
                  </h3>
                  <div className="space-y-2">
                    {invoiceData.instructions.map((instruction) => (
                      <div
                        key={instruction}
                        className="flex items-start gap-2 rounded-xl bg-slate-50 border border-slate-100 px-3 py-2 text-sm font-semibold text-slate-700"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{instruction}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                    <p className="text-xs font-black uppercase tracking-wider text-blue-700">
                      Additional Notes
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-700">
                      {invoiceData.additionalNotes}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-4">
                    Billing Summary
                  </h3>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="font-bold text-slate-500">Subtotal</dt>
                      <dd className="font-black text-slate-900">
                        {formatINR(invoiceData.billing.subtotal)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="font-bold text-slate-500">Discount</dt>
                      <dd className="font-black text-emerald-700">
                        -{formatINR(invoiceData.billing.discount)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="font-bold text-slate-500">GST</dt>
                      <dd className="font-black text-slate-900">
                        {formatINR(invoiceData.billing.gst)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="font-bold text-slate-500">Shipping</dt>
                      <dd className="font-black text-slate-900">
                        {formatINR(invoiceData.billing.shipping)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4 border-t border-slate-200 pt-4">
                      <dt className="font-black text-slate-900">Grand Total</dt>
                      <dd className="text-xl font-black text-blue-700">
                        {formatINR(invoiceData.billing.grandTotal)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </section>

              <section className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-5 border-b border-slate-100">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                  <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    Payment Details
                  </div>
                  <p className="text-xs font-bold text-slate-500 mt-4">
                    Transaction ID
                  </p>
                  <p className="text-sm font-black text-slate-900 mt-1">
                    {invoiceData.payment.transactionId}
                  </p>
                  <p className="text-xs font-bold text-slate-500 mt-3">
                    Payment Date
                  </p>
                  <p className="text-sm font-black text-slate-900 mt-1">
                    {formatDate(invoiceData.payment.paymentDate)}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                  <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    Next Follow-up
                  </div>
                  <p className="text-xs font-bold text-slate-500 mt-4">Date</p>
                  <p className="text-sm font-black text-slate-900 mt-1">
                    {formatDate(invoiceData.followUp.date)}
                  </p>
                  <p className="text-xs font-bold text-slate-500 mt-3">Time</p>
                  <p className="text-sm font-black text-slate-900 mt-1">
                    {invoiceData.followUp.time}
                  </p>
                  <p className="mt-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700 border border-blue-100">
                    {invoiceData.followUp.mode}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                  <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                    <Phone className="w-4 h-4 text-blue-600" />
                    Support
                  </div>
                  <p className="text-xs font-bold text-slate-500 mt-4">Phone</p>
                  <p className="text-sm font-black text-slate-900 mt-1">
                    {invoiceData.support.phone}
                  </p>
                  <p className="text-xs font-bold text-slate-500 mt-3">Email</p>
                  <p className="text-sm font-black text-slate-900 mt-1">
                    {invoiceData.support.email}
                  </p>
                  <p className="text-xs font-bold text-slate-500 mt-3">
                    Website
                  </p>
                  <p className="text-sm font-black text-slate-900 mt-1">
                    {invoiceData.support.website}
                  </p>
                </div>
              </section>

              <footer className="p-6 md:p-8 text-center">
                <p className="text-xs font-semibold text-slate-500">
                  This invoice is computer generated and does not require a
                  physical signature.
                </p>
                <p className="text-sm font-black text-slate-900 mt-3">
                  Thank you for choosing Genestac.
                </p>
                <p className="text-sm font-semibold text-slate-600 mt-1">
                  We wish you a healthy weight-loss journey.
                </p>
              </footer>
            </article>
          </div>
        </div>
    </>
  );
};

export default Page;
