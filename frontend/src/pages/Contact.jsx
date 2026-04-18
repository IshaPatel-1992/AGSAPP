import React from "react";
import UIButton from "../components/ui/UIButtons.jsx";
import { FaEnvelope } from "react-icons/fa";

export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-yellow-50 to-white">
      <div className="max-w-4xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#4b1d1d] mb-4">
            Contact Airdrie Gujarati Samaj
          </h1>
          <p className="text-lg md:text-xl text-[#333]">
            We’re here to support our community. Reach out to us anytime!
          </p>
        </div>

        {/* Centered Contact Card */}
        <div className="flex justify-center">
          <div className="bg-white p-10 rounded-2xl shadow-xl flex flex-col items-center text-center hover:shadow-2xl transition-shadow duration-300 max-w-md">
            <FaEnvelope className="text-4xl text-yellow-500 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Email Us</h3>
            <p className="text-[#555] mb-4">Reach out via email and we will respond promptly.</p>
            <a href="mailto:info@airdriegujaratisamaj.ca" className="text-blue-600 font-medium underline break-all">
             info@airdriegujaratisamaj.ca
            </a>
          </div>
        </div>

        {/* Membership CTA */}
        <div className="mt-16 bg-[#FFF3E0] p-12 rounded-3xl shadow-xl flex flex-col items-center text-center hover:shadow-2xl transition-shadow duration-300">
          <h3 className="text-3xl font-bold text-[#4b1d1d] mb-4">
            Become a Part of Something Special
          </h3>
          <p className="text-[#333] mb-6 max-w-2xl">
            Join Airdrie Gujarati Samaj and take part in cultural celebrations, events, and a vibrant community!
          </p>
          <UIButton href="/membershipinfo" variant="saffron" className="text-lg px-6 py-3">
            Become a Member
          </UIButton>
        </div>
      </div>
    </section>
  );
}
