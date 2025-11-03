"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  FaHandsHelping,
  FaEye,
  FaHeart,
  FaGlobeAsia,
  FaGraduationCap,
  FaUsers,
  FaPeopleCarry,
  FaQuoteLeft,
} from "react-icons/fa";

const CountUp = dynamic(() => import("react-countup"), { ssr: false });

function ClientCountUp({ number, suffix, icon, title }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col items-center text-center">
        {icon}
        <div className="text-4xl md:text-5xl font-bold text-[var(--primary-color)] drop-shadow-[0_0_12px_rgba(143,194,65,0.7)]">
          0{suffix}
        </div>
        <p className="text-gray-300 mt-3 text-base md:text-lg font-medium">
          {title}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center">
      {icon}
      <div className="text-4xl md:text-5xl font-bold text-[var(--primary-color)] drop-shadow-[0_0_12px_rgba(143,194,65,0.7)]">
        <CountUp
          start={0}
          end={number}
          duration={2.5}
          enableScrollSpy={false}
          suffix={suffix}
        />
      </div>
      <p className="text-gray-300 mt-3 text-base md:text-lg font-medium">
        {title}
      </p>
    </div>
  );
}

export default function AboutUs() {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };


  const missionVisionValues = [
    {
      title: "Our Mission",
      icon: (
        <FaHandsHelping className="text-4xl md:text-5xl text-[var(--primary-color)] mb-4 drop-shadow-[0_0_12px_rgba(143,194,65,0.7)]" />
      ),
      desc: "Empowering communities through education, healthcare, and sustainable initiatives that build brighter futures.",
    },
    {
      title: "Our Vision",
      icon: (
        <FaEye className="text-4xl md:text-5xl text-[var(--accent-color)] mb-4 drop-shadow-[0_0_10px_rgba(24,186,214,0.7)]" />
      ),
      desc: "A world where every individual lives with dignity, knowledge, and opportunity — a future built on compassion and equity.",
    },
    {
      title: "Our Values",
      icon: (
        <FaHeart className="text-4xl md:text-5xl text-red-400 mb-4 drop-shadow-[0_0_12px_rgba(255,80,80,0.7)]" />
      ),
      desc: "Integrity, compassion, and empowerment guide every action we take in our mission to serve humanity.",
    },
  ];

  const impactData = [
    {
      title: "Lives Impacted",
      icon: (
        <FaGlobeAsia className="text-4xl md:text-5xl text-[var(--accent-color)] mb-3" />
      ),
      number: 10000,
      suffix: "+",
    },
    {
      title: "Scholarships Awarded",
      icon: (
        <FaGraduationCap className="text-4xl md:text-5xl text-[var(--primary-color)] mb-3" />
      ),
      number: 500,
      suffix: "+",
    },
    {
      title: "Communities Served",
      icon: (
        <FaUsers className="text-4xl md:text-5xl text-[#36b37e] mb-3" />
      ),
      number: 120,
      suffix: "+",
    },
    {
      title: "Active Volunteers",
      icon: (
        <FaPeopleCarry className="text-4xl md:text-5xl text-[var(--accent-color)] mb-3" />
      ),
      number: 200,
      suffix: "+",
    },
  ];

  const journeyData = [
    {
      year: "2012",
      text: "Established the Saleemah Khanum Welfare Foundation with a vision to serve the community and promote social welfare.",
    },
    {
      year: "2022",
      text: "Marked a decade of meaningful service by celebrating the Foundation's 10th anniversary and reflecting on key accomplishments.",
    },
    {
      year: "2023",
      text: "Redefined our mission with a renewed commitment to Women Empowerment and Youth Development, emphasizing Education, Career Counseling, Job Placement, and Entrepreneurial Growth.",
    },
    {
      year: "2024",
      text: "Engaged in comprehensive planning to strengthen our impact and expand program outreach.",
    },
    {
      year: "2025",
      text: "Formally introduced the Tadbeer Resource Center, sponsored by the Saleemah Khanum Welfare Foundation, during the seminar \"Hope in Action.\" The event brought together prominent representatives from community service and philanthropic organizations.",
    },
  ];

  // Get frontend public folder path for team images
  const getTeamImageUrl = (filename) => {
    // Use frontend public folder - no backend needed
    // Files in public/vedios/team/ are accessible at /vedios/team/filename
    // Next.js handles spaces in filenames automatically
    return `/vedios/team/${filename}`;
  };

  // Team members ordered by rank
  const teamMembers = [
    {
      name: "Mr. Zia ul Haq",
      designation: "President",
      rank: 1,
      image: getTeamImageUrl("Mr Zia ul Haq preident.jpeg"),
    },
    {
      name: "Prof. Dr. Akhtar Ali Saleemi",
      designation: "Vice President",
      rank: 2,
      image: getTeamImageUrl("Prof. Dr .Akhtar Ali Saleemi.jpeg"),
    },
    {
      name: "Muhammad Saeed Akhtar",
      designation: "Vice Chairman Advisory Board",
      rank: 3,
      image: getTeamImageUrl("Saleem Akhtar.jpeg"),
    },
    {
      name: "Uzma Kamal",
      designation: "Member Advisory Board",
      rank: 4,
      image: getTeamImageUrl("15 uzma kamal.jpg"),
    },
    {
      name: "Abdul Gaffar",
      designation: "Member Advisory Board",
      rank: 5,
      image: getTeamImageUrl("13-abdul gahfir.jpg"),
    },
    {
      name: "Prof. Dr. Farhat Saleemi",
      designation: "Team Member",
      rank: 6,
      image: getTeamImageUrl("Prof. Dr. Farhat Saleemi.jpeg"),
    },
    {
      name: "Prof. Dr. Tahira Mugal",
      designation: "Team Member",
      rank: 7,
      image: getTeamImageUrl("Prof . Dr .Tahira Mugal.jpeg"),
    },
    {
      name: "Dr. Maira Waqas",
      designation: "Team Member",
      rank: 8,
      image: getTeamImageUrl("Dr Maira Waqas.jpeg"),
    },
    {
      name: "M. Ata-ul-Haq",
      designation: "Team Member",
      rank: 9,
      image: getTeamImageUrl("M. Ata-ul-Haq.jpeg"),
    },
    {
      name: "Muhammad Tariq",
      designation: "Team Member",
      rank: 10,
      image: getTeamImageUrl("Muhammad Tariq.jpeg"),
    },
    {
      name: "Noman Nasir",
      designation: "Team Member",
      rank: 11,
      image: getTeamImageUrl("Noman Nasir.jpeg"),
    },
  ];

  return (
    <section
      id="aboutus"
      className="relative bg-gradient-to-b from-[#0B0B0B] via-[#0F0F0F] to-[#151515] text-white py-20 px-6 md:px-16 font-[var(--font-family)] overflow-hidden"
    >
      {/* 🔹 Background Glow Effects */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-[var(--primary-color)]/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[var(--accent-color)]/20 blur-[120px] rounded-full"></div>

      {/* 🔹 Section Header */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="text-center mb-20 max-w-3xl mx-auto"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-[var(--primary-color)] drop-shadow-[0_0_15px_rgba(143,194,65,0.6)] mb-4">
          About Tadbeer
        </h2>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
          Guided by compassion, driven by impact — we bridge hope and
          opportunity.
        </p>
      </motion.div>

      {/* 🔹 Mission / Vision / Values */}
      <div className="grid md:grid-cols-3 gap-10 mb-24">
        {missionVisionValues.map((item, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            className="p-10 text-center bg-[#1A1A1A]/90 border border-white/10 rounded-2xl shadow-[0_0_20px_rgba(143,194,65,0.15)] backdrop-blur-md transition-transform duration-300"
          >
            {item.icon}
            <h3 className="text-2xl md:text-3xl font-semibold text-[var(--primary-color)] mb-3">
              {item.title}
            </h3>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* 🔹 Journey Timeline */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mb-24 max-w-3xl mx-auto"
      >
        <h3 className="text-3xl md:text-4xl font-semibold text-center text-[var(--accent-color)] drop-shadow-[0_0_15px_rgba(24,186,214,0.6)] mb-12">
          Our Journey
        </h3>
        <div className="relative border-l-4 border-[var(--accent-color)]/60 pl-8 space-y-10">
          {journeyData.map((event, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="relative bg-[#101010]/80 border border-white/10 rounded-xl p-6 shadow-md hover:shadow-[0_0_20px_rgba(24,186,214,0.25)] transition"
            >
              <div className="absolute -left-5 top-6 w-4 h-4 rounded-full bg-[var(--accent-color)] border-2 border-white animate-pulse"></div>
              <h4 className="text-lg md:text-xl font-semibold text-[var(--primary-color)]">
                {event.year}
              </h4>
              <p className="text-gray-300 text-base md:text-lg mt-2">
                {event.text}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 🔹 Team Members Section */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mb-20 max-w-7xl mx-auto"
      >
        <h3 className="text-3xl md:text-4xl font-semibold text-center text-[var(--primary-color)] drop-shadow-[0_0_15px_rgba(143,194,65,0.6)] mb-12">
          Our Team
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-[#101010]/90 border border-white/10 rounded-2xl p-6 shadow-[0_0_25px_rgba(143,194,65,0.15)] backdrop-blur-lg transition-all duration-300 hover:shadow-[0_0_40px_rgba(143,194,65,0.3)]"
            >
              <div className="flex justify-center mb-4">
                <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(143,194,65,0.25)] bg-[#1a1a1a]">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Try fallback image
                      if (e.target.src !== "/vedios/abc.jpeg") {
                        e.target.src = "/vedios/abc.jpeg";
                      } else {
                        // If fallback also fails, show placeholder
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center text-gray-500">
                            <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
              </div>
              <div className="text-center">
                <h4 className="text-xl md:text-2xl font-semibold text-[var(--primary-color)] mb-2">
                  {member.name}
                </h4>
                <p className="text-gray-400 text-sm md:text-base">
                  {member.designation}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 🔹 Impact Metrics */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-6xl mx-auto text-center"
      >
        <h3 className="text-3xl md:text-4xl font-semibold text-[var(--accent-color)] drop-shadow-[0_0_15px_rgba(24,186,214,0.6)] mb-12">
          Our Global Impact
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {impactData.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="p-10 bg-[#1A1A1A]/90 rounded-2xl shadow-[0_0_15px_rgba(143,194,65,0.15)] border border-white/10 backdrop-blur-md"
            >
              <ClientCountUp
                number={item.number}
                suffix={item.suffix}
                icon={item.icon}
                title={item.title}
              />
            </motion.div>
          ))}
        </div>

        {/* Quote */}
        <div className="relative bg-[#111]/90 border border-white/10 rounded-2xl shadow-[0_0_25px_rgba(24,186,214,0.15)] p-10 md:p-12 max-w-4xl mx-auto backdrop-blur-md">
          <FaQuoteLeft className="text-[var(--accent-color)] text-3xl mb-3 mx-auto" />
          <p className="text-gray-300 italic text-lg md:text-xl leading-relaxed">
            “Our mission is rooted in humanity — to light the path of
            opportunity, dignity, and empowerment for every life we touch.”
          </p>
          <p className="mt-4 text-[var(--primary-color)] font-semibold">
            — Tadbeer Foundation
          </p>
        </div>
      </motion.div>
    </section>
  );
}

