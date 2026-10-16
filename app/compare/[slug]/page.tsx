import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  FOODS,
  parseFoodSlug,
  parseGoalFromSlug,
  generateAllCompareSlugs,
  FoodNutrition,
} from "@/data/foods";

export const revalidate = 86400;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = generateAllCompareSlugs();
  return slugs.map((s) => ({ slug: s }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const foods = parseFoodSlug(slug);
  if (!foods) return { title: "Not Found" };

  const [f1, f2] = foods;
  const goal = parseGoalFromSlug(slug);
  const title = `${f1.name} vs ${f2.name} for ${goal} — Nutrition Comparison | Genestac`;
  const description = `Which is better for ${goal} — ${f1.name} or ${f2.name}? Compare calories, protein, GI, fibre and more per serving. Evidence-based analysis by Genestac Therapeutics.`;

  return {
    title,
    description,
    keywords: [
      `${f1.name} vs ${f2.name}`,
      `${f1.name} vs ${f2.name} ${goal}`,
      `${f1.name} calories`,
      `${f2.name} calories`,
      `Indian food ${goal}`,
      `Indian food nutrition comparison`,
    ].join(", "),
    alternates: { canonical: `https://www.genestac.com/compare/${slug}` },
    openGraph: { title, description, type: "article", url: `https://www.genestac.com/compare/${slug}` },
  };
}

function NutrientBar({
  label, val1, val2, unit, lowerIsBetter = false,
}: {
  label: string; val1: number; val2: number; unit: string; lowerIsBetter?: boolean;
}) {
  const max = Math.max(val1, val2) * 1.2 || 1;
  const pct1 = (val1 / max) * 100;
  const pct2 = (val2 / max) * 100;
  const better1 = lowerIsBetter ? val1 <= val2 : val1 >= val2;
  const better2 = lowerIsBetter ? val2 <= val1 : val2 >= val1;

  return (
    <div className="mb-5">
      <div className="flex justify-between text-sm font-medium text-slate-600 mb-1">
        <span>{label}</span>
        <span className="text-xs text-slate-400">per serving</span>
      </div>
      <div className="flex gap-3 items-center">
        <div className="flex-1">
          <div className="flex justify-between text-xs mb-0.5">
            <span className={better1 ? "text-emerald-600 font-semibold" : "text-slate-500"}>{val1}{unit}</span>
          </div>
          <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
            <div className={`h-full rounded-full ${better1 ? "bg-emerald-500" : "bg-slate-400"}`} style={{ width: `${pct1}%` }} />
          </div>
        </div>
        <span className="text-xs text-slate-400 w-4 text-center">vs</span>
        <div className="flex-1">
          <div className="flex justify-between text-xs mb-0.5">
            <span className={better2 ? "text-teal-600 font-semibold" : "text-slate-500"}>{val2}{unit}</span>
          </div>
          <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
            <div className={`h-full rounded-full ${better2 ? "bg-teal-500" : "bg-slate-400"}`} style={{ width: `${pct2}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function calcScore(food: FoodNutrition, goal: string): number {
  let score = 0;
  if (goal === "weight loss") score = 100 - food.calories / 3 + food.fiber * 5 - food.fat * 2 - food.gi / 5;
  else if (goal === "diabetes management") score = 100 - food.gi - food.gl * 2 + food.fiber * 4 + food.protein * 2;
  else if (goal === "muscle building") score = food.protein * 8 + food.calories / 10 - food.sugar * 2;
  else if (goal === "heart health") score = 80 - food.fat * 3 + food.fiber * 5 - food.sodium / 50 + food.protein;
  else score = food.protein * 4 + food.fiber * 5 - food.gi / 4 - food.calories / 10;
  return Math.min(100, Math.max(0, Math.round(score)));
}

function ScoreBadge({ food, goal }: { food: FoodNutrition; goal: string }) {
  const score = calcScore(food, goal);
  const color = score >= 70 ? "bg-emerald-100 text-emerald-700 border-emerald-200"
    : score >= 45 ? "bg-amber-100 text-amber-700 border-amber-200"
    : "bg-red-100 text-red-700 border-red-200";
  return (
    <div className={`inline-flex flex-col items-center border rounded-2xl px-4 py-2 ${color}`}>
      <span className="text-3xl font-black">{score}</span>
      <span className="text-[10px] uppercase tracking-widest font-semibold">/ 100</span>
    </div>
  );
}

export default async function ComparePage({ params }: Props) {
  const { slug } = await params;
  const foods = parseFoodSlug(slug);
  if (!foods) notFound();

  const [f1, f2] = foods;
  const goal = parseGoalFromSlug(slug);
  const goalLabel = goal.charAt(0).toUpperCase() + goal.slice(1);
  const winner = calcScore(f1, goal) >= calcScore(f2, goal) ? f1 : f2;
  const related = Object.keys(FOODS).filter((k) => k !== f1.slug && k !== f2.slug).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${f1.name} vs ${f2.name} for ${goalLabel}`,
    description: `Nutrition comparison of ${f1.name} and ${f2.name} for ${goal}.`,
    publisher: { "@type": "Organization", name: "Genestac Therapeutics", url: "https://www.genestac.com" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/30">
        <div className="max-w-4xl mx-auto px-4 pt-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
          {" / "}
          <Link href="/compare" className="hover:text-emerald-600 transition-colors">Compare</Link>
          {" / "}
          <span className="text-slate-700">{f1.name} vs {f2.name}</span>
        </div>

        <section className="max-w-4xl mx-auto px-4 pt-8 pb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-3">Nutrition Analysis · {goalLabel}</p>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-4">
            {f1.name} vs {f2.name}:{" "}
            <span className="text-emerald-600">Which Is Better for {goalLabel}?</span>
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed max-w-2xl">
            Both are popular in Indian kitchens — but when it comes to <strong>{goal}</strong>, the data tells a very different story.
            Here is a complete, evidence-based comparison so you can make the right choice.
          </p>
        </section>

        <section className="max-w-4xl mx-auto px-4 mb-8">
          <div className="grid grid-cols-2 gap-4">
            {[f1, f2].map((food) => (
              <div key={food.slug} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6" style={{ borderTop: `4px solid ${food.colorHex}` }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">{food.name}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">{food.category}</p>
                    <p className="text-[11px] text-slate-400 mt-1">Serving: {food.servingLabel}</p>
                  </div>
                  <ScoreBadge food={food} goal={goal} />
                </div>
                <div className="grid grid-cols-2 gap-3 text-center">
                  {[
                    { label: "Calories", val: `${food.calories} kcal` },
                    { label: "Protein", val: `${food.protein}g` },
                    { label: "GI", val: food.gi },
                    { label: "Fibre", val: `${food.fiber}g` },
                  ].map((s) => (
                    <div key={s.label} className="bg-slate-50 rounded-xl p-2">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">{s.label}</p>
                      <p className="font-bold text-slate-800 text-sm">{s.val}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 mb-8">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Detailed Nutrition Comparison</h2>
            <div className="flex justify-between text-xs font-semibold text-slate-500 mb-5 border-b pb-3">
              <span style={{ color: f1.colorHex }}>▮ {f1.name}</span>
              <span style={{ color: f2.colorHex }}>▮ {f2.name}</span>
            </div>
            <NutrientBar label="Calories" val1={f1.calories} val2={f2.calories} unit=" kcal" lowerIsBetter />
            <NutrientBar label="Protein" val1={f1.protein} val2={f2.protein} unit="g" />
            <NutrientBar label="Carbohydrates" val1={f1.carbs} val2={f2.carbs} unit="g" lowerIsBetter />
            <NutrientBar label="Dietary Fibre" val1={f1.fiber} val2={f2.fiber} unit="g" />
            <NutrientBar label="Fat" val1={f1.fat} val2={f2.fat} unit="g" lowerIsBetter />
            <NutrientBar label="Sugar" val1={f1.sugar} val2={f2.sugar} unit="g" lowerIsBetter />
            <NutrientBar label="Sodium" val1={f1.sodium} val2={f2.sodium} unit="mg" lowerIsBetter />
            <NutrientBar label="Glycemic Index (GI)" val1={f1.gi} val2={f2.gi} unit="" lowerIsBetter />
            <NutrientBar label="Glycemic Load (GL)" val1={f1.gl} val2={f2.gl} unit="" lowerIsBetter />
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 mb-8 grid md:grid-cols-2 gap-4">
          {[f1, f2].map((food) => (
            <div key={food.slug} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
              <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: food.colorHex }} />
                {food.name} — Pros &amp; Cons
              </h3>
              <div className="space-y-2">
                {food.healthBenefits.map((b) => (
                  <p key={b} className="flex gap-2 text-sm text-slate-700"><span className="text-emerald-500 shrink-0">✓</span> {b}</p>
                ))}
                {food.healthCautions.map((c) => (
                  <p key={c} className="flex gap-2 text-sm text-slate-500"><span className="text-amber-500 shrink-0">⚠</span> {c}</p>
                ))}
              </div>
              {food.idealFor.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Best for</p>
                  <div className="flex flex-wrap gap-1.5">
                    {food.idealFor.map((t) => (
                      <span key={t} className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-2.5 py-0.5">{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </section>

        <section className="max-w-4xl mx-auto px-4 mb-8">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-6 md:p-8 text-white">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-100 mb-2">Our Verdict</p>
            <h2 className="text-2xl font-black mb-3">For {goalLabel}: Which Should You Choose?</h2>
            <p className="text-emerald-50 leading-relaxed text-base">
              Both <strong>{f1.name}</strong> and <strong>{f2.name}</strong> have a place in a balanced Indian diet.
              However, for <strong>{goal}</strong>, the evidence favours <strong>{winner.name}</strong> due to its
              superior nutritional profile for this specific health goal. That said, a personalised plan from a
              qualified dietitian makes a significant difference.
            </p>
            <Link href="/book-consultation" className="mt-5 inline-flex items-center gap-2 bg-white text-emerald-700 font-bold px-5 py-3 rounded-2xl text-sm hover:bg-emerald-50 transition-colors">
              Book a Free Nutrition Consultation →
            </Link>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 mb-8 grid md:grid-cols-2 gap-4">
          {[f1, f2].map((food) => (
            <div key={food.slug} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
              <h3 className="font-bold text-slate-900 mb-4">{food.name} — Key Nutrients</h3>
              <div className="mb-3">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Vitamins</p>
                <div className="flex flex-wrap gap-1.5">
                  {food.keyVitamins.map((v) => (<span key={v} className="text-xs bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2.5 py-0.5">{v}</span>))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Minerals</p>
                <div className="flex flex-wrap gap-1.5">
                  {food.keyMinerals.map((m) => (<span key={m} className="text-xs bg-purple-50 text-purple-700 border border-purple-100 rounded-full px-2.5 py-0.5">{m}</span>))}
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="max-w-4xl mx-auto px-4 mb-12">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Related Comparisons</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {related.map((key) => {
              const food = FOODS[key];
              return (
                <Link key={key} href={`/compare/${f1.slug}-vs-${key}${goal !== "general health" ? `-for-${goal.replace(/ /g, "-")}` : ""}`}
                  className="bg-white rounded-2xl border border-slate-100 p-4 hover:shadow-md hover:border-emerald-200 transition-all group">
                  <p className="font-semibold text-slate-800 text-sm group-hover:text-emerald-600 transition-colors">{f1.name} vs {food.name}</p>
                  <p className="text-xs text-slate-400 mt-1">{food.category}</p>
                </Link>
              );
            })}
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 pb-12">
          <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-100 pt-6">
            <strong>Disclaimer:</strong> Nutritional values are approximate and sourced from NIN India (ICMR) and USDA databases.
            Actual values may vary based on preparation method, brand, and ingredients. This content is for informational
            purposes only and does not constitute medical or dietary advice. Consult a qualified healthcare professional
            before making significant dietary changes.
            <br />
            <em>Data sources: National Institute of Nutrition (ICMR, India), USDA FoodData Central.</em>
          </p>
        </div>
      </main>
    </>
  );
}
