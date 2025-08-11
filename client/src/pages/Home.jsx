import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FacilityCard from "../components/FacilityCard";
import TiltedCard from "../components/TiltedCard";

export default function Home() {
  const [facilities, setFacilities] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsPerPage = 4; // Number of cards visible at once

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const res = await fetch("/api/facility/getfacilities?status=approved");
        if (!res.ok)
          throw new Error(`Failed to fetch facilities: ${res.status}`);

        const data = await res.json();

        if (!data.success)
          throw new Error(data.message || "Failed to fetch facilities");

        setFacilities(data.facilities);
      } catch (err) {
        console.error("Error fetching facilities:", err);
        setFacilities([]);
      }
    };
    fetchFacilities();
  }, []);

  // Navigation
  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev + cardsPerPage < facilities.length ? prev + cardsPerPage : 0
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev - cardsPerPage >= 0
        ? prev - cardsPerPage
        : facilities.length - cardsPerPage
    );
  };

  const currentFacilities = facilities.slice(
    currentIndex,
    currentIndex + cardsPerPage
  );

  return (
    <div className="flex-1">
      {/* Top Section */}
      <div className="flex flex-col gap-6 p-4 lg:p-24 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-6 justify-center my-10">
          {/* Left Card */}
          <div className="w-full sm:w-1/2 flex justify-center items-center">
            <TiltedCard
              containerHeight="300px"
              containerWidth="100%"
              rotateAmplitude={12}
              scaleOnHover={1.2}
              showMobileWarning={false}
              showTooltip={false}
              displayOverlayContent={true}
              overlayContent={
                <div
                  className="w-full h-full rounded-2xl shadow-lg border-4 border-teal-500 
                        bg-gray-200 dark:bg-gray-800 flex flex-col justify-center items-center 
                        p-8 text-gray-800 dark:text-gray-200"
                >
                  <span className="text-red-500 text-2xl mb-2">📍</span>
                  <span className="mb-4">Ahmedabad</span>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center">
                    FIND PLAYERS & VENUES NEARBY
                  </h1>

                  <p className="mt-4 text-sm sm:text-base text-center opacity-90">
                    Seamlessly explore sports venues and play with sports
                    enthusiasts just like you!
                  </p>
                </div>
              }
            />
          </div>

          {/* Right Info Section */}
          <div
            className="w-full sm:w-1/2 min-h-[400px] rounded-2xl shadow-lg border-4 border-teal-500 
                       bg-gray-200 dark:bg-gray-800 flex-col justify-center items-center 
                       text-gray-800 dark:text-gray-200 p-8 transition-transform duration-300 hover:scale-105 md:flex hidden"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-center leading-tight tracking-wide">
              Welcome to{" "}
              <span className="text-teal-500 drop-shadow-md">QuickCourt</span>
            </h1>
            <p className="text-sm sm:text-base mt-6 text-center leading-relaxed max-w-md opacity-90">
              Here you can quickly find and book local sports courts, join
              matches, and connect with fellow sports enthusiasts in your area.
            </p>
          </div>
        </div>
      </div>

      {/* Facilities Section */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {facilities.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center">
              Featured Facilities
            </h2>
            <div className="flex justify-end w-full">
              <Link
                to="/facilities"
                className="mt-5 text-xs sm:text-sm font-bold text-teal-500 hover:underline"
              >
                See all venues
              </Link>
            </div>

            {/* Cards */}
            <div className="flex max-h-5flex-wrap gap-y-6 gap-x-2 justify-center">
              {currentFacilities.map((facility) =>
                facility && facility._id ? (
                  <FacilityCard key={facility._id} facility={facility} />
                ) : null
              )}
            </div>

            {/* Carousel Arrows */}
            {facilities.length > cardsPerPage && (
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  ←
                </button>
                <button
                  onClick={nextSlide}
                  className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Popular Sports Section */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        <h2 className="text-2xl font-semibold">Popular Sports</h2>
        <div className="flex flex-wrap gap-6 justify-center">
          {[
            { name: "Badminton", image: "/images/badminton.jpg" },
            { name: "Football", image: "/images/football.jpg" },
            { name: "Cricket", image: "/images/cricket.jpg" },
            { name: "Swimming", image: "/images/swimming.jpg" },
            { name: "Tennis", image: "/images/tennis.jpg" },
            { name: "Table Tennis", image: "/images/tabletennis.jpg" },
          ].map((sport, index) => (
            <div
              key={index}
              className="w-40 h-56 rounded-xl shadow-lg overflow-hidden bg-gray-100 dark:bg-gray-800 hover:scale-105 transition-transform cursor-pointer"
            >
              <img
                src={sport.image}
                alt={sport.name}
                className="w-full h-44 object-cover"
              />
              <div className="p-2 text-center text-sm font-medium">{sport.name}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
