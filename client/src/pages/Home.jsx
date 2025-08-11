import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FacilityCard from "../components/FacilityCard";
import TiltedCard from "../components/TiltedCard";
import badminton from "../images/bd.jpg";
import football from "../images/football.jpeg";
import cricket from "../images/cricket.jpg";
import swimming from "../images/swimming.jpg";
import tennis from "../images/tennis.jpg";
import tt from "../images/tabletennis.jpg";

export default function Home() {
  const [facilities, setFacilities] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsPerPage = 4;

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
      <div className="flex flex-col gap-6 p-4 lg:p-24 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-6 justify-center my-10">
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

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {facilities.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center">
              Featured Facilities
            </h2>
            <div className="flex justify-end w-full">
              <Link
                to="/search"
                className="mt-5 text-xs sm:text-sm font-bold text-teal-500 hover:underline"
              >
                See all venues
              </Link>
            </div>

            <div className="flex gap-y-6 gap-x-2 justify-center">
              {currentFacilities.map((facility) =>
                facility && facility._id ? (
                  <FacilityCard key={facility._id} facility={facility} />
                ) : null
              )}
            </div>

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
      <div className="max-w-6xl mx-auto p-6 flex flex-col gap-8 py-10">
        <h2 className="text-3xl font-extrabold text-center text-teal-500 tracking-wide">
          Popular Sports
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { name: "Badminton", image: badminton },
            { name: "Football", image: football },
            { name: "Cricket", image: cricket },
            { name: "Swimming", image: swimming },
            { name: "Tennis", image: tennis },
            { name: "Table Tennis", image: tt },
          ].map((sport, index) => (
            <div
              key={index}
              className="relative group w-full h-56 rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-xl"
            >
              <img
                src={sport.image}
                alt={sport.name}
                className="w-full h-full object-cover"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
              {/* Sport Name */}
              <div className="absolute bottom-0 w-full p-3 text-center text-white text-sm sm:text-base font-semibold tracking-wide">
                {sport.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
