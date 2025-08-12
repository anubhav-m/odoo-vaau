export default function Projects() {
  return (
    <div className='flex-1 max-w-4xl mx-auto flex justify-center gap-8 items-center flex-col p-6'>
      <h1 className='text-4xl font-bold text-center'>Explore Our Projects</h1>
      <p className='text-lg text-gray-600 text-center max-w-3xl'>
      QuickCourt — Local Sports Booking Platform
QuickCourt is a full-stack web app that helps sports lovers book local facilities like badminton courts, turf grounds, and tennis tables. Easily find venues, join or create matches, and enjoy a seamless booking experience.
<br></br>
User Roles: User, Facility Owner, Admin
      </p>
      {/* <a
        href='https://github.com/anubhav-m/odoo-vaau?tab=repositories'
        className='text-teal-500 hover:underline text-lg'
      >
        View All My Repositories →
      </a> */}

      <div className='w-full flex flex-col gap-6'>
        <section className='bg-gray-100 p-6 rounded-lg shadow-md dark:bg-gray-700'>
          <h2 className='text-2xl font-semibold dark:text-gray-100'>
            Why QuickCourt ?
          </h2>
          <p className='text-gray-300 mt-2'>
          Building this project lets you practice full-stack skills by solving real-world challenges: user authentication, venue management, bookings, and community interaction. It’s a great way to showcase practical development knowledge and problem-solving.
          </p>
        </section>

        <section className='bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-md'>
          <h2 className='text-2xl font-semibold dark:text-gray-100'>
            What You'll Get
          </h2>
          <ul className='list-disc list-inside text-gray-300 mt-2'>
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
