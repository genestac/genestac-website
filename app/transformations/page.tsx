"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { ALL_STORIES } from "@/data/data";

function TransformationsContent() {
  const searchParams = useSearchParams();
  const countryParam = searchParams.get("country");

  const filteredStories = useMemo(() => {
    if (!countryParam) return ALL_STORIES;
    return ALL_STORIES.filter(
      (s) => s.countryCode === countryParam.toLowerCase(),
    );
  }, [countryParam]);

  const displayTitle = countryParam
    ? `${countryParam.toUpperCase()} transformations`
    : "Global transformations";

  return (
    <main className="w-full min-h-screen pt-24 pb-16 overflow-x-hidden">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-baseline justify-between gap-6">
          <div>
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-[#14231C] hover:text-[#14231C] transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <Home className="w-4 h-4 mr-2" />
              Back to home
            </Link>
            <h1 className="font-serif text-4xl md:text-6xl text-[#14231C] tracking-tight">
              {/* {displayTitle} */}
            </h1>
            <p className="mt-4 text-lg text-[#14231C] max-w-2xl">
              {countryParam
                ? `Real success stories from our patients in the ${countryParam.toUpperCase()} region.`
                : "Real success stories from our patients around the world."}
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            {["All", "INDIA", "USA", "UK", "UAE"].map((code) => {
              const isActive =
                (code === "All" && !countryParam) ||
                code.toLowerCase() === countryParam?.toLowerCase();
              return (
                <Link
                  key={code}
                  href={
                    code === "All"
                      ? "/transformations"
                      : `/transformations?country=${code.toLowerCase()}`
                  }
                  className={`px-4 py-2 rounded-full text-sm font-semibold tracking-wide transition-all border ${
                    isActive
                      ? "bg-[#14231C] text-white border-[#14231C]"
                      : "bg-white text-[#14231C]/70 border-[#14231C]/15 hover:border-[#14231C]/30"
                  }`}
                >
                  {code}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        {filteredStories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredStories.map((story, idx) => (
              <div
                key={idx}
                className="group flex flex-col rounded-[1.75rem] bg-white border border-[#14231C]/10 p-4 transition-all duration-500 hover:border-[#14231C]/20 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(20,35,28,0.25)]"
              >
                <div className="relative w-full aspect-square rounded-[1.15rem] overflow-hidden bg-[#EAE5D6]">
                  <Image
                    src={story.src}
                    alt={`${story.name} transformation`}
                    fill
                    priority={idx < 6}
                    className="object-contain p-3 rounded-[1rem] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 280px, 320px"
                  />
                  {story.flag && (
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm">
                      <span className="text-base leading-none">
                        {story.flag}
                      </span>
                      <span className="text-xs font-semibold tracking-wide text-[#14231C] uppercase">
                        {story.countryCode}
                      </span>
                    </div>
                  )}
                </div>
                <div className="pt-5 px-1 flex flex-col flex-1">
                  <h3 className="font-serif text-2xl text-[#14231C] mb-2">
                    {story.name}
                  </h3>
                  <p className="text-sm text-[#14231C] leading-relaxed flex-1">
                    {story.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full bg-white rounded-[1.75rem] border border-[#14231C]/10 p-12 text-center">
            <h3 className="font-serif text-2xl text-[#14231C] mb-2">
              No stories found
            </h3>
            <p className="text-[#14231C]/60">
              We don&apos;t have any transformation stories for this region yet.
            </p>
            <Link
              href="/transformations"
              className="mt-6 inline-flex rounded-full bg-[#14231C] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1F332A] transition-colors"
            >
              View all stories
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

export default function TransformationsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F2EA] pt-24 text-center text-[#14231C]/60">
          Loading...
        </div>
      }
    >
      <TransformationsContent />
    </Suspense>
  );
}
