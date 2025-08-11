import { useEffect, useState } from "react";
import { Label, Select, TextInput, Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function CreateCourt() {
    const [facilities, setFacilities] = useState([]);
    const [selectedFacility, setSelectedFacility] = useState("");
    const [selectedSport, setSelectedSport] = useState("");
    const [pricePerHour, setPricePerHour] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [courtName, setCourtName] = useState("");
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();


    // Fetch facilities from backend
    useEffect(() => {
        fetch(`/api/facility/getFacilitiesByUser?userId=${currentUser._id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setFacilities(data.facilities);
                }
            });
    }, []);

    // Get sports that don’t already have courts in this facility
    const availableSports = (() => {
        const facility = facilities.find((f) => f._id === selectedFacility);
        if (!facility) return [];
        const usedSports = facility.courts?.map((c) => c.sportType) || [];
        return facility.sports?.filter((sport) => !usedSports.includes(sport)) || [];
    })();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validations
        if (!selectedFacility) {
            alert("Please select a facility.");
            return;
        }

        if (!selectedSport) {
            alert("Please select a sport.");
            return;
        }

        const trimmedName = courtName.trim();
        if (!trimmedName) {
            alert("Please enter a valid court name.");
            return;
        }

        const priceNum = Number(pricePerHour);
        if (isNaN(priceNum) || priceNum <= 0) {
            alert("Please enter a valid positive price per hour.");
            return;
        }

        if (!startTime || !endTime) {
            alert("Please select both start and end times.");
            return;
        }

        // Check time order
        if (startTime >= endTime) {
            alert("End time must be later than start time.");
            return;
        }

        const payload = {
            facilityId: selectedFacility,
            name: courtName.trim(),
            sportType: selectedSport,
            pricePerHour,
            operatingHours: { start: startTime, end: endTime },
        };

        try {
            const res = await fetch("/api/court/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (data.success) {
                console.log("Court created:", data);
                navigate(`/court/${data.court._id}`);
            } else {
                console.error("Error creating court:", data.message);
                alert(data.message || "Failed to create court");
            }
        } catch (err) {
            console.error("Error creating court:", err);
            alert("An error occurred while creating court");
        }
    };


    const timeOptions = Array.from({ length: 24 }, (_, hour) =>
        `${hour.toString().padStart(2, "0")}:00`
    );

    return (
        <div className="mt-20 w-[85%] mx-6 self-center sm:max-w-xl p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                Create Court
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Facility Selection */}
                <div>
                    <Label htmlFor="facility">Select Facility</Label>
                    <Select
                        id="facility"
                        value={selectedFacility}
                        onChange={(e) => {
                            setSelectedFacility(e.target.value);
                            setSelectedSport(""); // reset sport when facility changes
                        }}
                        required
                    >
                        <option value="">-- Select Facility --</option>
                        {facilities.map((facility) => (
                            <option key={facility._id} value={facility._id}>
                                {facility.name}
                            </option>
                        ))}
                    </Select>
                </div>

                {/* Sport Type Selection */}
                {selectedFacility && (
                    <div>
                        <Label htmlFor="sport">Sport Type</Label>
                        <Select
                            id="sport"
                            value={selectedSport}
                            onChange={(e) => setSelectedSport(e.target.value)}
                            required
                        >
                            <option value="">-- Select Sport --</option>
                            {availableSports.length > 0 ? (
                                availableSports.map((sport, idx) => (
                                    <option key={idx} value={sport}>
                                        {sport}
                                    </option>
                                ))
                            ) : (
                                <option disabled>No sports available</option>
                            )}
                        </Select>
                    </div>
                )}

                {/* Court Name */}
                <div>
                    <Label htmlFor="courtName">Court Name</Label>
                    <TextInput
                        id="courtName"
                        type="text"
                        value={courtName}
                        onChange={(e) => setCourtName(e.target.value)}
                        required
                    />
                </div>


                {/* Pricing */}
                <div>
                    <Label htmlFor="price">Pricing Per Hour (₹)</Label>
                    <TextInput
                        id="price"
                        type="number"
                        min="0"
                        step="500"
                        value={pricePerHour}
                        onChange={(e) => setPricePerHour(e.target.value)}
                        required
                    />
                </div>

                {/* Operating Hours */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="start">Start Time</Label>
                        <Select
                            id="start"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            required
                        >
                            <option value="">-- Select Start --</option>
                            {timeOptions.map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="end">End Time</Label>
                        <Select
                            id="end"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            required
                        >
                            <option value="">-- Select End --</option>
                            {timeOptions.map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </Select>
                    </div>
                </div>

                {/* Submit */}
                <Button type="submit" className="cursor-pointer w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:bg-gradient-to-l focus:ring-purple-200 dark:focus:ring-purple-800">
                    Create Court
                </Button>
            </form>
        </div>
    );
}
