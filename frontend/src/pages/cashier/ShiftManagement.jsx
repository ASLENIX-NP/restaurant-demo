import React, { useState, useMemo, useEffect } from "react";
import { useOrders } from "../../context/OrderContext";
import { PlayCircle, LogOut, ArrowDownCircle, Printer, X } from "lucide-react";

const ShiftManagement = () => {
  const { orders = [] } = useOrders() || {};

  // --- STATE MANAGEMENT ---
  const [shift, setShift] = useState(() => {
    const savedShift = localStorage.getItem("currentShiftDetails");
    return savedShift
      ? JSON.parse(savedShift)
      : {
          active: false,
          startTime: null,
          startingFloat: 0,
          payouts: [],
        };
  });

  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);

  const [startFloatInput, setStartFloatInput] = useState("");
  const [payoutAmountInput, setPayoutAmountInput] = useState("");
  const [payoutReasonInput, setPayoutReasonInput] = useState("");

  // Persist shift state to local storage
  useEffect(() => {
    localStorage.setItem("currentShiftDetails", JSON.stringify(shift));
  }, [shift]);

  // --- DATA CALCULATION ---
  const shiftMetrics = useMemo(() => {
    if (!shift.active) {
      return {
        cashSales: 0,
        digitalSales: 0,
        totalPayouts: 0,
        expectedInDrawer: 0,
      };
    }

    const shiftStartTime = new Date(shift.startTime);
    const salesInShift = orders.filter(
      (o) => o.status === "Completed" && new Date(o.timestamp) >= shiftStartTime
    );

    const cashSales = salesInShift
      .filter((o) => o.paymentMethod === "Cash")
      .reduce((sum, o) => sum + o.amount, 0);

    const digitalSales = salesInShift
      .filter((o) => o.paymentMethod !== "Cash")
      .reduce((sum, o) => sum + o.amount, 0);

    const totalPayouts = shift.payouts.reduce((sum, p) => sum + p.amount, 0);

    const expectedInDrawer = shift.startingFloat + cashSales - totalPayouts;

    return { cashSales, digitalSales, totalPayouts, expectedInDrawer };
  }, [orders, shift]);

  // --- HANDLER FUNCTIONS ---
  const handleStartShift = (e) => {
    e.preventDefault();
    const floatAmount = parseFloat(startFloatInput) || 0;
    setShift({
      active: true,
      startTime: new Date().toISOString(),
      startingFloat: floatAmount,
      payouts: [],
    });
    setIsStartModalOpen(false);
    setStartFloatInput("");
  };

  const handleAddPayout = (e) => {
    e.preventDefault();
    const payoutAmount = parseFloat(payoutAmountInput) || 0;
    if (payoutAmount <= 0) return;

    setShift((prev) => ({
      ...prev,
      payouts: [
        ...prev.payouts,
        {
          amount: payoutAmount,
          reason: payoutReasonInput || "General Payout",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ],
    }));
    setIsPayoutModalOpen(false);
    setPayoutAmountInput("");
    setPayoutReasonInput("");
  };

  const handleCloseShift = () => {
    if (
      window.confirm(
        "Are you sure you want to close the current shift? This action cannot be undone."
      )
    ) {
      // Logic to print Z-Report can be added here
      window.print();

      setTimeout(() => {
        setShift({
          active: false,
          startTime: null,
          startingFloat: 0,
          payouts: [],
        });
        setIsCloseModalOpen(false);
      }, 200); // Give a moment for the print dialog to appear
    }
  };

  // --- RENDER LOGIC ---
  if (!shift.active) {
    return (
      <div className="p-6 flex flex-col items-center justify-center text-center min-h-[calc(100vh-150px)]">
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 max-w-md">
          <LogOut size={48} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-2xl font-black text-slate-900">
            No Active Shift
          </h2>
          <p className="text-slate-500 mt-2 mb-6">
            Start a new shift to begin tracking sales and cash flow.
          </p>
          <button
            onClick={() => setIsStartModalOpen(true)}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition shadow-md flex items-center justify-center gap-3 text-lg"
          >
            <PlayCircle size={20} /> Start New Shift
          </button>
        </div>
        {isStartModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-slide-in">
              <h2 className="text-xl font-black text-slate-900 mb-4">
                Enter Starting Cash
              </h2>
              <form onSubmit={handleStartShift}>
                <input
                  id="startFloatInput"
                  name="startFloatInput"
                  type="number"
                  value={startFloatInput}
                  onChange={(e) => setStartFloatInput(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-center text-2xl font-bold outline-none focus:border-purple-500 transition"
                  placeholder="Rs. 0.00"
                  autoFocus
                  required
                />
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsStartModalOpen(false)}
                    className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-500 text-white font-bold py-3 rounded-xl"
                  >
                    Begin Shift
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Shift & Drawer</h1>
        <p className="text-slate-500">
          Manage your cash flow and daily closing reports
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-2xl screen-only">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-slate-900">
            Current Shift Details
          </h2>
          <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            Active
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between border-b border-slate-100 pb-3">
            <span className="text-slate-500 font-medium">
              Starting Cash Float
            </span>
            <span className="font-bold text-slate-900">
              Rs. {shift.startingFloat.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-3">
            <span className="text-slate-500 font-medium">Cash Sales Today</span>
            <span className="font-bold text-slate-900">
              Rs. {shiftMetrics.cashSales.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-3">
            <span className="text-slate-500 font-medium">
              Card/Digital Sales
            </span>
            <span className="font-bold text-slate-900">
              Rs. {shiftMetrics.digitalSales.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-3 text-rose-600">
            <span className="font-medium">Cash Payouts</span>
            <span className="font-bold">
              - Rs. {shiftMetrics.totalPayouts.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between pt-3">
            <span className="text-lg font-black text-slate-900">
              Expected Cash in Drawer
            </span>
            <span className="text-lg font-black text-emerald-600">
              Rs. {shiftMetrics.expectedInDrawer.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => setIsPayoutModalOpen(true)}
            className="flex-1 bg-amber-100 text-amber-600 border border-amber-200 font-bold py-3 rounded-xl hover:bg-amber-200 transition flex items-center justify-center gap-2"
          >
            <ArrowDownCircle size={16} /> Cash Payout / Drop
          </button>
          <button
            onClick={() => setIsCloseModalOpen(true)}
            className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition shadow-md flex items-center justify-center gap-2"
          >
            <LogOut size={16} /> Close Shift (Z-Report)
          </button>
        </div>
      </div>

      {/* MODALS */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-slide-in">
            <h2 className="text-xl font-black text-slate-900 mb-4">
              Record a Cash Payout
            </h2>
            <form onSubmit={handleAddPayout} className="space-y-4">
              <input
                id="payoutAmount"
                name="payoutAmount"
                type="number"
                value={payoutAmountInput}
                onChange={(e) => setPayoutAmountInput(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-amber-500 transition"
                placeholder="Amount (e.g., 5000)"
                required
              />
              <input
                id="payoutReason"
                name="payoutReason"
                type="text"
                value={payoutReasonInput}
                onChange={(e) => setPayoutReasonInput(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-amber-500 transition"
                placeholder="Reason (optional, e.g., Safe drop)"
              />
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPayoutModalOpen(false)}
                  className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 text-white font-bold py-3 rounded-xl"
                >
                  Record Payout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCloseModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-slide-in">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-black text-slate-900 mb-4">
                End of Shift Report (Z)
              </h2>
              <button
                onClick={() => setIsCloseModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Shift Started:</span>{" "}
                <span className="font-bold">
                  {new Date(shift.startTime).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Starting Float:</span>{" "}
                <span className="font-bold">
                  Rs. {shift.startingFloat.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cash Sales:</span>{" "}
                <span className="font-bold">
                  Rs. {shiftMetrics.cashSales.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Digital Sales:</span>{" "}
                <span className="font-bold">
                  Rs. {shiftMetrics.digitalSales.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Payouts:</span>{" "}
                <span className="font-bold text-rose-600">
                  - Rs. {shiftMetrics.totalPayouts.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-lg font-black text-emerald-600 pt-3 border-t border-slate-200 mt-3">
                <span className="text-slate-900">Expected in Drawer:</span>{" "}
                <span>
                  Rs. {shiftMetrics.expectedInDrawer.toLocaleString()}
                </span>
              </div>
            </div>
            <button
              onClick={handleCloseShift}
              className="w-full mt-6 bg-rose-500 text-white font-bold py-3 rounded-xl hover:bg-rose-600 transition flex items-center justify-center gap-2"
            >
              <Printer size={16} /> Print & Close Shift
            </button>
          </div>
        </div>
      )}

      {/* PRINT-ONLY Z-REPORT */}
      <div className="print-only">
        <h2>End of Shift Report (Z-Report)</h2>
        <p>
          <strong>Shift Started:</strong>{" "}
          {new Date(shift.startTime).toLocaleString()}
        </p>
        <p>
          <strong>Shift Closed:</strong> {new Date().toLocaleString()}
        </p>
        <hr style={{ margin: "1rem 0", borderStyle: "dashed" }} />
        <h3>Sales Summary</h3>
        <p>
          <strong>Starting Float:</strong> Rs.{" "}
          {shift.startingFloat.toLocaleString()}
        </p>
        <p>
          <strong>Cash Sales:</strong> Rs.{" "}
          {shiftMetrics.cashSales.toLocaleString()}
        </p>
        <p>
          <strong>Digital Sales:</strong> Rs.{" "}
          {shiftMetrics.digitalSales.toLocaleString()}
        </p>
        <p>
          <strong>Total Sales:</strong> Rs.{" "}
          {(
            shiftMetrics.cashSales + shiftMetrics.digitalSales
          ).toLocaleString()}
        </p>
        <hr style={{ margin: "1rem 0", borderStyle: "dashed" }} />
        <h3>Cash Drawer Reconciliation</h3>
        <p>
          <strong>Cash Payouts:</strong> - Rs.{" "}
          {shiftMetrics.totalPayouts.toLocaleString()}
        </p>
        <p
          style={{ fontSize: "1.2rem", fontWeight: "bold", marginTop: "1rem" }}
        >
          Expected Cash in Drawer: Rs.{" "}
          {shiftMetrics.expectedInDrawer.toLocaleString()}
        </p>
      </div>
      <style>{`
        .print-only { display: none; }
        @media print {
          .screen-only { display: none; }
          .print-only { display: block; padding: 20px; font-family: sans-serif; }
        }
      `}</style>
    </div>
  );
};

export default ShiftManagement;
