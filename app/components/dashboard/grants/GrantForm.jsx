"use client";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createGrant, getMyGrants } from "@/redux/slices/businessGrantSlice";
import { toast } from "react-hot-toast";

export default function GrantForm({ onSuccess }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const [form, setForm] = useState({
    title: "",
    description: "",
    proposal: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Authentication token missing. Please login again.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    if (form.proposal) formData.append("proposal", form.proposal);

    try {
      console.log("Submitting Grant with token:", token);
      const result = await dispatch(createGrant({ token, formData })).unwrap();
      toast.success("✅ Grant submitted successfully!");
      await dispatch(getMyGrants(token));

      setForm({ title: "", description: "", proposal: null });
      e.target.reset();
      onSuccess && onSuccess();
    } catch (err) {
      console.error("Grant submission error:", err);
      toast.error(`❌ ${err || "Failed to submit grant"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-6 bg-white rounded-xl shadow-md max-w-lg mx-auto"
    >
      <h2 className="text-xl font-bold text-center text-[var(--primary-color)]">
        Apply for Entrepreneur Incubation
      </h2>

      <input
        type="text"
        name="title"
        placeholder="Grant Title"
        value={form.title}
        onChange={handleChange}
        required
        className="p-2 border rounded bg-[var(--surface-color)] text-[var(--text-color)]"
      />

      <textarea
        name="description"
        placeholder="Describe your business idea..."
        value={form.description}
        onChange={handleChange}
        rows={4}
        required
        className="p-2 border rounded bg-[var(--surface-color)] text-[var(--text-color)]"
      />

      <input
        type="file"
        name="proposal"
        accept=".pdf,.doc,.docx"
        onChange={handleChange}
        className="p-2 border rounded bg-[var(--surface-color)] text-[var(--text-color)]"
      />

      <button
        type="submit"
        disabled={loading}
        className={`px-4 py-2 rounded font-bold text-white transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[var(--accent-color)] hover:opacity-90"
        }`}
      >
        {loading ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}
