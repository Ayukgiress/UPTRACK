import React, { useState } from 'react';
import { CheckCircle, Clock, List } from 'lucide-react';  // Import icons
import TodoModal from '../../Components/Modals/Todo';  // Adjust path as necessary

const Overview = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todos, setTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);

  const handleAddTodos = (newTodos) => {
    setTodos((prevTodos) => [...prevTodos, ...newTodos]);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const toggleTodoCompletion = (index) => {
    const updatedTodos = [...todos];
    const updatedCompletedTodos = [...completedTodos];

    if (updatedCompletedTodos.includes(updatedTodos[index])) {
      updatedTodos[index].completed = false;
      setCompletedTodos(updatedCompletedTodos.filter((todo) => todo !== updatedTodos[index]));
    } else {
      updatedTodos[index].completed = true;
      updatedCompletedTodos.push(updatedTodos[index]);
      setCompletedTodos(updatedCompletedTodos);
    }

    setTodos(updatedTodos);
  };

  const remainingTodos = todos.filter(todo => !todo.completed);
  const completedTodosList = todos.filter(todo => todo.completed);

  return (
    <div className='w-full items-center justify-center flex-col'>
      <div className='flex items-center justify-between'>
        <h1>Overview</h1>
        {/* <button
          onClick={handleOpenModal}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Add Todos
        </button> */}
      </div>

      <TodoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddTodos={handleAddTodos}
      />

      <div className="mt-6 flex justify-between w-full">
        <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg w-1/3">
          <Clock size={32} className="text-yellow-500 mb-4" />
          <h3 className="text-xl font-semibold">Pending</h3>
          <ul className="mt-4">
            {remainingTodos.map((todo, index) => (
              <li key={index} className="bg-white p-2 rounded-md mb-2">
                <button
                  onClick={() => toggleTodoCompletion(index)}
                  className="w-full text-left"
                >
                  {todo}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg w-1/3">
          <CheckCircle size={32} className="text-green-500 mb-4" />
          <h3 className="text-xl font-semibold">Completed</h3>
          <ul className="mt-4">
            {completedTodosList.map((todo, index) => (
              <li key={index} className="bg-white p-2 rounded-md mb-2">
                <button
                  onClick={() => toggleTodoCompletion(index)}
                  className="w-full text-left line-through"
                >
                  {todo}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg w-1/3">
          <List size={32} className="text-blue-500 mb-4" />
          <h3 className="text-xl font-semibold">Remaining</h3>
          <ul className="mt-4">
            {remainingTodos.map((todo, index) => (
              <li key={index} className="bg-white p-2 rounded-md mb-2">
                <button
                  onClick={() => toggleTodoCompletion(index)}
                  className="w-full text-left"
                >
                  {todo}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 bg-custom-background w-full h-full">
        <h3 className="text-xl font-semibold">Your Todos</h3>
        <ul className="mt-4 ">
          {todos.map((todo, index) => (
            <li key={index} className="bg-gray-100 p-2 rounded-md mb-2">
              {todo}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Overview;
