import { useMemo, useState, useEffect, useRef } from"react";
import { useNavigate } from"react-router-dom";
import {
 AlarmClock,
 Bell,
 BellOff,
 CheckCircle2,
 ChefHat,
 ClipboardList,
 Flame,
 LogOut,
 Maximize2,
 PackageCheck,
 Salad,
 Timer,
 UtensilsCrossed,
} from"lucide-react";
import { useOrders } from "../../context/OrderContext";
import { useAuth } from"../../context/AuthContext";

const stationOptions = [
"All Stations",
"Hot Line",
"Cold Prep",
"Oven",
"Dessert",
];
const statusOptions = ["All","Pending","Cooking","Ready"];

const statusIcons = {
  Pending: Timer,
  Cooking: Flame,
  Ready: CheckCircle2,
};

const CountdownTimer = ({ timestamp, isAudioMuted, status }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [isWarning, setIsWarning] = useState(false);
  const audioPlayedRef = useRef(false);

  useEffect(() => {
    if (status === "Ready" || status === "Completed" || status === "Served") {
       setTimeLeft("00:00");
       return;
    }

    const targetTime = new Date(timestamp || Date.now()).getTime() + 15 * 60 * 1000;
    
    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = targetTime - now;

      if (diff <= 0) {
        setTimeLeft("00:00");
        setIsWarning(true);
        if (!audioPlayedRef.current && !isAudioMuted) {
          audioPlayedRef.current = true;
          // Play a loud beep for warning
          const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2868/2868-preview.mp3");
          audio.play().catch(e => console.log("Audio block", e));
        }
      } else {
        const m = Math.floor((diff / 1000 / 60) % 60);
        const s = Math.floor((diff / 1000) % 60);
        setTimeLeft(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      }
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);
    return () => clearInterval(intervalId);
  }, [timestamp, isAudioMuted, status]);

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-black tracking-widest ${isWarning ? 'bg-red-50 text-red-600 border-red-200 animate-pulse shadow-sm shadow-red-500/20' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
       <Timer size={12} className={isWarning ? 'animate-bounce' : ''} /> {timeLeft}
    </span>
  );
};

