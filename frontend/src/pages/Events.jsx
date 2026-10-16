import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const parseLocalDate = (dateString) => {
    if (!dateString || dateString === "0000-00-00") return null;

    const [year, month, day] = dateString.split("-").map(Number);
    if (!year || !month || !day) return null;

    return new Date(year, month - 1, day);
  };

  const filterUpcomingEvents = (eventsList) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return eventsList.filter((event) => {
      // For a multi-day event, use its last day.
      const lastDate =
        parseLocalDate(event.event_end_date) ||
        parseLocalDate(event.event_date || event.date);

      return !lastDate || lastDate >= today;
    });
  };

  const formatEventDate = (startString, endString) => {
    const start = parseLocalDate(startString);
    const end = parseLocalDate(endString);

    if (!start) return "Date coming soon";

    const monthName = (date) =>
      date.toLocaleString("en-CA", { month: "long" });

    if (end && startString !== endString) {
      if (
        start.getFullYear() === end.getFullYear() &&
        start.getMonth() === end.getMonth()
      ) {
        return `${monthName(start)} ${start.getDate()} & ${end.getDate()}, ${start.getFullYear()}`;
      }

      return `${monthName(start)} ${start.getDate()}, ${start.getFullYear()} – ${monthName(end)} ${end.getDate()}, ${end.getFullYear()}`;
    }

    return `${monthName(start)} ${start.getDate()}, ${start.getFullYear()}`;
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await api.get("/getEvents.php");

        let eventsList;

        if (result?.success && Array.isArray(result.data)) {
          eventsList = result.data;
        } else if (Array.isArray(result)) {
          eventsList = result;
        } else {
          throw new Error("Invalid events response");
        }

        // registration_open = -1 means hide the event completely.
        const visibleEvents = eventsList.filter(
          (event) => Number(event.registration_open) !== -1
        );

        setEvents(filterUpcomingEvents(visibleEvents));
      } catch (err) {
        console.error("Failed to load events:", err);
        setError("Could not connect to the events service.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen bg-[#fdf6ef] px-4 py-10">
        <p className="text-center text-gray-600">Loading events...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-[#fdf6ef] px-4 py-10">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-md">
          <p className="font-semibold text-red-600">{error}</p>
          <p className="mt-2 text-sm text-gray-600">
            Please try again later.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#fdf6ef] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-center text-3xl font-bold text-[#d4503e] md:text-4xl">
          Upcoming Events
        </h1>

        {events.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-md">
            <p className="text-gray-600">No upcoming events found.</p>
          </div>
        ) : (
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6">
            {events.map((event, index) => {
              const eventKey = event.id || event._id || index;
              const imageUrl =
                event.image_url || event.image?.url || event.image || "";
              const eventTitle = event.title || "Untitled Event";
              const eventDescription =
                event.description || "More event details are coming soon.";
              const eventLocation = event.location || "To be announced";

              const eventDate =
                event.event_date && event.event_date !== "0000-00-00"
                  ? event.event_date
                  : event.date && event.date !== "0000-00-00"
                    ? event.date
                    : "";

              const eventEndDate =
                event.event_end_date &&
                  event.event_end_date !== "0000-00-00"
                  ? event.event_end_date
                  : "";

              const formattedEventDate = formatEventDate(
                eventDate,
                eventEndDate
              );

              const registrationLink =
                typeof event.registration_link === "string"
                  ? event.registration_link.trim()
                  : "";

              const registrationIsOpen =
                Number(event.registration_open) === 1;

              return (
                <article
                  key={eventKey}
                  className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)] transition duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                >
                  {/* Full banner, with no widget or crop */}
                  <div className="bg-[#f7e8dc]">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={eventTitle}
                        className="block h-auto w-full"
                      />
                    ) : (
                      <div className="flex min-h-[200px] items-center justify-center p-6">
                        <p className="font-semibold text-[#d4503e]">
                          Event image coming soon
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5 sm:p-7">
                    <h2 className="text-2xl font-bold text-[#d4503e] sm:text-3xl">
                      {eventTitle}
                    </h2>

                    <p className="mt-2 text-base font-semibold text-gray-700">
                      📅 {formattedEventDate}
                    </p>

                    <p className="mt-4 flex-1 leading-7 text-gray-700">
                      {eventDescription}
                    </p>

                    <p className="mt-4 text-sm text-gray-600">
                      <strong className="text-gray-800">Location:</strong>{" "}
                      {eventLocation}
                    </p>

                    <div className="mt-6">
                      {registrationIsOpen && registrationLink ? (
                        <>
                          <a
                            href={registrationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-full items-center justify-center rounded-lg bg-[#d4503e] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#bb4332] focus:outline-none focus:ring-2 focus:ring-[#d4503e] focus:ring-offset-2"
                            aria-label={`Buy non-member tickets for ${eventTitle}`}
                          >
                            Buy Non-Member Tickets
                          </a>

                          <p className="mt-3 text-center text-xs leading-5 text-gray-500">
                            Admission and dinner included. AGS members: enter your
                            membership code to access member pricing. Children under
                            10 are free but must be registered. Diwali + Christmas
                            combo tickets are also available.
                          </p>
                        </>
                      ) : registrationIsOpen ? (
                        <button
                          type="button"
                          disabled
                          className="w-full cursor-not-allowed rounded-lg bg-gray-300 px-5 py-3 text-sm font-semibold text-gray-600"
                        >
                          Ticket Link Coming Soon
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="w-full cursor-not-allowed rounded-lg bg-gray-300 px-5 py-3 text-sm font-semibold text-gray-600"
                        >
                          Registration Closed
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}