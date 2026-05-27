import "../../styles/reservations.css";

const reservations = [
  {
    name: "John Doe",
    status: "Confirmed",
    table: "Table 4",
    guests: 3,
    time: "7:30 PM",
  },
  {
    name: "Emily Smith",
    status: "Pending",
    table: "Table 2",
    guests: 2,
    time: "8:00 PM",
  },
  {
    name: "Michel Lee",
    status: "VIP",
    table: "Table 7",
    guests: 5,
    time: "9:15 PM",
  },
];

const Reservations = () => {
  return (
    <div className="reservations-page">

      <div className="reservations-header">
        <h1>Reservations</h1>
        <p>Manage restaurant bookings professionally</p>
      </div>

      <div className="reservations-grid">

        {reservations.map((item, index) => (
          <div className="reservation-card" key={index}>

            <div className="reservation-top">

              <div className="reservation-avatar">
                {item.name.charAt(0)}
              </div>

              <div>
                <h2>{item.name}</h2>

                <span className={`status-badge ${item.status}`}>
                  {item.status}
                </span>
              </div>

            </div>

            <div className="reservation-details">

              <div className="detail-box">
                <span>🍽️</span>
                <p>{item.table}</p>
              </div>

              <div className="detail-box">
                <span>👥</span>
                <p>{item.guests} Guests</p>
              </div>

              <div className="detail-box">
                <span>🕒</span>
                <p>{item.time}</p>
              </div>

            </div>

            <button className="view-btn">
              View Details
            </button>

          </div>
        ))}

      </div>

    </div>
  );
};

export default Reservations;