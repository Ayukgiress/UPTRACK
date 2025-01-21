import React, { useState } from 'react';

const TodoModal = ({ isOpen, onClose, onAddTodos }) => {
  const [todos, setTodos] = useState(['']); // Initialize with one empty input

  const handleInputChange = (index, value) => {
    const newTodos = [...todos];
    newTodos[index] = value;
    setTodos(newTodos);
  };

  const handleAddInput = () => {
    setTodos([...todos, '']); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredTodos = todos.filter(todo => todo.trim() !== '');
    onAddTodos(filteredTodos);
    setTodos(['']); 
    onClose(); 
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg p-6 w-96">
          <h2 className="text-xl font-bold mb-4">Add Todos</h2>
          <form onSubmit={handleSubmit}>
            {todos.map((todo, index) => (
              <div key={index} className="flex items-center mb-4">
                <input
                  type="text"
                  value={todo}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  className="border rounded-lg p-2 flex-1"
                  placeholder="Enter todo"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddInput}
              className="text-blue-500 hover:underline mb-4"
            >
              Add Another Todo
            </button>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 text-black rounded-lg px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white rounded-lg px-4 py-2"
              >
                Add Todos
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default TodoModal;
