export default function About() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-purple-200 dark:border-purple-700">
        <h1 className="text-3xl font-extrabold text-center text-purple-700 dark:text-purple-400 mb-8 drop-shadow-md">
          About QuickCourt
        </h1>
        <div className="text-gray-700 dark:text-gray-300 text-lg space-y-6 leading-relaxed">
          <p>
            Welcome to QuickCourt, your go-to local sports booking platform designed to connect sports enthusiasts with the best local facilities in your area. Whether you love badminton, tennis, football, or any other sport, QuickCourt makes it effortless to find, book, and enjoy top-quality courts and venues near you.
          </p>

          <p>
            Our mission is to foster community engagement and promote an active lifestyle by offering a seamless booking experience that’s quick, reliable, and user-friendly. Facility owners can easily manage their venues, track bookings, and grow their business, while admins ensure smooth operations and quality control across the platform.
          </p>

          <p>
            With features like real-time court availability, user reviews, dynamic booking calendars, and secure payment simulation, QuickCourt aims to become your trusted partner for every game day.
          </p>
        </div>
      </div>
    </div>
  );
}
