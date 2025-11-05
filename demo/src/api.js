import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001'; // đổi sang port mới

export const getTodos = () => axios.get(`${API_BASE_URL}/todos`);
export const createTodo = (todo) => axios.post(`${API_BASE_URL}/todos`, todo);
export const updateTodo = (id, data) => axios.put(`${API_BASE_URL}/todos/${id}`, data);
export const deleteTodo = (id) => axios.delete(`${API_BASE_URL}/todos/${id}`);
