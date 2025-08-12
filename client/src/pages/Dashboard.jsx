import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'
import DashSidebar from '../components/DashSidebar.jsx';
import DashProfile from '../components/DashProfile';
import DashUsers from '../components/DashUsers.jsx';
import DashComp from '../components/DashboardComp.jsx';
import DashComments from '../components/DashComments.jsx';
import DashFacilities from '../components/DashFacilities.jsx';
import DashCourts from '../components/DashCourts.jsx';
import DashBooking from '../components/DashBooking.jsx';

export default function Dashboard() {
    const location = useLocation();
    const [tab, setTab] = useState('');

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) setTab(tabFromUrl);
    }, [location.search])

    return (
        <div className="flex-1 flex flex-col md:flex-row">
            <div className='md:w-56'>
                {/* Sidebar */}
                <DashSidebar />
            </div>

            <div className="w-full overflow-x-auto">
                {/* Dashboard comp ...*/}
                {tab === 'dash' && <DashComp />}
                {/* Profile ... */}
                {tab === 'profile' && <DashProfile />}
                {/* Posts ... */}
                {tab === 'facilities' && <DashFacilities />}
                {/* Users ...*/}
                {tab === 'users' && <DashUsers/>}
                {/* Courts ...*/}
                {tab === 'courts' && <DashCourts />}
                {/* Comments ...*/}
                {tab === 'comments' && <DashComments />}
                {/* Booking ...*/}
                {tab === 'bookings' && <DashBooking/>}
            </div>

        </div>
    )
}