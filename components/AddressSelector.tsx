"use client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { Plus, MapPin, Check, Loader2, Pencil, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Address {
  id: string;
  user_id: string;
  house_no: string;
  address_line_1: string;
  address_line_2: string;
  landmark: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  is_default: boolean;
}

interface AddressSelectorProps {
  userId: string;
  selectedAddressId: string | null;
  onSelect: (id: string) => void;
}

const emptyForm = {
  house_no: "",
  address_line_1: "",
  address_line_2: "",
  landmark: "",
  city: "",
  state: "",
  country: "India",
  postal_code: "",
  is_default: false,
};

export default function AddressSelector({
  userId,
  selectedAddressId,
  onSelect,
}: AddressSelectorProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchAddresses = useCallback(async () => {
    try {
      const res = await fetch(`/api/users/addresses?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        setAddresses(data.data);
        const defaultAddr = data.data.find((a: Address) => a.is_default);
        if (defaultAddr && !selectedAddressId) {
          onSelect(defaultAddr.id);
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [userId, selectedAddressId, onSelect]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.house_no.trim()) errs.house_no = "Required";
    if (!form.address_line_1.trim()) errs.address_line_1 = "Required";
    if (!form.city.trim()) errs.city = "Required";
    if (!form.state.trim()) errs.state = "Required";
    if (!/^\d{6}$/.test(form.postal_code)) errs.postal_code = "Must be 6 digits";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const isEditing = !!editingId;
      const url = isEditing ? "/api/users/addresses" : "/api/users/addresses";
      const method = isEditing ? "PATCH" : "POST";
      const body: any = { userId, ...form };
      if (isEditing) body.id = editingId;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      toast.success(isEditing ? "Address updated" : "Address saved");
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        const refetch = await fetch(`/api/users/addresses?userId=${userId}`);
        const refetchData = await refetch.json();
        if (refetchData.success) {
          setAddresses(refetchData.data);
        }
      }
      onSelect(data.data.id);
    } catch {
      toast.error("Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (addr: Address) => {
    setEditingId(addr.id);
    setForm({
      house_no: addr.house_no,
      address_line_1: addr.address_line_1,
      address_line_2: addr.address_line_2 || "",
      landmark: addr.landmark || "",
      city: addr.city,
      state: addr.state,
      country: addr.country,
      postal_code: addr.postal_code,
      is_default: addr.is_default,
    });
    setShowForm(true);
    setErrors({});
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-slate-400 py-4">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        Loading addresses…
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Shipping Address
        </label>
        {!showForm && addresses.length > 0 && (
          <button
            onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
            className="text-[10px] font-bold text-blue-600 flex items-center gap-1 hover:underline"
          >
            <Plus className="w-3 h-3" />
            Add New
          </button>
        )}
      </div>

      {showForm ? (
        <div className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              {editingId ? "Edit Address" : "New Address"}
            </span>
            <button onClick={cancelForm} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-semibold text-slate-500">House / Flat No *</label>
              <input
                value={form.house_no}
                onChange={(e) => setForm({ ...form, house_no: e.target.value })}
                className="w-full mt-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              {errors.house_no && <p className="text-[10px] text-red-500 mt-0.5">{errors.house_no}</p>}
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-500">Landmark</label>
              <input
                value={form.landmark}
                onChange={(e) => setForm({ ...form, landmark: e.target.value })}
                className="w-full mt-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-semibold text-slate-500">Address Line 1 *</label>
            <input
              value={form.address_line_1}
              onChange={(e) => setForm({ ...form, address_line_1: e.target.value })}
              className="w-full mt-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            {errors.address_line_1 && <p className="text-[10px] text-red-500 mt-0.5">{errors.address_line_1}</p>}
          </div>
          <div>
            <label className="text-[10px] font-semibold text-slate-500">Address Line 2</label>
            <input
              value={form.address_line_2}
              onChange={(e) => setForm({ ...form, address_line_2: e.target.value })}
              className="w-full mt-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-semibold text-slate-500">City *</label>
              <input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full mt-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              {errors.city && <p className="text-[10px] text-red-500 mt-0.5">{errors.city}</p>}
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-500">State *</label>
              <input
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full mt-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              {errors.state && <p className="text-[10px] text-red-500 mt-0.5">{errors.state}</p>}
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-500">Postal Code *</label>
              <input
                value={form.postal_code}
                onChange={(e) => setForm({ ...form, postal_code: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                maxLength={6}
                className="w-full mt-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              {errors.postal_code && <p className="text-[10px] text-red-500 mt-0.5">{errors.postal_code}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_default"
              checked={form.is_default}
              onChange={(e) => setForm({ ...form, is_default: e.target.checked })}
              className="rounded border-slate-300"
            />
            <label htmlFor="is_default" className="text-[11px] text-slate-600 font-medium">
              Set as default address
            </label>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              {saving ? "Saving…" : editingId ? "Update Address" : "Save Address"}
            </button>
            <button
              onClick={cancelForm}
              className="px-4 py-2.5 text-xs font-bold text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-slate-200 rounded-2xl">
          <MapPin className="w-6 h-6 text-slate-300 mx-auto mb-1" />
          <p className="text-xs text-slate-400">No saved addresses</p>
          <button
            onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
            className="mt-2 text-xs font-bold text-blue-600 hover:underline"
          >
            Add a delivery address
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`relative p-3 rounded-2xl border transition cursor-pointer ${
                selectedAddressId === addr.id
                  ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500/20"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <button
                onClick={() => onSelect(addr.id)}
                className="w-full text-left"
              >
                <div className="flex items-start gap-2">
                  <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    selectedAddressId === addr.id ? "border-blue-600" : "border-slate-300"
                  }`}>
                    {selectedAddressId === addr.id && (
                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-800">
                      {addr.house_no}, {addr.address_line_1}
                    </p>
                    {(addr.address_line_2 || addr.landmark) && (
                      <p className="text-[10px] text-slate-500">
                        {[addr.address_line_2, addr.landmark].filter(Boolean).join(", ")}
                      </p>
                    )}
                    <p className="text-[10px] text-slate-400">
                      {addr.city}, {addr.state} - {addr.postal_code}
                    </p>
                    {addr.is_default && (
                      <span className="inline-block mt-1 text-[9px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                </div>
              </button>
              <button
                onClick={() => startEdit(addr)}
                className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                title="Edit address"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
