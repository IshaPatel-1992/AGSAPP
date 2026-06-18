import React, { useEffect, useState } from "react";
import { api } from "../api";

const typeStyles = {
  Diamond: { color: "#22d3ee", border: "border-cyan-400 shadow-cyan-300" },
  Platinum: { color: "#b9c3cf", border: "border-slate-300 shadow-slate-200" },
  Gold: { color: "#d4af37", border: "border-yellow-400 shadow-yellow-200" },
  Silver: { color: "#c0c0c0", border: "border-gray-300 shadow-gray-200" },
  Bronze: { color: "#b87333", border: "border-orange-500 shadow-orange-300" },
  "Media Partner": {
    color: "#2563eb",
    border: "border-blue-400 shadow-blue-200",
  },
  Event: { color: "#7c3aed", border: "border-purple-400 shadow-purple-200" },
  Supporter: { color: "#16a34a", border: "border-green-400 shadow-green-200" },
};

const priorityOrder = [
  "Diamond",
  "Platinum",
  "Gold",
  "Silver",
  "Bronze",
  "Media Partner",
  "Event",
  "Supporter",
];

const normalizeType = (type) => {
  if (!type) return "";

  const value = type.toString().trim().toLowerCase();

  const map = {
    diamond: "Diamond",
    platinum: "Platinum",
    gold: "Gold",
    silver: "Silver",
    bronze: "Bronze",
    "media partner": "Media Partner",
    event: "Event",
    supporter: "Supporter",
  };

  return map[value] || "";
};

const SponsorGroup = ({ groupName, sponsors, onSponsorClick }) => {
  const style = typeStyles[groupName] || {
    color: "#444",
    border: "border-gray-200 shadow-gray-100",
  };

  const isMediaPartner = groupName === "Media Partner";

  const gridClasses = isMediaPartner
    ? "grid grid-cols-1 gap-8"
    : groupName === "Platinum"
    ? "grid grid-cols-1 sm:grid-cols-2 gap-8"
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8";

  return (
    <div className="mb-16">
      <h3 className="text-2xl sm:text-3xl font-bold text-center mb-10">
        <span
          className="px-4 py-1 rounded-lg shadow inline-block"
          style={{
            background: `linear-gradient(135deg, ${style.color}, #ffffff22)`,
            color: "#fff",
          }}
        >
          {groupName} Sponsors
        </span>
      </h3>

      <div className={gridClasses}>
        {sponsors.map((sponsor) => (
          <div
            key={sponsor.id}
            onClick={() => onSponsorClick(sponsor)}
            className={`relative overflow-hidden rounded-2xl bg-white group cursor-pointer hover:shadow-xl transition duration-300 border-4 ${style.border}`}
          >
            <div
              className={`flex justify-center items-center bg-white p-5 ${
                isMediaPartner
                  ? "h-56 sm:h-64 md:h-72 lg:h-80"
                  : "h-48"
              }`}
            >
              <img
                src={sponsor.logoUrl}
                alt={sponsor.name}
                className={`object-contain transition-transform duration-300 group-hover:scale-105 ${
                  isMediaPartner
                    ? "max-h-44 sm:max-h-52 md:max-h-60 lg:max-h-72 max-w-full"
                    : "max-h-40 max-w-full"
                }`}
              />
            </div>

            <div className="p-4">
              <p
                className={`font-semibold text-brand tracking-wide text-center ${
                  isMediaPartner
                    ? "text-base sm:text-lg"
                    : "text-sm sm:text-base"
                }`}
              >
                {sponsor.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function SponsorsSection() {
  const [sponsors, setSponsors] = useState([]);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const result = await api.get("getSponsors.php");

        let data = [];

        if (result?.success && Array.isArray(result.data)) {
          data = result.data;
        }

        const normalizedData = data
          .map((sponsor) => ({
            ...sponsor,
            type: normalizeType(sponsor.type),
          }))
          .filter((sponsor) => sponsor.type);

        setSponsors(normalizedData);
      } catch (err) {
        console.error("Error fetching sponsors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  const groupedSponsors = sponsors.reduce((acc, sponsor) => {
    if (!acc[sponsor.type]) {
      acc[sponsor.type] = [];
    }

    acc[sponsor.type].push(sponsor);
    return acc;
  }, {});

  const sortedTypes = priorityOrder.filter(
    (type) => groupedSponsors[type]?.length
  );

  if (loading) {
    return <p className="text-center mt-20">Loading Sponsors...</p>;
  }

  return (
    <section id="sponsors" className="py-20 bg-brand-cream min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-brand mb-16 tracking-tight">
          Our Valued Sponsors
        </h2>

        {sortedTypes.map((type) => (
          <SponsorGroup
            key={type}
            groupName={type}
            sponsors={groupedSponsors[type]}
            onSponsorClick={setSelectedSponsor}
          />
        ))}
      </div>

      {selectedSponsor && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedSponsor(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-lg w-full text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-4 text-gray-500 hover:text-gray-800 text-2xl"
              onClick={() => setSelectedSponsor(null)}
            >
              ×
            </button>

            <img
              src={selectedSponsor.logoUrl}
              alt={selectedSponsor.name}
              className="w-full max-h-[70vh] object-contain mb-4"
            />

            <h3 className="text-lg font-bold text-brand">
              {selectedSponsor.name}
            </h3>

            {selectedSponsor.description && (
              <p className="text-sm text-gray-600 mt-2">
                {selectedSponsor.description}
              </p>
            )}

            {selectedSponsor.website && (
              <a
                href={selectedSponsor.website}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-4 text-sm font-medium text-blue-600 hover:underline"
              >
                Visit Website
              </a>
            )}
          </div>
        </div>
      )}
    </section>
  );
}