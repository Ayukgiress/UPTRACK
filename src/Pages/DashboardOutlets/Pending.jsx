import React from 'react'

export default function Pending() {
  return (
    <div>
      
    </div>
  )
}




// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';
// import { toast } from 'sonner';
// import { useAuth } from '../AuthContext';

// const TodoDetail = () => {
//     const { id } = useParams(); 
//     const navigate = useNavigate();
//     const [todo, setTodo] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const { currentUser, isAuthenticated } = useAuth();
//     const [isSupervisor, setIsSupervisor] = useState(false);
  
//     useEffect(() => {
//       const fetchTodo = async () => {
//         if (!isAuthenticated || !currentUser) {
//           toast.error("Please log in to view this todo");
//           navigate('/login');
//           return;
//         }

//         const token = localStorage.getItem("token");
//         if (!token) {
//           toast.error("Authentication token missing");
//           navigate('/login');
//           return;
//         }

//         try {
//             const response = await axios.get(`https://ticks-api.onrender.com/api/todos/detail/${id}`, {
//                 headers: {
//                   'Authorization': `Bearer ${token}`,
//                   'Content-Type': 'application/json'
//                 },
//             });
          
//             setTodo(response.data);
//             // Check if the current user is the supervisor (assigned to them)
//             setIsSupervisor(response.data.assignedTo === currentUser.email);
//         } catch (error) {
//             console.error("Detailed Fetch Error:", error);
//             toast.error(error.response?.data?.error || "Failed to load todo");
//             navigate('/dashboard');
//         } finally {
//             setIsLoading(false);
//         }
//       };
  
//       fetchTodo();
//     }, [id, currentUser, isAuthenticated, navigate]);

//     const handleStatusUpdate = async (completed) => {
//         const token = localStorage.getItem("token");
//         try {
//             const response = await axios.put(
//                 `https://ticks-api.onrender.com/api/todos/${id}`,
//                 { completed },
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                         'Content-Type': 'application/json'
//                     },
//                 }
//             );
//             setTodo(response.data);
//             toast.success(`Todo marked as ${completed ? 'completed' : 'pending'}`);
//         } catch (error) {
//             toast.error("Failed to update todo status");
//         }
//     };
  
//     if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
//     if (!todo) return <div className="flex justify-center items-center h-screen">Todo not found.</div>;
  
//     return (
//         <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
//             <h2 className="text-3xl font-bold mb-4">{todo.title}</h2>
//             <div className="bg-gray-50 p-4 rounded-lg mb-4">
//                 <p className="text-gray-700">{todo.description}</p>
//             </div>
            
//             {todo.subtodos?.length > 0 && (
//                 <div className="mb-4">
//                     <h3 className="text-xl font-semibold mb-2">Subtasks:</h3>
//                     <ul className="list-disc pl-6">
//                         {todo.subtodos.map((subtask, index) => (
//                             <li key={index} className="mb-1">{subtask.title}</li>
//                         ))}
//                     </ul>
//                 </div>
//             )}
            
//             <div className="grid grid-cols-2 gap-4 mb-4">
//                 <div className="bg-gray-50 p-3 rounded">
//                     <p className="font-semibold">Priority:</p>
//                     <span className={`inline-block px-2 py-1 rounded ${
//                         todo.priority === 'high' ? 'bg-red-100 text-red-800' :
//                         todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
//                         'bg-green-100 text-green-800'
//                     }`}>
//                         {todo.priority}
//                     </span>
//                 </div>
//                 <div className="bg-gray-50 p-3 rounded">
//                     <p className="font-semibold">Due Date:</p>
//                     <p>{new Date(todo.dueDate).toLocaleDateString()}</p>
//                 </div>
//             </div>
            
//             <div className="flex justify-between items-center">
//                 <div>
//                     <p className="font-semibold">Status:</p>
//                     <span className={`inline-block px-2 py-1 rounded ${
//                         todo.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//                     }`}>
//                         {todo.completed ? "Completed" : "Pending"}
//                     </span>
//                 </div>
                
//                 {(isSupervisor || todo.userId === currentUser.id) && (
//                     <button
//                         onClick={() => handleStatusUpdate(!todo.completed)}
//                         className={`px-4 py-2 rounded ${
//                             todo.completed 
//                                 ? 'bg-yellow-500 hover:bg-yellow-600' 
//                                 : 'bg-green-500 hover:bg-green-600'
//                         } text-white`}
//                     >
//                         Mark as {todo.completed ? 'Pending' : 'Completed'}
//                     </button>
//                 )}
//             </div>
            
//             {todo.assignedTo && (
//                 <div className="mt-4 bg-gray-50 p-3 rounded">
//                     <p className="font-semibold">Assigned To:</p>
//                     <p>{todo.assignedTo}</p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default TodoDetail;