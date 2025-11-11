"use client";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Get team image URL helper
const getTeamImageUrl = (filename) => {
  return `/vedios/team/${filename}`;
};

// Team members for Voice of Impact
const teamMembers = [
  // Leadership
  {
    name: "Muhammad ZiaUlHaq",
    designation: "President & Co-Founder",
    image: getTeamImageUrl("Zia saab latest.jpg"),
    description: "Leading with vision and compassion, guiding Tadbeer Resource Center towards greater impact and community empowerment.",
  },
  // Advisory Board
  {
    name: "Prof. Dr. Farhat Saleemi",
    designation: "Chairperson Advisory Board",
    image: getTeamImageUrl("Prof. Dr. Farhat Saleemi.jpg"),
    description: "Contributing expertise and dedication to advance our educational and social welfare programs.",
  },
  {
    name: "Muhammad Saeed Akhtar",
    designation: "Vice Chairman Advisory Board",
    image: getTeamImageUrl("Muhammad Saeed Akhtar.jpg"),
    description: "Strategic leadership and advisory excellence, shaping the foundation's mission with wisdom and insight.",
  },
  {
    name: "Prof. Dr. Tahira Mughal",
    designation: "Member Advisory Board",
    image: getTeamImageUrl("Tahira Muga latest.jpg"),
    description: "Passionate advocate for education and community development, making a meaningful difference every day.",
  },
  {
    name: "Abdul Ghafir",
    designation: "Member Advisory Board",
    image: getTeamImageUrl("Abdul Gaffar.jpg"),
    description: "Committed to community welfare and sustainable development, ensuring lasting positive change.",
  },
  {
    name: "Prof. Dr. Akhtar Saleemi",
    designation: "Member Advisory Board",
    image: getTeamImageUrl("Prof. Dr. Akhtar Ali Saleemi latest.jpg"),
    description: "Dedicated to excellence in education and social development, driving transformative change in our communities.",
  },
  {
    name: "Muhammad Tariq",
    designation: "Member Advisory Board",
    image: getTeamImageUrl("Muhammad Tariq latest.jpg"),
    description: "Committed to creating opportunities and pathways for success through our various programs.",
  },
  {
    name: "Uzma Kamal",
    designation: "Member Advisory Board",
    image: getTeamImageUrl("Uzma Kamal.jpg"),
    description: "Championing women's empowerment and youth development through innovative programs and initiatives.",
  },
  // Board of Management
  {
    name: "Muhammad Ata-ul-Haq",
    designation: "Treasurer & Head Board of Management",
    image: getTeamImageUrl("M. Ata-ul-Haq.jpg"),
    description: "Dedicated team member working tirelessly to support our mission of empowerment and service.",
  },
  {
    name: "Noman Nisar",
    designation: "Goodwill Ambassador",
    location: "Norway & Scandinavia",
    image: getTeamImageUrl("Noman Nasir latest.jpg"),
    description: "Active contributor to our mission, helping bridge gaps and create lasting positive impact.",
  },
  {
    name: "Dr. Maria Waqas Ph.D",
    designation: "Goodwill Ambassador",
    location: "UAE & Middle East",
    image: getTeamImageUrl("Dr. Maira Waqas.jpg"),
    description: "Bringing medical expertise and compassion to serve communities in need of healthcare support.",
  },
  {
    name: "Abdul Manan",
    designation: "Social Media & Outreach Associate",
    image: getTeamImageUrl("Abdul Manan.jpg"),
    description: "Connecting communities and spreading awareness about our initiatives through digital engagement.",
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
        Meet the visionaries and mentors whose passion and purpose inspire youth to dream big, act boldly, and make a lasting impact.
      </motion.p>

      {/* 🔹 Swiper Slideshow */}
      <div className="relative max-w-7xl mx-auto">
        <Swiper
          modules={[Pagination, Autoplay, Navigation]}
          spaceBetween={30}
          slidesPerView={1}
          slidesPerGroup={1}
          breakpoints={{
            640: {
              slidesPerView: 2,
              slidesPerGroup: 2,
            },
            768: {
              slidesPerView: 3,
              slidesPerGroup: 3,
            },
            1024: {
              slidesPerView: 4,
              slidesPerGroup: 4,
            },
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={true}
          className="pb-12"
        >
          {teamMembers.slice(0, 8).map((member, i) => (
            <SwiperSlide key={i}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative bg-[#101010]/90 border border-white/10 backdrop-blur-md 
                rounded-2xl shadow-[0_0_25px_rgba(24,186,214,0.15)] 
                hover:shadow-[0_0_40px_rgba(24,186,214,0.4)] 
                p-6 h-full transition-all duration-300 flex flex-col items-center text-center"
              >
                {/* 🔹 Image */}
                <div className="flex-shrink-0 relative mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover 
                    border-4 border-[var(--accent-color)] shadow-[0_0_20px_rgba(24,186,214,0.5)]
                    mx-auto"
                    onError={(e) => {
                      if (e.target.src !== "/vedios/abc.jpeg") {
                        e.target.src = "/vedios/abc.jpeg";
                      }
                    }}
                  />
                </div>

                {/* 🔹 Name & Designation */}
                <div className="flex-1 w-full">
                  <h3 className="text-base md:text-lg font-semibold text-[var(--primary-color)] drop-shadow-[0_0_10px_rgba(143,194,65,0.5)] mb-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                    {member.name}
                  </h3>
                  <p className="text-sm md:text-base text-[var(--accent-color)] font-medium mb-1">
                    {member.designation}
                  </p>
                  {member.location && (
                    <p className="text-xs text-gray-500 mb-3">
                      {member.location}
                    </p>
                  )}
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 🔹 Decorative Accent Line */}
      <div className="w-32 h-[3px] bg-[var(--accent-color)] mx-auto mt-14 rounded-full shadow-[0_0_20px_rgba(24,186,214,0.8)]"></div>
    </section>
  );
}
