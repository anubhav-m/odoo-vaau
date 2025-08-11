import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  TableHead,
  TableHeadCell,
  TableBody,
  TableRow,
  TableCell,
} from "flowbite-react";

export default function CourtPage() {
  const [courts, setCourts] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  const fetchCourts = async () => {
    try {
      if (!currentUser) return;
      if (!currentUser.isFacilityOwner) return;

      const res = await fetch(`/api/court/getCourtsByOwner?ownerId=${currentUser._id}`);
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



  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Courts</h1>
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
    </div>
  );
}
