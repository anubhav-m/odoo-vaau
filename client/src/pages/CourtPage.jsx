import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableHeadCell,
  TableBody,
  TableRow,
  TableCell,
  Button,
  TextInput,
  Label,
  Modal,
  Select,
} from "flowbite-react";

export default function CourtPage() {
  const [courts, setCourts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    facilityName: "",
    name: "",
    sportType: "",
    pricePerHour: "",
    operatingHours: { start: "", end: "" },
  });

  const fetchCourts = async () => {
    try {
      const res = await fetch("/api/court");
      const data = await res.json();
      if (data.success) {
        setCourts(data.courts);
      }
    } catch (err) {
      console.error("Error fetching courts:", err);
    }
  };

  useEffect(() => {
    fetchCourts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "start" || name === "end") {
      setFormData((prev) => ({
        ...prev,
        operatingHours: { ...prev.operatingHours, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      // 1️⃣ Get facility by name
      const facilityRes = await fetch(
        `/api/facility?searchTerm=${encodeURIComponent(formData.facilityName)}`
      );
      const facilityData = await facilityRes.json();

      if (!facilityData.success || facilityData.facilities.length === 0) {
        alert("Facility not found");
        return;
      }

      const facilityId = facilityData.facilities[0]._id;

      // 2️⃣ Create court
      const res = await fetch("/api/court/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facilityId,
          name: formData.name,
          sportType: formData.sportType,
          pricePerHour: Number(formData.pricePerHour),
          operatingHours: formData.operatingHours,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        fetchCourts();
      } else {
        alert(data.message || "Error creating court");
      }
    } catch (err) {
      console.error("Error creating court:", err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Courts</h1>
        <Button onClick={() => setShowModal(true)}>Add Court</Button>
      </div>

      {/* Courts Table */}
      <Table>
        <TableHead>
          <TableHeadCell>Facility</TableHeadCell>
          <TableHeadCell>Name</TableHeadCell>
          <TableHeadCell>Sport</TableHeadCell>
          <TableHeadCell>Price/Hr</TableHeadCell>
          <TableHeadCell>Hours</TableHeadCell>
        </TableHead>
        <TableBody className="divide-y">
          {courts.map((court) => (
            <TableRow key={court._id}>
              <TableCell>{court.facilityId?.name}</TableCell>
              <TableCell>{court.name}</TableCell>
              <TableCell>{court.sportType}</TableCell>
              <TableCell>₹{court.pricePerHour}</TableCell>
              <TableCell>
                {court.operatingHours?.start} - {court.operatingHours?.end}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Create Court Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Add Court</Modal.Header>
        <Modal.Body>
          <form className="space-y-4" onSubmit={handleCreate}>
            <div>
              <Label htmlFor="facilityName" value="Facility Name" />
              <TextInput
                id="facilityName"
                name="facilityName"
                value={formData.facilityName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="name" value="Court Name" />
              <TextInput
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="sportType" value="Sport Type" />
              <Select
                id="sportType"
                name="sportType"
                value={formData.sportType}
                onChange={handleChange}
                required
              >
                <option value="">Select sport</option>
                <option value="Tennis">Tennis</option>
                <option value="Badminton">Badminton</option>
                <option value="Basketball">Basketball</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="pricePerHour" value="Price per Hour" />
              <TextInput
                id="pricePerHour"
                name="pricePerHour"
                type="number"
                value={formData.pricePerHour}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label value="Operating Hours" />
              <div className="flex gap-2">
                <TextInput
                  name="start"
                  type="time"
                  value={formData.operatingHours.start}
                  onChange={handleChange}
                  required
                />
                <TextInput
                  name="end"
                  type="time"
                  value={formData.operatingHours.end}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <Button type="submit">Create Court</Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
