import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HashLoader } from "react-spinners";
import { Badge, TextInput, Button, Textarea, Alert } from "flowbite-react";
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";
import {
  HiOutlineLocationMarker,
  HiOutlineClipboardList,
  HiOutlineTicket,
  HiPhotograph,
  HiOutlineDocumentText,
} from "react-icons/hi";

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

  useEffect(() => {
    fetchFacility();
  }, [facilitySlug]);

  useEffect(() => {
    if (images && images.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [images]);

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

      await fetchFacility();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-gray-950 px-4 py-10">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700">
        {loading ? (
          <div className="m-auto flex justify-center">
            <HashLoader color="aqua" size={50} loading={loading} />
          </div>
        ) : error ? (
          <Alert color="failure" className="mb-6">
            {error}
          </Alert>
        ) : (
          facility && (
            <>
              {/* Facility Name */}
              <div className="relative mb-6">
                <HiOutlineClipboardList className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500 dark:text-purple-400 text-xl" />
                <TextInput
                  placeholder="Facility Name"
                  required
                  shadow
                  className="pl-10"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Location */}
              <div className="relative mb-6">
                <HiOutlineLocationMarker className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500 dark:text-purple-400 text-xl" />
                <TextInput
                  placeholder="Location"
                  required
                  shadow
                  className="pl-10"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              {/* Sports */}
              <div className="mb-4">
                <label className="flex items-center mb-2 font-semibold text-gray-700 dark:text-gray-200">
                  <HiOutlineClipboardList className="mr-2 text-purple-500 dark:text-purple-400 text-xl" />
                  Sports Supported
                </label>
                <div className="flex flex-wrap gap-3 mb-2">
                  {sports.map((sport, idx) => (
                    <Badge key={idx} color="purple">
                      {sport}
                    </Badge>
                  ))}
                </div>
                <TextInput
                  placeholder="Comma separated sports"
                  value={sports.join(", ")}
                  onChange={(e) =>
                    setSports(e.target.value.split(",").map((s) => s.trim()))
                  }
                />
              </div>

              {/* Amenities */}
              <div className="mb-4">
                <label className="flex items-center mb-2 font-semibold text-gray-700 dark:text-gray-200">
                  <HiOutlineTicket className="mr-2 text-indigo-500 dark:text-indigo-400 text-xl" />
                  Amenities Offered
                </label>
                <div className="flex flex-wrap gap-3 mb-2">
                  {amenities.map((amenity, idx) => (
                    <Badge key={idx} color="indigo">
                      {amenity}
                    </Badge>
                  ))}
                </div>
                <TextInput
                  placeholder="Comma separated amenities"
                  value={amenities.join(", ")}
                  onChange={(e) =>
                    setAmenities(e.target.value.split(",").map((a) => a.trim()))
                  }
                />
              </div>

              {/* Carousel */}
              <div className="mb-6">
                <label className="flex items-center mb-2 font-semibold text-purple-600 dark:text-purple-400">
                  <HiPhotograph className="mr-2 text-purple-600 dark:text-purple-400 text-xl" />
                  Facility Images
                </label>

                {Array.isArray(images) && images.length > 0 ? (
                  <div className="relative h-56 sm:h-64 xl:h-80 2xl:h-96 w-full overflow-hidden rounded-lg shadow">
                    {images.map((photo, idx) => (
                      <img
                        key={idx}
                        src={photo}
                        alt={`${name} ${idx + 1}`}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                          idx === currentIndex ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    ))}

                    <button
                      onClick={() =>
                        setCurrentIndex(
                          (prev) => (prev - 1 + images.length) % images.length
                        )
                      }
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white text-black rounded-full p-2 shadow-lg hover:bg-gray-300 transition"
                      aria-label="Previous Image"
                    >
                      <FaArrowCircleLeft size={32} />
                    </button>

                    <button
                      onClick={() =>
                        setCurrentIndex((prev) => (prev + 1) % images.length)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-black rounded-full p-2 shadow-lg hover:bg-gray-300 transition"
                      aria-label="Next Image"
                    >
                      <FaArrowCircleRight size={32} />
                    </button>

                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentIndex(idx)}
                          className={`w-3 h-3 rounded-full ${
                            idx === currentIndex ? "bg-white" : "bg-gray-400"
                          }`}
                          aria-label={`Go to image ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-gray-400">No images available</p>
                )}

                {/* Add image */}
                <div className="flex gap-2 mt-3">
                  <TextInput
                    placeholder="New image URL"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    className="flex-1"
                  />
                  <Button color="blue" onClick={addImage}>
                    Add
                  </Button>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="flex items-center mb-2 font-semibold text-gray-700 dark:text-gray-200">
                  <HiOutlineDocumentText className="mr-2 text-purple-500 dark:text-purple-400 text-xl" />
                  Description
                </label>
                <Textarea
                  rows={6}
                  placeholder="Facility description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Update Button */}
              <div className="flex justify-center">
                <Button
                  color="success"
                  onClick={handleUpdate}
                  className="purple shadow-lg hover:scale-[1.02] transition"
                >
                  Update Facility
                </Button>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
}
