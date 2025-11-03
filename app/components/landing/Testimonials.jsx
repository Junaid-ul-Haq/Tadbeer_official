"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const testimonials = [
  {
    name: "Ayesha Khan",
    role: "Beneficiary — Education Program",
    image: "/vedios/abc.jpeg",
    quote:
      "Thanks to Tadbeer Foundation, my children can now attend school without worrying about fees. Their compassion has given us hope for a better future.",
  },
  {
    name: "Dr. Imran Malik",
    role: "Healthcare Partner",
    image: "/vedios/abc.jpeg",
    quote:
      "Collaborating with Tadbeer has been a blessing — their tireless efforts bring healthcare to communities that truly need it the most.",
  },
  {
    name: "Sarah Williams",
    role: "Volunteer",
    image: "/vedios/abc.jpeg",
    quote:
      "Working with this foundation taught me the true meaning of compassion and service. Every small effort creates a ripple of positive change.",
  },
  {
    name: "Ahmed Raza",
    role: "Community Member",
    image: "/vedios/abc.jpeg",
    quote:
      "They provided clean water and food to our village — the impact is beyond words. We are deeply grateful for their unwavering support.",
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative py-24 px-6 md:px-16 font-[var(--font-family)] text-white 
      bg-gradient-to-b from-[#0A0A0A] via-[#0C0C0C] to-[#141414] overflow-hidden"
    >
      {/* 🔹 Background Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[500px] h-[300px] bg-[var(--accent-color)]/15 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[250px] bg-[var(--primary-color)]/15 blur-[120px] rounded-full"></div>
      </div>

      {/* 🔹 Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative text-center text-4xl md:text-5xl font-extrabold mb-6 text-[var(--primary-color)] drop-shadow-[0_0_15px_rgba(143,194,65,0.6)]"
      >
        Voices of Impact
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="relative max-w-2xl mx-auto text-gray-300 text-base md:text-lg mb-16 leading-relaxed text-center"
      >
        Real stories from people whose lives were transformed through our
        programs — together, we create lasting change.
      </motion.p>

      {/* 🔹 Swiper Carousel */}
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        effect="fade"
        pagination={{ clickable: true }}
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        loop={testimonials.length > 3}
        slidesPerView={1}
        className="relative max-w-5xl mx-auto"
      >
        {testimonials.map((t, i) => (
          <SwiperSlide key={i}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className="relative bg-[#101010]/90 border border-white/10 backdrop-blur-md 
              rounded-3xl shadow-[0_0_25px_rgba(24,186,214,0.15)] 
              hover:shadow-[0_0_40px_rgba(24,186,214,0.4)] 
              p-10 md:p-14 flex flex-col md:flex-row items-center md:items-start 
              text-center md:text-left gap-8 transition-all duration-300"
            >
              {/* 🔹 Image */}
              <div className="flex-shrink-0 relative">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover 
                  border-4 border-[var(--accent-color)] shadow-[0_0_20px_rgba(24,186,214,0.5)]"
                />
              </div>

              {/* 🔹 Quote & Info */}
              <div className="flex-1">
                <p className="text-gray-300 italic leading-relaxed mb-6 text-lg md:text-xl">
                  “{t.quote}”
                </p>
                <h3 className="text-xl md:text-2xl font-semibold text-[var(--primary-color)] drop-shadow-[0_0_10px_rgba(143,194,65,0.5)]">
                  {t.name}
                </h3>
                <p className="text-sm md:text-base text-gray-500 mt-1">{t.role}</p>
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 🔹 Decorative Accent Line */}
      <div className="w-32 h-[3px] bg-[var(--accent-color)] mx-auto mt-14 rounded-full shadow-[0_0_20px_rgba(24,186,214,0.8)]"></div>
    </section>
  );
}
