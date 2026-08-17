const fs = require('fs');
let code = fs.readFileSync('app/dashboard/cart/page.tsx', 'utf8');

// Imports to add
const uploadImport = `import { uploadToCloudinary } from "@/lib/cloudinary";\nimport { FileUp, CalendarCheck } from "lucide-react";\n`;
code = code.replace(`import { supabase } from "@/lib/supabase";`, uploadImport + `import { supabase } from "@/lib/supabase";`);

// State variables to add
const states = `
  const [prescriptionUrl, setPrescriptionUrl] = useState<string | null>(null);
  const [isUploadingRx, setIsUploadingRx] = useState(false);
  const [bookingConsultation, setBookingConsultation] = useState(false);
`;
code = code.replace(`const [activeCoupon, setActiveCoupon] = useState<string | null>(null);`, states + `\n  const [activeCoupon, setActiveCoupon] = useState<string | null>(null);`);

// Functions for Rx
const rxFunctions = `
  const requiresRx = cart.some((item) => item.requires_prescription);
  const hasFulfilledRx = prescriptionUrl !== null || bookingConsultation || !requiresRx;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingRx(true);
    try {
      const url = await uploadToCloudinary(file);
      setPrescriptionUrl(url);
      setBookingConsultation(false);
    } catch (err: any) {
      alert("Failed to upload prescription: " + err.message);
    } finally {
      setIsUploadingRx(false);
    }
  };

  const handleBookConsultation = async () => {
    setBookingConsultation(true);
    setPrescriptionUrl(null);
    try {
      const { data, error } = await supabase.from("plans").select("*").order("created_at", { ascending: true }).limit(1).single();
      if (data && !error) {
        addToCart({
          id: data.id,
          name: data.cart_name || data.name,
          price: data.price,
          image: data.image_url || "/cropped-Genestac-Logo-1-300x300-removebg-preview.png",
          category: "plan",
          planId: data.id
        });
      }
    } catch (err) {
      console.error("Failed to fetch consultation plan", err);
    }
  };
`;
code = code.replace(`const gstPercentage = pricing?.gstPercentage ?? 0;`, rxFunctions + `\n  const gstPercentage = pricing?.gstPercentage ?? 0;`);

// UI logic
const rxUI = `
                  {/* Prescription Section */}
                  {requiresRx && (
                    <div className="pt-2 border-t border-slate-100">
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                        <h4 className="text-amber-800 font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                          <ShieldCheck className="w-4 h-4" /> Prescription Required
                        </h4>
                        <p className="text-amber-700 text-xs mb-3">
                          One or more items in your cart require a valid medical prescription.
                        </p>
                        
                        {!hasFulfilledRx ? (
                          <div className="flex flex-col gap-2">
                            <label className="flex items-center justify-center gap-2 w-full bg-white border border-amber-300 text-amber-700 hover:bg-amber-100 px-4 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition">
                              {isUploadingRx ? (
                                <span className="animate-spin h-4 w-4 border-2 border-amber-700 border-t-transparent rounded-full" />
                              ) : (
                                <FileUp className="w-4 h-4" />
                              )}
                              {isUploadingRx ? "Uploading..." : "Upload Prescription"}
                              <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileUpload} disabled={isUploadingRx} />
                            </label>
                            
                            <div className="text-center text-[10px] text-amber-600 font-semibold my-1">OR</div>
                            
                            <button onClick={handleBookConsultation} className="flex items-center justify-center gap-2 w-full bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition">
                              <CalendarCheck className="w-4 h-4" /> Book Consultation
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-2 rounded-lg text-xs font-bold">
                            <div className="flex items-center gap-1.5">
                              <Check className="w-4 h-4" /> 
                              {prescriptionUrl ? "Prescription Uploaded" : "Consultation Booked"}
                            </div>
                            <button onClick={() => { setPrescriptionUrl(null); setBookingConsultation(false); }} className="text-emerald-600 hover:text-emerald-800 underline text-[10px]">Change</button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
`;

code = code.replace(`{/* Payment Button */}`, rxUI + `\n                  {/* Payment Button */}`);

// Replace RazorpayCheckout items to pass prescription details
code = code.replace(`items={cart} // Pass all items for RazorpayCheckout to send to /api/checkout`, `items={cart}
                        prescriptionUrl={prescriptionUrl}
                        needsConsultation={bookingConsultation}`);

// Disable payment button if rx not fulfilled
code = code.replace(`{!pricing ? (`, `{!pricing || !hasFulfilledRx ? (`);
code = code.replace(`Loading pricing…`, `{!pricing ? "Loading pricing..." : "Prescription Required"}`);

fs.writeFileSync('app/dashboard/cart/page.tsx', code);
