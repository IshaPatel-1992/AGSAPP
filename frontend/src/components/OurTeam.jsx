import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function OurTeam() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedMap, setExpandedMap] = useState({});

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await api.get("getTeamMembers.php");

        if (response?.success) {
          setTeam(response.team || []);
        } else {
          console.error("Failed to fetch team members");
        }
      } catch (err) {
        console.error("Error fetching team:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  const toggleExpanded = (id) => {
    setExpandedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getInitials = (fullName) => {
    const parts = fullName.trim().split(" ");
    const first = parts[0]?.[0] || "";
    const last = parts[parts.length - 1]?.[0] || "";
    return (first + last).toUpperCase();
  };

  if (loading) return <p className="text-center mt-20">Loading Our Team...</p>;

  return (
    <section className="py-20 bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <h2
          className="text-3xl sm:text-4xl font-heading font-bold tracking-wide text-center mb-10 drop-shadow-lg"
          style={{ color: "#d4503e" }}
        >
          Our Team
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {team.map((member) => {
            const isLong = member.bio && member.bio.length > 150;
            const expanded = expandedMap[member.id];
            const displayBio =
              expanded || !isLong
                ? member.bio
                : `${member.bio.slice(0, 150)}...`;

            return (
              <div
                key={member.id}
                className="bg-white rounded-3xl shadow-xl p-6 flex flex-col items-center text-center transform hover:scale-105 hover:shadow-2xl transition duration-300"
              >
                {member.photo?.url ? (
                  <div className="w-28 h-28 p-1 rounded-full bg-gradient-to-r from-brand-green to-brand-saffron mb-4">
                    <img
                      src={member.photo.url}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-full border-2 border-white"
                    />
                  </div>
                ) : (
                  <div className="w-28 h-28 rounded-full bg-brand-mint text-orange-600 flex items-center justify-center text-4xl font-bold mb-4 shadow-md">
                    {getInitials(member.name)}
                  </div>
                )}

                <h4 className="text-xl font-bold text-brand mb-1">{member.name}</h4>
                <p className="text-orange-600 font-semibold mb-2">{member.role}</p>
                <p className="text-brand-text text-sm italic mb-1">{displayBio}</p>

                {isLong && (
                  <button
                    className="text-brand-green text-sm font-semibold hover:underline"
                    onClick={() => toggleExpanded(member.id)}
                  >
                    {expanded ? "Show Less" : "Read More"}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <a
            href="/contact"
            className="bg-brand-saffron hover:bg-brand-yellow text-brand-text font-semibold px-10 py-4 rounded-lg shadow-lg transition transform hover:scale-105 text-lg md:text-xl inline-block"
          >
            📩 Get in Touch
          </a>
        </div>
      </div>
    </section>
  );
}