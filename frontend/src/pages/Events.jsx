import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import DiwaliImg from "../assets/Events/Diwali1.jpg";
import ChristmasImg from "../assets/Events/ChristmasNewYearParty.jpg";

const MEMBER_LINK = "https://buytickets.at/airdriegujaratisamaj/2494697";
const NON_MEMBER_LINK = "https://buytickets.at/airdriegujaratisamaj/2494759";
const PARTIES = [
  { id: "diwali", title: "🪔 Diwali Party", date: "2026-11-21", time: "5:30 PM onwards", venue: "Town & Country Center", address: "275 Jensen Dr NE, Unit #103, Airdrie, AB T4B 0G2", entertainment: "Dance performances, dinner and live DJ Vaibhav", image: DiwaliImg },
  { id: "christmas", title: "🎄 Christmas & New Year Party", date: "2026-12-24", time: "6:30 PM onwards", venue: "We Rock The Spectrum", address: "440 28th St NE, Calgary, AB T2A 6T8", entertainment: "Dinner, festive music and DJ Vaibhav", image: ChristmasImg },
];

function readAccount() {
  try {
    const account = JSON.parse(
      localStorage.getItem("member") || "null"
    );

    if (
      !account ||
      typeof account !== "object" ||
      Array.isArray(account) ||
      !Number.isInteger(Number(account.id)) ||
      Number(account.id) <= 0
    ) {
      return null;
    }

    return account;
  } catch {
    return null;
  }
}

