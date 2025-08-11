import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { HashLoader } from "react-spinners";
import { Badge, Carousel } from "flowbite-react";

export default function FacilityPage() {
  const { facilitySlug } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [facility, setFacility] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (facility && facility.images && facility.images.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % facility.images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [facility?.images]);

  useEffect(() => {
    const fetchFacility = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/facility/getfacilities?slug=${facilitySlug}`
        );
        const data = await res.json();

        if (!data.success) {
          throw new Error("Cannot fetch this facility");
        }
        console.log(data.facility);
        setFacility(data.facility);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFacility();
  }, [facilitySlug]);

  return (
    <div className="flex-1 flex flex-col p-3">
      {loading ? (
        <div className="m-auto">
          <HashLoader color="aqua" size={50} loading={loading} />
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        facility && (
          <>
            {/* Facility Name */}
            <h1 className="text-3xl m-6 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
              {facility.name}
            </h1>

            {/* Location */}
            <p className="text-center text-gray-500">{facility.location}</p>

            {/* Sports Types */}
            <div className="flex justify-center gap-2 my-3">
              {facility.sports?.map((sport, idx) => (
                <Badge key={idx} color="info">
                  {sport}
                </Badge>
              ))}
            </div>

            {/* Amenities */}
            <div className="flex justify-center gap-2 flex-wrap my-3">
              {facility.amenities?.map((amenity, idx) => (
                <Badge key={idx} color="success">
                  {amenity}
                </Badge>
              ))}
            </div>

            {/* Photos Carousel */}
            <div className="self-center max-w-5xl p-3 w-full">
              {Array.isArray(facility.images) && facility.images.length > 0 ? (
                <div className="relative h-56 sm:h-64 xl:h-80 2xl:h-96 w-full overflow-hidden rounded-lg shadow">
                  {facility.images.map((photo, idx) => (
                    <img
                      key={idx}
                      src={photo}
                      alt={`${facility.name} ${idx + 1}`}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                        idx === currentIndex ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ))}

                  {/* Prev button */}
                  <button
                    onClick={() =>
                      setCurrentIndex(
                        (prev) =>
                          (prev - 1 + facility.images.length) %
                          facility.images.length
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70"
                  >
                    ◀
                  </button>

                  {/* Next button */}
                  <button
                    onClick={() =>
                      setCurrentIndex(
                        (prev) => (prev + 1) % facility.images.length
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70"
                  >
                    ▶
                  </button>

                  {/* Dots */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                    {facility.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-3 h-3 rounded-full ${
                          idx === currentIndex ? "bg-white" : "bg-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ) : facility.image ? (
                <img
                  src={facility.image}
                  alt={facility.name}
                  className="mt-7 p-3 max-h-[600px] max-w-5xl object-cover items-center rounded-lg shadow"
                />
              ) : (
                <p className="text-center text-gray-400">No images available</p>
              )}
            </div>

            {/* Description */}
            <div
              dangerouslySetInnerHTML={{
                __html: facility && facility.description,
              }}
              className="p-2 max-w-2xl mx-auto w-full my-7 post-content"
            ></div>
          </>
        )
      )}
    </div>
  );
}
