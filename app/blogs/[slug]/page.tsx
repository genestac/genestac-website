import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";
import { BlogLayoutRenderer } from "@/components/blogs/BlogLayoutRenderer";
import BlogContentGate from "@/components/blogs/BlogContentGate";
import { TableOfContents } from "@/components/blogs/TableOfContents";
import { Blog } from "@/types/blog";
import AppointmentButton from "@/components/AppointmentButton";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const { data: blog } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", resolvedParams.slug)
    .single();

  if (!blog) {
    return { title: "Not Found | Genestac Therapeutics" };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: blog.meta_title || `${blog.title} | Genestac Therapeutics`,
    description: blog.meta_description,
    keywords: blog.focus_keywords?.join(", "),
    alternates: {
      canonical: blog.canonical_url || `https://genestac.com/blogs/${blog.slug}`,
    },
    openGraph: {
      title: blog.meta_title || blog.title,
      description: blog.meta_description || "",
      type: "article",
      publishedTime: blog.published_at || blog.created_at,
      authors: blog.author_id ? [blog.author_id] : [],
      images: blog.og_image
        ? [{ url: blog.og_image, width: 1200, height: 630, alt: blog.title }, ...previousImages]
        : previousImages,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.meta_title || blog.title,
      description: blog.meta_description || "",
      images: blog.og_image ? [blog.og_image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const resolvedParams = await params;
  const { data: blog, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", resolvedParams.slug)
    .single();

  if (error || !blog) notFound();

  const publishDate = blog.published_at
    ? new Date(blog.published_at)
    : new Date(blog.created_at);

  // Fetch 3 related recent posts
  const { data: related } = await supabase
    .from("blogs")
    .select("id, title, slug, og_image, published_at, updated_at, meta_description")
    .eq("status", "published")
    .neq("id", blog.id)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <>
      {/* JSON-LD Schema */}
      {blog.dynamic_schema_json && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blog.dynamic_schema_json) }}
        />
      )}

      {/* ── Full-bleed Hero ── */}
      <section className="relative bg-white border-b border-slate-200 pt-[1cm] pb-16 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(14,165,233,1) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-brand-100/60 rounded-full blur-3xl" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-teal-50/80 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Back button */}
          <div className="flex justify-center mb-8">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 transition-colors group"
            >
              <svg
                className="w-4 h-4 transition-transform group-hover:-translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Insights
            </Link>
          </div>

          {/* Category pill + date */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <span className="bg-brand-100 text-brand-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
              Article
            </span>
            <span className="w-1 h-1 bg-slate-300 rounded-full" />
            <time className="text-sm text-slate-500 font-medium" dateTime={publishDate.toISOString()}>
              {format(publishDate, "MMMM d, yyyy")}
            </time>
            {blog.focus_keywords && blog.focus_keywords.length > 0 && (
              <>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <span className="text-sm text-slate-500">
                  {Math.ceil(blog.content_layout?.length * 0.8)} min read
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-navy-900 leading-[1.08] tracking-tight mb-6">
            {blog.title}
          </h1>

          {/* Excerpt */}
          {blog.meta_description && (
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
              {blog.meta_description}
            </p>
          )}

          {/* Author + share strip */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-2xl mx-auto pt-6 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-500 to-teal-400 flex items-center justify-center text-white font-bold text-sm shadow-soft shrink-0">
                G
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-navy-900">Genestac Editorial</p>
                <p className="text-xs text-slate-400">Medical Review Team</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium mr-1">Share:</span>
              <button className="w-8 h-8 rounded-full border border-slate-200 bg-white text-slate-500 hover:border-[#1DA1F2] hover:text-[#1DA1F2] flex items-center justify-center transition-all" aria-label="Share on Twitter">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
              </button>
              <button className="w-8 h-8 rounded-full border border-slate-200 bg-white text-slate-500 hover:border-[#0077b5] hover:text-[#0077b5] flex items-center justify-center transition-all" aria-label="Share on LinkedIn">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Hero Image ── */}
      {(blog.cover_image || blog.og_image) && (
        <div className="relative bg-white border-b border-slate-100 py-10">
          {/* Ambient glow behind image */}
          <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-brand-50/60 to-slate-50 pointer-events-none" />
          <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12">
            {/* Premium image frame */}
            <div className="relative rounded-3xl overflow-hidden bg-white"
              style={{ boxShadow: '0 0 0 1px rgba(14,165,233,0.12), 0 4px 6px -1px rgba(0,0,0,0.04), 0 24px 60px -12px rgba(12,74,110,0.18)' }}
            >
              {/* Colorful top border strip */}
              <div className="h-1.5 w-full bg-gradient-to-r from-brand-500 via-teal-400 to-brand-600" />
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={`${blog.cover_image || blog.og_image}?v=${new Date(blog.updated_at || blog.created_at).getTime()}`}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1400px) 100vw, 1400px"
                />
                {/* Bottom fade to white */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/30 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Article body + sidebar ── */}
      <main className="bg-slate-50 pt-12 pb-24">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col xl:flex-row gap-8 xl:gap-10 items-start">

            {/* ── Main Article ── */}
            <article className="w-full xl:flex-1 min-w-0">
              {/* Content card with premium border */}
              <div
                className="bg-white rounded-3xl overflow-hidden"
                style={{ boxShadow: '0 0 0 1px rgba(14,165,233,0.10), 0 1px 3px rgba(0,0,0,0.04), 0 20px 50px -12px rgba(12,74,110,0.12)' }}
              >
                {/* Triple-layer top accent */}
                <div className="h-1.5 w-full bg-gradient-to-r from-brand-500 via-teal-400 to-brand-600" />
                <BlogContentGate>
                  <div className="px-8 sm:px-14 lg:px-20 pt-12 pb-10">
                    <BlogLayoutRenderer layout={blog.content_layout} />
                  </div>

                  {/* FAQs Section */}
                  {blog.faqs && blog.faqs.length > 0 && (
                    <div className="px-8 sm:px-14 lg:px-20 pb-12">
                      <div className="border-t border-slate-100 pt-10">
                        <h3 className="text-2xl md:text-3xl font-bold text-navy-900 mb-8">
                          Frequently Asked Questions
                        </h3>
                        <div className="space-y-4">
                          {blog.faqs.map((faq: { question: string; answer: string }, idx: number) => (
                            <details key={idx} className="group bg-slate-50 rounded-2xl border border-slate-200/60 shadow-sm [&_summary::-webkit-details-marker]:hidden">
                              <summary className="flex items-start justify-between cursor-pointer p-6 md:p-8 outline-none focus:ring-2 focus:ring-brand-500/50 rounded-2xl select-none">
                                <h4 className="text-lg md:text-xl font-bold text-navy-900 flex items-start gap-3">
                                  <span className="text-brand-500 shrink-0">Q{idx + 1}.</span>
                                  {faq.question}
                                </h4>
                                <span className="ml-4 shrink-0 transition-transform duration-300 group-open:-rotate-180 mt-1">
                                  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </span>
                              </summary>
                              <div className="px-6 md:px-8 pb-6 md:pb-8 pt-0">
                                <div className="border-t border-slate-200/80 pt-6">
                                  <p className="text-slate-600 leading-relaxed md:text-lg flex items-start gap-3">
                                    <span className="text-slate-400 font-bold shrink-0 opacity-50">A.</span>
                                    {faq.answer}
                                  </p>
                                </div>
                              </div>
                            </details>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </BlogContentGate>

                {/* Bottom share bar */}
                <div className="px-8 sm:px-14 lg:px-20 py-7 border-t border-slate-100 bg-gradient-to-r from-slate-50 to-brand-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-500 to-teal-400 flex items-center justify-center text-white font-bold text-sm shadow-soft shrink-0 ring-4 ring-brand-100">
                      G
                    </div>
                    <div>
                      <p className="text-sm font-bold text-navy-900">Genestac Editorial</p>
                      <p className="text-xs text-slate-400">Published {format(publishDate, "MMMM d, yyyy")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-medium text-slate-400 mr-1">Share:</span>
                    <button className="w-9 h-9 rounded-full border-2 border-slate-200 bg-white text-slate-500 hover:border-[#1DA1F2] hover:text-[#1DA1F2] hover:bg-sky-50 flex items-center justify-center transition-all shadow-sm" aria-label="Share on Twitter">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                    </button>
                    <button className="w-9 h-9 rounded-full border-2 border-slate-200 bg-white text-slate-500 hover:border-[#0077b5] hover:text-[#0077b5] hover:bg-blue-50 flex items-center justify-center transition-all shadow-sm" aria-label="Share on LinkedIn">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Focus keywords */}
              {blog.focus_keywords && blog.focus_keywords.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {blog.focus_keywords.map((kw: string) => (
                    <span
                      key={kw}
                      className="inline-flex items-center gap-1.5 bg-white border-2 border-slate-200 text-slate-500 text-xs font-semibold px-3.5 py-1.5 rounded-full hover:border-brand-300 hover:text-brand-600 transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </article>

            {/* ── Sidebar ── */}
            <aside className="hidden xl:flex flex-col gap-5 w-[320px] shrink-0">
              {/* TOC card */}
              <div
                className="bg-white rounded-2xl p-6"
                style={{ boxShadow: '0 0 0 1px rgba(14,165,233,0.10), 0 4px 24px -4px rgba(12,74,110,0.10)' }}
              >
                <TableOfContents layout={blog.content_layout} />
              </div>

              {/* CTA card */}
              <div className="relative rounded-2xl overflow-hidden border border-brand-800 shadow-luxury bg-gradient-to-br from-brand-950 via-brand-900 to-navy-900 p-7 text-center">
                <div className="absolute -top-20 -right-20 w-48 h-48 bg-brand-500/30 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4 border border-white/20">
                    <svg className="w-6 h-6 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Expert Care Awaits</h4>
                  <p className="text-sm text-brand-200/80 mb-6 leading-relaxed">
                    Book a consultation with our regenerative medicine specialists.
                  </p>
                  <AppointmentButton
                    className="block w-full py-3 px-4 bg-brand-500 hover:bg-brand-400 text-white text-center text-sm font-bold rounded-xl transition-all shadow-glow hover:-translate-y-0.5"
                  >
                    Book Consultation
                  </AppointmentButton>
                </div>
              </div>

              {/* Recent articles */}
              {related && related.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">
                    More Articles
                  </h3>
                  <div className="flex flex-col gap-5">
                    {related.map((r) => {
                      const rDate = r.published_at ? new Date(r.published_at) : new Date();
                      return (
                        <Link
                          key={r.id}
                          href={`/blogs/${r.slug}`}
                          className="group flex gap-3 items-start"
                        >
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                            {r.og_image ? (
                              <Image src={`${r.og_image}?v=${new Date(r.updated_at || r.published_at || new Date()).getTime()}`} alt={r.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="64px" />
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-br from-brand-50 to-slate-100" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-400 mb-1">{format(rDate, "MMM d, yyyy")}</p>
                            <h4 className="text-sm font-semibold text-navy-900 line-clamp-2 group-hover:text-brand-600 transition-colors leading-snug">
                              {r.title}
                            </h4>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  <Link
                    href="/blogs"
                    className="mt-5 flex items-center justify-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 pt-5 border-t border-slate-100 transition-colors"
                  >
                    View all articles
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>

      {/* ── Related Articles (mobile) ── */}
      {related && related.length > 0 && (
        <section className="bg-white border-t border-slate-200 py-16 xl:hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-8">More Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((r) => {
                const rDate = r.published_at ? new Date(r.published_at) : new Date();
                return (
                  <Link key={r.id} href={`/blogs/${r.slug}`} className="group block">
                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-100 mb-3 border border-slate-200">
                      {r.og_image && (
                        <Image src={`${r.og_image}?v=${new Date(r.updated_at || r.published_at || new Date()).getTime()}`} alt={r.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="33vw" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mb-1">{format(rDate, "MMM d, yyyy")}</p>
                    <h4 className="text-sm font-semibold text-navy-900 line-clamp-2 group-hover:text-brand-600 transition-colors">
                      {r.title}
                    </h4>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Bottom CTA ── */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-brand-900 via-navy-900 to-teal-950 border-t border-white/10">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Ready to Start Your Healing Journey?
          </h2>
          <p className="text-brand-200 text-lg mb-10 leading-relaxed">
            Our specialists are here to create a personalized regenerative treatment plan just for you.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <AppointmentButton className="inline-flex items-center gap-2 bg-white text-navy-900 font-bold px-8 py-4 rounded-xl hover:bg-brand-50 transition-all shadow-lg hover:-translate-y-1">
              Book Consultation
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </AppointmentButton>
            <Link href="/blogs" className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all">
              More Articles
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export async function generateStaticParams() {
  const { data: blogs } = await supabase
    .from("blogs")
    .select("slug")
    .eq("status", "published")
    .limit(100);

  if (!blogs) return [];
  return blogs.map((blog) => ({ slug: blog.slug }));
}
