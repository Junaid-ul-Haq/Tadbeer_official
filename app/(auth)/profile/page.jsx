"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { completeProfile } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { IoIosAddCircle } from "react-icons/io";

export default function CompleteProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, token, isLoggedIn } = useSelector((state) => state.auth);

  // Check if user is logged in
  useEffect(() => {
    if (!isLoggedIn || !token) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }

    // ✅ Admins should not access profile page - redirect to admin panel
    if (user?.role === "admin") {
      router.push("/admin");
      return;
    }

    // If profile is already completed, redirect to dashboard
    if (user?.profileCompleted) {
      toast.success("Profile already completed!");
      router.push("/payment");
      return;
    }
  }, [isLoggedIn, token, user, router]);

  // 🎓 Education States
  const [education, setEducation] = useState({
    institute: "",
    degree: "",
    cgpa: "",
    startDate: "",
    endDate: "",
  });
  const [educations, setEducations] = useState([]);

  // 💼 Experience States
  const [experience, setExperience] = useState({
    institute: "",
    role: "",
    startDate: "",
    endDate: "",
  });
  const [experiences, setExperiences] = useState([]);

  const [error, setError] = useState("");

  // ➕ Add Education
  const addEducation = () => {
    if (!education.institute || !education.degree) {
      toast.error("Please fill all education fields first");
      return;
    }
    setEducations([...educations, { ...education }]);
    setEducation({ institute: "", degree: "", cgpa: "", startDate: "", endDate: "" });
  };

  // ➕ Add Experience
  const addExperience = () => {
    if (!experience.institute || !experience.role) {
      toast.error("Please fill all experience fields first");
      return;
    }
    setExperiences([...experiences, { ...experience }]);
    setExperience({ institute: "", role: "", startDate: "", endDate: "" });
  };

  // ❌ Remove Education / Experience
  const removeEducation = (index) =>
    setEducations(educations.filter((_, i) => i !== index));

  const removeExperience = (index) =>
    setExperiences(experiences.filter((_, i) => i !== index));

  // 🧾 Submit form
  const handleSubmit = async (e) => {
  e.preventDefault();

  // 🔹 Validate that user pressed "+" at least once
  if (educations.length === 0) {
    toast.error("Please add at least one education by clicking ➕ before proceeding.");
    return;
  }
  if (experiences.length === 0) {
    toast.error("Please add at least one experience by clicking ➕ before proceeding.");
    return;
  }

  const formData = {
    education: educations,
    experience: experiences,
  };

  const result = await dispatch(completeProfile(formData));

  if (result.meta.requestStatus === "fulfilled") {
    toast.success("Profile completed successfully!");
    
    // Redirect based on user role
    const userRole = user?.role || result.payload?.user?.role;
    if (userRole === "admin") {
      // Admin goes directly to dashboard
      router.push("/admin");
    } else {
      // User goes to payment page
      router.push("/payment");
    }
  } else {
    setError(result.payload || "Failed to complete profile");
    toast.error("Please try again!");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#050505] via-[#0A0A0A] to-[#111] text-white px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 w-full max-w-4xl bg-[#101010]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-[var(--accent-color)]">
            Complete Your Profile
          </h2>
          <p className="text-gray-400 mt-2">
            Provide your education and professional experience details.
          </p>
        </div>

        {error && (
          <p className="text-red-500 text-center mb-4 font-medium bg-red-500/10 p-2 rounded-lg">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* 🎓 Education Section */}
          <section className="border border-white/10 bg-gradient-to-br from-[#151515]/60 to-[#1A1A1A]/40 rounded-2xl p-8 shadow-inner">
            <h3 className="text-2xl font-semibold text-[var(--accent-color)] mb-6 flex items-center justify-between">
              Educational Background
              <IoIosAddCircle
                onClick={addEducation}
                className="text-3xl text-[var(--accent-color)] cursor-pointer hover:scale-110 transition-transform"
                title="Add Education"
              />
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input
                type="text"
                placeholder="Institute Name"
                className="input-style"
                value={education.institute}
                onChange={(e) =>
                  setEducation({ ...education, institute: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Degree Title"
                className="input-style"
                value={education.degree}
                onChange={(e) =>
                  setEducation({ ...education, degree: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="CGPA / Percentage"
                className="input-style"
                value={education.cgpa}
                onChange={(e) =>
                  setEducation({ ...education, cgpa: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Starting Date (e.g. 2021-09-01)"
                className="input-style"
                value={education.startDate}
                onChange={(e) =>
                  setEducation({ ...education, startDate: e.target.value })
                }
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => (e.target.type = "text")}
              />
              <input
                type="text"
                placeholder="Leaving Date (e.g. 2024-05-30)"
                className="input-style"
                value={education.endDate}
                onChange={(e) =>
                  setEducation({ ...education, endDate: e.target.value })
                }
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => (e.target.type = "text")}
              />
            </div>

            {educations.length > 0 && (
              <div className="mt-6">
                <h4 className="text-gray-400 mb-3">Added Education:</h4>
                <div className="space-y-2">
                  {educations.map((edu, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-[#181818]/70 border border-white/10 rounded-xl px-4 py-2"
                    >
                      <span className="text-sm text-gray-300">
                        🎓 {edu.institute} — {edu.degree} ({edu.startDate} →{" "}
                        {edu.endDate})
                      </span>
                      <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="text-red-400 hover:text-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* 💼 Experience Section */}
          <section className="border border-white/10 bg-gradient-to-br from-[#151515]/60 to-[#1A1A1A]/40 rounded-2xl p-8 shadow-inner">
            <h3 className="text-2xl font-semibold text-[var(--primary-color)] mb-6 flex items-center justify-between">
              Professional Experience
              <IoIosAddCircle
                onClick={addExperience}
                className="text-3xl text-[var(--primary-color)] cursor-pointer hover:scale-110 transition-transform"
                title="Add Experience"
              />
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input
                type="text"
                placeholder="Company / Organization"
                className="input-style"
                value={experience.institute}
                onChange={(e) =>
                  setExperience({ ...experience, institute: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Role / Position"
                className="input-style"
                value={experience.role}
                onChange={(e) =>
                  setExperience({ ...experience, role: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Starting Date (e.g. 2022-01-10)"
                className="input-style"
                value={experience.startDate}
                onChange={(e) =>
                  setExperience({ ...experience, startDate: e.target.value })
                }
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => (e.target.type = "text")}
              />
              <input
                type="text"
                placeholder="Leaving Date (e.g. 2025-03-15)"
                className="input-style"
                value={experience.endDate}
                onChange={(e) =>
                  setExperience({ ...experience, endDate: e.target.value })
                }
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => (e.target.type = "text")}
              />
            </div>

            {experiences.length > 0 && (
              <div className="mt-6">
                <h4 className="text-gray-400 mb-3">Added Experiences:</h4>
                <div className="space-y-2">
                  {experiences.map((exp, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-[#181818]/70 border border-white/10 rounded-xl px-4 py-2"
                    >
                      <span className="text-sm text-gray-300">
                        💼 {exp.institute} — {exp.role} ({exp.startDate} →{" "}
                        {exp.endDate})
                      </span>
                      <button
                        type="button"
                        onClick={() => removeExperience(index)}
                        className="text-red-400 hover:text-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* ✅ Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 rounded-xl font-semibold text-lg text-white 
              bg-gradient-to-r from-[var(--accent-color)] to-[var(--primary-color)] 
              shadow-[0_0_25px_rgba(143,194,65,0.4)] hover:shadow-[0_0_35px_rgba(24,186,214,0.5)] 
              transition-all duration-300"
          >
            Complete Profile & Go to Dashboard →
          </motion.button>
        </form>
      </motion.div>

      {/* 🎨 Tailwind Extra Styles */}
      <style jsx>{`
        .input-style {
          background-color: rgba(26, 26, 26, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.87);
          border-radius: 0.75rem;
          padding: 0.75rem;
          color: white;
          transition: all 0.3s ease;
        }

        .input-style:focus {
          outline: none;
          border-color: var(--accent-color);
          box-shadow: 0 0 8px var(--accent-color);
        }

        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(48%) sepia(86%) saturate(748%) hue-rotate(180deg);
          cursor: pointer;
        }

        input[type="date"]::-webkit-calendar-picker-indicator:hover {
          filter: invert(63%) sepia(92%) saturate(1100%) hue-rotate(190deg)
            brightness(105%);
        }

        input[type="date"] {
          color-scheme: dark;
        }
      `}</style>
    </div>
  );
}
