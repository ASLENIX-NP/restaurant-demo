import React, { useState } from "react";
import "../../styles/reservations.css";

const reservationsData = [
  {
    name: "John Doe",
    status: "Confirmed",
    table: "Table 4",
    guests: 3,
    time: "7:30 PM",
    phone: "+977-9876543210",
    notes: "Prefers a window seat if possible. Celebrating a promotion.",
  },
  {
    name: "Emily Smith",
    status: "Pending",
    table: "Table 2",
    guests: 2,
    time: "8:00 PM",
    phone: "+977-9865432109",
    notes: "Requires a high chair for a toddler.",
  },
  {
    name: "Michel Lee",
    status: "VIP",
    table: "Table 7",
    guests: 5,
    time: "9:15 PM",
    phone: "+977-9843210987",
    notes: "Regular guest. Prepare the standard complimentary welcome drink.",
  },
];

// Helper array to assign premium distinct gradient backdrops to avatars
const avatarGradients = [
  "linear-gradient(135deg, #3b82f6, #1d4ed8)", // Blue
  "linear-gradient(135deg, #ec4899, #be185d)", // Pink/Berry
  "linear-gradient(135deg, #8b5cf6, #6d28d9)", // Purple
];

const Reservations = () => {
  const [selectedReservation, setSelectedReservation] = useState(null);

  return (
    <div className="reservations-page">
      {/* HEADER SECTION */}
      <div className="reservations-header">
        <div>
          <h1>Reservations</h1>
          <p>Manage restaurant bookings professionally</p>
        </div>
      </div>

      {/* CARDS GRID */}
      <div className="reservations-grid">
        {reservationsData.map((item, index) => {
          const avatarStyle = {
            background: avatarGradients[index % avatarGradients.length],
          };

          return (
            <div className="reservation-card" key={index}>
              <div className="reservation-top">
                <div className="reservation-avatar" style={avatarStyle}>
                  {item.name.charAt(0)}
                </div>

                <div className="reservation-user-meta">
                  <h2>{item.name}</h2>
                  <span className={`status-badge ${item.status.toLowerCase()}`}>
                    <span className="status-dot"></span>
                    {item.status}
                  </span>
                </div>
              </div>

              <div className="reservation-details">
                <div className="detail-box">
                  <span className="detail-icon">🍽️</span>
                  <p>{item.table}</p>
                </div>

                <div className="detail-box">
                  <span className="detail-icon">👥</span>
                  <p>{item.guests} Guests</p>
                </div>

                <div className="detail-box">
                  <span className="detail-icon">🕒</span>
                  <p>{item.time}</p>
                </div>
              </div>

              <button 
                className="view-btn"
                onClick={() => setSelectedReservation(item)}
              >
                View Details
              </button>
            </div>
          );
        })}
      </div>

      {/* AESTHETIC DETAIL MODAL DISPLAY */}
      {selectedReservation && (
        <div className="modal-overlay" onClick={() => setSelectedReservation(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Reservation Details</h2>
              <button className="close-x" onClick={() => setSelectedReservation(null)}>×</button>
            </div>
            <hr />
            
            <div className="modal-body-details">
              <div className="modal-row">
                <strong>Guest Name:</strong>
                <span>{selectedReservation.name}</span>
              </div>
              <div className="modal-row">
                <strong>Status:</strong>
                <span className={`status-badge ${selectedReservation.status.toLowerCase()}`}>
                  {selectedReservation.status}
                </span>
              </div>
              <div className="modal-row">
                <strong>Assigned Base:</strong>
                <span>{selectedReservation.table}</span>
              </div>
              <div className="modal-row">
                <strong>Party Size:</strong>
                <span>{selectedReservation.guests} Persons</span>
              </div>
              <div className="modal-row">
                <strong>Arrival Time:</strong>
                <span>{selectedReservation.time}</span>
              </div>
              <div className="modal-row">
                <strong>Contact Number:</strong>
                <span>{selectedReservation.phone}</span>
              </div>
              <div className="modal-notes-section">
                <strong>Special Requests / Notes:</strong>
                <p>{selectedReservation.notes || "No special requests appended."}</p>
              </div>
            </div>

            <button className="modal-close-btn" onClick={() => setSelectedReservation(null)}>
              Close View
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservations;