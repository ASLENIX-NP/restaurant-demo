import React, { useEffect, useState } from"react";
import { useParams, useNavigate } from"react-router-dom";
import { useOrders } from"../../context/OrderContext";
import { Printer, ArrowLeft } from"lucide-react";
import { QRCodeSVG } from "qrcode.react";

const InvoicePrinting = () => {
 const { orderId } = useParams();
 const navigate = useNavigate();
 const { orders = [], fetchOrders } = useOrders() || {};
 const [order, setOrder] = useState(null);

 useEffect(() => {
 if (fetchOrders && orders.length === 0) fetchOrders();
 }, [fetchOrders, orders.length]);

 useEffect(() => {
 if (orders.length > 0) {
 const found = orders.find(o => String(o.id) === String(orderId) || String(o._id) === String(orderId));
 setOrder(found);
 }
 }, [orders, orderId]);

 if (!order) {
 return (
 <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 font-sans">
 <div className="p-8 text-center text-slate-500 font-bold bg-white rounded-xl shadow-sm animate-pulse border border-slate-100">
 Loading invoice details...
 </div>
 </div>
 );
 }

 const subtotal = (order.items || []).reduce((acc, item) => acc + (item.qty * (parseFloat(item.price) || 0)), 0);
 const discount = parseFloat(order.discountAmount || 0);
 const serviceCharge = parseFloat(order.serviceCharge || 0);
 const finalTotal = subtotal - discount + serviceCharge;

 return (
 <div className="min-h-screen bg-slate-50 flex items-start justify-center p-8 font-sans">
 <style>{`
    @media print {
      @page {
        margin: 0;
        size: 80mm auto;
      }
      body, html {
        margin: 0;
        padding: 0;
        width: 80mm;
        background: #fff !important;
      }
      * {
        font-family: "Courier New", monospace !important;
        color: #000 !important;
      }
      .print\\:hidden { display: none !important; }
      #invoice-container {
        width: 80mm !important;
        padding: 5mm !important;
        margin: 0 !important;
        border: none !important;
        box-shadow: none !important;
      }
      /* Hide the outer wrapper padding/bg when printing */
      .bg-slate-50 { background: #fff !important; }
    }
  `}</style>
 <div className="max-w-md w-full">
 {/* Actions (Hidden on print) */}
 <div className="flex justify-between items-center mb-6 print:hidden">
 <button 
 onClick={() => navigate(-1)}
 className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-semibold transition"
 >
 <ArrowLeft size={18} /> Back
 </button>
 <button 
 onClick={() => window.print()}
 className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm hover:bg-slate-800 transition"
 >
 <Printer size={18} /> Print Invoice
 </button>
 </div>

 {/* Printable Receipt Area */}
 <div id="invoice-container" className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-slate-800 print:shadow-none print:border-none print:p-0 mx-auto" style={{ maxWidth:'400px' }}>
 <div className="text-center border-b border-slate-200 border-dashed pb-6 mb-6">
 <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">मिठ्ठो चिया & Tiffin घर</h1>
 <p className="text-slate-500 text-sm mt-1 font-medium">123 Culinary Avenue, Food City</p>
 <p className="text-slate-500 text-sm font-medium">Tel: +977-9800000000</p>
 </div>

 <div className="flex justify-between text-sm mb-6 font-semibold">
 <div>
 <p className="text-slate-500 mb-1 text-xs uppercase tracking-wider">Order ID</p>
 <p className="text-slate-900">{order.id}</p>
 </div>
 <div className="text-right">
 <p className="text-slate-500 mb-1 text-xs uppercase tracking-wider">Date</p>
 <p className="text-slate-900">{order.date || new Date().toLocaleDateString()}</p>
 </div>
 </div>

 <div className="flex justify-between text-sm mb-6 font-semibold bg-slate-50 p-3 rounded-lg print:bg-transparent print:p-0 print:border-y print:border-slate-200 print:border-dashed print:rounded-none print:py-2">
 <div>
 <span className="text-slate-500">Table:</span> <span className="text-slate-900 ml-1">{order.table ||"Walk-in"}</span>
 </div>
 <div>
 <span className="text-slate-500">Type:</span> <span className="text-slate-900 ml-1">{order.channel ||"Dine In"}</span>
 </div>
 </div>

 <div className="flex flex-col gap-1 text-xs mb-6 font-semibold bg-slate-50 p-3 rounded-lg print:bg-transparent print:p-0 print:border-b print:border-slate-200 print:border-dashed print:rounded-none print:pb-2">
  <div className="flex justify-between">
    <span className="text-slate-500">Cashier:</span>
    <span className="text-slate-900">{order.cashier || "System"}</span>
  </div>
  <div className="flex justify-between">
    <span className="text-slate-500">Server:</span>
    <span className="text-slate-900">{order.server || "System"}</span>
  </div>
  <div className="flex justify-between">
    <span className="text-slate-500">Chef:</span>
    <span className="text-slate-900">{order.chef || "System"}</span>
  </div>
 </div>

 <table className="w-full text-sm mb-6">
 <thead>
 <tr className="border-b border-slate-200 border-dashed">
 <th className="text-left py-2 font-bold text-slate-500 uppercase tracking-wider text-xs">Item</th>
 <th className="text-center py-2 font-bold text-slate-500 uppercase tracking-wider text-xs">Qty</th>
 <th className="text-right py-2 font-bold text-slate-500 uppercase tracking-wider text-xs">Total</th>
 </tr>
 </thead>
 <tbody className="font-medium text-slate-700">
 {(order.items || []).map((item, idx) => (
 <tr key={idx} className="border-b border-slate-50 border-dashed last:border-0 print:border-transparent">
 <td className="py-2.5 pr-2">{item.name}</td>
 <td className="py-2.5 text-center text-slate-500">{item.qty}</td>
 <td className="py-2.5 text-right font-semibold">Rs. {(item.qty * parseFloat(item.price || 0)).toFixed(2)}</td>
 </tr>
 ))}
 </tbody>
 </table>

 <div className="space-y-2 border-t border-slate-200 border-dashed pt-4 mb-6">
 <div className="flex justify-between text-sm font-bold text-slate-600">
 <span>Subtotal</span>
 <span>Rs. {subtotal.toFixed(2)}</span>
 </div>
 {serviceCharge > 0 && (
 <div className="flex justify-between text-sm font-bold text-slate-600">
 <span>Service Charge</span>
 <span>Rs. {serviceCharge.toFixed(2)}</span>
 </div>
 )}
 {discount > 0 && (
 <div className="flex justify-between text-sm font-bold text-emerald-600">
 <span>Discount</span>
 <span>- Rs. {discount.toFixed(2)}</span>
 </div>
 )}
 </div>

 <div className="flex justify-between text-xl font-black text-slate-900 border-t border-slate-200 border-dashed pt-4 mb-8">
 <span>Total</span>
 <span>Rs. {finalTotal.toFixed(2)}</span>
 </div>

 <div className="text-center text-sm font-semibold text-slate-500 mb-6">
 <p>Thank you for dining with us!</p>
 <p className="text-[10px] mt-1 text-slate-400 uppercase tracking-widest font-bold">Please visit again</p>
 </div>

 <div className="flex justify-center mt-6">
    <QRCodeSVG 
      value={JSON.stringify({ id: order.id, total: finalTotal, table: order.table })} 
      size={100}
      level="L"
    />
  </div>
 </div>
 </div>
 </div>
 );
};

export default InvoicePrinting;
