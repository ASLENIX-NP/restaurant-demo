import React, { useEffect, useState } from"react";
import { io } from"socket.io-client";
import apiClient from"../api/apiClient";

export default function CustomerMenu() {
 const [menuItems, setMenuItems] = useState([]);

 const loadProducts = async () => {
 try {
 const { data } = await apiClient.get("/api/menu");
 setMenuItems(Array.isArray(data) ? data : (data?.items || []));
 } catch (error) {
 console.error("Error fetching menu:", error);
 }
 };

 useEffect(() => {
 loadProducts();

 const socket = io(import.meta.env.VITE_API_URL ||"http://localhost:5001");
 socket.on("menuUpdated", loadProducts);

 return () => socket.disconnect();
 }, []);

 useEffect(() => {
 const headers = document.querySelectorAll(".accordion-header");

 const handleClick = function () {
 const accordionContent = this.nextElementSibling;
 const isOpen =
 accordionContent.style.maxHeight !=="0px" &&
 accordionContent.style.maxHeight !=="";

 document.querySelectorAll(".accordion-content").forEach((content) => {
 content.style.maxHeight ="0px";
 });

 document.querySelectorAll(".accordion-header").forEach((btn) => {
 btn.classList.remove("active");
 });

 if (!isOpen) {
 accordionContent.style.maxHeight = accordionContent.scrollHeight +"px";
 this.classList.add("active");
 }
 };

 headers.forEach((button) => {
 button.addEventListener("click", handleClick);
 });

 // Cleanup event listeners on unmount
 return () => {
 headers.forEach((button) => {
 button.removeEventListener("click", handleClick);
 });
 };
 }, [menuItems]);

 // Group and Filter Items
 const visibleItems = menuItems.filter((item) => item.isAvailable !== false);

 const categoriesMap = visibleItems.reduce((acc, item) => {
 const cat = (item.category ||"OTHER").toUpperCase();
 if (!acc[cat]) acc[cat] = [];
 acc[cat].push(item);
 return acc;
 }, {});

 const specialItems = visibleItems.filter((item) => item.isSpecial);
 if (specialItems.length > 0) {
 categoriesMap["OUR SPECIAL"] = specialItems;
 }

 const categoriesList = Object.keys(categoriesMap).sort((a, b) => {
 if (a ==="OUR SPECIAL") return -1;
 if (b ==="OUR SPECIAL") return 1;
 return a.localeCompare(b);
 });

 return (
 <div className="chiya-menu-page">
 <style>
 {`
 @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Poppins:wght@400;500;600&display=swap');

 :root {
 --bg-white: #ffffff;
 --bg-cream: #fdfbf7;
 --text-brown: #3a2210;
 --border-brown: #3a2210; 
 --hover-taupe: #f7f3eb;
 --accent-gold: #bfa15f;
 --font-heading:'Playfair Display', serif;
 --font-body:'Poppins', sans-serif;
 }

 .chiya-menu-page {
 background-color: var(--bg-cream);
 color: var(--text-brown);
 font-family: var(--font-body);
 position: relative;
 min-height: 100vh;
 overflow-x: hidden;
 }

 .chiya-menu-page::before {
 content:"";
 position: fixed;
 top: 0;
 left: 0;
 width: 100%;
 height: 100%;
 background-image: url('https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1920&q=80');
 background-size: cover;
 background-position: center;
 background-repeat: no-repeat;
 opacity: 0.18; 
 z-index: 0;
 pointer-events: none;
 }

 .menu-content-wrapper {
 position: relative;
 z-index: 1;
 }

 .top-nav {
 display: flex;
 justify-content: center;
 padding: 1.5rem 5%;
 background-color: rgba(253, 251, 247, 0.92);
 backdrop-filter: blur(10px);
 border-bottom: 1px solid rgba(58, 34, 16, 0.2);
 }

 .nav-links a {
 text-decoration: none;
 color: var(--text-brown);
 font-weight: 500;
 font-size: 1.1rem;
 padding-bottom: 5px;
 border-bottom: 2px solid var(--text-brown);
 }

 .menu-hero {
 text-align: center;
 padding: 3rem 2rem 1rem;
 }

 .menu-hero h1 {
 font-family: var(--font-heading);
 font-size: 3rem;
 color: var(--text-brown);
 letter-spacing: 2px;
 text-transform: uppercase;
 margin: 0;
 }

 .menu-container {
 max-width: 900px;
 margin: 0 auto 4rem;
 padding: 3rem;
 background-color: rgba(255, 255, 255, 0.85);
 backdrop-filter: blur(12px);
 border-radius: 12px;
 box-shadow: 0 10px 30px rgba(58, 34, 16, 0.05);
 }

 .menu-top-border {
 border-top: 2px solid var(--border-brown);
 margin-bottom: 5px;
 padding-top: 5px;
 border-bottom: 1px solid var(--border-brown);
 }

 .accordion-section {
 border-bottom: 2px solid var(--border-brown);
 }

 .accordion-header {
 width: 100%;
 background: none;
 border: none;
 padding: 1.5rem 0;
 display: flex;
 justify-content: space-between;
 align-items: center;
 font-family: var(--font-heading);
 font-size: 1.5rem;
 font-weight: 700;
 color: var(--text-brown);
 letter-spacing: 2px;
 cursor: pointer;
 transition: background-color 0.3s ease;
 text-align: left;
 }

 .accordion-header:hover {
 color: var(--accent-gold);
 }

 .arrow {
 transition: transform 0.4s ease;
 }

 .accordion-header.active .arrow {
 transform: rotate(180deg);
 }

 .accordion-content {
 max-height: 0;
 overflow: hidden;
 transition: max-height 0.5s cubic-bezier(0.16, 1, 0.3, 1);
 }

 .menu-list {
 padding: 0.5rem 0 2rem 0;
 }

 .menu-item {
 display: flex;
 justify-content: space-between;
 align-items: center;
 gap: 1rem;
 padding: 1rem 0;
 border-bottom: 1px dotted rgba(58, 34, 16, 0.3);
 }

 .menu-item:last-child {
 border-bottom: none;
 }

 .item-details {
 display: flex;
 justify-content: space-between;
 align-items: baseline;
 flex: 1;
 gap: 1rem;
 }

 .item-name {
 font-family: var(--font-heading);
 font-size: 1.25rem;
 font-weight: 700;
 color: var(--text-brown);
 flex: 1;
 }

 .item-price {
 font-family: var(--font-heading);
 font-size: 1.2rem;
 font-weight: 700;
 color: var(--accent-gold);
 white-space: nowrap;
 }

 .item-desc {
 display: block;
 font-family: var(--font-body);
 font-size: 0.9rem;
 color: #666;
 margin-top: 0.2rem;
 font-weight: 400;
 }

 .item-image {
 width: 80px;
 height: 80px;
 object-fit: cover;
 border-radius: 8px;
 flex-shrink: 0;
 box-shadow: 0 2px 8px rgba(58, 34, 16, 0.15);
 }

 @media (max-width: 768px) {
 .menu-container {
 padding: 1.5rem;
 margin: 0 1rem 3rem 1rem;
 }
 .accordion-header {
 font-size: 1.25rem;
 }
 .item-name {
 font-size: 1.1rem;
 }
 .item-price {
 font-size: 1.05rem;
 }
 }
 `}
 </style>

 <div className="menu-content-wrapper">
 <nav className="top-nav">
 <div className="nav-links">
 <a href="#menu" className="active">
 Menu
 </a>
 </div>
 </nav>

 <section className="menu-hero">
 <h1>Food Menu</h1>
 </section>

 <div className="menu-container">
 <div className="menu-top-border"></div>

 {categoriesList.length === 0 ? (
 <div
 style={{
 textAlign:"center",
 padding:"3rem 1rem",
 color:"#666",
 }}
 >
 <p>Menu is currently being updated. Please check back soon!</p>
 </div>
 ) : (
 categoriesList.map((cat) => (
 <div className="accordion-section" key={cat}>
 <button className="accordion-header">
 {cat}
 <svg
 className="arrow"
 width="20"
 height="20"
 viewBox="0 0 24 24"
 fill="none"
 stroke="currentColor"
 strokeWidth="2"
 strokeLinecap="round"
 strokeLinejoin="round"
 >
 <polyline points="9 18 15 12 9 6" />
 </svg>
 </button>
 <div className="accordion-content">
 <div className="menu-list">
 {categoriesMap[cat].map((item, idx) => (
 <div
 className="menu-item"
 key={item._id || item.id || idx}
 >
 {item.image && (
 <img
 src={item.image}
 alt={item.name}
 className="item-image"
 />
 )}
 <div
 className="item-details"
 style={{ alignItems:"center" }}
 >
 <div
 style={{
 display:"flex",
 flexDirection:"column",
 flex: 1,
 }}
 >
 <span className="item-name">{item.name}</span>
 {item.description && (
 <span className="item-desc">
 {item.description}
 </span>
 )}
 </div>
 {item.price && (
 <span className="item-price">Rs. {item.price}</span>
 )}
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 ))
 )}
 </div>
 </div>
 </div>
 );
}
