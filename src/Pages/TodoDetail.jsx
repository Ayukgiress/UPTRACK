import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, MessageSquare, Clock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { API_BASE_URL } from '../../lib/constants';

const TodoDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
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
        `${API_BASE_URL}/todos/api/public-todos/${id}?email=${encodeURIComponent(email)}`
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
        `${API_BASE_URL}/todos/api/public-todos/${id}/comment`,
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
        `${API_BASE_URL}/todos/api/public-todos/${id}/complete`,
        { email }
      );

      setTodo(response.data);
      toast.success('Todo marked as complete');
    } catch (error) {
      console.error('Error completing todo:', error);
      toast.error('Failed to complete todo');
    }
  };

  const toggleSubtaskCompletion = async (todoId, subtaskIndex) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/todos/api/public-todos/${todoId}/subtask`,
        {
          subtaskIndex,
          email
        }
      );

      setTodo(response.data);
      toast.success('Subtask updated');
    } catch (error) {
      console.error('Error updating subtask:', error);
      toast.error('Failed to update subtask');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!todo) {
    return <div className="text-center mt-8">Todo not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{todo.title}</h1>
              {todo.description && (
                <p className="text-gray-600 mt-3 text-lg">{todo.description}</p>
              )}
            </div>
            {/*
             Disable "Mark Complete" button if any subtasks are incomplete
            */}
            {(() => {
              const allSubtasksCompleted = todo.subtodos ? todo.subtodos.every(st => st.completed) : true;
              if (!todo.completed && allSubtasksCompleted) {
                return (
                  <button
                    onClick={handleComplete}
                    className="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <CheckCircle size={18} />
                    Mark Complete
                  </button>
                );
              } else if (!todo.completed && !allSubtasksCompleted) {
                return (
                  <button
                    disabled
                    className="bg-gray-300 text-gray-600 px-6 py-3 rounded-xl cursor-not-allowed flex items-center gap-2"
                    title="Complete all subtasks before marking as complete"
                  >
                    <CheckCircle size={18} />
                    Mark Complete
                  </button>
                );
              }
              return null;
            })()}
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-8">
            {todo.priority && (
              <span className={`px-3 py-2 rounded-full text-white font-medium
                ${todo.priority === "high" ? "bg-red-500" :
                  todo.priority === "medium" ? "bg-yellow-500" : "bg-green-500"}`}>
                {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)} Priority
              </span>
            )}
            {todo.dueDate && (
              <span className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                <Clock size={16} />
                Due: {new Date(todo.dueDate).toLocaleDateString()}
              </span>
            )}
            {todo.assignedTo && (
              <span className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Assigned to: {todo.assignedTo}
              </span>
            )}
          </div>

          {todo.subtodos?.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Subtasks ({todo.subtodos.filter(st => st.completed).length}/{todo.subtodos.length})
              </h2>
              <div className="bg-gray-50 rounded-xl p-4">
                <ul className="space-y-3">
                  {todo.subtodos.map((subtask, index) => (
                    <li key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white transition-colors">
                  <button
                    onClick={() => toggleSubtaskCompletion(todo._id, index)}
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200
                      ${subtask.completed
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-gray-300 hover:border-green-400 hover:bg-green-50"
                      }`}
                  >
                    {subtask.completed && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <input
                    type="radio"
                    name={"subtask-radio-group"}
                    checked={subtask.completed}
                    onChange={() => toggleSubtaskCompletion(todo._id, index)}
                    className="w-6 h-6 cursor-pointer text-green-500 ml-2"
                    aria-label={`Mark subtask ${subtask.title} as completed`}
                  />
                  <span className={`text-base flex-1 ${subtask.completed ? "line-through text-gray-400" : "text-gray-700"}`}>
                    {subtask.title}
                  </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
              <MessageSquare size={20} />
              Comments ({todo.comments?.length || 0})
            </h2>

            <div className="space-y-4 mb-6">
              {todo.comments?.length > 0 ? (
                todo.comments.map((comment, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-start text-sm text-gray-500 mb-2">
                      <span className="font-medium text-gray-700">{comment.author}</span>
                      <span>{new Date(comment.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{comment.text}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No comments yet. Be the first to add one!</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                placeholder="Add a comment..."
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <MessageSquare size={18} />
                Comment
              </button>
            </div>
          </div>

          {todo.completed && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-3 text-green-700">
                <CheckCircle size={20} />
                <div>
                  <p className="font-semibold">Task Completed</p>
                  <p className="text-sm text-green-600">
                    Completed by {todo.completedBy} on {new Date(todo.completedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoDetail;