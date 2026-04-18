import React, { useState, useEffect } from "react";
import UIButton from "../components/ui/UIButtons.jsx";
import { useLocation } from "react-router-dom";

export default function Contact() {
  const location = useLocation();

  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    message: "",
    notify_membership: false,
  });

  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState("success");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("from") === "membership") {
      setFormData((prev) => ({ ...prev, notify_membership: true }));
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const sendEmail = async (e) => {
    e.preventDefault();

    if (!formData.user_name || !formData.user_email) {
      alert("Please fill in your name and email.");
      return;
    }

    setLoading(true);

    try {
      const API_BASE_URL = "https://api.airdriegujaratisamaj.ca";
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          notify_membership: formData.notify_membership ? "Yes" : "No",
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || "Form submitted successfully!");
        setFormData({
          user_name: "",
          user_email: "",
          message: "",
          notify_membership: false,
        });
      } else {
        alert(result.message || "Error submitting form.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }


  };

  return (<section id="contact" className="py-16 bg-brand-cream"> <div className="p-6 max-w-5xl mx-auto animate-fadeIn text-brand"> <h2 className="text-3xl font-heading font-bold tracking-wide text-center text-brand mb-10">
    Contact & Join Us </h2>


    {notification && (
      <div
        className={`mb-6 px-4 py-3 rounded-md text-center ${notificationType === "success"
            ? "bg-green-500 text-white"
            : "bg-red-500 text-white"
          }`}
      >
        {notification}
      </div>
    )}

    <div className="flex flex-col md:flex-row gap-10">

      <div className="flex-1 space-y-4 rounded-lg p-8 shadow-lg bg-white text-center"
        style={{
          borderWidth: "4px",
          borderImage: "linear-gradient(to right, #FF9933, #FFFFFF, #138808) 1",
        }}
      >
        <h3 className="text-2xl font-bold text-brand mb-3">
          Contact Us
        </h3>

        <p className="text-brand text-lg mb-4">
          Our contact form is temporarily unavailable.
          Please reach out to us directly:
        </p>

        <a
          href="mailto:airdriegujaratisamaj@gmail.com"
          className="text-xl font-semibold text-blue-600 underline break-all"
        >
          airdriegujaratisamaj@gmail.com
        </a>

        <p className="mt-4 text-brand">
          We will get back to you as soon as possible!
        </p>
      </div>
      {/* Contact Form 
      <form
        onSubmit={sendEmail}
        className="flex-1 space-y-4 rounded-lg p-6 shadow-lg bg-white"
        style={{
          borderWidth: "4px",
          borderImage: "linear-gradient(to right, #FF9933, #FFFFFF, #138808) 1",
        }}
      >
        <input
          type="text"
          name="user_name"
          placeholder="Your Name"
          value={formData.user_name}
          onChange={handleChange}
          className="w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          required
        />
        <input
          type="email"
          name="user_email"
          placeholder="Your Email"
          value={formData.user_email}
          onChange={handleChange}
          className="w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          required
        />
        <textarea
          name="message"
          rows="6"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          className="w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
        ></textarea>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="notify_membership"
            checked={formData.notify_membership}
            onChange={handleChange}
            className="h-5 w-5 text-yellow-500 rounded focus:ring-yellow-400"
          />
          <span className="text-brand">
            Notify me about membership updates or newsletters from Airdrie Gujarati Samaj
          </span>
        </label>

        <center>
          <UIButton
            type="submit"
            variant="green"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Send Message"}
          </UIButton>
        </center>
      </form>
*/}
      {/* Membership CTA */}
      <div className="flex-1 bg-brand-cream p-8 rounded-2xl shadow-lg border border-yellow-300 flex flex-col justify-center items-center text-center">
        <h3 className="text-2xl font-bold text-[#4b1d1d] mb-4">
          Become a Part of Something Special
        </h3>
        <p className="text-brand mb-6 px-4">
          Join Airdrie Gujarati Samaj and take part in cultural celebrations,
          events, and a vibrant community!
        </p>
        <UIButton
          href="/membershipinfo"
          variant="saffron"
        >
          Become a Member
        </UIButton>
      </div>
    </div>
  </div>
  </section>


  );
}
