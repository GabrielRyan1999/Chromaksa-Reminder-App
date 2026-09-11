"use client";

import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";

export default function HeroCarousel() {
  const images = ["/preview1new.png", "/preview2new.png"];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="mt-20 relative rounded-xl border border-[var(--color-brand-graphite)] border-opacity-20 shadow-2xl overflow-hidden aspect-[16/9] flex items-center justify-center bg-black/5 dark:bg-white/5">
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] via-transparent to-transparent opacity-50 pointer-events-none z-10" />
      
      {/* Fallback text if image is missing */}
      <div className="absolute text-[var(--color-brand-graphite)] opacity-50 flex flex-col items-center z-0">
        <Calendar className="w-16 h-16 mb-4" />
        <p className="font-serif text-xl">Loading preview...</p>
      </div>

      {/* Actual Preview Images */}
      {images.map((src, index) => (
        <img 
          key={src}
          src={src} 
          alt={`Reminder App Dashboard Preview ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-1000 ease-in-out z-0 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
