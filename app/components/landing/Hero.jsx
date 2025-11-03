"use client";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-[90vh] md:h-screen w-full max-w-full overflow-hidden hero-section"
    >
      {/* 🔹 Responsive Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat hero-banner"
        style={{
          backgroundImage: "url('/vedios/banner.jpg')",
        }}
      ></div>
      {/* Overlay for better content visibility if needed */}
      <div className="absolute inset-0 w-full h-full bg-black/5"></div>
    </section>
  );
}
