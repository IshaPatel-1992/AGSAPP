import React from "react";
import UIButton from "./ui/UIButtons";
import diwaliBanner from "../assets/banners/Airdrie Diwali Dinner 2026 Banner.png";

export default function Hero() {
  return (
    <section className="bg-[#fff7ed]">
      {/* Preserve the full banner on every screen */}
      <img
        src={diwaliBanner}
        alt="Airdrie Gujarati Samaj Diwali Dinner 2026"
        className="block h-auto w-full"
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
        <div className="rounded-3xl bg-white p-5 shadow-lg sm:p-7 lg:p-10">
          <div className="inline-flex rounded-full bg-[#d4503e] px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-white">
            🪔 Diwali & Christmas 2026 🎄
          </div>

          <h1 className="mt-5 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Celebrate the Festive Season with AGS!
          </h1>

          <p className="mt-2 text-lg font-bold text-[#b84a24] sm:text-xl">
            Dinner • Entertainment • Culture • Community
          </p>

          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-700 sm:text-base">
            Join Airdrie Gujarati Samaj for our upcoming Diwali and Christmas
            celebrations! Gather with family and friends for festive evenings
            filled with delicious food, entertainment, and community togetherness.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <EventCard
              icon="🪔"
              title="Diwali Party 2026"
              description="Celebrate the festival of lights with dinner, cultural performances, and festive cheer."
              highlight="Performance registrations are now open!"
              performanceUrl="https://forms.gle/qqZV75c3UUssGjpWA"
            />

            <EventCard
              icon="🎄"
              title="Christmas & New Year Party"
              description="Celebrate Christmas and welcome the New Year with dinner, entertainment, and joyful moments together."
              highlight="More event details coming soon!"
            />
          </div>

          <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 p-4">
            <p className="text-base font-extrabold text-[#b84a24]">
              🎟️ Ticket booking opens soon!
            </p>
            <p className="mt-1 text-sm leading-relaxed text-gray-700">
              Stay tuned for dates, venue details, and booking links for both
              celebrations.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <UIButton to="/events" variant="saffron">
              View Upcoming Events
            </UIButton>
            <UIButton to="/membershipdashboard" variant="green">
              Become a Member
            </UIButton>
          </div>

          <p className="mt-5 text-sm text-gray-600">
            For event details or performance enquiries, contact{" "}
            <a
              href="mailto:info@airdriegujaratisamaj.ca"
              className="break-words font-semibold text-[#b84a24] underline underline-offset-4"
            >
              info@airdriegujaratisamaj.ca
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}

function EventCard({ icon, title, description, highlight, performanceUrl }) {
  return (
    <div className="rounded-2xl bg-orange-50 p-5">
      <h2 className="text-xl font-extrabold text-gray-900">
        <span aria-hidden="true">{icon}</span> {title}
      </h2>

      <p className="mt-2 text-sm leading-relaxed text-gray-700">
        {description}
      </p>

      <p className="mt-3 text-sm font-bold text-[#b84a24]">
        {highlight}
      </p>

      {performanceUrl && (
        <a
          href={performanceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#d4503e] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#b84a24] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4503e]"
        >
          Register for Diwali Performance
        </a>
      )}
    </div>
  );
}