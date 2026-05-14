import React from "react";
import UIButton from "./ui/UIButtons";

export default function Hero() {
  return (
    <>
      {/* ================= MOBILE / TABLET ================= */}
      <section className="relative overflow-hidden lg:hidden">

        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#7a1f1f] via-[#b45309] to-[#14532d]" />

        {/* Decorative Glow */}
        <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-yellow-400/20 blur-3xl" />
        <div className="absolute top-1/3 -right-10 h-52 w-52 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-green-400/20 blur-3xl" />

        <div className="relative z-10 flex min-h-[70vh] items-end px-4 py-10">
          <div className="w-full rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl shadow-2xl">

            <div className="inline-flex rounded-full bg-brand-saffron px-3 py-1 text-[11px] font-bold tracking-wide text-white">
              UPCOMING EVENTS 2026
            </div>

            <h1 className="mt-4 text-3xl font-heading font-extrabold leading-tight text-white">
              Celebrate Together with AGS
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-white/85">
              Bringing families and communities together through cultural,
              social, and fun-filled events all year long.
            </p>

            {/* Event Cards */}
            <div className="mt-5 space-y-3">

              {/* Picnic */}
              <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-yellow-300">
                  July 11, 2026
                </p>

                <h3 className="mt-1 text-lg font-bold text-white">
                  Community Picnic
                </h3>
              </div>

              {/* Outdoor Garba */}
              <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-yellow-300">
                  August 29, 2026
                </p>

                <h3 className="mt-1 text-lg font-bold text-white">
                  Outdoor Garba – First Time in Calgary
                </h3>

                <p className="mt-1 text-xs text-white/75">
                  Music, dance, food & cultural celebration.
                </p>
              </div>

              {/* Movie Night */}
              <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-yellow-300">
                  Coming Soon
                </p>

                <h3 className="mt-1 text-lg font-bold text-white">
                  Movie Night
                </h3>
              </div>

              {/* Camping */}
              <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-yellow-300">
                  Coming Soon
                </p>

                <h3 className="mt-1 text-lg font-bold text-white">
                  Camping Event
                </h3>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex flex-col gap-3">
              <UIButton to="/events" variant="saffron">
                View Events
              </UIButton>

              <UIButton to="/membershipdashboard" variant="green">
                Become a Member
              </UIButton>
            </div>
          </div>
        </div>
      </section>

      {/* ================= DESKTOP ================= */}
      {/* ================= DESKTOP ================= */}
<section className="relative hidden overflow-hidden lg:block">
  {/* Background */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#7a1f1f] via-[#b45309] to-[#14532d]" />

  {/* Decorative Glow */}
  <div className="absolute -top-20 -left-20 h-[360px] w-[360px] rounded-full bg-yellow-400/10 blur-3xl" />
  <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-green-500/10 blur-3xl" />

  {/* Pattern Overlay */}
  <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[size:24px_24px]" />

  <div className="relative z-10 mx-auto grid min-h-[72vh] max-w-7xl grid-cols-2 items-center gap-10 px-8 py-16 xl:px-12">
    
    {/* Left Content */}
    <div>
      <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-md">
        Upcoming Events 2026
      </div>

      <h1 className="mt-5 text-5xl font-heading font-extrabold leading-tight text-white xl:text-6xl">
        Celebrate Community Together
      </h1>

      <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/85">
        Experience cultural celebrations, family activities, entertainment nights,
        and outdoor adventures with Airdrie Gujarati Samaj.
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <UIButton to="/events" variant="saffron">
          View Events
        </UIButton>

        <UIButton to="/membershipdashboard" variant="green">
          Become a Member
        </UIButton>
      </div>
    </div>

    {/* Right Event Cards */}
    <div className="grid gap-4">
      <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl shadow-xl">
        <p className="text-sm font-bold uppercase tracking-widest text-yellow-300">
          July 11, 2026
        </p>
        <h3 className="mt-2 text-2xl font-bold text-white">
          Community Picnic
        </h3>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl shadow-xl">
        <p className="text-sm font-bold uppercase tracking-widest text-yellow-300">
          August 29, 2026
        </p>
        <h3 className="mt-2 text-2xl font-bold text-white">
          Outdoor Garba – First Time in Calgary
        </h3>
        <p className="mt-2 text-sm text-white/80">
          Music, dance, food, and community spirit.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl shadow-xl">
          <p className="text-sm font-bold uppercase tracking-widest text-yellow-300">
            Coming Soon
          </p>
          <h3 className="mt-2 text-2xl font-bold text-white">
            Movie Night
          </h3>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl shadow-xl">
          <p className="text-sm font-bold uppercase tracking-widest text-yellow-300">
            Coming Soon
          </p>
          <h3 className="mt-2 text-2xl font-bold text-white">
            Camping Event
          </h3>
        </div>
      </div>
    </div>
  </div>
</section>
    </>
  );
}