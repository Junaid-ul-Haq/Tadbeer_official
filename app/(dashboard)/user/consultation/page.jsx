"use client";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Modal from "@/app/components/dashboard/scholoarship/Modal";
import ConsultationForm from "@/app/components/dashboard/consultation/ConsultationForm";
import { fetchUserConsultations } from "@/redux/slices/consultationSlice";

export default function UserConsultationDashboard() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const [showForm, setShowForm] = useState(false);

  const handleFormSuccess = () => {
    // Refresh overview data when consultation is submitted
    dispatch(fetchUserConsultations(token));
    setShowForm(false);
  };

  return (
    <div className="p-6 font-[var(--font-family)] text-[var(--text-color)]">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Book Career Pathways</h1>
          <p className="text-gray-400 text-sm">
            View all your career pathways requests in the{" "}
            <a href="/user" className="text-[var(--primary-color)] hover:underline">
              Overview
            </a>
          </p>
        </div>
        <button
          className="px-5 py-2 bg-[var(--primary-color)] text-black font-bold rounded-lg shadow-md hover:opacity-90 transition"
          onClick={() => setShowForm(true)}
        >
          Book Career Pathways
        </button>
      </div>

      <Modal show={showForm} onClose={() => setShowForm(false)}>
        <ConsultationForm onSuccess={handleFormSuccess} />
      </Modal>

      <div className="bg-[#1A1A1A]/60 rounded-xl border border-white/10 p-8 text-center">
        <p className="text-gray-400 text-lg">
          All your career pathways requests can be viewed in the Overview page.
        </p>
      </div>
    </div>
  );
}
