"use client";
import { motion } from "framer-motion";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPaperPlane,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; 

export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative bg-gradient-to-b from-[#0A0A0A] via-[#0C0C0C] to-[#141414] 
      text-gray-300 border-t border-white/10 py-20 px-6 md:px-20 font-[var(--font-family)] overflow-hidden"
    >
      {/* 🔹 Glowing background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/4 w-[400px] h-[200px] bg-[var(--accent-color)]/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-10 right-1/4 w-[400px] h-[200px] bg-[var(--primary-color)]/20 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
        {/* 🔸 Logo & About */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl md:text-3xl font-semibold text-[var(--primary-color)] mb-5 drop-shadow-[0_0_10px_rgba(143,194,65,0.5)]">
            Tadbeer Foundation
          </h3>
          <p className="text-base text-gray-400 leading-relaxed">
            Guided by compassion and impact, we bridge hope and opportunity to
            empower lives and uplift communities.
          </p>

          {/* Social Icons */}
    
    <div className="flex gap-4 mt-6">
      {[
        { Icon: FaFacebook, link: "https://facebook.com/yourprofile" },
        { Icon: FaXTwitter, link: "https://x.com/CentreTadb42387" }, // ✅ X link
        { Icon: FaInstagram, link: "https://www.instagram.com/tadbeerofficial?fbclid=IwY2xjawNLDYpleHRuA2FlbQIxMABicmlkETA4bVFLeW5paHZYeHdVUmRLAR7hJvaG86pORayMMZe_8ZkoK0NS0Zi4MRwa2MFt6sznMnjeIp7ZhzLEdi4dfA_aem_AHhYs999ZunLiRTZvMYG_g" },
        { Icon: FaLinkedin, link: "https://www.linkedin.com/company/tadbeerofficial/?viewAsMember=true" },
      ].map(({ Icon, link }, i) => (
        <a
          key={i}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 border border-white/10 bg-white/5 text-gray-300 rounded-full 
          shadow-[0_0_10px_rgba(255,255,255,0.05)] 
          hover:text-white hover:bg-[var(--accent-color)] 
          hover:shadow-[0_0_20px_rgba(24,186,214,0.6)] 
          transition-all duration-300"
        >
          <Icon className="text-lg" />
        </a>
      ))}
    </div>
  


        </motion.div>

        {/* 🔸 Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center md:text-left"
        >
          <h4 className="text-xl md:text-2xl font-semibold text-[var(--accent-color)] mb-6 drop-shadow-[0_0_10px_rgba(24,186,214,0.4)]">
            Quick Links
          </h4>
          <ul className="space-y-3 text-base">
            {["Home", "About Us", "Services", "Contact"].map((item, i) => (
              <li key={i}>
                <a
                  href={`#${item.toLowerCase().replace(" ", "")}`}
                  className="hover:text-[var(--primary-color)] transition-colors duration-300 font-medium"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* 🔸 Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h4 className="text-xl md:text-2xl font-semibold text-[var(--primary-color)] mb-6 drop-shadow-[0_0_10px_rgba(143,194,65,0.5)]">
            Stay Connected
          </h4>
          <p className="text-base text-gray-400 mb-4">
            Subscribe for updates on our impact, stories, and initiatives.
          </p>
          <div className="flex items-center bg-[#1a1a1a]/80 border border-white/10 rounded-full px-4 py-3 shadow-[0_0_15px_rgba(24,186,214,0.1)] focus-within:shadow-[0_0_25px_rgba(24,186,214,0.4)] transition-all">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-transparent flex-1 text-base outline-none text-gray-300 placeholder-gray-500"
            />
            <button
              className="p-3 rounded-full bg-[var(--accent-color)] hover:bg-[var(--primary-color)] 
              text-white transition-all shadow-[0_0_15px_rgba(24,186,214,0.5)] hover:shadow-[0_0_20px_rgba(143,194,65,0.6)]"
            >
              <FaPaperPlane className="text-base" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* 🔹 Divider & Copyright */}
      <div className="border-t border-white/10 mt-14 pt-6 text-center text-sm md:text-base text-gray-500 leading-relaxed relative z-10">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-[var(--primary-color)]">
          Tadbeer Foundation
        </span>
        . All rights reserved.
        <br />
        <span className="text-[var(--accent-color)] font-medium">
          Empowering Lives with Compassion & Clarity.
        </span>
      </div>
    </footer>
  );
}
