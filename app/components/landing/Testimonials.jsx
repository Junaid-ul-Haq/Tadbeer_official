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
  {
    name: "Mr. Zia ul Haq",
    designation: "President",
    image: getTeamImageUrl("Mr Zia ul Haq preident.jpeg"),
    description: "Leading with vision and compassion, guiding Tadbeer Resource Center towards greater impact and community empowerment.",
  },
  {
    name: "Prof. Dr. Akhtar Ali Saleemi",
    designation: "Vice President",
    image: getTeamImageUrl("Prof. Dr .Akhtar Ali Saleemi.jpeg"),
    description: "Dedicated to excellence in education and social development, driving transformative change in our communities.",
  },
  {
    name: "Muhammad Saeed Akhtar",
    designation: "Vice Chairman Advisory Board",
    image: getTeamImageUrl("Saleem Akhtar.jpeg"),
    description: "Strategic leadership and advisory excellence, shaping the foundation's mission with wisdom and insight.",
  },
  {
    name: "Uzma Kamal",
    designation: "Member Advisory Board",
    image: getTeamImageUrl("15 uzma kamal.jpg"),
    description: "Championing women's empowerment and youth development through innovative programs and initiatives.",
  },
  {
    name: "Abdul Gaffar",
    designation: "Member Advisory Board",
    image: getTeamImageUrl("13-abdul gahfir.jpg"),
    description: "Committed to community welfare and sustainable development, ensuring lasting positive change.",
  },
  {
    name: "Prof. Dr. Farhat Saleemi",
    designation: "Team Member",
    image: getTeamImageUrl("Prof. Dr. Farhat Saleemi.jpeg"),
    description: "Contributing expertise and dedication to advance our educational and social welfare programs.",
  },
  {
    name: "Prof. Dr. Tahira Mugal",
    designation: "Team Member",
    image: getTeamImageUrl("Prof . Dr .Tahira Mugal.jpeg"),
    description: "Passionate advocate for education and community development, making a meaningful difference every day.",
  },
  {
    name: "Dr. Maira Waqas",
    designation: "Team Member",
    image: getTeamImageUrl("Dr Maira Waqas.jpeg"),
    description: "Bringing medical expertise and compassion to serve communities in need of healthcare support.",
  },
  {
    name: "M. Ata-ul-Haq",
    designation: "Team Member",
    image: getTeamImageUrl("M. Ata-ul-Haq.jpeg"),
    description: "Dedicated team member working tirelessly to support our mission of empowerment and service.",
  },
  {
    name: "Muhammad Tariq",
    designation: "Team Member",
    image: getTeamImageUrl("Muhammad Tariq.jpeg"),
    description: "Committed to creating opportunities and pathways for success through our various programs.",
  },
  {
    name: "Noman Nasir",
    designation: "Team Member",
    image: getTeamImageUrl("Noman Nasir.jpeg"),
    description: "Active contributor to our mission, helping bridge gaps and create lasting positive impact.",
  },
  {
    name: "Abdul Manan",
    designation: "Social Media & Outreach Associate",
    image: getTeamImageUrl("14.jpg"),
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
        Meet our dedicated team members who drive our mission forward — leaders, advisors, and passionate contributors making a difference.
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
          {teamMembers.map((member, i) => (
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
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-semibold text-[var(--primary-color)] drop-shadow-[0_0_10px_rgba(143,194,65,0.5)] mb-2">
                    {member.name}
                  </h3>
                  <p className="text-sm md:text-base text-[var(--accent-color)] font-medium mb-3">
                    {member.designation}
                  </p>
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
