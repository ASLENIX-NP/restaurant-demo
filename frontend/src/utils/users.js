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

const usersKey = "restaurant_users";
const pendingApplicationsKey = "restaurant_user_applications";

export const getUsers = () => {
    const savedUsers = localStorage.getItem(usersKey);

    if (savedUsers) {
        return JSON.parse(savedUsers);
    }

    localStorage.setItem(usersKey, JSON.stringify(defaultUsers));
    return defaultUsers;
};

export const saveUsers = (users) => {
    localStorage.setItem(usersKey, JSON.stringify(users));
};

export const getPendingApplications = () => {
    const savedApplications = localStorage.getItem(pendingApplicationsKey);
    return savedApplications ? JSON.parse(savedApplications) : [];
};

export const savePendingApplications = (applications) => {
    localStorage.setItem(pendingApplicationsKey, JSON.stringify(applications));
};
