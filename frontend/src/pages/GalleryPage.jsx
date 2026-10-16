import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

function formatDate(dateString) {
  if (!dateString) return "Date unavailable";

  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function GalleryPage() {
  const [events, setEvents] = useState([]);
  const [selectedYear, setSelectedYear] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Keep the year list available even after filtering the cards.
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function loadYears() {
      try {
        const response = await api.get(
          "/gallery-events.php?year=All&search="
        );

        const allEvents = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : [];

        const years = [
          ...new Set(
            allEvents
              .map((event) => Number(event.event_date?.slice(0, 4)))
              .filter(Number.isInteger)
          ),
        ].sort((a, b) => b - a);

        if (!cancelled) setAvailableYears(years);
      } catch (err) {
        console.error("Failed to load gallery years:", err);
      }
    }

    loadYears();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadEvents() {
      try {
        setLoading(true);
        setError("");

        const query = new URLSearchParams({
          year: selectedYear,
          search: searchTerm,
        });

        const response = await api.get(
          `/gallery-events.php?${query.toString()}`
        );

        const eventList = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : null;

        if (!eventList) {
          throw new Error("Unexpected gallery response");
        }

        if (!cancelled) setEvents(eventList);
      } catch (err) {
        console.error("Failed to load gallery events:", err);

        if (!cancelled) {
          setEvents([]);
          setError("Could not load gallery events. Please try again later.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadEvents();

    return () => {
      cancelled = true;
    };
  }, [selectedYear, searchTerm]);

  const years = useMemo(
    () => ["All", ...availableYears],
    [availableYears]
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Heading */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-green-50">
        <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:py-16">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
            Past Events Gallery
          </h1>

          <p className="mt-4 text-gray-600">
            Explore memorable moments from our community events.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:justify-between lg:px-8">
          <input
            type="search"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 lg:max-w-md"
            aria-label="Search gallery events"
          />

          <select
            value={selectedYear}
            onChange={(event) => setSelectedYear(event.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 lg:w-48"
            aria-label="Filter gallery by year"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year === "All" ? "All Years" : year}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Event cards */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {loading ? (
          <p className="py-16 text-center text-gray-600">
            Loading gallery events...
          </p>
        ) : error ? (
          <p className="py-16 text-center text-red-600" role="alert">
            {error}
          </p>
        ) : events.length === 0 ? (
          <p className="py-16 text-center text-gray-600">
            No gallery events found.
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
              <article
                key={event.id}
                className="flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:shadow-xl"
              >
                <div className="flex h-56 items-center justify-center bg-orange-50 sm:h-64">
                  {event.cover_image ? (
                    <img
                      src={event.cover_image}
                      alt={`${event.title} cover`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="px-4 text-center text-sm text-gray-500">
                      Event photo coming soon
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <p className="text-sm font-medium text-orange-600">
                    {formatDate(event.event_date)}
                  </p>

                  <h2 className="mt-2 text-xl font-bold text-gray-900">
                    {event.title}
                  </h2>

                  {event.location && (
                    <p className="mt-2 text-sm text-gray-500">
                      {event.location}
                    </p>
                  )}

                  {event.description && (
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
                      {event.description}
                    </p>
                  )}

                  <div className="mt-auto pt-6">
                    <Link
                      to={`/gallery/${event.id}`}
                      className="inline-flex rounded-lg bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
                    >
                      View Gallery
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}