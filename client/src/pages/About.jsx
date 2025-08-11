export default function About() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-2xl mx-auto p-3 text-center'>
        <div>
          <h1 className='text-3xl font font-semibold text-center my-7'>
            About QuickCourt
          </h1>
          <div className='text-md text-gray-500 flex flex-col gap-6'>
            <p>
              Welcome to QuickCourt, your go-to local sports booking platform 
              designed to connect sports enthusiasts with the best local facilities 
              in your area. Whether you love badminton, tennis, football, or any other 
              sport, QuickCourt makes it effortless to find, book, and enjoy top-quality 
              courts and venues near you.
            </p>

            <p>
             Our mission is to foster community engagement and promote an active 
             lifestyle by offering a seamless booking experience that’s quick, reliable, 
             and user-friendly. Facility owners can easily manage their venues, track 
             bookings, and grow their business, while admins ensure smooth operations 
             and quality control across the platform.
            </p>

            <p>
              With features like real-time court availability, user reviews, dynamic booking 
              calendars, and secure payment simulation, QuickCourt aims to become your trusted 
              partner for every game day.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}