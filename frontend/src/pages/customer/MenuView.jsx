import { useState } from "react";

import {
  useParams,
} from "react-router-dom";

import "../../styles/menuview.css";

const menuSections = [

  /* MOMO */

  {
    title: "Momo",

    categories: [

      {
        type: "Chicken",
        available: true,

        items: [

          {
            name:
              "Chicken Steam Momo",

            price: 320,

            image:
              "https://images.pexels.com/photos/7363686/pexels-photo-7363686.jpeg",
          },

          {
            name:
              "Chicken Fry Momo",

            price: 380,

            image:
              "https://images.pexels.com/photos/6646037/pexels-photo-6646037.jpeg",
          },

          {
            name:
              "Chicken Kothey Momo",

            price: 420,

            image:
              "https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg",
          },

        ],
      },

      {
        type: "Buff",
        available: true,

        items: [

          {
            name:
              "Buff Steam Momo",

            price: 300,

            image:
              "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg",
          },

          {
            name:
              "Buff Sadeko Momo",

            price: 450,

            image:
              "https://images.pexels.com/photos/6646043/pexels-photo-6646043.jpeg",
          },

        ],
      },

      {
        type: "Pork",
        available: false,

        items: [],
      },

    ],
  },

  /* PIZZA */

  {
    title: "Pizza",

    categories: [

      {
        type: "Chicken",
        available: true,

        items: [

          {
            name:
              "Chicken Cheese Pizza",

            price: 950,

            image:
              "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop",
          },

          {
            name:
              "Chicken BBQ Pizza",

            price: 1100,

            image:
              "https://images.unsplash.com/photo-1594007654729-407eedc4be65?q=80&w=1200&auto=format&fit=crop",
          },

        ],
      },

      {
        type: "Veg",
        available: true,

        items: [

          {
            name:
              "Veg Loaded Pizza",

            price: 850,

            image:
              "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?q=80&w=1200&auto=format&fit=crop",
          },

        ],
      },

    ],
  },

  /* BURGER */

  {
    title: "Burger",

    categories: [

      {
        type: "Chicken",
        available: true,

        items: [

          {
            name:
              "Chicken Crispy Burger",

            price: 450,

            image:
              "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop",
          },

        ],
      },

      {
        type: "Buff",
        available: true,

        items: [

          {
            name:
              "Buff Grill Burger",

            price: 480,

            image:
              "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop",
          },

        ],
      },

      {
        type: "Veg",
        available: false,

        items: [],
      },

    ],
  },

  /* DRINKS */

  {
    title: "Drinks",

    categories: [

      {
        type: "Cold",
        available: true,

        items: [

          {
            name:
              "Cold Coffee",

            price: 250,

            image:
              "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1200&auto=format&fit=crop",
          },

          {
            name:
              "Coke",

            price: 120,

            image:
              "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?q=80&w=1200&auto=format&fit=crop",
          },

        ],
      },

      {
        type: "Hot",
        available: true,

        items: [

          {
            name:
              "Hot Coffee",

            price: 180,

            image:
              "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop",
          },

          {
            name:
              "Black Tea",

            price: 90,

            image:
              "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=1200&auto=format&fit=crop",
          },

        ],
      },

    ],
  },

];

const MenuView = () => {

  const { tableId } =
    useParams();

  const [
    selectedCategories,
    setSelectedCategories,
  ] = useState({

    Momo: "Chicken",

    Pizza: "Chicken",

    Burger: "Chicken",

    Drinks: "Cold",
  });

  // CATEGORY CHANGE

  const handleCategoryChange =
    (
      sectionTitle,
      category
    ) => {

      setSelectedCategories(
        (prev) => ({

          ...prev,

          [sectionTitle]:
            category,
        })
      );
    };

  return (

    <div className="menu-view-page">

      {/* HEADER */}

      <div className="menu-header">

        <h1>
          ASLENIX Restaurant
        </h1>

        <p>
          Table {tableId}
        </p>

      </div>

      {/* MENU */}

      {menuSections.map(
        (
          section,
          sectionIndex
        ) => {

          const selectedCategory =
            section.categories.find(
              (cat) =>
                cat.type ===
                selectedCategories[
                  section.title
                ]
            );

          return (

            <div
              key={sectionIndex}
              className="menu-section"
            >

              {/* TITLE */}

              <h2 className="menu-title">

                {section.title}

              </h2>

              {/* CATEGORY BUTTONS */}

              <div className="category-buttons">

                {section.categories.map(
                  (
                    category,
                    catIndex
                  ) => (

                    <button
                      key={catIndex}

                      disabled={
                        !category.available
                      }

                      onClick={() =>
                        handleCategoryChange(
                          section.title,
                          category.type
                        )
                      }

                      className={`category-btn ${
                        selectedCategories[
                          section.title
                        ] ===
                        category.type
                          ? "active-category"
                          : ""
                      } ${
                        category.available
                          ? "available-category"
                          : "unavailable-category"
                      }`}
                    >

                      {category.type}

                    </button>

                  )
                )}

              </div>

              {/* FOOD GRID */}

              <div className="food-grid">

                {selectedCategory?.items.map(
                  (
                    item,
                    itemIndex
                  ) => (

                    <div
                      key={itemIndex}
                      className="food-card"
                    >

                      {/* IMAGE */}

                      <img
                        src={item.image}
                        alt={item.name}
                        className="food-image"
                      />

                      {/* CONTENT */}

                      <div className="food-content">

                        <h3>
                          {item.name}
                        </h3>

                        <p>
                          Fresh delicious
                          restaurant food
                        </p>

                        <h2>
                          Rs.
                          {" "}
                          {item.price}
                        </h2>

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

          );
        }
      )}

    </div>
  );
};

export default MenuView;