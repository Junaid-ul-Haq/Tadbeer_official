"use client";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { FaGraduationCap, FaHandshake, FaBriefcase } from "react-icons/fa";

export default function Features() {
  const services = [
    {
      icon: (
        <FaGraduationCap className="text-[var(--accent-color)] text-5xl mb-4 drop-shadow-[0_0_15px_rgba(24,186,214,0.8)]" />
      ),
      title: "Educational Counseling",
      text: "Empowering students with access to quality education and brighter futures.",
      link: "#scholarships",
    },
    {
      icon: (
        <FaHandshake className="text-[var(--primary-color)] text-5xl mb-4 drop-shadow-[0_0_12px_rgba(143,194,65,0.8)]" />
      ),
      title: "Career Counseling",
      text: "Guiding individuals with personalized support for education and careers.",
      link: "#consultations",
    },
    {
      icon: (
        <FaBriefcase className="text-[var(--accent-color)] text-5xl mb-4 drop-shadow-[0_0_15px_rgba(24,186,214,0.8)]" />
      ),
      title: "Entrepreneur Incubation",
      text: "Supporting small businesses and entrepreneurs to create lasting impact.",
      link: "#grants",
    },
  ];

  return (
    <section
      id="services"
      className="relative py-20 px-4 sm:px-6 md:px-12 lg:px-20 
      bg-gradient-to-b from-[#0B0B0B] via-[#0E0E0E] to-[#151515] 
      font-[var(--font-family)] text-white overflow-hidden"
    >
      {/* 🔹 Glowing Background Blurs */}
      <div className="absolute -top-10 left-10 w-80 h-80 bg-[var(--accent-color)]/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-[var(--primary-color)]/20 blur-[120px] rounded-full"></div>

      {/* 🔹 Heading Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="text-center mb-16 relative z-10"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-[var(--primary-color)] drop-shadow-[0_0_20px_rgba(143,194,65,0.5)]">
          Our Core Services
        </h2>
        <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed px-2">
          Driving positive change through education, empowerment, and economic
          opportunity.
        </p>
      </motion.div>

      {/* 🔹 Swiper Carousel */}
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={false}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          480: { slidesPerView: 1, spaceBetween: 20 },
          640: { slidesPerView: 1.2, spaceBetween: 25 },
          768: { slidesPerView: 2, spaceBetween: 30 },
          1024: { slidesPerView: 3, spaceBetween: 35 },
          1280: { slidesPerView: 3, spaceBetween: 40 },
        }}
        className="max-w-[90%] sm:max-w-[95%] md:max-w-6xl mx-auto relative z-10"
      >
        {services.map((service, index) => (
          <SwiperSlide key={index} className="flex justify-center items-stretch">
            <motion.div
              whileHover={{ scale: 1.04 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-[#101010]/90 w-full sm:w-[90%] md:w-full h-full 
              rounded-2xl border border-white/10 shadow-[0_0_25px_rgba(24,186,214,0.15)] 
              hover:shadow-[0_0_35px_rgba(24,186,214,0.35)] 
              transition-all duration-300 p-8 text-center flex flex-col items-center justify-between backdrop-blur-md"
            >
              <div className="flex flex-col items-center flex-grow">
                {service.icon}
                <h3 className="text-xl sm:text-2xl font-bold mb-3 text-[var(--primary-color)] drop-shadow-[0_0_10px_rgba(143,194,65,0.6)]">
                  {service.title}
                </h3>
                <p className="text-gray-300 mb-6 text-sm sm:text-base leading-relaxed px-1 sm:px-2">
                  {service.text}
                </p>
              </div>

              {/* 🔹 CTA Button */}
              <motion.a
                href={service.link}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-semibold 
                text-white text-sm sm:text-base transition-all duration-300
                bg-[var(--accent-color)] shadow-[0_0_20px_rgba(24,186,214,0.5)] 
                hover:bg-[var(--secondary-color)] hover:shadow-[0_0_30px_rgba(143,194,65,0.5)]"
              >
                Learn More
              </motion.a>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
