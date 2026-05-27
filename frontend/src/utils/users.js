const defaultUsers = [

    {
        username: "admin",
        password: "admin123",
        role: "admin",
    },

    {
        username: "staff",
        password: "staff123",
        role: "staff",
    },

    {
        username: "chef",
        password: "chef123",
        role: "chef",
    },

    {
        username: "cashier",
        password: "cashier123",
        role: "cashier",
    },

];

// GET USERS
export const getUsers = () => {

    const savedUsers =
        localStorage.getItem(
            "restaurant_users"
        );

    // IF EXISTS
    if (savedUsers) {

        return JSON.parse(
            savedUsers
        );
    }

    // SAVE DEFAULT USERS
    localStorage.setItem(
        "restaurant_users",
        JSON.stringify(
            defaultUsers
        )
    );

    return defaultUsers;
};

// SAVE USERS
export const saveUsers = (
    users
) => {

    localStorage.setItem(
        "restaurant_users",
        JSON.stringify(users)
    );
};