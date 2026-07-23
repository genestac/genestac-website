import AppointmentButton from "@/components/AppointmentButton";

export const metadata = {
  title: "Joint & Sports Injury Treatment | Genestac Therapeutics",
  description: "Revolutionary regenerative care for joint injuries, arthritis, and sports-related pain using non-surgical therapies.",
};

const page = () => (
  <main className="bg-slate-50 overflow-x-hidden">
    <section className="relative pt-28 pb-20 overflow-hidden bg-gradient-to-br from-slate-900 to-cyan-900 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.18),_transparent_25%)]" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.35em] text-cyan-200">
              Joint Care</span>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">Revolutionary Regenerative Care for Active Joints</h1>
            <p className="max-w-3xl text-lg leading-8 text-cyan-100">
              Joint & sports injury treatment is essential for millions facing arthritis and sport-related damage. Genestac Therapeutics restores strength, reduces inflammation, and improves mobility without invasive surgery.
            </p>
            <div className="flex flex-wrap gap-3">
              <AppointmentButton className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                Book Evaluation
              </AppointmentButton>
              <a href="#conditions" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
                Explore Conditions
              </a>
            </div>
          </div>
          <div className="relative rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-2xl shadow-slate-900/40 backdrop-blur-xl">
            <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.12),_transparent_30%)]" />
            <div className="relative space-y-6">
              <div className="rounded-3xl border border-white/20 bg-slate-950/80 p-6">
                <h2 className="text-2xl font-semibold">Active recovery focused treatment</h2>
                <p className="mt-3 text-cyan-100 leading-7">Our approach supports both pain relief and functional recovery for athletes and everyday movers.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/15 bg-slate-950/80 p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-cyan-200">Precision</p>
                  <p className="mt-3 text-lg font-semibold text-white">Imaging-guided injections</p>
                </div>
                <div className="rounded-3xl border border-white/15 bg-slate-950/80 p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-cyan-200">Recovery</p>
                  <p className="mt-3 text-lg font-semibold text-white">Faster return to activity</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="conditions" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="space-y-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-600">Common Conditions</p>
          <h2 className="mt-4 text-3xl font-semibold text-slate-900">Joint & sports injuries we treat with non-surgical precision</h2>
          <p className="mt-3 text-slate-600 leading-8">From arthritis to athletic injuries, our regenerative therapies help patients restore joint health and avoid invasive procedures.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              title: "Osteoarthritis",
              description: "Relieve joint wear, rebuild cartilage, and improve knee, hip or shoulder function with PRP and biologics.",
            },
            {
              title: "Rheumatoid Arthritis",
              description: "Reduce autoimmune inflammation and strengthen joints with targeted regenerative support.",
            },
            {
              title: "Sports Injuries",
              description: "Support recovery from sprains, tears, and repetitive impact with advanced tissue healing therapies.",
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

    <section className="bg-slate-950 py-16 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 md:grid-cols-2">
        {[
          { title: "Personalized Diagnosis", description: "Imaging and labs to assess joint health, inflammation, and injury severity." },
          { title: "Regenerative Treatments", description: "PRP, stem cells, peptides and biologic injectables rebuild damaged tissues." },
          { title: "Rehabilitation & Recovery", description: "Guided physical therapy and exercise programs for long-term joint stability." },
          { title: "Non-Surgical Care", description: "Focus on pain relief and healing without invasive surgery." },
        ].map((item) => (
          <div key={item.title} className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-xl shadow-cyan-500/10">
            <h3 className="text-2xl font-semibold text-white">{item.title}</h3>
            <p className="mt-4 text-slate-300 leading-7">{item.description}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid gap-10 lg:grid-cols-[1.35fr_0.85fr]">
        <div className="space-y-8 rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm">
          <h2 className="text-3xl font-semibold text-slate-900">Why Choose Genestac?</h2>
          <p className="mt-4 text-slate-600 leading-7">Our regenerative joint and sports injury program blends science, expertise, and personalized care to deliver reliable recovery.</p>
          <ul className="mt-6 list-disc list-inside space-y-4 text-slate-700 leading-7">
            <li><strong>Experienced Team:</strong> Specialists in orthopedics, immunology, and sports medicine.</li>
            <li><strong>Customized Treatment Plans:</strong> Personalized for each patient’s joint goals.</li>
            <li><strong>Patient-Centered Care:</strong> We listen closely and guide every step of your recovery.</li>
          </ul>
          <div className="rounded-[1.75rem] bg-slate-950 p-8 text-slate-100">
            <h3 className="text-2xl font-semibold">Who Can Benefit?</h3>
            <ul className="mt-5 space-y-3 text-slate-300 leading-7 list-disc list-inside">
              <li>Adults with chronic joint pain from arthritis</li>
              <li>Young athletes recovering from injuries</li>
              <li>Patients seeking to avoid joint replacement surgery</li>
              <li>Anyone needing long-term pain relief without painkillers</li>
            </ul>
          </div>
        </div>

        <aside className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-cyan-600 to-slate-900 p-10 text-white shadow-2xl shadow-cyan-500/20">
          <div className="space-y-6">
            <h3 className="text-3xl font-semibold">Take the First Step Toward Pain-Free Movement</h3>
            <p className="text-slate-100 leading-7">Genestac’s joint and sports injury treatments are designed to restore mobility, reduce pain, and help you return to the activities you love.</p>
            <AppointmentButton className="inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
              Book an Appointment
            </AppointmentButton>
          </div>
        </aside>
      </div>
    </section>
  </main>
);

export default page;
