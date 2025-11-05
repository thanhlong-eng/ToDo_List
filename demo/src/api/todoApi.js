import axios from './axiosInstance';

// ---- GET TODOS với search + page + limit + filter ----
export const getTodos = async (page = 1, limit = 5, search = '', filter = 'all') => {
  const res = await axios.get('/todos', {
    params: { page, limit, search, filter },
  });
  // trả về { todos, total } để frontend xử lý pagination
  return res.data;
};

// ---- ADD TODO ----
export const addTodo = async (text) => {
  const res = await axios.post('/todos', { text });
  return res.data;
};

// ---- UPDATE TODO ----
export const updateTodo = async (id, data) => {
  const res = await axios.patch(`/todos/${id}`, data);
  return res.data;
};

// ---- DELETE TODO ----
export const deleteTodo = async (id) => {
  await axios.delete(`/todos/${id}`);
};
