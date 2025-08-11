import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HashLoader } from "react-spinners";
import { Badge } from "flowbite-react";
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";

export default function UpdateFacilityPage() {
  const { facilitySlug } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [facility, setFacility] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [sports, setSports] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [newImage, setNewImage] = useState("");

  // Auto carousel
  useEffect(() => {
    if (images && images.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [images]);

  // Fetch facility
  useEffect(() => {
    const fetchFacility = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/facility/getfacilities?slug=${facilitySlug}`);
        const data = await res.json();

        if (!data.success) throw new Error("Cannot fetch this facility");

        setFacility(data.facility);
        setName(data.facility.name);
        setLocation(data.facility.location);
        setSports(data.facility.sports || []);
        setAmenities(data.facility.amenities || []);
        setDescription(data.facility.description || "");
        setImages(data.facility.images || []);

        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFacility();
  }, [facilitySlug]);

  const addImage = () => {
    if (newImage.trim()) {
      setImages((prev) => [...prev, newImage.trim()]);
      setNewImage("");
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/facility/updatefacility/${facility._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name,
          location,
          sports,
          amenities,
          description,
          images,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      navigate(`/facility/${facilitySlug}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
            <input
              type="text"
              className="text-3xl m-6 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* Location */}
            <input
              type="text"
              className="text-center text-gray-500 border p-2 rounded mx-auto"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            {/* Sports */}
            <div className="flex justify-center gap-2 my-3">
              {sports.map((sport, idx) => (
                <Badge key={idx} color="info">{sport}</Badge>
              ))}
            </div>
            <input
              type="text"
              className="border p-2 rounded mx-auto"
              value={sports.join(", ")}
              onChange={(e) => setSports(e.target.value.split(",").map(s => s.trim()))}
            />

            {/* Amenities */}
            <div className="flex justify-center gap-2 flex-wrap my-3">
              {amenities.map((amenity, idx) => (
                <Badge key={idx} color="success">{amenity}</Badge>
              ))}
            </div>
            <input
              type="text"
              className="border p-2 rounded mx-auto"
              value={amenities.join(", ")}
              onChange={(e) => setAmenities(e.target.value.split(",").map(a => a.trim()))}
            />

            {/* Carousel */}
            <div className="self-center max-w-5xl p-3 w-full">
              {Array.isArray(images) && images.length > 0 ? (
                <div className="relative h-56 sm:h-64 xl:h-80 2xl:h-96 w-full overflow-hidden rounded-lg shadow">
                  {images.map((photo, idx) => (
                    <img
                      key={idx}
                      src={photo}
                      alt={`${name} ${idx + 1}`}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${idx === currentIndex ? "opacity-100" : "opacity-0"}`}
                    />
                  ))}

                  {/* Prev button */}
                  <button
                    onClick={() =>
                      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white text-black rounded-full p-2 shadow-lg hover:bg-gray-300 transition"
                  >
                    <FaArrowCircleLeft size={32} />
                  </button>

                  {/* Next button */}
                  <button
                    onClick={() =>
                      setCurrentIndex((prev) => (prev + 1) % images.length)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-black rounded-full p-2 shadow-lg hover:bg-gray-300 transition"
                  >
                    <FaArrowCircleRight size={32} />
                  </button>

                  {/* Dots */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-3 h-3 rounded-full ${idx === currentIndex ? "bg-white" : "bg-gray-400"}`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-400">No images available</p>
              )}

              {/* Add image */}
              <div className="flex gap-2 mt-3">
                <input
                  type="text"
                  placeholder="New image URL"
                  className="border p-2 rounded flex-1"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                />
                <button
                  type="button"
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={addImage}
                >
                  Add
                </button>
              </div>
            </div>

            {/* Description */}
            <textarea
              className="p-2 max-w-2xl mx-auto w-full my-7 border rounded"
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {/* Update button */}
            <div className="flex justify-center my-5">
              <button
                onClick={handleUpdate}
                className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
              >
                Update Facility
              </button>
            </div>
          </>
        )
      )}
    </div>
  );
}
