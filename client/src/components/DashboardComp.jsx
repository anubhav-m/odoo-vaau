import { useEffect, useState } from "react";
import { Card, Spinner, Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/admin/stats", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        setStats(data.data); // match your backend response structure
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  // Dummy data for booking chart
  const bookingData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Bookings",
        data: [5, 8, 12, 9, 14, 20],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  // New dummy data for registration and sports activities chart
  const activityData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Registrations",
        data: [10, 15, 20, 18, 22, 30],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
      {
        label: "Sports Activities",
        data: [3, 5, 7, 6, 8, 12],
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
      },
      // You can add more datasets here if needed
    ],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 font-semibold mt-10">
        Error loading dashboard: {error}
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <h2 className="text-lg font-semibold mb-2">Total Users</h2>
          <p className="text-2xl font-bold">{stats.totalUsers ?? 0}</p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold mb-2">New Users This Month</h2>
          <p className="text-2xl font-bold">{stats.lastMonthUsers ?? 0}</p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold mb-2">Total Facilities</h2>
          <p className="text-2xl font-bold">{stats.totalFacilities ?? 0}</p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold mb-2">
            New Facilities This Month
          </h2>
          <p className="text-2xl font-bold">{stats.lastMonthFacilities ?? 0}</p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold mb-2">Total Bookings</h2>
          <p className="text-2xl font-bold">{stats.totalBookings ?? 0}</p>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold mb-2">
            New Bookings This Month
          </h2>
          <p className="text-2xl font-bold">{stats.lastMonthBookings ?? 0}</p>
        </Card>
      </div>

      {/* Booking Chart */}
      <div className="bg-white p-5 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold mb-4">
          Booking Activity Over Time
        </h2>
        <Line data={bookingData} />
      </div>

      {/* New Registrations and Sports Activities Chart */}
      <div className="bg-white p-5 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold mb-4">
          Registrations & Sports Activities Over Time
        </h2>
        <Line data={activityData} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-xl font-semibold mb-2">
            Pending Facility Approvals
          </h3>
          <p className="mb-4">
            Review and approve/reject new facility registration requests.
          </p>
          <Link to="/admin/facility-approvals">
            <Button className="w-full">View Pending Approvals</Button>
          </Link>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold mb-2">User Management</h3>
          <p className="mb-4">
            View, search, and manage users and facility owners.
          </p>
          <Link to="/admin/user-management">
            <Button className="w-full">Go to User Management</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
