import React from "react";
import heroImage from "../assets/banners/SudarkandEvent2026.png";
import UIButton from "./ui/UIButtons";

export default function Hero() {
  return (
    <>
      {/* ================= MOBILE / TABLET ================= */}
      <section
        className="lg:hidden relative bg-cover bg-center bg-no-repeat pt-20 pb-10 px-4"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        {/* Light overlay to soften image */}
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px]" />

        <div className="relative z-10 max-w-md mx-auto space-y-6">

          {/* Welcome card 
          <div className="rounded-3xl bg-white/70 border border-white/60 shadow-xl px-5 py-6 text-center backdrop-blur-md">
            <p className="text-sm font-semibold text-brand-saffron">
              Welcome to
            </p>

            <h1 className="mt-2 text-3xl font-heading font-extrabold leading-tight text-gray-900">
              Airdrie Gujarati Samaj
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-700">
              A community rooted in culture, devotion, and togetherness
            </p>
          </div> */}

          {/* Event card */}
          <div className="rounded-3xl overflow-hidden border border-white/50 bg-[#3a140fe8] shadow-xl backdrop-blur-md">
            <div className="bg-gradient-to-r from-brand-saffron to-brand-green px-5 py-3">
              <p className="text-white text-sm font-bold">
                Free Community Event
              </p>
            </div>

            <div className="px-5 py-6 text-center">
              <h2 className="text-2xl font-heading font-extrabold text-white">
                Sundarkand Path
              </h2>

              <div className="mt-5 space-y-2">
                <p className="text-base font-semibold text-white">
                  Saturday, 18 April 2026
                </p>
                <p className="text-base font-semibold text-white">
                  5:30 PM
                </p>
                <p className="text-base font-semibold text-white">
                  Town & Country Community Hall
                </p>
                <p className="text-sm text-white/90">
                  275 Jensen Dr NE, Airdrie, AB T4A 1K9
                </p>
              </div>

              <p className="mt-4 text-sm text-white/85">
                Join us for a devotional gathering and community prayer.
              </p>

              <div className="mt-5 flex flex-col gap-3">
                <UIButton to="/events" variant="saffron">
                  RSVP
                </UIButton>
                <UIButton to="/contact" variant="green">
                  Contact Us
                </UIButton>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= DESKTOP ================= */}
      <section
        className="relative hidden min-h-[88vh] overflow-hidden bg-cover bg-center lg:block"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/10 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/5" />

        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl items-center justify-center px-6 xl:px-10">
          <div className="w-full max-w-[540px]">
            {/* <div className="rounded-[28px] border border-white/10 bg-black/34 px-7 py-6 text-center shadow-2xl backdrop-blur-md">
              <p className="text-sm font-semibold text-brand-saffron lg:text-base">
                Welcome to
              </p>

              <h1 className="mt-1 text-4xl font-heading font-extrabold leading-tight text-white xl:text-5xl">
                Airdrie Gujarati Samaj
              </h1>

              <p className="mt-3 text-base leading-7 text-white/90 xl:text-lg">
                A community rooted in culture, devotion, and togetherness
              </p>
            </div> */}

            <div className="mt-6 overflow-hidden rounded-[28px] border border-white/10 bg-[#2b130fcc] shadow-2xl backdrop-blur-md">
              <div className="bg-gradient-to-r from-brand-saffron to-brand-green px-6 py-3">
                <p className="text-sm font-bold text-white xl:text-base">
                  Free Community Event
                </p>
              </div>

              <div className="px-6 py-6 text-center">
                <h2 className="text-3xl font-heading font-extrabold text-white xl:text-[34px]">
                  Sundarkand Path
                </h2>

                <div className="mt-5 space-y-2">
                  <p className="text-base sm:text-lg font-semibold text-white">
                    Saturday, 18 April 2026
                  </p>
                  <p className="text-base sm:text-lg font-semibold text-white">
                    5:30 PM Onwards
                  </p>
                  <p className="text-base sm:text-lg font-semibold text-white">
                    Town &amp; Country Community Hall
                  </p>
                  <p className="text-sm sm:text-base leading-6 text-white/95">
                    275 Jensen Dr NE, Airdrie, AB T4A 1K9
                  </p>
                </div>

                <p className="mt-5 text-base leading-7 text-white/85">
                  Join us for a devotional gathering and community prayer.
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <UIButton
  href="https://docs.google.com/forms/d/e/1FAIpQLSdquif6Gamuf7UDICSTzuIji2kLF2ZdiY6RgAZguyR59JuTnw/viewform"
  variant="saffron"
>
  RSVP
</UIButton>
                  <UIButton to="/contact" variant="green">
                    Contact Us
                  </UIButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}