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
            try {
                const response = await axios.get(
                    `https://ticks-api.onrender.com/api/todos/supervisor/${id}?email=${supervisorEmail}`,
                    { headers: { 'Content-Type': 'application/json' } }
                );
                setTodo(response.data);
            } catch (error) {
                console.error("Error fetching todo:", error);
                toast.error(error.response?.data?.error || "Failed to load todo");
            } finally {
                setIsLoading(false);
            }
        };

        if (supervisorEmail) {
            fetchTodo();
        } else {
            setIsLoading(false);
            toast.error("Supervisor email is required");
        }
    }, [id, supervisorEmail]);

    if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (!todo) return <div className="flex justify-center items-center h-screen">Todo not found.</div>;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
            <h2 className="text-3xl font-bold mb-4">{todo.title}</h2>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-gray-700">{todo.description}</p>
            </div>
            
            {todo.subtodos?.length > 0 && (
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
                        {todo.priority}
                    </span>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                    <p className="font-semibold">Due Date:</p>
                    <p>{new Date(todo.dueDate).toLocaleDateString()}</p>
                </div>
            </div>
            
            <div className="mt-4">
                <p className="font-semibold">Status:</p>
                <span className={`inline-block px-2 py-1 rounded ${
                    todo.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                    {todo.completed ? "Completed" : "Pending"}
                </span>
            </div>
        </div>
    );
};


export default SupervisorTodoView