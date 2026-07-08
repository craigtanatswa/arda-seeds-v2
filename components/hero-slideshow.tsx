"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type HeroSlide = {
  id: string | number;
  image_url?: string;
  video_url?: string;
  title: string;
  titleLine2?: string;
  subtitle: string;
};

export default function HeroSlideshow({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Image slides: 5 seconds; video slides: 10 seconds
  useEffect(() => {
    if (!slides || slides.length === 0) return;

    const currentSlide = slides[index];
    const duration = currentSlide?.video_url ? 10000 : 5000;

    const timeout = setTimeout(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, duration);

    return () => clearTimeout(timeout);
  }, [index, slides]);

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === index) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [index, slides]);

  if (!slides || slides.length === 0) {
    return (
      <section className="relative h-[600px] w-full flex items-center justify-center bg-gray-200">
        <p className="text-gray-600">No slideshow images uploaded yet.</p>
      </section>
    );
  }

  return (
    <section className="relative h-[600px] w-full overflow-hidden">

      {/* SLIDE FADE LAYERS */}
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          {slide.video_url ? (
            <video
              ref={(el) => {
                videoRefs.current[i] = el;
                if (el && i === index && el.readyState >= 2) {
                  el.play().catch(() => {});
                }
              }}
              src={slide.video_url}
              poster={slide.image_url || "/images/Maize field.jpg"}
              autoPlay={i === index}
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : slide.image_url ? (
            <Image
              src={slide.image_url}
              alt={slide.title || "ARDA slide"}
              fill
              priority={i === 0}
              className="object-cover"
            />
          ) : null}
        </div>
      ))}

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-center text-white p-6">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {slides[index].titleLine2 ? (
              <>
                <span className="block">{slides[index].title}</span>
                <span className="block">{slides[index].titleLine2}</span>
              </>
            ) : (
              slides[index].title
            )}
          </h1>
          <p className="text-xl md:text-2xl mb-6">
            {slides[index].subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-green-700 hover:bg-green-800"
            >
              <Link href="/products">Explore Our Products</Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="bg-white text-green-800 hover:bg-gray-100"
            >
              <Link href="/quote">Request a Quote</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* DOT INDICATORS */}
      <div className="absolute bottom-6 w-full flex justify-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-3 w-3 rounded-full transition-all ${
              i === index ? "bg-white scale-125" : "bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* LEFT ARROW */}
      <button
        onClick={() =>
          setIndex((index - 1 + slides.length) % slides.length)
        }
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full text-white hover:bg-black/60"
      >
        <ChevronLeft size={28} />
      </button>

      {/* RIGHT ARROW */}
      <button
        onClick={() => setIndex((index + 1) % slides.length)}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full text-white hover:bg-black/60"
      >
        <ChevronRight size={28} />
      </button>
    </section>
  );
}
