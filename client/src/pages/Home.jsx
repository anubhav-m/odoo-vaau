// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import TiltedCard from '../components/TiltedCard'; // ✅ Corrected path

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/getPosts');
        const data = await res.json();

        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch posts');
        }

        setPosts(data.posts);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="flex-1">
      <div className="flex flex-col gap-6 p-4 lg:p-24 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-6">
        {/* Left Section */}
        <div className="w-full sm:w-1/2 flex justify-center items-center">
        <TiltedCard
            containerHeight="300px"
            containerWidth="100%"
            rotateAmplitude={12}
            scaleOnHover={1.2}
            showMobileWarning={false}
            showTooltip={false}
            displayOverlayContent={true}
            overlayContent={
            <div
                className="w-full h-full rounded-2xl shadow-lg border-4 border-teal-500 
                        bg-gray-200 dark:bg-gray-800 flex flex-col justify-center items-center 
                        p-8 text-gray-800 dark:text-gray-200"
            >
                <span className="text-red-500 text-2xl mb-2">📍</span>
                <span className="mb-4">Location</span>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center">
                FIND PLAYERS & VENUES NEARBY
                </h1>

                <p className="mt-4 text-sm sm:text-base text-center opacity-90">
                Seamlessly explore sports venues and play with sports enthusiasts just like you!
                </p>
            </div>
            }
        />
        </div>



          {/* Right Section */}
          <div
            className="w-full sm:w-1/2 min-h-[400px] rounded-2xl shadow-lg border-4 border-teal-500 
                       bg-gray-200 dark:bg-gray-800 flex flex-col justify-center items-center 
                       text-gray-800 dark:text-gray-200 p-8 transition-transform duration-300 hover:scale-105"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-center leading-tight tracking-wide">
              Welcome to <span className="text-teal-500 drop-shadow-md">QuickCourt</span>
            </h1>
            <p className="text-sm sm:text-base mt-6 text-center leading-relaxed max-w-md opacity-90">
              Here you can quickly find and book local sports courts, join matches,
              and connect with fellow sports enthusiasts in your area.
            </p>
          </div>
        </div>

        <Link
          to="/search"
          className="mt-5 text-xs sm:text-sm text-teal-500 font-bold hover:underline"
        >
          View all posts
        </Link>
      </div>

      {/* Posts Section */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center">Recent Posts</h2>
            <div className="flex flex-wrap gap-y-6 gap-x-2">
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
  );
}
