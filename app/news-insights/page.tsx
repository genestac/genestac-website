import React from "react";
import Link from "next/link";

export const metadata = {
  title: "News & Insights | Genestac Therapeutics",
  description: "Stay informed with the latest updates, medical research articles, and insights in regenerative medicine, stem cell therapy, and chronic pain management from Genestac.",
};

const categories = ["All Posts", "Back Pain", "Cancer Treatment", "Knee Pain Treatment", "Therapies"];

const articles = [
  {
    category: "Cancer Treatment",
    date: "October 24, 2025",
    title: "Can Stem Cell Therapy Cure Diabetes?",
    excerpt: "What the Science Says. For ages, diabetes has been treated as a lifelong condition requiring constant management...",
    image: "https://genestac.com/wp-content/uploads/2025/10/can-stem-cell-therapy-cure-diabetes.jpg",
    href: "https://genestac.com/can-stem-cell-therapy-cure-diabetes/",
    readTime: "5 min read",
  },
  {
    category: "Knee Pain Treatment",
    date: "October 5, 2025",
    title: "Non-Surgical Knee Pain Treatment with PRP & Stem Cell Therapy by Dr. Hemant Gupta",
    excerpt: "Knee pain has become one of the most prevalent musculoskeletal issues affecting millions worldwide. Dr. Hemant Gupta shares innovative solutions...",
    image: "https://genestac.com/wp-content/uploads/2025/10/knee-pain-treatment-prp-stem-cell.jpg",
    href: "https://genestac.com/non-surgical-knee-pain-treatment-with-prp-stem-cell-therapy/",
    readTime: "7 min read",
  },
  {
    category: "Therapies",
    date: "October 1, 2025",
    title: "IV Drip Therapy in Gurugram – Benefits, Procedure, and Cost",
    excerpt: "IV drip therapy is one of the quickest-growing wellness therapies. Learn about its benefits, procedure, and what to expect at Genestac...",
    image: "https://genestac.com/wp-content/uploads/2025/10/iv-drip-therapy-gurugram.jpg",
    href: "https://genestac.com/iv-drip-therapy-in-gurugram/",
    readTime: "4 min read",
  },
  {
    category: "Cancer Treatment",
    date: "September 29, 2025",
    title: "Stem Cell Therapy and CRISPR Gene Editing: The Future of Cancer Treatment",
    excerpt: "Cancer remains one of the most complex and challenging medical conditions. Discover how CRISPR and stem cells are transforming oncology...",
    image: "https://genestac.com/wp-content/uploads/2025/09/stem-cell-crispr-cancer.jpg",
    href: "https://genestac.com/stem-cell-therapy-and-crispr-gene-editing-the-future-of-cancer-treatment/",
    readTime: "8 min read",
  },
  {
    category: "Back Pain",
    date: "September 26, 2025",
    title: "How Stem Cell Therapy Treats Back Pain Naturally: Non-Surgical Solutions at Genestac",
    excerpt: "Millions of people around the world struggle with chronic back pain. Discover our non-surgical stem cell approach to lasting relief...",
    image: "https://genestac.com/wp-content/uploads/2025/09/stem-cell-back-pain.jpg",
    href: "https://genestac.com/how-stem-cell-therapy-treats-back-pain-naturally/",
    readTime: "6 min read",
  },
  {
    category: "Cancer Treatment",
    date: "September 24, 2025",
    title: "How Stem Cell Therapy is Transforming Cancer Treatment in India 2025",
    excerpt: "Recent studies have shown that stem cell therapy is creating a paradigm shift in cancer care across India. Here's what you need to know...",
    image: "https://genestac.com/wp-content/uploads/2025/09/stem-cell-cancer-india-2025.jpg",
    href: "https://genestac.com/stem-cell-therapy-cancer-treatment-india-2025/",
    readTime: "6 min read",
  },
];

export default function NewsInsightsPage() {
  return (
    <main className="bg-white overflow-x-hidden min-h-screen pt-24" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* ── HERO ── */}
      <section className="relative py-20 bg-gradient-to-br from-[#001f3f] via-[#00305f] to-[#001a35] text-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[100px]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">
            Medical Board Updates
          </span>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight text-white">
            News & Insights
          </h1>
          <p className="text-lg text-[#F5E6CC] font-medium max-w-2xl mx-auto">
            Discover the latest clinical findings, therapy breakdowns, and wellness wisdom from our medical team.
          </p>
        </div>
      </section>

      {/* ── CATEGORY FILTER ── */}
      <section className="py-8 bg-white border-b border-slate-100 sticky top-20 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat, i) => (
              <span key={i}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
                  i === 0
                    ? "bg-[#001f3f] text-[#F5E6CC] shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}>
                {cat}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── ARTICLES GRID ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((art, i) => (
              <article key={i} className="rounded-[2rem] border border-slate-100 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
                <div className="h-52 overflow-hidden relative">
                  <img src={art.image} alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {art.category}
                  </span>
                </div>
                <div className="p-7 flex flex-col flex-grow space-y-4">
                  <div className="space-y-2 flex-grow">
                    <p className="text-xs text-slate-400 font-semibold">{art.date} &bull; {art.readTime}</p>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug hover:text-emerald-600 transition-colors line-clamp-3">
                      <a href={art.href} target="_blank" rel="noopener noreferrer">{art.title}</a>
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">{art.excerpt}</p>
                  </div>
                  <a href={art.href} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-[#001f3f] hover:text-emerald-600 transition-colors pt-2">
                    Read More <i className="fa-solid fa-arrow-right text-xs"></i>
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* View More */}
          <div className="mt-12 text-center">
            <a href="https://genestac.com/blog/" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 justify-center rounded-full border-2 border-[#001f3f] px-8 py-4 text-sm font-bold text-[#001f3f] hover:bg-[#001f3f] hover:text-white transition-all">
              View All Articles on Genestac.com <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
            </a>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="py-16 bg-[#001f3f] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#F5E6CC]">Stay Updated</span>
          <h2 className="text-2xl sm:text-3xl font-bold">Subscribe to Genestac Updates</h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm leading-relaxed">
            Get monthly emails detailing our latest patient case studies, published clinical findings, and priority treatment announcements.
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <input type="email" placeholder="Your email address"
              className="flex-grow px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 text-sm" />
            <button className="px-6 py-3 rounded-full bg-[#F5E6CC] text-[#001f3f] font-extrabold hover:bg-white transition-colors text-sm shrink-0">
              Subscribe
            </button>
          </div>
          <div className="pt-4">
            <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
