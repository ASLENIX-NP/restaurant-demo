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
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Poppins:wght@300;400;500;600&display=swap');

  :root {
  --bg-white: #ffffff;
  --bg-cream: #fff9f5;
  --text-brown: #2F4858;
  --text-brown-light: #4A6E8A;
  --border-brown: #2F4858; 
  --hover-taupe: #ffeadb;
  --accent-gold: #F37021;
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
  background-image: url('/logo.png');
  background-size: 140%;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.05; 
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
  padding: 1.2rem 5%;
  background-color: rgba(251, 249, 244, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(74, 47, 29, 0.15);
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
  }

  .nav-links a {
  text-decoration: none;
  color: var(--text-brown);
  font-weight: 500;
  font-size: 1.05rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding-bottom: 4px;
  border-bottom: 2px solid var(--accent-gold);
  transition: opacity 0.2s;
  }
  .nav-links a:hover {
  opacity: 0.7;
  }

  .menu-hero {
  text-align: center;
  padding: 4rem 2rem 2rem;
  }

  .menu-hero h1 {
  font-family: var(--font-body);
  font-weight: 800;
  font-size: 2.8rem;
  color: var(--text-brown);
  letter-spacing: 3px;
  text-transform: uppercase;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }

  .menu-container {
  max-width: 850px;
  margin: 0 auto 5rem;
  padding: 3.5rem;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(74, 47, 29, 0.08);
  border: 1px solid rgba(194, 155, 87, 0.15);
  }

  .menu-top-border {
  border-top: 3px solid var(--text-brown);
  margin-bottom: 5px;
  padding-top: 5px;
  border-bottom: 1px solid var(--text-brown);
  opacity: 0.8;
  }

  .accordion-section {
  border-bottom: 1px solid rgba(74, 47, 29, 0.15);
  }

  .accordion-header {
  width: 100%;
  background: none;
  border: none;
  padding: 1.8rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-heading);
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text-brown);
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  }

  .accordion-header:hover {
  color: var(--accent-gold);
  transform: translateX(4px);
  }

  .arrow {
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  stroke: var(--accent-gold);
  }

  .accordion-header.active .arrow {
  transform: rotate(180deg);
  }

  .accordion-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .menu-list {
  padding: 0.5rem 0 2rem 0;
  }

  .menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.2rem;
  padding: 1.5rem 1rem;
  border-bottom: 1px dashed rgba(194, 155, 87, 0.3);
  transition: all 0.3s ease;
  border-radius: 12px;
  margin: 0.2rem 0;
  }

  .menu-item:hover {
  background-color: var(--hover-taupe);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  }

  .menu-item:last-child {
  border-bottom: none;
  }

  .item-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  gap: 1.5rem;
  }

  .item-text-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  }

  .item-name {
  font-family: var(--font-heading);
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-brown);
  margin-bottom: 0.3rem;
  }
  
  .menu-item:hover .item-name {
  color: var(--accent-gold);
  }

  .item-price {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-brown);
  white-space: nowrap;
  background: rgba(194, 155, 87, 0.1);
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  transition: background 0.3s;
  }

  .menu-item:hover .item-price {
  background: var(--accent-gold);
  color: white;
  }

  .item-desc {
  display: block;
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--text-brown-light);
  font-weight: 300;
  line-height: 1.5;
  }

  .item-image {
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 12px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(74, 47, 29, 0.12);
  transition: transform 0.4s ease;
  }
  
  .menu-item:hover .item-image {
  transform: scale(1.05) rotate(2deg);
  }

  @media (max-width: 768px) {
  .menu-hero {
    padding: 2.5rem 1rem 1.5rem;
  }
  .menu-hero h1 {
    font-size: 1.8rem;
  }
  .menu-container {
  padding: 1.5rem;
  margin: 0 1rem 3rem 1rem;
  border-radius: 16px;
  }
  .accordion-header {
  font-size: 1.3rem;
  padding: 1.2rem 0;
  }
  .item-details {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 0.8rem;
  }
  .item-name {
  font-size: 1.15rem;
  }
  .item-price {
  font-size: 1.1rem;
  align-self: flex-start;
  }
  .menu-item {
    padding: 1.2rem 0.5rem;
  }
  .item-image {
    width: 75px;
    height: 75px;
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
 <img src="/logo.png" alt="Logo" style={{ height: "180px", margin: "0 auto 15px auto", display: "block" }} />
 <h1>मिठ्ठो चिया & Tiffin घर Menu</h1>
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
 <div className="item-details">
 <div className="item-text-container">
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
