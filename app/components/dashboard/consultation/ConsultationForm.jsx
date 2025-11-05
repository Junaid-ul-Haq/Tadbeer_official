"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createConsultation, fetchCategories } from "@/redux/slices/consultationSlice";

export default function ConsultationForm({ onSuccess }) {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const categories = useSelector(state => state.consultation.categories);

  const [formData, setFormData] = useState({ category: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (token) dispatch(fetchCategories(token));
  }, [token, dispatch]);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); 
    setError(""); 
    setSuccess("");

    try {
      const result = await dispatch(createConsultation({ token, data: formData })).unwrap();
      setSuccess("✅ Consultation submitted successfully!");
      setFormData({ category: "", description: "" });
      onSuccess && onSuccess();
    } catch (err) {
      setError(err || "Failed to submit consultation");
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 bg-[var(--surface-color)] rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-center text-[var(--primary-color)]">Request Career Counseling</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
        className="p-2 border rounded bg-[var(--surface-color)] text-[var(--text-color)]"
      >
        <option value="">Select Category</option>
        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
      </select>

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Describe your concern..."
        rows={4}
        required
        className="p-2 border rounded bg-[var(--surface-color)] text-[var(--text-color)]"
      />

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-[var(--accent-color)] rounded font-bold text-white"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
