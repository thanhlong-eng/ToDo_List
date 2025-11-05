import { useState, useEffect } from "react";
import Header from "./components/Header";
import TodoForm from "./components/TodoFrom";
import TodoList from "./components/TodoList";
import AuthForm from "./components/AuthForm";
import axios from "./api/axiosInstance";
import {
  getTodos as apiGetTodos,
  addTodo as apiAddTodo,
  updateTodo as apiUpdateTodo,
  deleteTodo as apiDeleteTodo,
} from "./api/todoApi";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 5;

  // ---- DARK MODE ----
  useEffect(() => {
    const saved = localStorage.getItem("darkMode") === "true";
    setDarkMode(saved);
    if (saved) document.documentElement.classList.add("dark");
  }, []);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    html.classList.toggle("dark");
    const isDark = html.classList.contains("dark");
    setDarkMode(isDark);
    localStorage.setItem("darkMode", isDark);
  };

  // ---- CHECK LOGIN ----
  useEffect(() => {
    const checkLogin = async () => {
      try {
        await axios.get("/auth/me");
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkLogin();
  }, []);

  // ---- FETCH TODOS ----
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchTodos = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiGetTodos(1, 1000, search); // luôn lấy hết, phân trang FE
        setTodos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch todos error:", err);
        setError("Không thể lấy dữ liệu từ server.");
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [isLoggedIn, search]);

  // ---- LOGOUT ----
  const logout = async () => {
    try {
      await axios.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    }
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) return <AuthForm onLoginSuccess={() => setIsLoggedIn(true)} />;

  // ---- HANDLERS ----
  const handleAddTodo = async (text) => {
    try {
      const newTodo = await apiAddTodo(text);
      setTodos((prev) => [newTodo, ...prev]);
    } catch (err) {
      console.error("Add todo error:", err);
      setError("Không thể thêm todo.");
    }
  };

  const handleToggleTodo = async (id) => {
    try {
      const todo = todos.find((t) => t.id === id);
      const updated = await apiUpdateTodo(id, { isCompleted: !todo.isCompleted });
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      console.error("Toggle todo error:", err);
      setError("Không thể cập nhật todo.");
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await apiDeleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Delete todo error:", err);
      setError("Không thể xóa todo.");
    }
  };

  const handleClearCompleted = async () => {
    try {
      const completed = todos.filter((t) => t.isCompleted);
      await Promise.all(completed.map((t) => apiDeleteTodo(t.id)));
      setTodos((prev) => prev.filter((t) => !t.isCompleted));
    } catch (err) {
      console.error("Clear completed error:", err);
      setError("Không thể xóa todos đã hoàn thành.");
    }
  };

  // ---- FILTERED TODOS ----
  const filteredTodos = todos.filter((t) => {
    if (filter === "active") return !t.isCompleted;
    if (filter === "completed") return t.isCompleted;
    return true;
  });

  // ---- PHÂN TRANG CHO CẢ 3 FILTER ----
  const totalPages = Math.ceil(filteredTodos.length / limit);
  const start = (page - 1) * limit;
  const end = start + limit;
  const currentTodos = filteredTodos.slice(start, end);

  // ---- RENDER ----
  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gray-100 dark:bg-gray-900">
      {/* Dark Mode + Logout */}
      <div className="w-full max-w-md flex justify-between mb-4">
        <button onClick={toggleDarkMode} className="px-3 py-1 border rounded text-sm">
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <button onClick={logout} className="px-3 py-1 border rounded text-sm text-red-500">
          Logout
        </button>
      </div>

      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 sm:p-8">
        <Header />
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          type="text"
          placeholder="Search todos..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsSearching(e.target.value.length > 0);
            setPage(1);
          }}
          className="border p-1 rounded w-full mb-2"
        />
        {isSearching && <p className="text-gray-500 dark:text-gray-300 mb-2">Đang tìm...</p>}

        <TodoForm addTodo={handleAddTodo} />

        {loading ? (
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        ) : (
          <TodoList todos={currentTodos} toggleTodo={handleToggleTodo} deleteTodo={handleDeleteTodo} />
        )}

        {/* Pagination */}
        <div className="flex justify-between items-center mt-2 mb-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-gray-700 dark:text-gray-300">
            Page {page} / {totalPages || 1}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Filter + Clear */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-2">
            {["all", "active", "completed"].map((f) => (
              <button
                key={f}
                className={`px-3 py-1 rounded ${
                  filter === f
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-600 dark:text-gray-200"
                }`}
                onClick={() => {
                  setFilter(f);
                  setPage(1);
                }}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex gap-4 items-center">
            <p className="text-gray-600 dark:text-gray-300">
              {todos.filter((t) => !t.isCompleted).length} tasks left
            </p>
            <button onClick={handleClearCompleted} className="text-sm text-red-500 hover:underline">
              Clear Completed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
