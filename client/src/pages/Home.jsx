import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PostCard from "../components/PostCard";
import FacilityCard from "../components/FacilityCard";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/post/getPosts");
        const data = await res.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch posts");
        }

        setPosts(data.posts);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    const fetchFacilities = async () => {
      try {
        const res = await fetch("/api/facility/getFacilities");
        const data = await res.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch facilities");
        }

        setFacilities(data.facilities);
      } catch (err) {
        console.error("Error fetching facilities:", err);
      }
    };

    fetchPosts();
    fetchFacilities();
  }, []);

  return (
    <div className="flex-1">
      <div className="flex flex-col gap-6 p-4 lg:p-10 max-w-[70%] mx-auto justify-center">
        {/* <div className="w-full flex"> */}
        <div className="flex gap-6">
          {/* Left Section */}
          <div
            className="w-full sm:w-1/2 min-h-[400px] rounded-2xl shadow-lg border-4 border-teal-500 
                                bg-gray-200 dark:bg-gray-800 flex flex-col justify-center items-center 
                                text-gray-800 dark:text-gray-200 p-8 transition-transform duration-300 hover:scale-105"
          >
            {/* Location pill */}
            <div className="flex items-center gap-2 bg-transparent border border-gray-400 rounded-lg px-4 py-2 w-fit mb-4">
              <span className="text-red-500">📍</span>
              <span className="text-gray-800 dark:text-gray-200">
                Ahmedabad
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center">
              FIND PLAYERS & VENUES NEARBY
            </h1>

            {/* Paragraph */}
            <p className="text-sm sm:text-base mt-6 text-center leading-relaxed max-w-md opacity-90">
              Seamlessly explore sports venues and play with sports enthusiasts
              just like you!
            </p>
          </div>

          {/* Right Section */}
          <div
            className="w-full sm:w-1/2 min-h-[400px] rounded-2xl shadow-lg border-4 border-teal-500 
                                bg-gray-200 dark:bg-gray-800 flex flex-col justify-center items-center 
                                text-gray-800 dark:text-gray-200 p-8 transition-transform duration-300 hover:scale-105"
          >
            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-center leading-tight tracking-wide">
              Welcome to{" "}
              <span className="text-teal-500 drop-shadow-md">QuickCourt</span>
            </h1>

            {/* Paragraph */}
            <p className="text-sm sm:text-base mt-6 text-center leading-relaxed max-w-md opacity-90">
              Here you can quickly find and book local sports courts, join
              matches, and connect with fellow sports enthusiasts in your area.
            </p>
          </div>
        </div>

        <div className="max-w-6xl p-3 flex flex-col gap-8 py-7 justify-center">
          {posts.length > 0 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-semibold text-center">
                Recent Posts
              </h2>
              <div className="flex flex-wrap gap-x-2 justify-center items-center">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
              <Link
                to="/search"
                className="mt-5 text-xs sm:text-sm text-teal-500 font-bold hover:underline"
              >
                View all posts
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
