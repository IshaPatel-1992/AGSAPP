import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const galleryEvents = [
    {
    id: 1,
    title: "Summer Picnic 2025",
    slug: "summer-picnic-2025",
    date: "2025-07-20",
    year: "2025",
    category: "Community",
    location: "Airdrie",
    description:
      "A fun-filled family picnic with games, food, and beautiful community moments.",
    coverImage:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    photoCount: 34,
  },
  {
    id: 2,
    title: "Diwali Night 2025",
    slug: "diwali-2025",
    date: "2025-11-01",
    year: "2025",
    category: "Festival",
    location: "Airdrie",
    description:
      "Memorable moments from our Diwali celebration with lights, culture, and performances.",
    coverImage:
      "https://images.unsplash.com/photo-1604423043493-4138c7b7c2f2?auto=format&fit=crop&w=1200&q=80",
    photoCount: 65,
  },
  {
    id: 3,
    title: "Navratri Garba 2025",
    slug: "navratri-garba-2025",
    date: "2025-10-10",
    year: "2025",
    category: "Cultural",
    location: "Airdrie",
    description:
      "Energetic Garba night bringing families and friends together in celebration.",
    coverImage:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
    photoCount: 73,
  },
  
];

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function GalleryPage() {
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const years = useMemo(() => {
    const uniqueYears = [...new Set(galleryEvents.map((event) => event.year))];
    return ["All", ...uniqueYears.sort((a, b) => b.localeCompare(a))];
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(galleryEvents.map((event) => event.category)),
    ];
    return ["All", ...uniqueCategories.sort()];
  }, []);

  const filteredEvents = useMemo(() => {
    return galleryEvents.filter((event) => {
      const matchesYear =
        selectedYear === "All" || event.year === selectedYear;
      const matchesCategory =
        selectedCategory === "All" || event.category === selectedCategory;
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesYear && matchesCategory && matchesSearch;
    });
  }, [selectedYear, selectedCategory, searchTerm]);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-green-50">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-16 -left-12 h-52 w-52 rounded-full bg-orange-200 blur-3xl" />
          <div className="absolute top-20 right-0 h-64 w-64 rounded-full bg-green-200 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-44 w-44 rounded-full bg-yellow-100 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full bg-orange-100 px-4 py-1 text-sm font-semibold text-orange-700">
              Airdrie Gujarati Samaj
            </span>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Past Events Gallery
            </h1>

            <p className="mt-4 text-base leading-7 text-gray-600 sm:text-lg">
              Explore memorable moments from our community events, festivals,
              family gatherings, and celebrations over the years.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Browse Event Galleries
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Filter by year, category, or search by event name.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-auto">
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year === "All" ? "All Years" : year}
                  </option>
                ))}
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "All" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Cards */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {filteredEvents.length > 0 ? (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing <span className="font-semibold">{filteredEvents.length}</span>{" "}
                event{filteredEvents.length > 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {filteredEvents.map((event) => (
                <article
                  key={event.id}
                  className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={event.coverImage}
                      alt={event.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                    <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-800">
                        {event.category}
                      </span>
                      <span className="rounded-full bg-orange-500/90 px-3 py-1 text-xs font-semibold text-white">
                        {event.photoCount} Photos
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-sm font-medium text-orange-600">
                      {formatDate(event.date)}
                    </p>

                    <h3 className="mt-2 text-xl font-bold text-gray-900">
                      {event.title}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">{event.location}</p>

                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
                      {event.description}
                    </p>

                    <div className="mt-6 flex items-center justify-between">
                      <Link
                        to={`/gallery/${event.slug}`}
                        className="inline-flex items-center rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                      >
                        View Gallery
                      </Link>

                      <span className="text-sm font-medium text-gray-400">
                        {event.year}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
            <h3 className="text-xl font-semibold text-gray-900">
              No galleries found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Try changing the filters or search term to see more event galleries.
            </p>

            <button
              onClick={() => {
                setSelectedYear("All");
                setSelectedCategory("All");
                setSearchTerm("");
              }}
              className="mt-6 inline-flex rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}