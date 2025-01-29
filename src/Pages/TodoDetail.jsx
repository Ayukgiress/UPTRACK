import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, MessageSquare, Clock } from 'lucide-react';
import { toast } from 'sonner';

const TodoDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const [todo, setTodo] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTodo();
  }, [id, email]);

  const fetchTodo = async () => {
    try {
      const response = await axios.get(
        `https://ticks-api.onrender.com/supervisor/api/public-todos/${id}?email=${encodeURIComponent(email)}`
      );
      setTodo(response.data);
    } catch (error) {
      console.error('Error fetching todo:', error);
      toast.error('Failed to load todo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(
        `https://ticks-api.onrender.com/supervisor/api/public-todos/${id}/comment`,
        {
          text: newComment,
          email: email
        }
      );

      setTodo(response.data);
      setNewComment('');
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const handleComplete = async () => {
    try {
      const response = await axios.put(
        `https://ticks-api.onrender.com/supervisor/api/public-todos/${id}/complete`,
        { email }
      );

      setTodo(response.data);
      toast.success('Todo marked as complete');
    } catch (error) {
      console.error('Error completing todo:', error);
      toast.error('Failed to complete todo');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!todo) {
    return <div className="text-center mt-8">Todo not found</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-2xl w-full p-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">{todo.title}</h1>
              {todo.description && (
                <p className="text-gray-600 mt-2">{todo.description}</p>
              )}
            </div>
            {!todo.completed && (
              <button
                onClick={handleComplete}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Mark Complete
              </button>
            )}
          </div>

          <div className="flex gap-4 text-sm text-gray-500 mb-6">
            {todo.priority && (
              <span className={`px-2 py-1 rounded-full text-white 
                ${todo.priority === "high" ? "bg-red-500" : 
                  todo.priority === "medium" ? "bg-yellow-500" : "bg-green-500"}`}>
                {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
              </span>
            )}
            {todo.dueDate && (
              <span className="flex items-center gap-1">
                <Clock size={16} />
                Due: {new Date(todo.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>

          {todo.subtodos?.length > 0 && (
            <div className="mb-6">
              <h2 className="font-semibold mb-2">Subtasks:</h2>
              <ul className="space-y-2">
                {todo.subtodos.map((subtask, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                    <span>{subtask.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="border-t pt-4">
            <h2 className="font-semibold flex items-center gap-2 mb-4">
              <MessageSquare size={18} />
              Comments
            </h2>
            
            <div className="space-y-4 mb-4">
              {todo.comments?.map((comment, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{comment.author}</span>
                    <span>{new Date(comment.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="mt-1">{comment.text}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 border rounded-lg px-3 py-2"
              />
              <button
                onClick={handleAddComment}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Comment
              </button>
            </div>
          </div>

          {todo.completed && (
            <div className="mt-4 text-sm text-green-600 flex items-center gap-2">
              <CheckCircle size={16} />
              Completed by {todo.completedBy} on {new Date(todo.completedAt).toLocaleString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoDetail;