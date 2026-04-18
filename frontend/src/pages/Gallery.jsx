import React, { useState, useEffect } from "react";

// Helper to import images safely (won’t break if folder is empty)
function safeImportAll(r) {
  const images = r.keys().map(r);
  return images.length ? images : [];
}

/*
  📌 GALLERY DATA STRUCTURE
  Organized Year → Category → Images
  (This will not break even if folders are empty)
*/
const galleryData = {
  "2025": {
    Navratri: safeImportAll(
      require.context("../assets/Gallery/", false, /\.(jpg|jpeg|png)$/)
    ),
    Picnic: safeImportAll(
      require.context("../assets/Gallery/", false, /\.(jpg|jpeg|png)$/)
    ),
  },
  "2024": {
    Navratri: safeImportAll(
      require.context("../assets/Gallery/", false, /\.(jpg|jpeg|png)$/)
    ),
  },
};

export default function Gallery() {
  const years = ["All Years", ...Object.keys(galleryData)];
  const [selectedYear, setSelectedYear] = useState("All Years");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  // Categories depend on year filter
  const categories =
    selectedYear === "All Years"
      ? ["All Categories"]
      : ["All Categories", ...Object.keys(galleryData[selectedYear])];

  // Get images based on filters
  const getFilteredImages = () => {
    let images = [];

    if (selectedYear === "All Years") {
      Object.entries(galleryData).forEach(([year, cats]) => {
        Object.entries(cats).forEach(([category, imgs]) => {
          imgs.forEach((img) => images.push({ img, category, year }));
        });
      });
      return images;
    }

    if (selectedCategory === "All Categories") {
      Object.entries(galleryData[selectedYear]).forEach(([category, imgs]) => {
        imgs.forEach((img) =>
          images.push({ img, category, year: selectedYear })
        );
      });
      return images;
    }

    galleryData[selectedYear][selectedCategory].forEach((img) => {
      images.push({
        img,
        category: selectedCategory,
        year: selectedYear,
      });
    });

    return images;
  };

  const displayedImages = getFilteredImages();

  // Lightbox state
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  // Open modal
  const openModal = (index) => setSelectedImageIndex(index);

  // Modal navigation
  const showPrev = () => {
    setSelectedImageIndex(
      (selectedImageIndex - 1 + displayedImages.length) %
        displayedImages.length
    );
  };

  const showNext = () => {
    setSelectedImageIndex(
      (selectedImageIndex + 1) % displayedImages.length
    );
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImageIndex === null) return;
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "Escape") setSelectedImageIndex(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () =>
      window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, displayedImages.length]);

  return (
    <div id="gallery" className="p-6 max-w-7xl mx-auto">
      {/* Heading */}
      <h2
        className="text-3xl sm:text-4xl font-heading font-bold tracking-wide text-center mb-10 drop-shadow-lg"
        style={{ color: "#d4503e" }}
      >
        Gallery
      </h2>

      {/* Year Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {years.map((yr) => (
          <button
            key={yr}
            onClick={() => {
              setSelectedYear(yr);
              setSelectedCategory("All Categories");
            }}
            className={`px-4 py-2 rounded-full font-semibold border transition-all duration-300 ${
              selectedYear === yr
                ? "bg-brand-saffron text-white scale-105 shadow-lg"
                : "bg-white text-brand border-brand hover:bg-brand-saffron hover:text-white"
            }`}
          >
            {yr}
          </button>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full font-semibold border transition-all duration-300 ${
              selectedCategory === cat
                ? "bg-brand-saffron text-white scale-105 shadow-lg"
                : "bg-white text-brand border-brand hover:bg-brand-saffron hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ---------------------- */}
      {/* IF NO IMAGES → SHOW MESSAGE */}
      {/* ---------------------- */}
      {displayedImages.length === 0 ? (
        <p className="text-center text-gray-600 text-xl py-20">
          📸 <strong>Gallery photos will be uploaded soon!</strong>
        </p>
      ) : (
        <>
          {/* Image Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {displayedImages.map((item, idx) => (
              <div
                key={idx}
                onClick={() => openModal(idx)}
                className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer group border border-brand"
              >
                <img
                  src={item.img}
                  alt={`${item.category} ${idx + 1}`}
                  loading="lazy"
                  className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                  {item.year} • {item.category}
                </div>
              </div>
            ))}
          </div>

          {/* Lightbox Modal */}
          {selectedImageIndex !== null && (
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4"
              onClick={() => setSelectedImageIndex(null)}
            >
              <div
                className="relative max-w-3xl w-full mx-auto flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Prev */}
                <button
                  onClick={showPrev}
                  className="absolute left-0 text-white text-3xl font-bold bg-black/50 px-3 py-2 rounded-full hover:bg-black/70 transition"
                >
                  ‹
                </button>

                {/* Image */}
                <img
                  src={displayedImages[selectedImageIndex].img}
                  alt="Preview"
                  className="w-full max-h-[80vh] object-contain rounded-lg shadow-xl mx-4"
                />

                {/* Next */}
                <button
                  onClick={showNext}
                  className="absolute right-0 text-white text-3xl font-bold bg-black/50 px-3 py-2 rounded-full hover:bg-black/70 transition"
                >
                  ›
                </button>

                {/* Badge */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
                  {displayedImages[selectedImageIndex].year} •{" "}
                  {displayedImages[selectedImageIndex].category}
                </div>

                {/* Close */}
                <button
                  onClick={() => setSelectedImageIndex(null)}
                  className="absolute -top-4 -right-4 bg-white text-black w-10 h-10 rounded-full shadow-lg flex items-center justify-center text-xl font-bold hover:scale-110 transition"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <p className="mt-8 text-center text-gray-500">
        Photos are from past events celebrating our vibrant community.
      </p>
    </div>
  );
}
