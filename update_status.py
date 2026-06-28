import sys

with open("frontend/src/components/shared/ReservationDashboard.jsx", "r", encoding="utf-8") as f:
    content = f.read()

target_block = """ <div className="pt-2">
 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
 Update Status
 </label>
 {(role ==="cashier" || role ==="admin") && (
 <div className="flex gap-2">
 <button
 onClick={() =>
 handleStatusChange(selectedReservation.id,"Confirmed")
 }
 className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${
 selectedReservation.status ==="Confirmed"
 ?"bg-emerald-50 text-slate-900 border-emerald-600 shadow-md"
 :"bg-white text-slate-600 border-slate-100 hover:bg-emerald-50"
 }`}
 >
 Confirm
 </button>
 <button
 onClick={() =>
 handleStatusChange(selectedReservation.id,"Pending")
 }
 className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${
 selectedReservation.status ==="Pending"
 ?"bg-amber-50 text-slate-900 border-amber-600 shadow-md"
 :"bg-white text-slate-600 border-slate-100 hover:bg-amber-50"
 }`}
 >
 Pending
 </button>
 <button
 onClick={() =>
 handleStatusChange(selectedReservation.id,"VIP")
 }
 className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all border ${
 selectedReservation.status ==="VIP"
 ?"bg-purple-50 text-slate-900 border-purple-600 shadow-md"
 :"bg-white text-slate-600 border-slate-100 hover:bg-purple-50"
 }`}
 >
 VIP
 </button>
 </div>
 )}
 {selectedReservation.status !=="Completed" && selectedReservation.status !=="Cancelled" && (
 <div className="flex gap-2 mt-2">
 <button
 onClick={() =>
 handleStatusChange(selectedReservation.id,"Completed")
 }
 className="flex-1 py-2 rounded-lg text-xs font-bold transition-all border bg-emerald-50 text-slate-900 border-emerald-600 hover:bg-emerald-600 shadow-md"
 >
 Complete
 </button>
 <button
 onClick={() =>
 handleStatusChange(selectedReservation.id,"Cancelled")
 }
 className="flex-1 py-2 rounded-lg text-xs font-bold transition-all border bg-rose-50 text-slate-900 border-rose-600 hover:bg-rose-600 shadow-md"
 >
 Cancel
 </button>
 </div>
 )}
 </div>"""

replacement_block = """ <div className="pt-2">
 <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-3">
 Quick Actions
 </label>
 {(role ==="cashier" || role ==="admin") && (
 <div className="flex gap-2">
 <button
 onClick={() => handleStatusChange(selectedReservation.id || selectedReservation._id, "Confirmed")}
 className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl text-[11px] font-bold transition-all border shadow-sm ${
 selectedReservation.status ==="Confirmed"
 ?"bg-emerald-500 text-white border-emerald-600 shadow-emerald-500/30 scale-[1.02]"
 :"bg-white text-slate-600 border-slate-200 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600"
 }`}
 >
 <CheckCircle2 size={16} className="mb-1" /> Confirm
 </button>
 <button
 onClick={() => handleStatusChange(selectedReservation.id || selectedReservation._id, "Pending")}
 className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl text-[11px] font-bold transition-all border shadow-sm ${
 selectedReservation.status ==="Pending"
 ?"bg-amber-500 text-white border-amber-600 shadow-amber-500/30 scale-[1.02]"
 :"bg-white text-slate-600 border-slate-200 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-600"
 }`}
 >
 <Hourglass size={16} className="mb-1" /> Pending
 </button>
 <button
 onClick={() => handleStatusChange(selectedReservation.id || selectedReservation._id, "VIP")}
 className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl text-[11px] font-bold transition-all border shadow-sm ${
 selectedReservation.status ==="VIP"
 ?"bg-indigo-500 text-white border-indigo-600 shadow-indigo-500/30 scale-[1.02]"
 :"bg-white text-slate-600 border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600"
 }`}
 >
 <Star size={16} className="mb-1" /> VIP
 </button>
 </div>
 )}
 {selectedReservation.status !=="Completed" && selectedReservation.status !=="Cancelled" && (
 <div className="flex gap-2 mt-3">
 <button
 onClick={() => handleStatusChange(selectedReservation.id || selectedReservation._id, "Completed")}
 className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all border bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 shadow-sm"
 >
 <CheckCircle2 size={14} /> Mark Complete
 </button>
 <button
 onClick={() => handleStatusChange(selectedReservation.id || selectedReservation._id, "Cancelled")}
 className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all border bg-white text-rose-600 border-rose-200 hover:bg-rose-50 hover:border-rose-300 shadow-sm"
 >
 <X size={14} /> Cancel Booking
 </button>
 </div>
 )}
 </div>"""

if target_block in content:
    content = content.replace(target_block, replacement_block)
    with open("frontend/src/components/shared/ReservationDashboard.jsx", "w", encoding="utf-8") as f:
        f.write(content)
    print("Success")
else:
    print("Target block not found. Trying flexible replacement.")
    # More flexible replacement in case of whitespace issues
    content_lines = content.splitlines()
    start_idx = -1
    end_idx = -1
    for i, line in enumerate(content_lines):
        if '<label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">' in line and 'Update Status' in content_lines[i+1]:
            start_idx = i - 1
            break
    
    if start_idx != -1:
        # find the end of the div
        div_count = 0
        for i in range(start_idx, len(content_lines)):
            if '<div className="pt-2">' in content_lines[i] or (i == start_idx):
                div_count += 1
            if '<div ' in content_lines[i] and 'className="pt-2"' not in content_lines[i]:
                div_count += content_lines[i].count('<div')
            div_count -= content_lines[i].count('</div')
            
            if div_count == 0 and '</div>' in content_lines[i]:
                end_idx = i
                break
                
        if end_idx != -1:
            new_content = '\n'.join(content_lines[:start_idx]) + '\n' + replacement_block + '\n' + '\n'.join(content_lines[end_idx+1:])
            with open("frontend/src/components/shared/ReservationDashboard.jsx", "w", encoding="utf-8") as f:
                f.write(new_content)
            print("Success via flexible replacement")
        else:
            print("End idx not found")
    else:
        print("Start idx not found")
