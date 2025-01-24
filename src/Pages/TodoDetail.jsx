import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

const TodoDetail = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [todo, setTodo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { currentUser, isAuthenticated } = useAuth();
  
    useEffect(() => {
      const fetchTodo = async () => {
        console.log("Current User:", currentUser);
        console.log("Is Authenticated:", isAuthenticated);
        console.log("Todo ID:", id);

        if (!isAuthenticated || !currentUser) {
          toast.error("Please log in to view this todo");
          navigate('/login');
          return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Authentication token missing");
          navigate('/login');
          return;
        }

        try {
            const response = await axios.get(`https://ticks-api.onrender.com/api/todos/detail/${id}`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
              });
          
          console.log("Todo Response:", response.data);
          setTodo(response.data);
        } catch (error) {
          console.error("Detailed Fetch Error:", error);
          toast.error(error.response?.data?.error || "Failed to load todo");
          navigate('/dashboard');
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchTodo();
    }, [id, currentUser, isAuthenticated, navigate]);
  
    if (isLoading) return <p>Loading...</p>;
    if (!todo) return <p>Todo not found.</p>;
  
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold">{todo.title}</h2>
        <p>{todo.description}</p>
        <h3 className="font-semibold">Subtasks:</h3>
        <ul>
          {todo.subtodos?.map((subtask, index) => (
            <li key={index}>{subtask.title}</li>
          ))}
        </ul>
        <p>Priority: {todo.priority}</p>
        <p>Due Date: {new Date(todo.dueDate).toLocaleDateString()}</p>
        <p>Status: {todo.completed ? "Completed" : "Pending"}</p>
        {todo.assignedTo && <p>Assigned To: {todo.assignedTo}</p>}
      </div>
    );
  };

export default TodoDetail;