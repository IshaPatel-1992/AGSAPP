import React from "react";
import UIButton from "./ui/UIButtons";
import picnicBanner from "../assets/banners/picnic-banner1.jpg";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#fff7ed]">
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{
          backgroundImage: `url(${picnicBanner})`,
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-7xl items-center px-5 py-16 md:px-8 lg:py-24">
        <div className="max-w-2xl rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-md md:p-8">
          <div className="inline-flex rounded-full bg-[#d4503e] px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-white shadow-lg">
            Picnic 2026 • Booking Opens Soon
          </div>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white md:text-6xl">
            Community Picnic 2026
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/90 md:text-lg">
            Join Airdrie Gujarati Samaj for a joyful day of food, games, music,
            family fun, and community bonding.
          </p>

          <div className="mt-6 grid gap-3 rounded-2xl border border-white/15 bg-black/25 p-4 text-white sm:grid-cols-3">
            <InfoBox label="Date" value="July 11, 2026" />
            <InfoBox label="Time" value="11:00 AM onwards" />
            <InfoBox label="Location" value="Nose Creek Park" />
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <UIButton to="/events" variant="saffron">
              View All Events
            </UIButton>

            <UIButton to="/membershipdashboard" variant="green">
              Become a Member
            </UIButton>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-orange-200">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-white">{value}</p>
    </div>
  );
}