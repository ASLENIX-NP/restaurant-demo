import React from "react";

import {
  Search,
  Printer,
  CreditCard,
  Wallet,
  Receipt,
  CheckCircle,
} from "lucide-react";

const pendingBills = [
  {
    id: "INV-1025",
    table: "Table 2",
    customer: "Walk-in Customer",
    amount: 1150,
    status: "Unpaid",
    time: "7:45 PM",
  },

  {
    id: "INV-1026",
    table: "Table 5",
    customer: "John Doe",
    amount: 600,
    status: "Partial",
    time: "8:10 PM",
  },

  {
    id: "INV-1027",
    table: "Table 1",
    customer: "Emily Smith",
    amount: 800,
    status: "Unpaid",
    time: "8:25 PM",
  },
];

const items = [
  {
    name: "Burger",
    qty: 1,
    price: 350,
  },

  {
    name: "Pizza",
    qty: 1,
    price: 700,
  },

  {
    name: "Coke",
    qty: 1,
    price: 100,
  },
];

export default function PendingBillsPage() {

  const subtotal =
    items.reduce(
      (a, b) =>
        a + b.qty * b.price,
      0
    );

  const vat = subtotal * 0.13;

  const total =
    subtotal + vat + 50;

  return (

    <div className="min-h-screen bg-gray-100 p-6">

      <main>

        {/* PAGE HEADER */}

        <div className="flex justify-between items-center mb-8">

          <div>

            <h1 className="text-4xl font-bold text-gray-800">
              Pending Bills
            </h1>

            <p className="text-gray-500 mt-1">
              Manage all unpaid customer invoices
            </p>

          </div>

          <div className="flex items-center gap-4">

            <div className="bg-white px-4 py-3 rounded-xl flex items-center gap-2 shadow-sm">

              <Search
                size={18}
                className="text-gray-400"
              />

              <input
                placeholder="Search..."
                className="outline-none bg-transparent"
              />

            </div>

            <button className="bg-purple-600 text-white px-5 py-3 rounded-xl">
              Today
            </button>

          </div>

        </div>

        {/* SUMMARY */}

        <div className="grid grid-cols-4 gap-5 mb-6">

          {[
            {
              title: "Pending Bills",
              value: "28",
              color: "text-red-500",
            },

            {
              title: "Total Due",
              value: "Rs. 24,500",
              color: "text-purple-600",
            },

            {
              title: "Partial Payments",
              value: "12",
              color: "text-orange-500",
            },

            {
              title: "Completed Today",
              value: "45",
              color: "text-green-500",
            },

          ].map((card) => (

            <div
              key={card.title}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >

              <p className="text-gray-500">
                {card.title}
              </p>

              <h2 className={`text-3xl font-bold mt-2 ${card.color}`}>
                {card.value}
              </h2>

            </div>

          ))}

        </div>

        {/* MAIN CONTENT */}

        <div className="grid grid-cols-12 gap-6">

          {/* LEFT */}

          <div className="col-span-4 bg-white rounded-2xl p-5 shadow-sm">

            <div className="flex items-center justify-between mb-5">

              <h2 className="text-xl font-bold">
                Pending Invoices
              </h2>

              <div className="bg-gray-100 px-3 py-2 rounded-lg flex items-center gap-2">

                <Search size={16} />

                <input
                  placeholder="Search..."
                  className="bg-transparent outline-none text-sm"
                />

              </div>

            </div>

            <div className="space-y-4">

              {pendingBills.map((bill) => (

                <div
                  key={bill.id}
                  className="border rounded-2xl p-4 hover:shadow-lg hover:border-purple-500 transition cursor-pointer"
                >

                  <div className="flex justify-between">

                    <div>

                      <h3 className="font-bold text-lg">
                        {bill.id}
                      </h3>

                      <p className="text-gray-500 text-sm">
                        {bill.customer}
                      </p>

                    </div>

                    <div className="text-right">

                      <h3 className="font-bold text-lg">
                        Rs. {bill.amount}
                      </h3>

                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          bill.status === "Unpaid"
                            ? "bg-red-100 text-red-500"
                            : "bg-orange-100 text-orange-500"
                        }`}
                      >
                        {bill.status}
                      </span>

                    </div>

                  </div>

                  <div className="flex justify-between mt-4 text-sm text-gray-500">

                    <span>
                      {bill.table}
                    </span>

                    <span>
                      {bill.time}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* RIGHT */}

          <div className="col-span-8 bg-white rounded-2xl p-6 shadow-sm">

            {/* INVOICE HEADER */}

            <div className="flex justify-between items-start mb-6">

              <div>

                <h2 className="text-3xl font-bold text-gray-800">
                  Invoice Details
                </h2>

                <p className="text-gray-500 mt-1">
                  INV-1025
                </p>

              </div>

              <button className="flex items-center gap-2 bg-purple-600 text-white px-5 py-3 rounded-xl">

                <Printer size={18} />

                Print Bill

              </button>

            </div>

            {/* CUSTOMER INFO */}

            <div className="grid grid-cols-4 gap-4 mb-6">

              {[
                ["Customer", "Walk-in Customer"],
                ["Table", "Table 2"],
                ["Date", "2026/05/27"],
                ["Time", "7:45 PM"],
              ].map(([label, value]) => (

                <div
                  key={label}
                  className="bg-gray-50 rounded-xl p-4"
                >

                  <p className="text-gray-500 text-sm">
                    {label}
                  </p>

                  <h3 className="font-bold mt-1">
                    {value}
                  </h3>

                </div>

              ))}

            </div>

            {/* TABLE */}

            <div className="overflow-hidden rounded-2xl border mb-6">

              <table className="w-full">

                <thead className="bg-gray-100">

                  <tr className="text-left">

                    <th className="p-4">
                      Item
                    </th>

                    <th>
                      Qty
                    </th>

                    <th>
                      Price
                    </th>

                    <th>
                      Total
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {items.map((item) => (

                    <tr
                      key={item.name}
                      className="border-t"
                    >

                      <td className="p-4">
                        {item.name}
                      </td>

                      <td>
                        {item.qty}
                      </td>

                      <td>
                        Rs. {item.price}
                      </td>

                      <td>
                        Rs. {item.qty * item.price}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            {/* PAYMENT SECTION */}

            <div className="grid grid-cols-2 gap-6">

              {/* METHODS */}

              <div>

                <h3 className="text-xl font-bold mb-4">
                  Payment Method
                </h3>

                <div className="grid grid-cols-2 gap-4">

                  {[
                    {
                      name: "Cash",
                      icon: <Wallet size={18} />,
                    },

                    {
                      name: "Card",
                      icon: <CreditCard size={18} />,
                    },

                    {
                      name: "eSewa",
                      icon: <Receipt size={18} />,
                    },

                    {
                      name: "Khalti",
                      icon: <Wallet size={18} />,
                    },

                  ].map((method) => (

                    <button
                      key={method.name}
                      className="border rounded-xl p-4 flex items-center justify-center gap-2 hover:bg-purple-600 hover:text-white transition"
                    >

                      {method.icon}

                      {method.name}

                    </button>

                  ))}

                </div>

              </div>

              {/* SUMMARY */}

              <div className="bg-gray-50 rounded-2xl p-6">

                <h3 className="text-xl font-bold mb-5">
                  Payment Summary
                </h3>

                <div className="space-y-3">

                  <div className="flex justify-between">

                    <span>
                      Subtotal
                    </span>

                    <span>
                      Rs. {subtotal}
                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span>
                      VAT (13%)
                    </span>

                    <span>
                      Rs. {vat.toFixed(2)}
                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span>
                      Service Charge
                    </span>

                    <span>
                      Rs. 50
                    </span>

                  </div>

                  <div className="border-t pt-4 flex justify-between text-2xl font-bold text-purple-600">

                    <span>
                      Total
                    </span>

                    <span>
                      Rs. {total.toFixed(2)}
                    </span>

                  </div>

                </div>

                {/* ACTION BUTTONS */}

                <div className="grid grid-cols-2 gap-4 mt-6">

                  <button className="bg-orange-500 text-white py-3 rounded-xl font-semibold">
                    Partial Payment
                  </button>

                  <button className="bg-gradient-to-r from-purple-600 to-blue-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2">

                    <CheckCircle size={18} />

                    Complete Payment

                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}