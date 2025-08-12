import React, { useState } from 'react';

const Booking = () => {
  const [sport, setSport] = useState('Badminton');
  const [date, setDate] = useState('2025-05-06');
  const [startTime, setStartTime] = useState('13:00');
  const [duration, setDuration] = useState(2);
  const [courts, setCourts] = useState([]);
  const courtOptions = ['Table 1', 'Table 2'];

  const toggleCourt = (court) => {
    setCourts((prev) =>
      prev.includes(court) ? prev.filter((c) => c !== court) : [...prev, court]
    );
  };

  const incrementDuration = () => {
    if (duration < 12) setDuration(duration + 1);
  };

  const decrementDuration = () => {
    if (duration > 1) setDuration(duration - 1);
  };

  const pricePerHour = 300;
  const totalPrice = duration * pricePerHour;

  return (
  <div className="max-w-3xl mx-auto mt-8 p-6 rounded-lg font-mono
                  bg-blue-100 text-blue-900
                  dark:bg-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-300">

      <header className="flex justify-between items-center mb-6 bg-blue-300 dark:bg-gray-700 p-4 rounded-md">
        <div className="font-bold text-lg">QUICKCOURT</div>

        <button
          onClick={() => alert('Booking confirmed!')}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold transition-colors"
        >
          📅 Book
        </button>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-400 dark:bg-gray-500"></div>
          Mitchell Admin
        </div>
      </header>

      <h1 className="text-2xl font-semibold mb-5">Court Booking</h1>

      <div className="bg-blue-200 dark:bg-gray-800 rounded-lg p-5 transition-colors">
        <h2 className="mb-2 font-semibold">SBR Badminton</h2>
        <p className="text-sm mb-4">
          📍 Satellite, Jodhpur Village &nbsp;⭐ 4.5 (6)
        </p>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Sport</label>
          <select
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            className="w-full p-2 rounded border border-blue-400 dark:border-gray-600
                       bg-white dark:bg-gray-700 text-blue-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
          >
            <option>Badminton</option>
            <option>Football</option>
            <option>Basketball</option>
            <option>Tennis</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 rounded border border-blue-400 dark:border-gray-600
                       bg-white dark:bg-gray-700 text-blue-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full p-2 rounded border border-blue-400 dark:border-gray-600
                       bg-white dark:bg-gray-700 text-blue-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Duration</label>
          <div className="flex items-center gap-4">
            <button
              onClick={decrementDuration}
              className="bg-green-600 hover:bg-green-700 text-white w-8 h-8 rounded
                         flex items-center justify-center font-bold transition-colors"
              type="button"
            >
              −
            </button>
            <div>{duration} Hr</div>
            <button
              onClick={incrementDuration}
              className="bg-green-600 hover:bg-green-700 text-white w-8 h-8 rounded
                         flex items-center justify-center font-bold transition-colors"
              type="button"
            >
              +
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Court</label>
          <select
            value=""
            onChange={(e) => toggleCourt(e.target.value)}
            className="w-full p-2 rounded border border-blue-400 dark:border-gray-600
                       bg-white dark:bg-gray-700 text-blue-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
          >
            <option value="" disabled>
              --Select Court--
            </option>
            {courtOptions.map((court) => (
              <option key={court} value={court}>
                {court}
              </option>
            ))}
          </select>

          <div className="flex flex-wrap gap-2 mt-2">
            {courts.map((court) => (
              <div
                key={court}
                onClick={() => toggleCourt(court)}
                className="bg-blue-500 dark:bg-blue-700 text-white rounded px-3 py-1 cursor-pointer select-none
                           hover:bg-blue-600 dark:hover:bg-blue-800 transition"
              >
                {court} ×
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => alert('Continue to Payment')}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded font-bold transition-colors"
          type="button"
        >
          Continue to Payment - ₹{totalPrice}.00
        </button>
      </div>
    </div>
  );
};

export default Booking;
