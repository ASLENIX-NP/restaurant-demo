import sys

with open("frontend/src/pages/cashier/SalesHistory.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Header
content = content.replace('<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">', '<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 print:hidden">')

# 2. View Switcher Tabs
content = content.replace('<div className="flex gap-2 mb-8 mt-6 overflow-x-auto scrollbar-hide">', '<div className="flex gap-2 mb-8 mt-6 overflow-x-auto scrollbar-hide print:hidden">')

# 3. Metrics Cards
content = content.replace('<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">', '<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 print:hidden">')

# 4. Search and Filter Bar
content = content.replace('<div className="p-5 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center bg-slate-50/50">', '<div className="p-5 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center bg-slate-50/50 print:hidden">')

# 5. Right column (Charts)
content = content.replace('<div className="w-full xl:w-[340px] shrink-0 flex flex-col gap-6">', '<div className="w-full xl:w-[340px] shrink-0 flex flex-col gap-6 print:hidden">')

# 6. Load More Button area
content = content.replace('<div className="p-4 border-t border-slate-100 bg-slate-50/50">', '<div className="p-4 border-t border-slate-100 bg-slate-50/50 print:hidden">')

with open("frontend/src/pages/cashier/SalesHistory.jsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Added print:hidden to extraneous UI elements.")
