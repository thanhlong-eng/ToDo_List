function TodoItem({ todo, toggleTodo, deleteTodo }) {
  return (
    <li className="flex justify-between items-center bg-white dark:bg-gray-700 p-3 mb-2 rounded shadow">
      <div
        className={`flex items-center gap-2 cursor-pointer ${
          todo.isCompleted ? "line-through text-gray-400 dark:text-gray-400" : "text-gray-900 dark:text-gray-200"
        }`}
        onClick={() => toggleTodo(todo.id)}
      >
        <input
          type="checkbox"
          checked={todo.isCompleted}
          onChange={() => toggleTodo(todo.id)}
        />
        {todo.text}
      </div>
      <button
        className="text-red-500 hover:text-red-700"
        onClick={() => deleteTodo(todo.id)}
      >
        Delete
      </button>
    </li>
  );
}

export default TodoItem;
