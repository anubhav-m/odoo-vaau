import React, { useState } from "react";

const courts = ["Table 1", "Table 2"];
const sports = ["Badminton", "Football", "Basketball", "Tennis"];

const Booking = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sport, setSport] = useState("Badminton");
  const [date, setDate] = useState("2025-05-06");
  const [startTime, setStartTime] = useState("13:00");
  const [duration, setDuration] = useState(2);
  const [selectedCourts, setSelectedCourts] = useState([]);

  const pricePerHour = 300;
  const totalPrice = pricePerHour * duration;

  const toggleCourt = (court) => {
    setSelectedCourts((prev) =>
      prev.includes(court)
        ? prev.filter((c) => c !== court)
        : [...prev, court]
    );
  };

  const bgColor = darkMode ? "#0B2342" : "#C7E0F4"; // dark blue / light blue
  const textColor = darkMode ? "#C7E0F4" : "#0B2342"; // invert text color

  return (
    <div
      style={{
        backgroundColor: bgColor,
        color: textColor,
        minHeight: "100vh",
        padding: "2rem",
        fontFamily: "monospace",
        transition: "all 0.3s ease",
      }}
    >
      <button
        onClick={() => setDarkMode((d) => !d)}
        style={{
          marginBottom: "1rem",
          padding: "0.5rem 1rem",
          cursor: "pointer",
          backgroundColor: darkMode ? "#C7E0F4" : "#0B2342",
          color: darkMode ? "#0B2342" : "#C7E0F4",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Switch to {darkMode ? "Light" : "Dark"} Mode
      </button>

      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        Court Booking
      </h1>

      <div
        style={{
          border: `1px solid ${textColor}`,
          borderRadius: "10px",
          padding: "2rem",
          maxWidth: "500px",
        }}
      >
        <h2>SBR Badminton</h2>
        <p>
          <span role="img" aria-label="pin">
            📍
          </span>{" "}
          Satellite, Jodhpur Village{" "}
          <span role="img" aria-label="star">
            ⭐
          </span>{" "}
          4.5 (6)
        </p>

        <div style={{ marginTop: "1rem" }}>
          <label>
            Sport
            <br />
            <select
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              style={{ padding: "0.5rem", width: "100%", marginTop: "0.25rem" }}
            >
              {sports.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ marginTop: "1rem" }}>
          <label>
            Date
            <br />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ padding: "0.5rem", width: "100%", marginTop: "0.25rem" }}
            />
          </label>
        </div>

        <div style={{ marginTop: "1rem" }}>
          <label>
            Start Time
            <br />
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              style={{ padding: "0.5rem", width: "100%", marginTop: "0.25rem" }}
            />
          </label>
        </div>

        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <label>Duration</label>
          <button
            onClick={() => setDuration((d) => Math.max(1, d - 1))}
            style={{
              padding: "0.25rem 0.75rem",
              cursor: "pointer",
              backgroundColor: "#2e7d32",
              border: "none",
              color: "white",
              borderRadius: "50%",
              fontSize: "1.25rem",
            }}
          >
            −
          </button>
          <span>{duration} Hr</span>
          <button
            onClick={() => setDuration((d) => Math.min(6, d + 1))}
            style={{
              padding: "0.25rem 0.75rem",
              cursor: "pointer",
              backgroundColor: "#2e7d32",
              border: "none",
              color: "white",
              borderRadius: "50%",
              fontSize: "1.25rem",
            }}
          >
            +
          </button>
        </div>

        <div style={{ marginTop: "1rem" }}>
          <label>
            Court
            <br />
            <select
              multiple
              value={selectedCourts}
              onChange={(e) =>
                setSelectedCourts(
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
              style={{ padding: "0.5rem", width: "100%", marginTop: "0.25rem" }}
            >
              {courts.map((court) => (
                <option key={court} value={court}>
                  {court}
                </option>
              ))}
            </select>
          </label>
          <div style={{ marginTop: "0.5rem" }}>
            Selected:{" "}
            {selectedCourts.length === 0
              ? "--Select Court--"
              : selectedCourts.join(", ")}
          </div>
        </div>

        <button
          style={{
            marginTop: "2rem",
            padding: "0.75rem 1rem",
            width: "100%",
            backgroundColor: "#2e7d32",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
          onClick={() => alert(`Continue to Payment - ₹${totalPrice}.00`)}
        >
          Continue to Payment - ₹{totalPrice}.00
        </button>
      </div>
    </div>
  );
};

export default Booking;
