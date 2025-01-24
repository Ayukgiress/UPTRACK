import React, { useState, useEffect } from "react";

const EditTodoModal = ({ isOpen, onClose, todo, onEditTodo }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description);
    }
  }, [todo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedTodo = { ...todo, title, description };
    onEditTodo(updatedTodo);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edit Todo</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded w-full py-2 px-3"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border rounded w-full py-2 px-3"
            />
          </div>
          <div className="flex justify-between">
            <button type="button" onClick={onClose} className="mr-2 bg-gray-300 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded">
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTodoModal;