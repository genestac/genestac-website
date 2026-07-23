import AppointmentButton from "@/components/AppointmentButton";

export const metadata = {
  title: "Precision Regenerative Care | Genestac Therapeutics",
  description: "Precision regenerative care that combines diagnostics, biologics, and minimally invasive techniques for superior outcomes.",
};

const page = () => (
  <main className="bg-slate-100 overflow-x-hidden">
    <section className="relative pt-28 pb-20 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.18),_transparent_25%)]" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] items-center">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.35em] text-cyan-200">
              Precision Regenerative Care</span>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">Precision Care with Regenerative Innovation</h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-300">
              At Genestac Therapeutics, our commitment is to provide every patient with the most advanced, personalized, and compassionate care. Chronic pain and degeneration affect more than the body—they impact your energy, mood, and daily life.
            </p>
            <div className="flex flex-wrap gap-3">
              <AppointmentButton className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300">
                Schedule a Review
              </AppointmentButton>
              <a href="#pillars" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
                See Our Process
              </a>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-900/40 backdrop-blur-xl">
            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-8">
              <h2 className="text-2xl font-semibold">Precision diagnostics. Targeted regeneration.</h2>
              <p className="mt-4 text-slate-300 leading-7">Our care combines imaging, guided injections, and biologic therapies so you get the right treatment in the right place.</p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-950/80 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Focused</p>
                <p className="mt-3 text-lg font-semibold text-white">Real-time imaging</p>
              </div>
              <div className="rounded-3xl bg-slate-950/80 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Advanced</p>
                <p className="mt-3 text-lg font-semibold text-white">Biologic therapies</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="pillars" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid gap-8 lg:grid-cols-3">
        {[
          { title: "Precision Diagnostics", description: "Ultrasound and X-ray-guided injections locate the source of pain with surgical precision." },
          { title: "Regenerative Therapies", description: "PRP, stem cells, and growth factor injections support natural tissue repair." },
          { title: "Minimally Invasive Techniques", description: "Day-care procedures with shorter recovery and powerful outcomes." },
        ].map((item) => (
          <div key={item.title} className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-4 text-slate-600 leading-7">{item.description}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="bg-slate-950 py-16 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 md:grid-cols-2">
        {[
          { label: "Ultrasound-Guided Injections", text: "Precise placement in tendons, joints, and nerves for better outcomes." },
          { label: "Fluoroscopy Guidance", text: "Ideal for deeper spine and sacroiliac injections with real-time visibility." },
          { label: "Real-Time Feedback", text: "Improved safety and treatment accuracy through live imaging." },
          { label: "Regenerative Biology", text: "Bioactive therapies to accelerate tissue repair and reduce inflammation." },
        ].map((item) => (
          <div key={item.label} className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">{item.label}</p>
            <p className="mt-4 text-slate-300 leading-7">{item.text}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-slate-100">
      <div className="grid gap-10 lg:grid-cols-[1.35fr_0.85fr]">
        <div className="space-y-8 rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm">
          <h2 className="text-3xl font-semibold text-slate-900">Why Choose Genestac Therapeutics?</h2>
          <p className="text-slate-600 leading-7">We combine comprehensive evaluation, precision diagnostics, and advanced regenerative therapies under one roof, so patients receive intelligent care with fewer procedures and better results.</p>
          <ul className="mt-6 list-disc list-inside space-y-4 text-slate-700 leading-7">
            <li><strong>Comprehensive Evaluation:</strong> Biomechanics, imaging, and lifestyle analysis before treatment.</li>
            <li><strong>Integrated Approach:</strong> Diagnostics, biologics, and advanced techniques in a single plan.</li>
            <li><strong>Patient-Centered Care:</strong> We listen, educate, and personalize every step.</li>
            <li><strong>Avoid Surgery:</strong> Patients often delay or bypass surgery through regenerative care.</li>
          </ul>
        </div>

        <aside className="rounded-[2rem] border border-slate-200 bg-slate-950 p-10 text-slate-100 shadow-2xl shadow-slate-900/20">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">A New Standard in Pain Relief and Regeneration</h3>
            <p className="text-slate-300 leading-7">Whether you are an athlete, a senior, or someone recovering from chronic joint or nerve pain, our precision regenerative care offers a new hope for lasting recovery.</p>
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
