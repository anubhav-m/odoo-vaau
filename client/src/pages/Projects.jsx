export default function Projects() {
  return (
    <div className="flex-1 max-w-4xl mx-auto flex flex-col items-center gap-10 p-8 bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-lg">
      <h1 className="text-4xl font-extrabold text-center text-purple-700 dark:text-purple-400 drop-shadow-md">
        Explore Our Projects
      </h1>

      <p className="text-lg text-gray-700 dark:text-gray-300 text-center max-w-3xl leading-relaxed">
        <strong className="text-purple-600 dark:text-purple-300">QuickCourt — Local Sports Booking Platform</strong>
        <br />
        QuickCourt is a full-stack web app that helps sports lovers book local facilities like badminton courts, turf grounds, and tennis tables. Easily find venues, join or create matches, and enjoy a seamless booking experience.
        <br />
        <span className="mt-2 block font-semibold text-purple-600 dark:text-purple-300">
          User Roles: User, Facility Owner, Admin
        </span>
      </p>

      {/* Uncomment if you want the repo link */}
      {/* <a
        href="https://github.com/anubhav-m/odoo-vaau?tab=repositories"
        className="text-purple-600 dark:text-purple-400 hover:underline text-lg font-semibold"
      >
        View All My Repositories →
      </a> */}

      <div className="w-full flex flex-col gap-8">
        <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-purple-200 dark:border-purple-700 transition-transform hover:scale-[1.03] duration-300">
          <h2 className="text-2xl font-semibold text-purple-700 dark:text-purple-300 mb-3">
            Why QuickCourt?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Building this project lets you practice full-stack skills by solving real-world challenges: user authentication, venue management, bookings, and community interaction. It’s a great way to showcase practical development knowledge and problem-solving.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-purple-200 dark:border-purple-700 transition-transform hover:scale-[1.03] duration-300">
          <h2 className="text-2xl font-semibold text-purple-700 dark:text-purple-300 mb-4">
            What You’ll Get
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed">
            <li>A fully functional authentication system with email, password, and OTP verification</li>
            <li>Responsive React UI with venue search, filters, and pagination</li>
            <li>Detailed venue pages with photos, amenities, and reviews</li>
            <li>Court booking system with time slot selection and payment simulation</li>
            <li>User profiles with booking management and editable info</li>
            <li>Facility owner dashboard for managing courts, bookings, and earnings</li>
            <li>Admin panel with stats, user management, and facility approvals</li>
            <li>RESTful backend APIs built with Express and MongoDB</li>
            <li>File upload and image gallery features for facilities</li>
            <li>Role-based access control for different user types</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
