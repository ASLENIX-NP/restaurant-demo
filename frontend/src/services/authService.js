import api from './api';

// Register a new user (Staff/Employee)
export const registerUser = async (userData) => {
  const { data } = await api.post('/auth/register', userData);
  return data;
};

// Fetch users
export const getUsers = async () => {
  const { data } = await api.get('/auth/users'); // Assuming you create this route, if not, we handle local state for now
  return data;
};
