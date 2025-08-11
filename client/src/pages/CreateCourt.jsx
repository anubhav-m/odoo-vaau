import { useEffect, useState } from "react";
import { Label, Select, TextInput, Button } from "flowbite-react";

export default function CreateCourt() {
    const [facilities, setFacilities] = useState([]);
    const [selectedFacility, setSelectedFacility] = useState("");
    const [selectedSport, setSelectedSport] = useState("");
    const [pricePerHour, setPricePerHour] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    // Fetch facilities from backend
    useEffect(() => {
        fetch("/api/facility/getFacilities?limit=100")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setFacilities(data.facilities || []);
                }
            })
            .catch((err) => console.error("Error fetching facilities:", err));
    }, []);

    // Get sports that don’t already have courts in this facility
    const availableSports = (() => {
        const facility = facilities.find((f) => f._id === selectedFacility);
        if (!facility) return [];
        const usedSports = facility.courts?.map((c) => c.sportType) || [];
        return facility.sports?.filter((sport) => !usedSports.includes(sport)) || [];
    })();

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            facilityId: selectedFacility,
            sportType: selectedSport,
            pricePerHour,
            operatingHours: { start: startTime, end: endTime },
        };
        console.log("Submitting court:", payload);
        // fetch POST to /api/court/create
    };

    const timeOptions = Array.from({ length: 24 }, (_, hour) =>
        `${hour.toString().padStart(2, "0")}:00`
    );

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                Create Court
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Facility Selection */}
                <div>
                    <Label htmlFor="facility" value="Select Facility" />
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
                        <Label htmlFor="sport" value="Sport Type" />
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

                {/* Pricing */}
                <div>
                    <Label htmlFor="price" value="Pricing Per Hour (₹)" />
                    <TextInput
                        id="price"
                        type="number"
                        min="0"
                        value={pricePerHour}
                        onChange={(e) => setPricePerHour(e.target.value)}
                        required
                    />
                </div>

                {/* Operating Hours */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="start" value="Start Time" />
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
                        <Label htmlFor="end" value="End Time" />
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
                <Button type="submit" className="w-full">
                    Create Court
                </Button>
            </form>
        </div>
    );
}
