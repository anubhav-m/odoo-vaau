import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setError, clearError } from "../redux/user/userSlice.js";
import {
    Table,
    TableHead,
    TableHeadCell,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
} from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { HashLoader } from "react-spinners";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashCourts() {
    const { currentUser } = useSelector((state) => state.user);
    const [courts, setCourts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [courtIdToDelete, setCourtIdToDelete] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourts = async () => {
            try {
                if (!currentUser || !currentUser.isFacilityOwner) return;

                dispatch(clearError());
                setLoading(true);

                const res = await fetch(
                    `/api/court/getCourtsByOwner?ownerId=${currentUser._id}`
                );
                const data = await res.json();

                if (!data.success) throw new Error("Error fetching courts");

                setCourts(data.courts);
            } catch (err) {
                dispatch(setError(err.message));
            } finally {
                setLoading(false);
            }
        };

        fetchCourts();
    }, [currentUser, dispatch]);

    const handleDeleteCourt = async () => {
        setShowModal(false);
        dispatch(clearError());

        try {
            const res = await fetch(`/api/court/deleteCourt/${courtIdToDelete}`, {
                method: "DELETE",
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            setCourts((prev) => prev.filter((court) => court._id !== courtIdToDelete));
        } catch (error) {
            dispatch(setError(error.message));
        }
    };

    return (
        <div
            className="max-w-full h-full overflow-x-auto p-5
  scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500"
        >
            {loading ? (
                <div className="w-full flex justify-center items-center h-full">
                    <HashLoader color="aqua" size={50} loading={loading} />
                </div>
            ) : currentUser && currentUser.isFacilityOwner && courts.length > 0 ? (
                <>
                    <Table hoverable className="shadow-md">
                        <TableHead>
                            <TableRow>
                                <TableHeadCell>Facility</TableHeadCell>
                                <TableHeadCell>Court Name</TableHeadCell>
                                <TableHeadCell>Sport</TableHeadCell>
                                <TableHeadCell>Price/Hr</TableHeadCell>
                                <TableHeadCell>Hours</TableHeadCell>
                                <TableHeadCell>Edit</TableHeadCell>
                                <TableHeadCell>Delete</TableHeadCell>
                            </TableRow>
                        </TableHead>

                        <TableBody className="divide-y">
                            {courts.map((court) => (
                                <TableRow
                                    key={court._id}
                                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                >
                                    <TableCell>{court.facilityId?.name || "N/A"}</TableCell>
                                    <TableCell>{court.name}</TableCell>
                                    <TableCell>{court.sportType}</TableCell>
                                    <TableCell>₹{court.pricePerHour}</TableCell>
                                    <TableCell>
                                        {court.operatingHours?.start} - {court.operatingHours?.end}
                                    </TableCell>



                                    <TableCell>
                                        <Link
                                            className="text-teal-500 hover:underline"
                                            to={`/update-court/${court._id}`}
                                        >
                                            Edit
                                        </Link>
                                    </TableCell>


                                    <TableCell>
                                        <span
                                            onClick={() => {
                                                setShowModal(true);
                                                setFacilityIdToDelete(court._id);
                                            }}
                                            className="font-medium text-red-500 hover:underline cursor-pointer"
                                        >
                                            Delete
                                        </span>
                                    </TableCell>



                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </>
            ) : (
                <p className="text-center text-xl">You have no courts yet</p>
            )}

            <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
                <ModalHeader />
                <ModalBody>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                        <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this court?
                        </h3>
                        <div className="flex justify-between px-7">
                            <Button
                                color="red"
                                onClick={handleDeleteCourt}
                                className="cursor-pointer"
                            >
                                Yes, I am sure
                            </Button>

                            <Button
                                onClick={() => setShowModal(false)}
                                className="cursor-pointer"
                            >
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    );
}
