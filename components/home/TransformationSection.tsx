import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function TransformationSection() {
  const categories = [
    {
      country: "India",
      flag: "🇮🇳",
      subtitle: "Success stories",
      stat: "transformations shared",
      src: "/images/pic3.jpeg",
      link: "/transformations?country=india",
    },
    {
      country: "USA",
      flag: "🇺🇸",
      subtitle: "Transformations",
      stat: "transformations shared",
      src: "/images/pic8.png",
      link: "/transformations?country=usa",
    },
    // {
    //   country: "UK",
    //   flag: "🇬🇧",
    //   subtitle: "Inspiring journeys",
    //   stat: "410+ transformations shared",
    //   src: "/pic7.jpeg",
    //   link: "/transformations?country=uk",
    // },
    // {
    //   country: "UAE",
    //   flag: "🇦🇪",
    //   subtitle: "Global impact",
    //   stat: "295+ transformations shared",
    //   src: "/pic2.jpeg",
    //   link: "/transformations?country=uae",
    // },
  ];

  return (
    <section className="w-full bg-[#F5F2EA] py-16 md:py-24 border-t border-[#14231C]/10" id="#transformations">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="text-center mb-14 md:mb-20">
          
          <h2 className="font-serif text-4xl md:text-6xl text-[#14231C] tracking-tight">
            Transformations, worldwide
          </h2>
          <p className="mt-4 text-lg text-[#14231C]/60 max-w-2xl mx-auto">
            Real journeys from patients across the globe. Choose a region to see how far they&apos;ve come.
          </p>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.link}
              className="group block rounded-4xl bg-white border border-[#14231C]/10 p-4 md:p-5 transition-all duration-500 hover:border-[#14231C]/20 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(20,35,28,0.25)]"
            >
              {/* Photo mat */}
              <div className="relative overflow-hidden rounded-[1.4rem] h-70 md:h-95 bg-[#EAE5D6]">
                <Image
                  src={cat.src}
                  alt={`${cat.country} transformations`}
                  fill
                  className="object-contain p-3 transition-transform duration-700 ease-out group-hover:scale-[1.03] rounded-[1.03rem]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Country stamp */}
                <div className="absolute top-5 left-5 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full pl-1.5 pr-3 py-1.5 shadow-sm">
                  <span className="text-base leading-none">{cat.flag}</span>
                  <span className="text-xs font-semibold tracking-wide text-[#14231C]">
                    {cat.subtitle}
                  </span>
                </div>
              </div>

              {/* Info row */}
              <div className="flex items-end justify-between pt-5 px-1 md:px-2">
                <div>
                  <p className="text-xs font-semibold tracking-[0.15em] uppercase text-[#8A6A22] mb-1">
                    {cat.stat}  
                  </p>
                  <h3 className="font-serif text-3xl md:text-4xl text-[#14231C] leading-none">
                    {cat.country}
                  </h3>
                </div>

                <div className="flex items-center justify-center w-11 h-11 rounded-full border border-[#14231C]/15 text-[#14231C] transition-all duration-300 group-hover:bg-[#14231C] group-hover:text-white group-hover:border-[#14231C]">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}