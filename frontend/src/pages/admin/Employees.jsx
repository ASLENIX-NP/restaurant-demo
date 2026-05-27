import "../../styles/employees.css";

const employees = [

  {
    name: "John Doe",
    role: "Manager",
    email: "john@gmail.com",
    phone: "+977 9812345678",
    status: "Active",
    salary: "Rs. 55,000",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },

  {
    name: "Sarah Wilson",
    role: "Chef",
    email: "sarah@gmail.com",
    phone: "+977 9800000001",
    status: "Active",
    salary: "Rs. 45,000",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },

  {
    name: "Michael Brown",
    role: "Cashier",
    email: "michael@gmail.com",
    phone: "+977 9800000002",
    status: "Inactive",
    salary: "Rs. 32,000",
    image: "https://randomuser.me/api/portraits/men/55.jpg",
  },

  {
    name: "Emily Davis",
    role: "Waiter",
    email: "emily@gmail.com",
    phone: "+977 9800000003",
    status: "Active",
    salary: "Rs. 25,000",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },

];

const Employees = () => {

  return (

    <div className="employees-page">

      {/* TOP */}

      <div className="employees-top">

        <div>

          <h1>
            Employees
          </h1>

          <p>
            Dashboard {" > "} Employees
          </p>

        </div>

        <div className="employees-buttons">

          <button className="white-btn">
            Attendance
          </button>

          <button className="black-btn">
            + Add Employee
          </button>

        </div>

      </div>

      {/* STATS */}

      <div className="employees-stats">

        <div className="employee-stat-card">

          <div className="employee-icon">
            👨‍💼
          </div>

          <div>

            <h4>
              Total Employees
            </h4>

            <h2>
              42
            </h2>

          </div>

        </div>

        <div className="employee-stat-card">

          <div className="employee-icon green-bg">
            ✅
          </div>

          <div>

            <h4>
              Active Staff
            </h4>

            <h2>
              36
            </h2>

          </div>

        </div>

        <div className="employee-stat-card">

          <div className="employee-icon yellow-bg">
            🍳
          </div>

          <div>

            <h4>
              Kitchen Staff
            </h4>

            <h2>
              12
            </h2>

          </div>

        </div>

        <div className="employee-stat-card">

          <div className="employee-icon red-bg">
            ❌
          </div>

          <div>

            <h4>
              Inactive
            </h4>

            <h2>
              6
            </h2>

          </div>

        </div>

      </div>

      {/* TABLE */}

      <div className="employees-table-wrapper">

        <div className="employees-filter">

          <input
            type="text"
            placeholder="Search employee..."
            className="employee-search"
          />

          <select>
            <option>
              All Roles
            </option>
          </select>

          <select>
            <option>
              All Status
            </option>
          </select>

        </div>

        <table className="employees-table">

          <thead>

            <tr>

              <th>
                Employee
              </th>

              <th>
                Role
              </th>

              <th>
                Contact
              </th>

              <th>
                Salary
              </th>

              <th>
                Status
              </th>

              <th>
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {employees.map((employee, index) => (

              <tr key={index}>

                <td>

                  <div className="employee-info">

                    <img src={employee.image} alt="" />

                    <div>

                      <h4>
                        {employee.name}
                      </h4>

                      <p>
                        {employee.email}
                      </p>

                    </div>

                  </div>

                </td>

                <td>
                  {employee.role}
                </td>

                <td>
                  {employee.phone}
                </td>

                <td>
                  {employee.salary}
                </td>

                <td>

                  <span className={`employee-status ${employee.status}`}>
                    {employee.status}
                  </span>

                </td>

                <td>

                  <div className="employee-actions">

                    <button>
                      ✏️
                    </button>

                    <button>
                      🗑️
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Employees;