import Link from "next/link";

export const metadata = {
  title: "Hair Treatment | Genestac Therapeutics",
  description: "Advanced hair regrowth solutions using regenerative therapies, PRP, and stem cell treatments to restore hair health.",
};

const page = () => (
  <main className="bg-white overflow-x-hidden">

    {/* Hero */}
    <section className="relative pt-20 pb-16 bg-center bg-no-repeat" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url('https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1600&q=80')" }}>
      <div className="max-w-4xl mx-auto text-center px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">Advanced Hair Regrowth Solutions</h1>
        <p className="mt-4 text-base leading-8 text-slate-600 max-w-2xl mx-auto">Clinically proven treatments for hair loss and thinning by Genestac Therapeutics. Restore your confidence with our science-backed solutions.</p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="https://genestac.com/schedule-an-appointment/" className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-500">Book Free Consultation</Link>
          <a href="https://wa.me/918929979971" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-8 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-400">Chat on WhatsApp</a>
        </div>
      </div>
    </section>

    {/* Problems section */}
    <section className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 py-16">
      <h2 className="text-center text-2xl font-semibold text-slate-900">Hair Loss Problems We Solve</h2>
      <p className="text-center mt-2 text-slate-600">Millions suffer from hair loss, but few find effective solutions. Here are the common problems we address:</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-2 items-start">
        <div className="rounded-3xl overflow-hidden shadow-xl">
          <img src="https://images.unsplash.com/photo-1551223490-6c4e9a1d1b0b?auto=format&fit=crop&w=1200&q=80" alt="hair clinic" className="w-full h-full object-cover" />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Are You Experiencing These Issues?</h3>
          <ul className="mt-5 space-y-4 text-slate-700">
            {[
              'Excessive hair fall during shower or combing',
              'Visible thinning of hair on scalp',
              'Receding hairline or bald patches',
              'Slow or no hair regrowth',
              'Scalp conditions like dandruff or itching',
              'Hair damage due to chemicals or styling',
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <svg className="flex-none mt-1 h-5 w-5 text-red-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span className="text-sm leading-6">{t}</span>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-sm text-slate-600">If you're facing any of these problems, our specialised treatments can help restore your hair’s natural growth cycle.</p>
        </div>
      </div>
    </section>

    {/* Treatment cards */}
    <section className="bg-slate-50 py-14">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
        <h3 className="text-center text-2xl font-semibold text-slate-900">Our Advanced Treatments</h3>
        <p className="text-center mt-2 text-slate-600">Genestac Therapeutics offers cutting-edge solutions for hair regrowth and scalp health</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[{
            title: 'Stem Cell Therapy',
            desc: 'Our revolutionary stem cell treatment activates dormant hair follicles and stimulates new hair growth.',
            img: 'https://images.unsplash.com/photo-1583947581696-8b3c6449d2c8?auto=format&fit=crop&w=800&q=80'
          },{
            title: 'PRP Treatment',
            desc: 'Platelet-Rich Plasma therapy uses growth factors from your own blood to promote thicker, healthier hair growth.',
            img: 'https://images.unsplash.com/photo-1588774069269-cc1d49f3f3f6?auto=format&fit=crop&w=800&q=80'
          },{
            title: 'Hair Regrowth Formula',
            desc: 'Scientifically formulated topicals and supplements to support long-term hair health from within.',
            img: 'https://images.unsplash.com/photo-1582719478250-0f4b6f3b4f1a?auto=format&fit=crop&w=800&q=80'
          }].map((c) => (
            <div key={c.title} className="rounded-3xl bg-white shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl overflow-hidden">
              <div className="h-44 bg-gray-100 overflow-hidden">
                <img src={c.img} alt={c.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h4 className="text-lg font-semibold text-slate-900">{c.title}</h4>
                <p className="mt-3 text-slate-600 text-sm leading-6">{c.desc}</p>
                <div className="mt-5">
                  <a href="#" className="inline-flex items-center justify-center rounded-full bg-blue-600 text-white px-5 py-2.5 text-sm font-semibold shadow-sm transition hover:bg-blue-500">Learn More</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Why choose */}
    <section className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 py-14">
      <h3 className="text-center text-2xl font-semibold text-slate-900">Why Choose Genestac Therapeutics?</h3>
      <p className="text-center mt-2 text-slate-600 max-w-2xl mx-auto">We’re different from conventional hair clinics. Here’s why hundreds trust us with their hair regrowth journey.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl bg-white p-6 text-center shadow-sm transition-transform duration-200 hover:-translate-y-1">
          <div className="mx-auto w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">🔬</div>
          <strong className="block mt-3">Science-Backed</strong>
          <p className="mt-2 text-sm text-slate-600 leading-6">All our treatments are based on rigorous clinical research for proven results.</p>
        </div>
        <div className="rounded-3xl bg-white p-6 text-center shadow-sm transition-transform duration-200 hover:-translate-y-1">
          <div className="mx-auto w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">👩‍⚕️</div>
          <strong className="block mt-3">Expert Team</strong>
          <p className="mt-2 text-sm text-slate-600 leading-6">Our dermatologists and trichologists have 15+ years experience in hair restoration.</p>
        </div>
        <div className="rounded-3xl bg-white p-6 text-center shadow-sm transition-transform duration-200 hover:-translate-y-1">
          <div className="mx-auto w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">🧩</div>
          <strong className="block mt-3">Personalized</strong>
          <p className="mt-2 text-sm text-slate-600 leading-6">We create customised treatment plans based on your hair loss pattern and needs.</p>
        </div>
        <div className="rounded-3xl bg-white p-6 text-center shadow-sm transition-transform duration-200 hover:-translate-y-1">
          <div className="mx-auto w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">🌿</div>
          <strong className="block mt-3">Safe & Natural</strong>
          <p className="mt-2 text-sm text-slate-600 leading-6">No harmful chemicals or invasive procedures. We work with your body’s natural processes.</p>
        </div>
      </div>
    </section>

    {/* Testimonials */}
    <section className="bg-slate-50 py-14">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
        <h3 className="text-center text-2xl font-semibold text-slate-900">Patient Success Stories</h3>
        <p className="text-center text-sm text-slate-600 mt-2">Don't just take our word for it. Here's what patients say about their results.</p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[{
            quote: 'After struggling with hair loss for 5 years, Genestac’s PRP treatment gave me amazing results. My hair is thicker now than it’s been in a decade!',
            name: 'Rahul Sharma',
            meta: '6 Months Treatment',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80'
          },{
            quote: 'The stem cell therapy completely transformed my receding hairline. I can’t believe these are my before and after photos.',
            name: 'Vikram Patel',
            meta: '4 Months Treatment',
            avatar: 'https://images.unsplash.com/photo-1545996124-1b9d2d9b1d0d?auto=format&fit=crop&w=80&q=80'
          },{
            quote: 'As a woman with thinning hair, the personalized approach at Genestac gave me my confidence back.',
            name: 'Priya Malhotra',
            meta: '8 Months Treatment',
            avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=80&q=80'
          }].map((t) => (
            <div key={t.name} className="rounded-3xl bg-white p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1">
              <p className="text-sm text-slate-700 leading-7">“{t.quote}”</p>
              <div className="mt-5 flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <div className="text-sm font-semibold text-slate-900">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.meta}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Blue CTA with centered white form */}
    <section className="relative bg-blue-600 py-20">
      <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1505238680356-667803448bb6?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center" />
      <div className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-xl bg-white rounded-xl p-8 shadow-lg -mt-24">
          <h3 className="text-center text-2xl font-semibold text-slate-900">Book Your Free Consultation</h3>
          <p className="text-center mt-2 text-sm text-slate-600">Take the first step towards healthier hair. Consult with our experts today.</p>

          <form className="mt-6 grid gap-3">
            <input aria-label="Full name" className="w-full rounded-md border px-3 py-2" placeholder="Full Name" />
            <input aria-label="Phone" className="w-full rounded-md border px-3 py-2" placeholder="Phone Number" />
            <input aria-label="Email" className="w-full rounded-md border px-3 py-2" placeholder="Email Address" />
            <select aria-label="Concern" className="w-full rounded-md border px-3 py-2">
              <option>Hair Concern</option>
              <option>Thinning</option>
              <option>Receding Hairline</option>
              <option>Patchy Loss</option>
            </select>
            <button type="button" className="w-full rounded-full bg-blue-600 px-6 py-3 text-white font-semibold">Get Free Hair Analysis</button>
          </form>
        </div>
      </div>
    </section>

  </main>
);

export default page;
