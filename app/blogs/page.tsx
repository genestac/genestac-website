import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { Blog } from "@/types/blog";
import { BlogCard } from "@/components/blogs/BlogCard";
import AppointmentButton from "@/components/AppointmentButton";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Insights & Articles | Genestac Therapeutics",
  description:
    "Read the latest insights, research, and articles on regenerative medicine, pain management, and holistic wellness from Genestac Therapeutics.",
  openGraph: {
    title: "Insights & Articles | Genestac Therapeutics",
    description:
      "Read the latest insights, research, and articles on regenerative medicine.",
    type: "website",
  },
};

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || "1", 10);
  const pageSize = 9;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const {
    data: blogs,
    count,
    error,
  } = await supabase
    .from("blogs")
    .select("*", { count: "exact" })
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching blogs:", error);
  }

  const totalPages = count ? Math.ceil(count / pageSize) : 0;
  const featured = blogs?.[0];
  const rest = blogs?.slice(1) ?? [];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ── Hero Banner ── */}
      <section className="relative pt-[1cm] pb-12 overflow-hidden bg-white border-slate-200">
        {/* Soft gradient blobs */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-brand-100/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-teal-100/50 rounded-full blur-3xl pointer-events-none" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(14,165,233,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            Genestac Journal
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-navy-900 tracking-tight leading-[1.05] mb-6">
            Latest{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-teal-500">
              Insights
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Explore advanced medical research, treatment breakthroughs, and
            wellness strategies from the experts at Genestac Therapeutics.
          </p>

          {/* Stats bar */}
          <div className="mt-12 flex flex-wrap justify-center gap-8">
            {[
              { label: "Articles Published", value: count ? `${count}+` : "—" },
              { label: "Topics Covered", value: "12+" },
              { label: "Expert Authors", value: "8+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-extrabold text-navy-900">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Content Area ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {blogs && blogs.length > 0 ? (
          <>
            {/* Featured Article */}
            {page === 1 && featured && (
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="h-px flex-1 bg-slate-200" />
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Featured Story
                  </span>
                  <span className="h-px flex-1 bg-slate-200" />
                </div>
                <BlogCard blog={featured as Blog} featured />
              </div>
            )}

            {/* Section label */}
            {page === 1 && rest.length > 0 && (
              <div className="flex items-center gap-3 mb-8">
                <span className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  All Articles
                </span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {(page === 1 ? rest : blogs).map((blog: Blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-16">
                {page > 1 ? (
                  <a
                    href={`/blogs?page=${page - 1}`}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-brand-400 hover:text-brand-600 transition-all font-medium text-sm text-slate-700 shadow-sm"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Previous
                  </a>
                ) : (
                  <span className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-300 font-medium text-sm cursor-not-allowed">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Previous
                  </span>
                )}

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <a
                        key={p}
                        href={`/blogs?page=${p}`}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold transition-all ${
                          p === page
                            ? "bg-brand-600 text-white shadow-glow"
                            : "bg-white border border-slate-200 text-slate-600 hover:border-brand-400 hover:text-brand-600"
                        }`}
                      >
                        {p}
                      </a>
                    ),
                  )}
                </div>

                {page < totalPages ? (
                  <a
                    href={`/blogs?page=${page + 1}`}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-brand-400 hover:text-brand-600 transition-all font-medium text-sm text-slate-700 shadow-sm"
                  >
                    Next
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                ) : (
                  <span className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-300 font-medium text-sm cursor-not-allowed">
                    Next
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-32">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-slate-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-navy-900 mb-2">
              No articles yet
            </h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              Our editorial team is working on great content. Check back soon!
            </p>
          </div>
        )}
      </section>

      {/* ── Newsletter CTA ── */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-brand-900 via-navy-900 to-teal-950 border-t border-white/10">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Stay Ahead with Medical Insights
          </h2>
          <p className="text-brand-200 text-lg mb-10 leading-relaxed">
            Expert articles on regenerative medicine delivered straight to your
            inbox.
          </p>
          <AppointmentButton
            className="inline-flex items-center gap-2 bg-white text-navy-900 font-bold px-8 py-4 rounded-xl hover:bg-brand-50 transition-all shadow-lg hover:-translate-y-1"
          >
            Book a Consultation
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </AppointmentButton>
        </div>
      </section>
    </main>
  );
}
