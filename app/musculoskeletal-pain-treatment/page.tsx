import AppointmentButton from "@/components/AppointmentButton";

export const metadata = {
  title: "Musculoskeletal Pain Treatment | Genestac Therapeutics",
  description: "Regenerative solutions for plantar fasciitis, tendonitis, rotator cuff tears, bursitis, and myofascial pain.",
};

const page = () => (
  <main className="bg-white overflow-x-hidden">
    <section className="relative pt-28 pb-20 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-800 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.18),_transparent_25%)]" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] items-center">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.35em] text-cyan-200">
              Musculoskeletal Care</span>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">Regenerative Healing for Pain-Free Movement</h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-300">
              Musculoskeletal conditions impact your muscles, bones, tendons, and ligaments—causing stiffness, chronic pain, and limited function. Genestac Therapeutics offers specialized non-surgical therapies that restore strength, mobility, and comfort.
            </p>
            <div className="flex flex-wrap gap-3">
              <AppointmentButton className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300">
                Request Assessment
              </AppointmentButton>
              <a href="#conditions" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
                Learn More
              </a>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-900/40">
            <div className="rounded-[2rem] bg-slate-900/80 p-8">
              <h2 className="text-2xl font-semibold">Restore mobility and stay active</h2>
              <p className="mt-4 text-slate-300 leading-7">Our treatments support recovery from common muscle, tendon, and joint conditions with minimal downtime.</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-950 p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Support</p>
                  <p className="mt-3 text-lg font-semibold text-white">Targeted injections</p>
                </div>
                <div className="rounded-3xl bg-slate-950 p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Recovery</p>
                  <p className="mt-3 text-lg font-semibold text-white">Therapy guidance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="conditions" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-10 text-slate-100 shadow-2xl shadow-slate-900/20">
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-400">Issues We Treat</p>
          <h2 className="mt-4 text-3xl font-semibold">Targeted regenerative care for muscle and joint pain</h2>
          <p className="mt-4 text-slate-300 leading-7">From heel pain to shoulder strain, our advanced therapies help you move without pain.</p>
        </div>

        <div className="space-y-6">
          {[
            { title: "Plantar Fasciitis", text: "Repair the plantar fascia, reduce inflammation, and restore comfortable walking." },
            { title: "Tendonitis", text: "Calm tendon inflammation and rebuild strength in elbows, shoulders, or knees." },
            { title: "Rotator Cuff Tears", text: "Improve shoulder stability and motion with regenerative injection therapy." },
            { title: "Bursitis", text: "Relieve joint swelling and restore pain-free movement with guided injections." },
            { title: "Myofascial Pain Syndrome", text: "Release trigger points and improve muscle function with regenerative support." },
          ].map((item) => (
            <article key={item.title} className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="text-2xl font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-4 text-slate-600 leading-7">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-slate-50">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8 rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm">
          <h2 className="text-3xl font-semibold text-slate-900">Why Regenerative Therapy?</h2>
          <ul className="mt-6 list-disc list-inside space-y-4 text-slate-700 leading-7">
            <li><strong>Natural Healing:</strong> Your body repairs tissues instead of masking pain.</li>
            <li><strong>No Downtime:</strong> Outpatient treatments with a shorter recovery window.</li>
            <li><strong>Reduced Dependency:</strong> Less need for painkillers or steroids.</li>
            <li><strong>Avoid Surgery:</strong> Non-invasive alternatives that offer lasting relief.</li>
          </ul>
        </div>

        <aside className="rounded-[2rem] border border-slate-200 bg-slate-950 p-10 text-slate-100 shadow-2xl shadow-slate-900/20">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Who Should Consider These Treatments?</h3>
            <ul className="mt-6 space-y-4 text-slate-300 leading-7 list-disc list-inside">
              <li>Individuals with chronic heel, shoulder, or elbow pain</li>
              <li>Athletes or active adults with tendon or muscle injuries</li>
              <li>Patients not responding to physiotherapy or medications</li>
              <li>Those aiming to avoid surgery or long-term steroid use</li>
            </ul>
            <AppointmentButton className="inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400">
              Book an Appointment
            </AppointmentButton>
          </div>
        </aside>
      </div>
    </section>
  </main>
);

export default page;
