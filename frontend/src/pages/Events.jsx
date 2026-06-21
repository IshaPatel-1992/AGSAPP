import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function EventsPage() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const filterUpcomingEvents = (eventsList) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return eventsList.filter((event) => {
      const eventDate = event.event_date || event.date;

      if (!eventDate || eventDate === "0000-00-00") return true;

      const [year, month, day] = eventDate.split("-").map(Number);
      const eventLocalDate = new Date(year, month - 1, day);

      return eventLocalDate >= today;
    });
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "0000-00-00") return "";

    const [year, month, day] = dateString.split("-").map(Number);

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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const result = await api.get("/getEvents.php");

        if (result?.success) {
          const visibleEvents = (result.data || []).filter(
            (event) => Number(event.registration_open) !== -1
          );

          setEvents(filterUpcomingEvents(visibleEvents));
        } else if (Array.isArray(result)) {
          const visibleEvents = result.filter(
            (event) => Number(event.registration_open) !== -1
          );

          setEvents(filterUpcomingEvents(visibleEvents));
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
    return <p className="px-6 py-10 text-center">Loading Events...</p>;
  }

  if (error) {
    return <p className="px-6 py-10 text-center text-red-600">{error}</p>;
  }

  const handleBookNow = (eventId) => {
    navigate(`/events/${eventId}/booking`);
  };
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
              const eventKey = event.id || event._id || index;

              const imageUrl =
                event.image_url || event.image?.url || event.image || "";

              const eventTitle = event.title || "Untitled Event";

              const eventDescription =
                event.description || "No description available.";

              const eventLocation = event.location || "To be announced";

              const eventDate =
                event.event_date && event.event_date !== "0000-00-00"
                  ? event.event_date
                  : event.date && event.date !== "0000-00-00"
                    ? event.date
                    : "";

              const eventEndDate =
                event.event_end_date && event.event_end_date !== "0000-00-00"
                  ? event.event_end_date
                  : "";

              const formattedEventDate =
                eventDate && eventEndDate
                  ? `${formatDate(eventDate)} - ${formatDate(eventEndDate)}`
                  : eventDate
                    ? formatDate(eventDate)
                    : "Date Coming Soon July-August";

              

              const isPicnicEvent = eventTitle
                .toLowerCase()
                .includes("picnic");

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

                    {eventDate ? (
                      (() => {
                        const [year, month, day] = eventDate
                          .split("-")
                          .map(Number);

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
                          <div className="absolute left-4 top-4 rounded-2xl bg-white/95 px-4 py-2 text-center shadow-lg backdrop-blur-sm">
                            <p className="text-xs font-bold text-orange-500">
                              {monthNames[month - 1]}
                            </p>

                            <p className="text-xl font-extrabold leading-none text-gray-900">
                              {day}
                            </p>

                            <p className="text-[11px] font-semibold text-gray-500">
                              {year}
                            </p>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="absolute left-4 top-4 rounded-2xl bg-orange-500 px-4 py-2 text-center shadow-lg">
                        <p className="text-xs font-bold text-white">COMING</p>

                        <p className="text-sm font-extrabold leading-none text-white">
                          SOON
                        </p>

                        <p className="text-sm font-extrabold leading-none text-white">
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

                  <div className="mt-5">
                    {isPicnicEvent && (
                      <div className="mt-5">
                        <button
                          onClick={() => handleBookNow(event.id)}
                          className="rounded-lg bg-[#d4503e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#bb4332]"
                        >
                          Book Now
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}