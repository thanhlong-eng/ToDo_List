import { useState } from "react";
import axios from "../api/axiosInstance"; // dùng instance với withCredentials

export default function AuthForm({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); // true: login, false: register
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const url = `/auth/${isLogin ? "login" : "register"}`;
      const res = await axios.post(url, { username, password });

      if (isLogin) {
        // ✅ cookie JWT đã được set từ server
        onLoginSuccess(); // thông báo app đã login
      } else {
        alert("Đăng ký thành công! Bạn có thể đăng nhập ngay.");
        setIsLogin(true);
      }

      setUsername("");
      setPassword("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Lỗi server");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Register"}
        </h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-2 border rounded dark:bg-gray-700 dark:text-white"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {isLogin ? "Login" : "Register"}
        </button>
        <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-300">
          {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
          {" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 hover:underline"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </form>
    </div>
  );
}
