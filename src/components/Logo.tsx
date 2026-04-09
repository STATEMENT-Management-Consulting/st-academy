"use client";

export default function Logo() {
  return (
    <div className="flex items-center gap-4 h-10">
      {/* STATEMENT text */}
      <span className="font-serif text-lg font-normal tracking-widest text-black" style={{ fontFamily: "'Times New Roman', serif", fontSize: "20px", letterSpacing: "4px" }}>
        STATEMENT
      </span>

      {/* Vertical separator */}
      <div className="w-0.5 h-8 bg-black"></div>

      {/* ACADEMY text */}
      <span className="font-serif text-lg font-normal tracking-widest text-black" style={{ fontFamily: "'Times New Roman', serif", fontSize: "18px", letterSpacing: "3px" }}>
        ACADEMY
      </span>
    </div>
  );
}