function parseLocalDate(dateString) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(
    dateString || ""
  );

  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function formatEventDate(dateString) {
  const date = parseLocalDate(dateString);

  return date
    ? date.toLocaleDateString("en-CA", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Date coming soon";
}

export default function EventsPage() {
  const [account, setAccount] = useState(readAccount);
  const [membershipCheck, setMembershipCheck] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const accountId = Number(account?.id) || 0;

  useEffect(() => {
    const syncAccount = () => setAccount(readAccount());

    window.addEventListener("authChanged", syncAccount);
    window.addEventListener("storage", syncAccount);

    return () => {
      window.removeEventListener("authChanged", syncAccount);
      window.removeEventListener("storage", syncAccount);
    };
  }, []);

  // Check paid membership before enabling member booking.
  useEffect(() => {
    let cancelled = false;

    setMembershipCheck(null);

    if (!accountId) {
      return () => {
        cancelled = true;
      };
    }

    async function checkMembership() {
      let status = "unavailable";

      try {
        const result = await api.post(
          "getMyEventEligibility.php",
          {
            member_id: accountId,
            membership_only: true,
          }
        );

        if (
          result?.success === true &&
          typeof result.has_paid_membership === "boolean"
        ) {
          status = result.has_paid_membership
            ? "paid"
            : "non-member";
        }
      } catch {
        status = "unavailable";
      }

      if (!cancelled) {
        setMembershipCheck({
          accountId,
          retryCount,
          status,
        });
      }
    }

    checkMembership();

    return () => {
      cancelled = true;
    };
  }, [accountId, retryCount]);

  const status = !accountId
    ? "non-member"
    : membershipCheck?.accountId === accountId &&
        membershipCheck?.retryCount === retryCount
      ? membershipCheck.status
      : "checking";

  const hasPaidMembership = status === "paid";
  const checkingMembership = status === "checking";


  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingParties = PARTIES.filter((party) => parseLocalDate(party.date) >= today);
  const comboAvailable = upcomingParties.length === PARTIES.length;
  const performanceOpen = today <= parseLocalDate("2026-10-31");
  const bookingClass = "inline-flex items-center justify-center rounded-xl px-5 py-3 text-center font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

  return (
    <section className="min-h-screen bg-[#fdf6ef] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-center text-3xl font-bold text-[#d4503e] md:text-4xl">Upcoming Events</h1>
        {upcomingParties.length === 0 ? (
          <p className="mt-8 rounded-2xl bg-white p-8 text-center text-gray-600">No upcoming events found.</p>
        ) : (
          <article className="mt-8 overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-md">
            {/* Both original posters remain fully visible without cropping. */}
            <div className="grid grid-cols-2 items-center bg-[#fff7f2]">
              {PARTIES.map((party) => <img key={party.id} src={party.image} alt={`${party.title} 2026 event poster`} className="h-auto w-full object-contain" />)}
            </div>
            <div className="p-5 sm:p-8">
              <h2 className="text-2xl font-bold text-[#d4503e] md:text-3xl">AGS Diwali & Christmas Celebrations 2026 — Admission & Dinner</h2>
              <p className="mt-4 leading-7 text-gray-700">Celebrate the festive season with Airdrie Gujarati Samaj! Enjoy festive dinners, cultural performances at Diwali, music and community fun. Choose one party or attend both and save $10 per person with a combo ticket.</p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {PARTIES.map((party) => {
                  const passed = parseLocalDate(party.date) < today;
                  return <section key={party.id} className="rounded-xl border border-orange-100 bg-[#fff7f2] p-5">
                    <h3 className="text-xl font-bold text-[#b54332]">{party.title}</h3>
                    <p className="mt-3 font-semibold">📅 {formatEventDate(party.date)}</p>
                    <p className="mt-2">⏰ {party.time}</p>
                    <p className="mt-2 font-semibold">📍 {party.venue}</p>
                    <p className="mt-1 leading-6 text-gray-700">{party.address}</p>
                    <p className="mt-3 text-sm leading-6 text-gray-700">{party.entertainment}</p>
                    {passed && <p className="mt-3 font-semibold text-gray-600">This party has ended.</p>}
                  </section>;
                })}
              </div>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <caption className="mb-3 text-left text-lg font-bold text-gray-800">Admission & Dinner — Prices in CAD per person</caption>
                  <thead className="bg-orange-50"><tr><th scope="col" className="p-3">Ticket option</th><th scope="col" className="p-3">AGS Members</th><th scope="col" className="p-3">Non-Members</th></tr></thead>
                  <tbody>
                    {PARTIES.map((party) => <tr key={party.id} className="border-b border-orange-100"><th scope="row" className="p-3 font-medium">{party.title} only</th><td className="p-3">$30</td><td className="p-3">$35</td></tr>)}
                    <tr className="bg-green-50 font-bold"><th scope="row" className="p-3">Both parties combo{!comboAvailable && " (unavailable)"}</th><td className="p-3">$50</td><td className="p-3">$60</td></tr>
                  </tbody>
                </table>
              </div>
              {comboAvailable && <p className="mt-3 font-semibold text-green-800">Save $10 per person with a combo! Each combo includes admission and dinner for one person at both parties, with a separate ticket for each celebration.</p>}
              <div className="mt-6 rounded-xl bg-purple-50 p-5">
                <h3 className="font-bold text-purple-800">Children under 10 — FREE admission & dinner</h3>
                <p className="mt-2 leading-7 text-gray-700">Available to member and non-member families. Register every child: choose a free child ticket for the selected party, or a free kids’ combo for both parties. Children aged 10 and above require a paid ticket.</p>
              </div>
              <div role="status" className="mt-6 rounded-xl border border-orange-100 p-4 text-sm leading-6 text-gray-700">
                {checkingMembership ? <p>Checking your paid membership...</p> : hasPaidMembership ? <p className="font-semibold text-green-700">Paid membership found. Member booking is available. Have your membership code ready at checkout.</p> : !accountId ? <p>Paid AGS member? <Link to="/login" state={{ redirectTo: "/events" }} className="font-semibold text-[#d4503e] underline">Sign in for member pricing</Link>. Non-member booking is available below.</p> : status === "non-member" ? <p>No paid membership found. <Link to="/membershipdashboard" className="font-semibold text-[#d4503e] underline">View your membership</Link> or book non-member tickets below.</p> : <div><p>We could not confirm paid membership. Non-member booking is available.</p><button type="button" onClick={() => setRetryCount((current) => current + 1)} className="mt-2 font-semibold text-[#d4503e] underline">Retry Membership Check</button></div>}
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {hasPaidMembership ? <a href={MEMBER_LINK} target="_blank" rel="noopener noreferrer" className={`${bookingClass} bg-[#d4503e] hover:bg-[#bb4332] focus-visible:ring-[#d4503e]`}>Book Member Tickets</a> : <button type="button" disabled className="rounded-xl bg-gray-100 px-5 py-3 font-semibold text-gray-500">{checkingMembership ? "Checking Membership..." : "Sign In to Access Member Tickets"}</button>}
                <a href={NON_MEMBER_LINK} target="_blank" rel="noopener noreferrer" className={`${bookingClass} bg-green-700 hover:bg-green-800 focus-visible:ring-green-700`}>Book Non-Member Tickets</a>
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">Select Diwali only, Christmas only, or the combo on the booking page. Member pricing requires a current, verified paid AGS membership. Please register everyone attending for dinner planning.</p>
              {performanceOpen && <section className="mt-6 rounded-xl border border-purple-100 p-5">
                <h3 className="font-bold text-purple-800">💃 Share Your Talent at Diwali!</h3>
                <p className="mt-2 leading-7 text-gray-700">Solo and group performances welcome: dance, singing, speeches, poetry, mimicry, comedy, skits, musical instruments and storytelling.</p>
                <p className="mt-2 font-semibold text-purple-800">Registration deadline: October 31, 2026</p>
                <a href="https://forms.gle/qqZV75c3UUssGjpWA" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block font-semibold text-purple-800 underline">Register Your Performance</a>
              </section>}
              <p className="mt-6 text-center font-semibold text-[#d4503e]">Let’s Grow Together, Let’s Glow Together.</p>
            </div>
          </article>
        )}
        <p className="mt-8 text-center text-sm leading-6 text-gray-600">For event or booking enquiries, contact <a href="mailto:info@airdriegujaratisamaj.ca" className="font-semibold text-[#d4503e] underline">info@airdriegujaratisamaj.ca</a></p>
      </div>
    </section>
  );
}
