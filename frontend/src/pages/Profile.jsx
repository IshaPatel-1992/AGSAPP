// Profile.jsx
import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("member") || "null");
    if (saved) {
      setUser(saved);
      setFormData({
        full_name: saved.full_name || "",
        email: saved.email || "",
        phone: saved.phone || "",
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await api.post("updateProfile.php", {
        member_id: user.id,
        ...formData,
      });

      if (result?.success) {
        localStorage.setItem("member", JSON.stringify(result.user));
        window.dispatchEvent(new Event("authChanged"));
        setMessage("Profile updated successfully.");
      } else {
        setMessage(result?.message || "Profile update failed.");
      }
    } catch {
      setMessage("Something went wrong.");
    }
  };

  return (
    <section className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow p-6">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full border rounded-lg px-4 py-2"
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border rounded-lg px-4 py-2"
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full border rounded-lg px-4 py-2"
          />

          <button className="px-5 py-2 rounded-lg bg-brand text-white">
            Save Changes
          </button>
        </form>

        {message && <p className="mt-4 text-sm">{message}</p>}
      </div>
    </section>
  );
}