import AppointmentButton from "@/components/AppointmentButton";

export const metadata = {
  title: "Spine & Nerve Disorder Treatment | Genestac Therapeutics",
  description: "Advanced non-surgical spine and nerve disorder treatment programs from Genestac Therapeutics for lasting relief and regeneration.",
};

const page = () => (
  <main className="bg-white overflow-x-hidden">
    <section className="pt-28 pb-14 bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">Spine & Nerve Disorder Treatment</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Spine & Nerve Disorder Treatment: Advanced Non-Surgical Relief</h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-200">
            Chronic back pain, nerve compression, and spinal degeneration affect millions worldwide. From sciatica pain radiating down the legs to numbness from neuropathy, these conditions disrupt daily life. At Genestac Therapeutics, we provide innovative, non-surgical spine & nerve disorder treatment using regenerative therapies that target the root cause for lasting relief.
          </p>
        </div>
      </div>
    </section>

    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="space-y-14">
        <div className="space-y-6">
          <h2 className="text-3xl font-semibold text-slate-900">Common Conditions We Treat</h2>
          <div className="space-y-8">
            <article className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
              <h3 className="text-2xl font-semibold text-slate-900">1. Herniated Discs</h3>
              <p className="mt-4 text-slate-700 leading-7">
                Herniated or bulging discs occur when the soft spinal disc material pushes through its outer layer, compressing nerves. Symptoms include back pain, numbness, and weakness. Our regenerative disc therapy using PRP, stem cells, and targeted injections reduces inflammation and restores spinal function.
              </p>
            </article>
            <article className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
              <h3 className="text-2xl font-semibold text-slate-900">2. Sciatica</h3>
              <p className="mt-4 text-slate-700 leading-7">
                Sciatica causes sharp pain along the sciatic nerve, often from herniated discs or spinal stenosis. Genestac’s non-surgical treatments relieve nerve pressure, accelerate healing, and provide long-term pain management without surgery.
              </p>
            </article>
            <article className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
              <h3 className="text-2xl font-semibold text-slate-900">3. Spinal Stenosis</h3>
              <p className="mt-4 text-slate-700 leading-7">
                Spinal stenosis narrows spinal spaces, compressing nerves and causing pain or difficulty walking. Our minimally invasive regenerative therapies improve spinal flexibility, reduce inflammation, and enhance mobility naturally.
              </p>
            </article>
            <article className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
              <h3 className="text-2xl font-semibold text-slate-900">4. Degenerative Disc Disease (DDD)</h3>
              <p className="mt-4 text-slate-700 leading-7">
                DDD involves deterioration of intervertebral discs, leading to chronic pain and nerve irritation. Using regenerative injections, Genestac strengthens spinal structures and stimulates natural disc repair for lasting relief.
              </p>
            </article>
            <article className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
              <h3 className="text-2xl font-semibold text-slate-900">5. Neuropathy (Diabetic & Peripheral)</h3>
              <p className="mt-4 text-slate-700 leading-7">
                Neuropathy causes numbness, tingling, and burning sensations in hands or feet. Our regenerative nerve treatments, combined with nutritional guidance and lifestyle support, aim to manage and reverse nerve damage effectively.
              </p>
            </article>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-8 rounded-[2rem] border border-slate-200 bg-slate-50 p-10 shadow-lg">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold text-slate-900">Our Treatment Philosophy</h2>
              <ul className="space-y-4 text-slate-700 leading-7 list-disc list-inside">
                <li><strong>Precise Diagnosis:</strong> Advanced imaging and clinical exams to locate the exact nerve or spinal issue.</li>
                <li><strong>Regenerative Non-Surgical Therapies:</strong> PRP, stem cells, and biologics target the root cause and regenerate tissue.</li>
                <li><strong>Minimally Invasive Procedures:</strong> Image-guided injections reduce nerve pressure without surgery.</li>
                <li><strong>Holistic Rehabilitation:</strong> Physiotherapy and mobility exercises support long-term recovery.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-semibold text-slate-900">Who Can Benefit?</h2>
              <ul className="space-y-3 text-slate-700 leading-7 list-disc list-inside">
                <li>Individuals with chronic back or neck pain</li>
                <li>Patients with herniated discs, spinal stenosis, or sciatica</li>
                <li>People suffering from diabetic or peripheral neuropathy</li>
                <li>Those looking to avoid spine surgery</li>
                <li>Older adults with degenerative spinal changes</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-semibold text-slate-900">Why Choose Genestac Therapeutics?</h2>
              <ul className="space-y-3 text-slate-700 leading-7 list-disc list-inside">
                <li><strong>Expert Medical Team:</strong> Neurology and orthopedic specialists customize your care plan.</li>
                <li><strong>Advanced Technology:</strong> Imaging-guided regenerative medicine for precise and effective treatments.</li>
                <li><strong>No Surgery, Minimal Downtime:</strong> Most therapies are outpatient with fast recovery.</li>
              </ul>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-slate-200 bg-slate-950 p-10 text-slate-100 shadow-2xl shadow-slate-900/20">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">Take the First Step Toward Relief</h3>
              <p className="text-slate-300 leading-7">
                Stop relying on painkillers or fearing spine surgery. Genestac offers science-backed regenerative spine & nerve disorder treatments for lasting healing. Relief is just a step away.
              </p>
              <AppointmentButton
                className="inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
              >
                Book an Appointment
              </AppointmentButton>
            </div>

            <div className="mt-10 rounded-3xl bg-slate-900/90 p-6">
              <h4 className="text-lg font-semibold text-white">References & Further Reading</h4>
              <ul className="mt-4 space-y-3 text-slate-300 text-sm">
                <li>
                  <a href="https://www.mayoclinic.org/diseases-conditions/herniated-disk/symptoms-causes/syc-20354095" target="_blank" rel="noreferrer" className="text-emerald-300 hover:text-emerald-200">
                    Herniated Disc – Mayo Clinic
                  </a>
                </li>
                <li>
                  <a href="https://www.nimh.nih.gov/health/publications/sciatica" target="_blank" rel="noreferrer" className="text-emerald-300 hover:text-emerald-200">
                    Sciatica Overview – NIH
                  </a>
                </li>
                <li>
                  <a href="https://www.webmd.com/pain-management/neuropathy" target="_blank" rel="noreferrer" className="text-emerald-300 hover:text-emerald-200">
                    Neuropathy Treatment – WebMD
                  </a>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  </main>
);

export default page;
