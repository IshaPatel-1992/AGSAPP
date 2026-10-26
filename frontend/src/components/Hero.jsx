import React from "react";
import UIButton from "./ui/UIButtons";
import diwaliBanner from "../assets/Events/DiwaliandChristmasCelebrations2026.png";

export default function Hero() {
  // Keep your existing banner import, or replace it with your combined banner.
  const performanceRegistrationOpen =
    new Date() < new Date("2026-11-01T00:00:00-06:00");

  return (
    <section className="bg-[#fff7ed]">
      <img
        src={diwaliBanner}
        alt="Airdrie Gujarati Samaj festive celebrations 2026"
        className="block h-auto w-full"
        fetchPriority="high"
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
            Join Airdrie Gujarati Samaj for Diwali and Christmas celebrations!
            Enjoy festive dinners, music, cultural performances at Diwali, and
            joyful moments with family and friends. Choose one party or book
            both celebrations with our money-saving combo.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <EventCard
              icon="🪔"
              title="Diwali Party 2026"
              date="Saturday, November 21, 2026"
              dateTime="2026-11-21"
              time="5:30 PM onwards"
              venue="Town & Country Center"
              address="275 Jensen Dr NE, Unit #103, Airdrie, AB T4B 0G2"
              description="Dance performances, dinner and live DJ Vaibhav."
            />
            <EventCard
              icon="🎄"
              title="Christmas & New Year Party 2026"
              date="Thursday, December 24, 2026"
              dateTime="2026-12-24"
              time="6:30 PM onwards"
              venue="We Rock The Spectrum"
              address="440 28th St NE, Calgary, AB T2A 6T8"
              description="Dinner, festive music and DJ Vaibhav."
            />
          </div>

          <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 p-5">
            <h2 className="text-lg font-extrabold text-[#b84a24]">
              🎟️ Booking Is Now Open — Admission & Dinner
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-white p-4">
                <h3 className="font-bold text-gray-900">Each Party</h3>
                <p className="mt-2 text-sm text-gray-700">AGS Members: <strong>$30 per person</strong></p>
                <p className="mt-1 text-sm text-gray-700">Non-Members: <strong>$35 per person</strong></p>
              </div>
              <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                <h3 className="font-bold text-green-800">Diwali + Christmas Combo</h3>
                <p className="mt-2 text-sm text-gray-700">AGS Members: <strong>$50 per person</strong></p>
                <p className="mt-1 text-sm text-gray-700">Non-Members: <strong>$60 per person</strong></p>
                <p className="mt-2 text-sm font-bold text-green-800">Save $10 per person!</p>
              </div>
            </div>
            <p className="mt-4 text-sm font-bold text-purple-800">
              👧👦 Children under 10: FREE admission & dinner for member and non-member families.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              Registration is required for every child at each party. Select
              individual free child tickets or a free kids’ combo for both
              celebrations. Children aged 10 and above require a paid ticket.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              Each combo covers one person at both parties, with a separate
              ticket for each celebration. Member pricing is available to
              current, verified paid AGS members. Have your membership code
              ready when booking.
            </p>
          </div>

          {performanceRegistrationOpen && (
            <div className="mt-5 rounded-2xl border border-purple-200 bg-purple-50 p-5">
              <h2 className="font-extrabold text-purple-800">💃 Share Your Talent at Diwali!</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">
                Solo and group performance registrations are open. Dance,
                singing, poetry, comedy, skits, musical instruments and more
                are welcome!
              </p>
              <p className="mt-2 text-sm font-bold text-purple-800">Registration deadline: October 31, 2026</p>
              <a
                href="https://forms.gle/qqZV75c3UUssGjpWA"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-purple-700 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-purple-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-700"
              >
                Register for Diwali Performance
              </a>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <UIButton to="/events" variant="saffron">Book Tickets — One Party or Both</UIButton>
            <UIButton to="/membershipdashboard" variant="green">Become a Member</UIButton>
          </div>
          <p className="mt-5 text-sm text-gray-600">
            For event details or performance enquiries, contact{" "}
            <a href="mailto:info@airdriegujaratisamaj.ca" className="break-words font-semibold text-[#b84a24] underline underline-offset-4">
              info@airdriegujaratisamaj.ca
            </a>.
          </p>
          <p className="mt-4 font-bold text-[#b84a24]">Let’s Grow Together, Let’s Glow Together.</p>
        </div>
      </div>
    </section>
  );
}

function EventCard({ icon, title, date, dateTime, time, venue, address, description }) {
  return (
    <div className="rounded-2xl bg-orange-50 p-5">
      <h2 className="text-xl font-extrabold text-gray-900"><span aria-hidden="true">{icon}</span> {title}</h2>
      <p className="mt-3 text-sm font-bold text-[#b84a24]">📅 <time dateTime={dateTime}>{date}</time></p>
      <p className="mt-2 text-sm font-semibold text-gray-800">⏰ {time}</p>
      <p className="mt-3 text-sm font-bold text-gray-900">📍 {venue}</p>
      <p className="mt-1 text-sm leading-relaxed text-gray-700">{address}</p>
      <p className="mt-3 text-sm leading-relaxed text-gray-700">{description}</p>
    </div>
  );
}
