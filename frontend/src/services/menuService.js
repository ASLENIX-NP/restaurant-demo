import api from './api';

// Fetch all menu items from the Node backend
export const getProducts = async () => {
  const { data } = await api.get('/menu');
  return data; // Assumes backend returns an array of items
};

// Add a new menu item
export const addProduct = async (productData) => {
  const { data } = await api.post('/menu', productData);
  return data;
};

// Update an existing menu item
export const updateProduct = async (id, productData) => {
  const { data } = await api.put(`/menu/${id}`, productData);
  return data;
};

// Delete a menu item
export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/menu/${id}`);
  return data;
};
