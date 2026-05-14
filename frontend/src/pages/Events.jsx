import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FILTER UPCOMING EVENTS ONLY
  const filterUpcomingEvents = (eventsList) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return eventsList.filter((event) => {
      const eventDate = event.event_date || event.date;

      // Show events with no date as Coming Soon
      if (!eventDate || eventDate === "0000-00-00") return true;

      const [year, month, day] = eventDate.split("-").map(Number);
      const eventLocalDate = new Date(year, month - 1, day);

      return eventLocalDate >= today;
    });
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const result = await api.get("/getEvents.php");

        if (result?.success) {
          setEvents(filterUpcomingEvents(result.data || []));
        } else if (Array.isArray(result)) {
          setEvents(filterUpcomingEvents(result));
        } else {
          setError(result?.message || "Failed to fetch events");
        }
      } catch (err) {
        setError("Could not connect to backend");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <p className="px-6 py-10 text-center">
        Loading Events...
      </p>
    );
  }

  if (error) {
    return (
      <p className="px-6 py-10 text-center text-red-600">
        {error}
      </p>
    );
  }

  return (
    <section className="min-h-screen bg-[#fdf6ef] px-6 py-10">
      <div className="mx-auto max-w-[1000px]">
        <h1 className="mb-8 text-center text-3xl font-bold text-[#d4503e] md:text-4xl">
          Events
        </h1>

        {events.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
            No upcoming events found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event, index) => {
              const imageUrl =
                event.image_url || event.image?.url || event.image || "";

              const eventTitle = event.title || "Untitled Event";
              const eventDescription =
                event.description || "No description available.";
              const eventLocation =
                event.location || "To be announced";

              const eventDate =
                event.event_date && event.event_date !== "0000-00-00"
                  ? event.event_date
                  : event.date && event.date !== "0000-00-00"
                    ? event.date
                    : "";

              const eventEndDate = event.event_end_date || "";

              const formatDate = (dateString) => {
                const [year, month, day] = dateString
                  .split("-")
                  .map(Number);

                const monthNames = [
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ];

                return `${day} ${monthNames[month - 1]} ${year}`;
              };

              const formattedEventDate =
                eventDate && eventEndDate
                  ? `${formatDate(eventDate)} - ${formatDate(eventEndDate)}`
                  : eventDate
                    ? formatDate(eventDate)
                    : "Date Coming Soon July-August";

              const eventKey = event.id || event._id || index;

              const isRegistrationOpen =
                Number(event.registration_open) === 1;

              const registrationLink =
                event.registration_link || "";

              return (
                <div
                  key={eventKey}
                  className="rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
                >
                  <div className="relative">
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt={eventTitle}
                        className="mb-4 block h-[220px] w-full rounded-xl object-cover"
                      />
                    )}

                    {/* DATE BADGE */}
                    {eventDate ? (() => {
                      const [year, month, day] =
                        eventDate.split("-").map(Number);

                      const monthNames = [
                        "JAN",
                        "FEB",
                        "MAR",
                        "APR",
                        "MAY",
                        "JUN",
                        "JUL",
                        "AUG",
                        "SEP",
                        "OCT",
                        "NOV",
                        "DEC",
                      ];

                      return (
                        <div className="absolute left-4 top-4 rounded-2xl bg-white/95 backdrop-blur-sm px-4 py-2 shadow-lg text-center">
                          <p className="text-xs font-bold text-orange-500">
                            {monthNames[month - 1]}
                          </p>

                          <p className="text-xl font-extrabold text-gray-900 leading-none">
                            {day}
                          </p>

                          <p className="text-[11px] font-semibold text-gray-500">
                            {year}
                          </p>
                        </div>
                      );
                    })() : (
                      <div className="absolute left-4 top-4 rounded-2xl bg-orange-500 px-4 py-2 shadow-lg text-center">
                        <p className="text-xs font-bold text-white">
                          COMING
                        </p>

                        <p className="text-sm font-extrabold text-white leading-none">
                          SOON
                        </p>
                        <p className="text-sm font-extrabold text-white leading-none">
                          JUL-AUG
                        </p>
                      </div>
                    )}
                  </div>

                  <h2 className="m-0 text-2xl font-bold text-[#d4503e]">
                    {eventTitle}
                  </h2>

                  <p className="mt-2 text-sm text-[#666]">
                    {formattedEventDate}
                  </p>

                  <p className="mt-4 leading-7 text-[#444]">
                    {eventDescription}
                  </p>

                  <p className="mt-4 text-sm text-[#666]">
                    <strong>Location:</strong> {eventLocation}
                  </p>

                  {isRegistrationOpen && registrationLink && (
                    <div className="mt-5">
                      <button
                        onClick={() =>
                          window.open(registrationLink, "_blank")
                        }
                        className="rounded-lg bg-[#d4503e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#bb4332]"
                      >
                        Register / RSVP
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}