const Dashboard = () => {
 const [activeStation, setActiveStation] = useState("All Stations");
 const [statusFilter, setStatusFilter] = useState("All");
 const [isAudioMuted, setIsAudioMuted] = useState(false);
 const [isFullscreen, setIsFullscreen] = useState(false);
 const { orders, startCooking, markReady } = useOrders();
 const { logout } = useAuth();
 const navigate = useNavigate();
 const prevOrdersRef = useRef(orders);

 // Play notification sound when a new incoming order is detected
 useEffect(() => {
 const newOrder = orders.find(
 (order) =>
 order.status ==="Pending" &&
 !prevOrdersRef.current.find((o) => o.id === order.id)
 );

 if (newOrder && !isAudioMuted) {
 const audio = new Audio(
"https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"
 );
 audio.play().catch((err) => console.log("Audio play prevented:", err));
 }

 prevOrdersRef.current = orders;
 }, [orders, isAudioMuted]);

 const toggleFullscreen = () => {
 if (!document.fullscreenElement) {
 document.documentElement.requestFullscreen().catch(() => {});
 setIsFullscreen(true);
 return;
 }

 document.exitFullscreen();
 setIsFullscreen(false);
 };

 const handleLogout = () => {
 if (logout) logout();
 navigate("/login");
 };

 const metrics = useMemo(() => {
 const pending = orders.filter((order) => order.status ==="Pending").length;
 const cooking = orders.filter((order) => order.status ==="Cooking").length;
 const ready = orders.filter((order) => order.status ==="Ready").length;
 const delayed = orders.filter(
 (order) => (order.elapsedMinutes || 0) >= 15 && order.status !=="Ready"
 ).length;

 const prepMap = {};
 orders
 .filter((order) => order.status !=="Ready")
 .forEach((order) => {
 (order.items || []).forEach((item) => {
 prepMap[item.name] = (prepMap[item.name] || 0) + item.qty;
 });
 });

 return {
 totalActive: orders.filter(
 (o) => o.status !=="Completed" && o.status !=="Served"
 ).length,
 pending,
 cooking,
 ready,
 delayed,
 prepList: Object.entries(prepMap).map(([name, qty]) => ({ name, qty })),
 };
 }, [orders]);

 const filteredOrders = useMemo(() => {
 return orders
 .filter((order) => {
 if (order.status ==="Completed" || order.status ==="Served")
 return false;

 const stationMatches =
 activeStation ==="All Stations" ||
 order.station === activeStation ||
 (order.items || []).some((item) => item.station === activeStation);
 const statusMatches =
 statusFilter ==="All" || order.status === statusFilter;

 return stationMatches && statusMatches;
 })
 .sort((a, b) => {
 // Put oldest incoming active orders at the top of the queue (First In First Out)
 const timeA = new Date(a.timestamp || 0).getTime();
 const timeB = new Date(b.timestamp || 0).getTime();
 return timeA - timeB;
 });
 }, [activeStation, orders, statusFilter]);

 const dynamicCompletedHistory = useMemo(() => {
 return orders
 .filter((o) => o.status ==="Ready" || o.status ==="Served" || o.status ==="Completed")
 .map((o) => ({
 id: o.id,
 channel: o.channel || o.table ||"System",
 itemsCount: (o.items || []).reduce((sum, item) => sum + item.qty, 0),
 clearedAt: o.time || new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }),
 timestamp: o.timestamp
 }))
 .sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime())
 .slice(0, 5); // Show the 5 most recently finished orders
 }, [orders]);

 return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-slate-50 text-slate-900 font-sans transition-colors duration-300">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 p-5 sm:p-6 mb-6 bg-white border border-slate-200 shadow-sm rounded-2xl">
        <div className="flex flex-col">
          <span className="inline-flex items-center gap-2 text-indigo-600 text-xs font-black uppercase tracking-widest mb-2">
            <ChefHat size={16} /> Kitchen Display System
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none mb-1">Kitchen KDS Panel</h1>
          <p className="text-slate-500 text-sm font-medium">Live production board for line cooks, expo, and station prep.</p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
          <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.15)] animate-pulse" />
          <div>
            <span className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider">System Active</span>
            <strong className="block text-slate-900 text-sm font-black">
              {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </strong>
          </div>
        </div>
      </header>

      <section className="flex flex-col lg:flex-row items-center gap-4 p-3 mb-6 bg-white border border-slate-200 shadow-sm rounded-xl">
        <label className="flex items-center gap-3 text-slate-500 text-xs font-black uppercase tracking-wider w-full lg:w-auto px-2">
          Station
          <select
            value={activeStation}
            onChange={(event) => setActiveStation(event.target.value)}
            className="flex-1 lg:w-48 h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {stationOptions.map((station) => (
              <option key={station} value={station}>{station}</option>
            ))}
          </select>
        </label>

        <div className="flex bg-slate-100 p-1 rounded-lg w-full lg:w-auto overflow-x-auto">
          {statusOptions.map((status) => (
            <button
              key={status}
              type="button"
              className={`flex-1 lg:flex-none min-w-[80px] h-8 px-3 rounded-md text-xs font-black transition-all ${statusFilter === status ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto lg:ml-auto">
          <button
            className={`flex items-center justify-center gap-2 h-10 px-4 flex-1 lg:flex-none rounded-lg text-xs font-black transition-colors border ${isAudioMuted ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            type="button"
          >
            {isAudioMuted ? <BellOff size={15} /> : <Bell size={15} />}
            {isAudioMuted ? "Muted" : "Sound On"}
          </button>
          <button className="flex items-center justify-center gap-2 h-10 px-4 flex-1 lg:flex-none bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-black transition-colors" onClick={toggleFullscreen} type="button">
            <Maximize2 size={15} />
            {isFullscreen ? "Exit KDS" : "Fullscreen"}
          </button>
          <button className="flex items-center justify-center gap-2 h-10 px-4 flex-1 lg:flex-none bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 rounded-lg text-xs font-black transition-colors" onClick={handleLogout} type="button" title="Sign Out">
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </section>

 <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 mt-6">
 <button
 className={`rounded-xl p-6 border shadow-sm flex items-center gap-4 transition-all duration-300 text-left ${
 statusFilter ==="All"
 ?"border-blue-300 bg-blue-50 ring-4 ring-blue-100 scale-[1.02]"
 :"border-slate-100 bg-white hover:border-slate-200 hover:shadow-md hover:bg-slate-50"
 }`}
 type="button"
 onClick={() => setStatusFilter("All")}
 >
 <div
 className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
 statusFilter ==="All"
 ?"bg-blue-100 text-blue-600"
 :"bg-slate-100 text-slate-500"
 }`}
 >
 <ClipboardList size={22} />
 </div>
 <div>
 <h2 className="text-2xl font-black text-slate-900 leading-none">
 {metrics.totalActive}
 </h2>
 <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">
 Active Tickets
 </p>
 </div>
 </button>

 <button
 className={`rounded-xl p-6 border shadow-sm flex items-center gap-4 transition-all duration-300 text-left ${
 statusFilter ==="Pending"
 ?"border-slate-400 bg-slate-100 ring-4 ring-slate-200 scale-[1.02]"
 :"border-slate-100 bg-white hover:border-slate-200 hover:shadow-md hover:bg-slate-50"
 }`}
 type="button"
 onClick={() => setStatusFilter("Pending")}
 >
 <div
 className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
 statusFilter ==="Pending"
 ?"bg-slate-300 text-slate-700"
 :"bg-slate-100 text-slate-500"
 }`}
 >
 <Timer size={22} />
 </div>
 <div>
 <h2 className="text-2xl font-black text-slate-900 leading-none">
 {metrics.pending}
 </h2>
 <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">
 Incoming Queue
 </p>
 </div>
 </button>

 <button
 className={`rounded-xl p-6 border shadow-sm flex items-center gap-4 transition-all duration-300 text-left ${
 statusFilter ==="Cooking"
 ?"border-orange-300 bg-orange-50 ring-4 ring-orange-100 scale-[1.02]"
 :"border-slate-100 bg-white hover:border-slate-200 hover:shadow-md hover:bg-slate-50"
 }`}
 type="button"
 onClick={() => setStatusFilter("Cooking")}
 >
 <div
 className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
 statusFilter ==="Cooking"
 ?"bg-orange-100 text-orange-600"
 :"bg-orange-50 text-orange-400"
 }`}
 >
 <Flame size={22} />
 </div>
 <div>
 <h2 className="text-2xl font-black text-slate-900 leading-none">
 {metrics.cooking}
 </h2>
 <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">
 On Range/Grill
 </p>
 </div>
 </button>

 <button
 className={`rounded-xl p-6 border shadow-sm flex items-center gap-4 transition-all duration-300 text-left ${
 statusFilter ==="Ready"
 ?"border-emerald-300 bg-emerald-50 ring-4 ring-emerald-100 scale-[1.02]"
 :"border-slate-100 bg-white hover:border-slate-200 hover:shadow-md hover:bg-slate-50"
 }`}
 type="button"
 onClick={() => setStatusFilter("Ready")}
 >
 <div
 className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
 statusFilter ==="Ready"
 ?"bg-emerald-100 text-emerald-600"
 :"bg-emerald-50 text-emerald-500"
 }`}
 >
 <PackageCheck size={22} />
 </div>
 <div>
 <h2 className="text-2xl font-black text-slate-900 leading-none">
 {metrics.ready}
 </h2>
 <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">
 Ready / Takeaway
 </p>
 </div>
 </button>
 </section>

      <main className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm min-h-[520px] p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 mb-6 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Live Production Board ({filteredOrders.length})</h2>
              <p className="text-sm font-semibold text-slate-500 mt-1">{activeStation} production queue</p>
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap bg-slate-50 px-2 py-1 rounded-md h-fit">Auto-update: just now</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {filteredOrders.map((order) => {
              const StatusIcon = statusIcons[order.status];
              const isDelayed = (order.elapsedMinutes || 0) >= 15;
              const isCritical = order.priority?.toLowerCase() === "critical" || isDelayed;
              const isHigh = order.priority?.toLowerCase() === "high";
              
              let borderCol = "border-indigo-500";
              let shadowPulse = "";
              if (isCritical) {
                borderCol = "border-red-500";
                shadowPulse = "animate-[pulse_2s_infinite] shadow-[0_0_15px_rgba(239,68,68,0.2)]";
              } else if (isHigh) borderCol = "border-orange-500";
              else if (order.status === "Ready") borderCol = "border-emerald-500";

              return (
                <article
                  key={order.id}
                  className={`flex flex-col p-4 bg-white border border-slate-200 border-l-[6px] ${borderCol} rounded-xl shadow-sm ${shadowPulse} transition-all duration-300 hover:shadow-md`}
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <span className="block text-lg font-black text-slate-900 leading-none">{order.id}</span>
                      <span className="block text-xs font-black text-slate-500 mt-1.5">{order.channel || "System"} - {order.table || "Queue"}</span>
                      <span className="block text-[10px] font-bold text-slate-400 mt-0.5">Server: {order.server || "System"}</span>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                          order.status === "Pending" ? "bg-orange-50 text-orange-700" :
                          order.status === "Cooking" ? "bg-indigo-50 text-indigo-700" :
                          "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {StatusIcon && <StatusIcon size={12} />}
                        {order.status}
                      </span>
                      {(order.status === "Pending" || order.status === "Cooking") && (
                        <CountdownTimer timestamp={order.timestamp} isAudioMuted={isAudioMuted} status={order.status} />
                      )}
                    </div>
                  </div>

                  <ul className="flex flex-col gap-2 mb-4 flex-1">
                    {(order.items || []).map((item) => (
                      <li key={`${order.id}-${item.name}`} className="flex items-center gap-3 py-2 border-b border-slate-100 border-dashed last:border-0">
                        <span className="flex-none min-w-[32px] h-7 inline-flex items-center justify-center rounded-md bg-indigo-50 text-indigo-600 text-sm font-black">{item.qty}x</span>
                        <div>
                          <span className="block text-sm font-black text-slate-800 leading-tight">{item.name}</span>
                          <span className="block text-[10px] font-bold text-slate-400 mt-0.5">{item.category} - {item.station}</span>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {order.notes && (
                    <div className="flex items-start gap-2 mt-2 mb-4 p-2.5 bg-red-50 border border-red-100 rounded-lg text-red-700 text-xs font-bold">
                      <AlarmClock size={14} className="flex-none mt-0.5" />
                      <span><strong>Mod Notes:</strong> {order.notes}</span>
                    </div>
                  )}

                  <div className="mt-auto">
                    {order.status === "Pending" && (
                      <button
                        className="w-full h-11 inline-flex items-center justify-center gap-2 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-lg text-sm font-black shadow-lg shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all"
                        type="button"
                        onClick={() => startCooking(order.id)}
                      >
                        <Flame size={16} /> Start Cooking
                      </button>
                    )}

                    {order.status === "Cooking" && (
                      <button
                        className="w-full h-11 inline-flex items-center justify-center gap-2 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-black shadow-lg shadow-emerald-500/30 hover:scale-[1.02] active:scale-95 transition-all"
                        type="button"
                        onClick={() => markReady(order.id)}
                      >
                        <CheckCircle2 size={16} /> Mark Ready
                      </button>
                    )}

                    {order.status === "Ready" && (
                      <div className="w-full h-11 inline-flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm font-black">
                        <PackageCheck size={16} /> Ready for expo pickup
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-4 border-t border-slate-100">
                    <div className={`inline-flex items-center gap-1.5 text-xs font-black ${isDelayed ? "text-red-500 animate-[pulse_1s_infinite]" : "text-emerald-500"}`}>
                      <Timer size={14} /> {order.elapsedMinutes || 0} mins
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">Placed {order.time}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="flex flex-col gap-5">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-1.5">
              <UtensilsCrossed size={18} className="text-indigo-500" />
              <h3 className="text-sm font-black text-slate-900">Station Load</h3>
            </div>
            <div className="h-2.5 overflow-hidden my-4 bg-slate-100 rounded-full">
              <span
                className="block h-full bg-gradient-to-r from-emerald-400 via-orange-400 to-red-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(metrics.totalActive * 18, 100)}%` }}
              />
            </div>
            <div className="flex items-baseline gap-2">
              <strong className="text-2xl font-black text-red-500">{metrics.delayed}</strong>
              <span className="text-xs font-bold text-slate-500">tickets need attention</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-1">
              <Salad size={18} className="text-indigo-500" />
              <h3 className="text-sm font-black text-slate-900">Total Master Prep</h3>
            </div>
            <p className="text-[11px] font-bold text-slate-400 mb-4">Quantities required for active batches</p>
            <div className="flex flex-col gap-2">
              {metrics.prepList.map((item) => (
                <div className="flex items-center gap-3 p-2.5 bg-slate-50 border border-slate-100 rounded-lg" key={item.name}>
                  <span className="min-w-[28px] text-orange-600 text-base font-black">{item.qty}</span>
                  <span className="text-slate-800 text-xs font-black">{item.name}</span>
                </div>
              ))}
              {metrics.prepList.length === 0 && (
                <p className="text-center text-xs font-bold text-slate-400 py-4 opacity-70">No prep required currently</p>
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
            <h3 className="text-sm font-black text-slate-900 mb-4">Passed to Waitstaff Feed</h3>
            <div className="flex flex-col gap-2">
              {dynamicCompletedHistory.map((historyItem) => (
                <div className="flex items-center justify-between gap-3 py-2 border-b border-slate-100 last:border-0" key={historyItem.id}>
                  <div>
                    <span className="block text-xs font-black text-slate-800">{historyItem.id}</span>
                    <span className="block text-[10px] font-bold text-slate-400 mt-0.5">{historyItem.channel} - {historyItem.itemsCount} items</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-500">
                    <span className="text-[10px] font-bold">{historyItem.clearedAt}</span>
                    <CheckCircle2 size={14} />
                  </div>
                </div>
              ))}
              {dynamicCompletedHistory.length === 0 && (
                <p className="text-center text-xs font-bold text-slate-400 py-4 opacity-70">No completed orders yet</p>
              )}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Dashboard;
