import { useEffect, useState } from "react";
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
import { Link } from "react-router-dom";
import { HashLoader } from "react-spinners";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashFacilities() {
  const { currentUser } = useSelector((state) => state.user);
  const [facilities, setFacilities] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [facilityIdToDelete, setFacilityIdToDelete] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        dispatch(setError(false));
        setLoading(true);

        let res;
        if (currentUser.isAdmin) {
          res = await fetch(`/api/facility/getfacilities`);
        } else {
          res = await fetch(
            `/api/facility/getFacilities?userId=${currentUser._id}`
          );
        }

        const data = await res.json();
        if (!data.success) {
          throw new Error("Error fetching facilities");
        }

        setFacilities(data.facilities);
        if (data.facilities.length < 9) setShowMore(false);
      } catch (err) {
        dispatch(setError(err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, [currentUser._id, currentUser.isAdmin, dispatch]);

  const handleShowMore = async () => {
    const startIndex = facilities.length;

    try {
      const res = await fetch(
        `/api/facility/getFacilities?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();

      if (!data.success) throw new Error("Error fetching more facilities");

      setFacilities((prev) => [...prev, ...data.facilities]);
      if (data.facilities.length < 9) setShowMore(false);
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  const handleDeleteFacility = async () => {
    setShowModal(false);
    dispatch(clearError());

    try {
      const res = await fetch(
        `/api/facility/deleteFacility/${facilityIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setFacilities((prev) =>
        prev.filter((facility) => facility._id !== facilityIdToDelete)
      );
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
      ) : currentUser &&
        (currentUser.isFacilityOwner || currentUser.isAdmin) && // allow admin too
        facilities.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <TableHead>
              <TableRow>
                <TableHeadCell>Date updated</TableHeadCell>
                {currentUser.isAdmin && <TableHeadCell>Username</TableHeadCell>}
                <TableHeadCell>Facility image</TableHeadCell>
                <TableHeadCell>Name</TableHeadCell>
                <TableHeadCell>Sports</TableHeadCell>
                <TableHeadCell>Amenities</TableHeadCell>
                <TableHeadCell>Edit</TableHeadCell>
                <TableHeadCell>Delete</TableHeadCell>
              </TableRow>
            </TableHead>

            <TableBody className="divide-y">
              {facilities
                // if user is NOT admin, filter to only their own facilities
                .filter((facility) =>
                  currentUser.isAdmin
                    ? true
                    : (facility.ownerId?._id ?? facility.ownerId).toString() ===
                      currentUser._id.toString()
                )
                .map((facility) => (
                  <TableRow
                    key={facility._id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <TableCell>
                      {new Date(facility.updatedAt).toLocaleDateString()}
                    </TableCell>

                    {currentUser.isAdmin && (
                      <TableCell>
                        {facility.ownerId?.username || "Unknown"}
                      </TableCell>
                    )}

                    <TableCell>
                      <Link to={`/facility/${facility._id}`}>
                        <img
                          src={facility.images[0]}
                          alt={facility.name}
                          className="w-20 h-10 object-cover bg-gray-500"
                        />
                      </Link>
                    </TableCell>

                    <TableCell className="truncate">
                      <Link
                        className="font-medium text-gray-900 dark:text-white"
                        to={`/facility/${facility._id}`}
                      >
                        {facility.name}
                      </Link>
                    </TableCell>

                    <TableCell>
                      {facility.sports.map((sport) => sport + " ")}
                    </TableCell>

                    <TableCell>
                      {facility.amenities.map((amenity) => amenity + " ")}
                    </TableCell>

                    {/* Show Edit/Delete only if admin OR owner */}
                    {(currentUser.isAdmin || currentUser.isFacilityOwner) && (
                      <>
                        <TableCell>
                          <Link
                            className="text-teal-500 hover:underline"
                            to={`/update-facility/${facility._id}`}
                          >
                            Edit
                          </Link>
                        </TableCell>

                        <TableCell>
                          <span
                            onClick={() => {
                              setShowModal(true);
                              setFacilityIdToDelete(facility._id);
                            }}
                            className="font-medium text-red-500 hover:underline cursor-pointer"
                          >
                            Delete
                          </span>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          {showMore && (
            <Button
              onClick={handleShowMore}
              className="mt-5 mx-auto cursor-pointer"
              color="blue"
              outline
            >
              Show More
            </Button>
          )}
        </>
      ) : (
        <p className="text-center text-xl">You have no facilities yet</p>
      )}

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this facility?
            </h3>
            <div className="flex justify-between px-7">
              <Button
                color="red"
                onClick={handleDeleteFacility}
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
