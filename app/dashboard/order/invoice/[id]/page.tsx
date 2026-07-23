"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, FileText } from "lucide-react";

export default function InvoiceViewPage() {
  const params = useParams();
  const invoiceNo = params.id as string;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/order"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Plans
          </Link>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-slate-800">
              Invoice {invoiceNo}
            </span>
          </div>
        </div>
        <a
          href={`/api/invoice/${invoiceNo}`}
          download={`invoice-${invoiceNo}.html`}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm"
        >
          <Download className="w-4 h-4" />
          Download
        </a>
      </header>

      <div className="flex-1 p-6">
        {invoiceNo && (
          <iframe
            src={`/api/invoice/${invoiceNo}`}
            className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm"
            style={{ height: "calc(100vh - 140px)" }}
            title={`Invoice ${invoiceNo}`}
          />
        )}
      </div>
    </div>
  );
}
