import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function GalleryPage() {
  const [events, setEvents] = useState([]);
  const [selectedYear, setSelectedYear] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch(
      `/api/gallery-events.php?year=${selectedYear}&search=${searchTerm}`
    )
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error(err));
  }, [selectedYear, searchTerm]);

  // Extract years dynamically
  const years = useMemo(() => {
    const uniqueYears = [
      ...new Set(events.map((e) => new Date(e.event_date).getFullYear())),
    ];
    return ["All", ...uniqueYears.sort((a, b) => b - a)];
  }, [events]);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-green-50">
        <div className="relative mx-auto max-w-7xl px-4 py-16 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Past Events Gallery
          </h1>
          <p className="mt-4 text-gray-600">
            Explore memorable moments from our community events.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 flex flex-col gap-4 lg:flex-row lg:justify-between">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-xl border px-4 py-2"
          />

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="rounded-xl border px-4 py-2"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year === "All" ? "All Years" : year}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Cards */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        {events.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
              <article
                key={event.id}
                className="group rounded-3xl border shadow-sm hover:shadow-xl transition"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={
                      event.cover_image ||
                      "https://via.placeholder.com/400"
                    }
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-6">
                  <p className="text-sm text-orange-600">
                    {formatDate(event.event_date)}
                  </p>

                  <h3 className="text-xl font-bold mt-2">
                    {event.title}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {event.location}
                  </p>

                  <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                    {event.description}
                  </p>

                  <div className="mt-5 flex justify-between items-center">
                    <Link
                      to={`/gallery/${event.id}`}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg"
                    >
                      View Gallery
                    </Link>

                    <span className="text-sm text-gray-400">
                      {new Date(event.event_date).getFullYear()}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p>No gallery events found</p>
          </div>
        )}
      </section>
    </div>
  );
}