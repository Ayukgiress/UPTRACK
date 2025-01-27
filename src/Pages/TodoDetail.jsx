import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

const SupervisorTodoView = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const supervisorEmail = searchParams.get('email');
    const [todo, setTodo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTodo = async () => {
            if (!supervisorEmail) {
                setIsLoading(false);
                toast.error("Supervisor email is required");
                return;
            }

            try {
                const response = await axios.get(
                    `https://ticks-api.onrender.com/api/todos/supervisor/${id}`,
                    { 
                        params: { email: supervisorEmail },
                        headers: { 
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    }
                );
                console.log('Todo data received:', response.data);
                setTodo(response.data);
            } catch (error) {
                console.error("Error fetching todo:", error);
                toast.error(error.response?.data?.error || "Failed to load todo");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTodo();
    }, [id, supervisorEmail]);

    const handleMarkComplete = async () => {
        if (!todo) return;
        
        try {
            const response = await axios.put(
                `https://ticks-api.onrender.com/api/todos/supervisor/${id}`,
                { completed: !todo.completed },
                { 
                    params: { email: supervisorEmail },
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            setTodo(response.data);
            toast.success(`Todo marked as ${response.data.completed ? 'completed' : 'pending'}`);
        } catch (error) {
            console.error("Error updating todo:", error);
            toast.error("Failed to update todo status");
        }
    };

    if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (!todo) return <div className="flex justify-center items-center h-screen">Todo not found.</div>;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
            <h2 className="text-3xl font-bold mb-4">{todo.title || 'No Title'}</h2>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-gray-700">{todo.description || 'No Description'}</p>
            </div>
            
            {todo.subtodos && todo.subtodos.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-xl font-semibold mb-2">Subtasks:</h3>
                    <ul className="list-disc pl-6">
                        {todo.subtodos.map((subtask, index) => (
                            <li key={index} className="mb-1">{subtask.title}</li>
                        ))}
                    </ul>
                </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded">
                    <p className="font-semibold">Priority:</p>
                    <span className={`inline-block px-2 py-1 rounded ${
                        todo.priority === 'high' ? 'bg-red-100 text-red-800' :
                        todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                    }`}>
                        {todo.priority || 'Not set'}
                    </span>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                    <p className="font-semibold">Due Date:</p>
                    <p>{todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : 'No due date'}</p>
                </div>
            </div>
            
            <div className="flex justify-between items-center mt-4">
                <div>
                    <p className="font-semibold">Status:</p>
                    <span className={`inline-block px-2 py-1 rounded ${
                        todo.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                        {todo.completed ? "Completed" : "Pending"}
                    </span>
                </div>
                
                <button
                    onClick={handleMarkComplete}
                    className={`px-4 py-2 rounded ${
                        todo.completed 
                            ? 'bg-yellow-500 hover:bg-yellow-600' 
                            : 'bg-green-500 hover:bg-green-600'
                    } text-white`}
                >
                    Mark as {todo.completed ? 'Pending' : 'Completed'}
                </button>
            </div>
        </div>
    );
};

export default SupervisorTodoView;