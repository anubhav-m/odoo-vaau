export default function DashBooking() {
    const bookings = [
        {
            id: 'b1',
            court: 'Court 1',
            date: '2025-08-15',
            startTime: '10:00',
            endTime: '11:30',
            totalPrice: 150,
            status: 'Confirmed',
        },
        {
            id: 'b2',
            court: 'Court 3',
            date: '2025-08-16',
            startTime: '14:00',
            endTime: '15:00',
            totalPrice: 100,
            status: 'Pending',
        },
        {
            id: 'b3',
            court: 'Court 2',
            date: '2025-08-17',
            startTime: '09:30',
            endTime: '10:30',
            totalPrice: 120,
            status: 'Cancelled',
        },
    ];

    // Color coding for status
    const statusColors = {
        Confirmed: 'text-green-600 bg-green-100',
        Pending: 'text-yellow-600 bg-yellow-100',
        Cancelled: 'text-red-600 bg-red-100',
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white dark:bg-gray-900 rounded-md">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900 dark:text-gray-100">
                My Bookings
            </h2>
            <ul className="space-y-4">
                {bookings.map(({ id, court, date, startTime, endTime, totalPrice, status }) => (
                    <li
                        key={id}
                        className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow
                     bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                {court}
                            </span>
                            <span
                                className={`text-sm font-semibold px-2 py-1 rounded-full
                ${status === 'Confirmed'
                                        ? 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400'
                                        : status === 'Pending'
                                            ? 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-400'
                                            : 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-400'
                                    }`}
                            >
                                {status}
                            </span>
                        </div>
                        <div className="text-gray-700 dark:text-gray-300 mb-1">
                            Date: <span className="font-semibold">{date}</span>
                        </div>
                        <div className="text-gray-700 dark:text-gray-300 mb-1">
                            Time: <span className="font-semibold">{startTime} - {endTime}</span>
                        </div>
                        <div className="text-gray-700 dark:text-gray-300">
                            Price: <span className="font-semibold">${totalPrice}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );

}
