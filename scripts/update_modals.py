import sys

with open("frontend/src/components/shared/ReservationDashboard.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update Modal Wrappers
content = content.replace('bg-slate-900/40 backdrop-blur-sm z-50', 'bg-slate-900/50 backdrop-blur-md z-[60]')
content = content.replace('bg-white rounded-2xl shadow-xl w-full max-w-md', 'bg-white rounded-[24px] shadow-2xl shadow-indigo-900/20 w-full max-w-lg border border-slate-100')
content = content.replace('bg-white rounded-2xl shadow-xl w-full max-w-sm', 'bg-white rounded-[24px] shadow-2xl shadow-rose-900/20 w-full max-w-sm border border-slate-100')

# 2. Update Modal Headers
content = content.replace('p-5 border-b border-slate-100 bg-white/5', 'p-6 border-b border-slate-100 bg-gradient-to-r from-indigo-50/50 to-white')

# 3. Update Inputs & Selects
content = content.replace('w-full border border-slate-100 bg-slate-50 focus:bg-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-all font-medium text-sm', 'w-full border-2 border-slate-100 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-sm text-slate-800 placeholder:text-slate-300')
content = content.replace('w-full border border-slate-100 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition-all font-medium text-sm resize-none', 'w-full border-2 border-slate-100 bg-slate-50 focus:bg-white rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-sm text-slate-800 resize-none placeholder:text-slate-300')

# 4. Update Labels
content = content.replace('block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5', 'block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2')

# 5. Buttons
content = content.replace('bg-white border border-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition', 'bg-white border-2 border-slate-200 text-slate-600 font-bold py-3.5 rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 transition-all')
content = content.replace('bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 shadow-md transition', 'bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all')
content = content.replace('bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 shadow-md transition', 'bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 transition-all')
content = content.replace('bg-rose-50 text-slate-900 font-bold py-3 rounded-xl hover:bg-rose-600 shadow-md shadow-rose-200 transition', 'bg-rose-500 text-white font-bold py-3.5 rounded-xl hover:bg-rose-600 shadow-lg shadow-rose-500/30 transition-all')

# 6. Icons in headers
content = content.replace('<CalendarPlus size={18} className="text-purple-500" /> New', '<div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600"><CalendarPlus size={16} /></div> New')

with open("frontend/src/components/shared/ReservationDashboard.jsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Modal styling updated successfully.")
