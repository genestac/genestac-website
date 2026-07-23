import Link from "next/link";

export const metadata = {
  title: "Chronic Pain Treatment | Genestac Therapeutics",
  description: "Chronic pain syndromes managed with non-surgical regenerative therapies for lasting relief and improved function.",
};

const page = () => (
  <main className="bg-slate-50 overflow-x-hidden">
    <section className="relative pt-28 pb-20 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.3),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.25),_transparent_30%)]" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] items-center">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-semibold uppercase tracking-[0.35em] text-emerald-200">
              Chronic Pain Care</span>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">Break the Cycle of Persistent Pain with Regenerative Care</h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-200">
              Chronic pain doesn’t have to define your life. At Genestac Therapeutics, we combine advanced diagnostics, regenerative biology, and rehabilitation to deliver long-lasting relief for complex pain conditions.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="https://genestac.com/schedule-an-appointment/" className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300">
                Book a Consultation
              </Link>
              <a href="#conditions" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
                See Conditions
              </a>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-slate-900/40">
            <div className="space-y-5">
              <div className="rounded-3xl border border-slate-700 bg-slate-950/90 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Why this matters</p>
                <h2 className="mt-4 text-2xl font-semibold">Restore function. Reduce flare-ups. Live better.</h2>
                <p className="mt-3 text-slate-300 leading-7">Our multidisciplinary chronic pain programs are tailored for sustained recovery, not temporary masking.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Targeted Diagnostics", value: "MRI + ultrasound guided" },
                  { label: "Therapy Type", value: "PRP, stem cells, neuromodulation" },
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl border border-slate-700 bg-slate-950/90 p-5">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
                    <p className="mt-3 text-lg font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="conditions" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="space-y-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-500">Conditions we treat</p>
          <h2 className="mt-4 text-3xl font-semibold text-slate-900">A focused approach for the most challenging pain syndromes</h2>
          <p className="mt-3 text-slate-600 leading-8">From fibromyalgia to failed back surgery, our regenerative treatments are designed to calm nerve irritation, restore tissue health, and improve mobility.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: "Fibromyalgia",
              description: "Regulate nerve sensitivity, reduce tender points, and improve energy through precision pain care.",
            },
            {
              title: "CRPS",
              description: "Calm burning pain and swelling with neurologic stabilization and regenerative nerve support.",
            },
            {
              title: "Post-Surgical Pain",
              description: "Repair injured tissue, manage scar inflammation, and recover without repeat surgery.",
            },
            {
              title: "Failed Back Surgery Syndrome",
              description: "Address post-operative spinal pain with targeted biologics and nerve therapies.",
            },
          ].map((item) => (
            <article key={item.title} className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="text-2xl font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-4 text-slate-600 leading-7">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-8">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-900/5 p-10 shadow-sm">
            <h2 className="text-3xl font-semibold text-slate-900">Why Regenerative Pain Care Works</h2>
            <ul className="mt-6 space-y-4 text-slate-700 leading-7 list-disc list-inside">
              <li><strong>Root-Cause Focus:</strong> We rebuild tissues and calm nerves instead of masking pain.</li>
              <li><strong>Minimally Invasive:</strong> Day-care, needle-guided treatments with fast recovery.</li>
              <li><strong>Medication Reduction:</strong> Easier long-term recovery by lowering painkiller use.</li>
              <li><strong>Better Quality of Life:</strong> Improved sleep, mobility, and resilience.</li>
            </ul>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-10 shadow-sm">
            <h2 className="text-3xl font-semibold text-slate-900">How Genestac Helps You Recover</h2>
            <div className="mt-6 space-y-4">
              <div className="rounded-3xl bg-slate-100 p-6">
                <h3 className="text-xl font-semibold text-slate-900">Assessment</h3>
                <p className="mt-3 text-slate-700 leading-7">Detailed history, imaging, and nerve studies to uncover the real cause of pain.</p>
              </div>
              <div className="rounded-3xl bg-slate-100 p-6">
                <h3 className="text-xl font-semibold text-slate-900">Treatment</h3>
                <p className="mt-3 text-slate-700 leading-7">Precision injections, biologics, and neuromodulation tailored to your symptoms.</p>
              </div>
              <div className="rounded-3xl bg-slate-100 p-6">
                <h3 className="text-xl font-semibold text-slate-900">Recovery</h3>
                <p className="mt-3 text-slate-700 leading-7">Rehabilitation and support to help you regain strength and maintain results.</p>
              </div>
            </div>
          </div>
        </div>

        <aside className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-emerald-600 to-cyan-600 p-10 text-white shadow-2xl shadow-cyan-500/20">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-200">Ready for relief?</p>
            <h2 className="text-3xl font-semibold">Move beyond chronic pain with precision regenerative care.</h2>
            <p className="text-slate-100 leading-7">Our team helps people like you reclaim active living through evidence-based, patient-centered treatment.</p>
            <Link href="https://genestac.com/schedule-an-appointment/" className="inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
              Book Your Pain Consultation
            </Link>
            <div className="rounded-3xl bg-white/10 p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-emerald-200">Quick facts</p>
              <ul className="mt-4 space-y-3 text-slate-100 text-sm leading-7">
                <li>Non-surgical care</li>
                <li>Fast outpatient recovery</li>
                <li>Personalized protocols</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </section>
  </main>
);

export default page;
