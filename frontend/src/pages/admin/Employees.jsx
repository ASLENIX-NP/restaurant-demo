import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/employees.css";

const initialEmployees = [
  {
    name: "John Doe",
    role: "Manager",
    shift: "Morning",
    email: "john@gmail.com",
    phone: "+977 9812345678",
    status: "Active",
    salary: "Rs. 55,000",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Sarah Wilson",
    role: "Chef",
    shift: "Day",
    email: "sarah@gmail.com",
    phone: "+977 9800000001",
    status: "Active",
    salary: "Rs. 45,000",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Michael Brown",
    role: "Cashier",
    shift: "Evening",
    email: "michael@gmail.com",
    phone: "+977 9800000002",
    status: "Inactive",
    salary: "Rs. 32,000",
    image: "https://randomuser.me/api/portraits/men/55.jpg",
  },
  {
    name: "Emily Davis",
    role: "Waiter",
    shift: "Night",
    email: "emily@gmail.com",
    phone: "+977 9800000003",
    status: "Active",
    salary: "Rs. 25,000",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

const Employees = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState(initialEmployees);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);

  const [newEmployee, setNewEmployee] = useState({
    name: "",
    role: "",
    shift: "",
    email: "",
    phone: "",
    salary: "",
    status: "Active",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  });

  const handleDelete = (index) => {
    const updated = employees.filter((_, i) => i !== index);
    setEmployees(updated);
  };

  const handleAddEmployee = () => {
    if (
      !newEmployee.name ||
      !newEmployee.role ||
      !newEmployee.email
    ) {
      alert("Please fill required fields");
      return;
    }

    setEmployees([...employees, newEmployee]);

    setShowModal(false);

    setNewEmployee({
      name: "",
      role: "",
      shift: "",
      email: "",
      phone: "",
      salary: "",
      status: "Active",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
    });
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      employee.email
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      employee.role
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesRole =
      roleFilter === "All" ||
      employee.role === roleFilter;

    const matchesStatus =
      statusFilter === "All" ||
      employee.status === statusFilter;

    return (
      matchesSearch &&
      matchesRole &&
      matchesStatus
    );
  });

  const totalEmployees = employees.length;

  const activeEmployees = employees.filter(
    (e) => e.status === "Active"
  ).length;

  const inactiveEmployees = employees.filter(
    (e) => e.status === "Inactive"
  ).length;

  const kitchenStaff = employees.filter(
    (e) => e.role === "Chef"
  ).length;

  return (
    <div className="employees-page">

      <div className="employees-top">

        <div>
          <h1>Employees</h1>
          <p>
            Dashboard {" > "} Employees
          </p>
        </div>

        <div className="employees-buttons">

          <button
            className="white-btn"
            onClick={() =>
              navigate("/admin/attendance")
            }
          >
            Attendance
          </button>

          <button
            className="black-btn"
            onClick={() =>
              setShowModal(true)
            }
          >
            + Add Employee
          </button>

        </div>

      </div>

      <div className="employees-stats">

        <div className="employee-stat-card">
          <div className="employee-icon">
            👨‍💼
          </div>

          <div>
            <h4>Total Employees</h4>
            <h2>{totalEmployees}</h2>
          </div>
        </div>

        <div className="employee-stat-card">
          <div className="employee-icon green-bg">
            ✅
          </div>

          <div>
            <h4>Active Staff</h4>
            <h2>{activeEmployees}</h2>
          </div>
        </div>

        <div className="employee-stat-card">
          <div className="employee-icon yellow-bg">
            🍳
          </div>

          <div>
            <h4>Kitchen Staff</h4>
            <h2>{kitchenStaff}</h2>
          </div>
        </div>

        <div className="employee-stat-card">
          <div className="employee-icon red-bg">
            ❌
          </div>

          <div>
            <h4>Inactive</h4>
            <h2>{inactiveEmployees}</h2>
          </div>
        </div>

      </div>

      <div className="employees-table-wrapper">

        <div className="employees-filter">

          <input
            type="text"
            placeholder="Search employee..."
            className="employee-search"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(e.target.value)
            }
          >
            <option value="All">
              All Roles
            </option>
            <option value="Manager">
              Manager
            </option>
            <option value="Chef">
              Chef
            </option>
            <option value="Cashier">
              Cashier
            </option>
            <option value="Waiter">
              Waiter
            </option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="All">
              All Status
            </option>
            <option value="Active">
              Active
            </option>
            <option value="Inactive">
              Inactive
            </option>
          </select>

        </div>

        <table className="employees-table">

          <thead>
            <tr>
              <th>Employee</th>
              <th>Role</th>
              <th>Shift</th>
              <th>Contact</th>
              <th>Salary</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredEmployees.map(
              (employee, index) => (
                <tr key={index}>

                  <td>

                    <div className="employee-info">

                      <img
                        src={employee.image}
                        alt={employee.name}
                      />

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
                    {employee.shift}
                  </td>

                  <td>
                    {employee.phone}
                  </td>

                  <td>
                    {employee.salary}
                  </td>

                  <td>

                    <span
                      className={`employee-status ${employee.status}`}
                    >
                      {employee.status}
                    </span>

                  </td>

                  <td>

                    <div className="employee-actions">

                      <button
                        onClick={() =>
                          alert(
                            `Edit ${employee.name}`
                          )
                        }
                      >
                        ✏️
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(index)
                        }
                      >
                        🗑️
                      </button>

                    </div>

                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

      {showModal && (

        <div className="modal-overlay">

          <div className="modal">

            <h2>Add Employee</h2>

            <input
              placeholder="Name"
              value={newEmployee.name}
              onChange={(e) =>
                setNewEmployee({
                  ...newEmployee,
                  name: e.target.value,
                })
              }
            />

            <input
              placeholder="Email"
              value={newEmployee.email}
              onChange={(e) =>
                setNewEmployee({
                  ...newEmployee,
                  email: e.target.value,
                })
              }
            />

            <input
              placeholder="Phone"
              value={newEmployee.phone}
              onChange={(e) =>
                setNewEmployee({
                  ...newEmployee,
                  phone: e.target.value,
                })
              }
            />

            <input
              placeholder="Role"
              value={newEmployee.role}
              onChange={(e) =>
                setNewEmployee({
                  ...newEmployee,
                  role: e.target.value,
                })
              }
            />

            <input
              placeholder="Shift"
              value={newEmployee.shift}
              onChange={(e) =>
                setNewEmployee({
                  ...newEmployee,
                  shift: e.target.value,
                })
              }
            />

            <input
              placeholder="Salary"
              value={newEmployee.salary}
              onChange={(e) =>
                setNewEmployee({
                  ...newEmployee,
                  salary: e.target.value,
                })
              }
            />

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "20px",
              }}
            >

              <button
                onClick={
                  handleAddEmployee
                }
              >
                Save
              </button>

              <button
                onClick={() =>
                  setShowModal(false)
                }
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default Employees;