import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { API_BASE_URL } from '../lib/constants';

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
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-card-foreground">{todo.title}</h1>
              {todo.description && (
                <p className="text-muted-foreground mt-3 text-lg">{todo.description}</p>
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
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <CheckCircle size={18} />
                    Mark Complete
                  </button>
                );
              } else if (!todo.completed && !allSubtasksCompleted) {
                return (
                  <button
                    disabled
                    className="bg-muted text-muted-foreground px-6 py-3 rounded-xl cursor-not-allowed flex items-center gap-2"
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

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-8">
            {todo.priority && (
              <span className={`px-3 py-2 rounded-full text-white font-medium
                ${todo.priority === "high" ? "bg-red-500" :
                  todo.priority === "medium" ? "bg-yellow-500" : "bg-green-500"}`}>
                {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)} Priority
              </span>
            )}
            {todo.dueDate && (
              <span className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                <Clock size={16} />
                Due: {new Date(todo.dueDate).toLocaleDateString()}
              </span>
            )}
            {todo.assignedTo && (
              <span className="flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Assigned to: {todo.assignedTo}
              </span>
            )}
          </div>

          {todo.subtodos?.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Subtasks ({todo.subtodos.filter(st => st.completed).length}/{todo.subtodos.length})
              </h2>
              <div className="bg-muted rounded-xl p-4">
                <ul className="space-y-3">
                  {todo.subtodos.map((subtask, index) => (
                    <li key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-card transition-colors">
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={() => toggleSubtaskCompletion(todo._id, index)}
                    className="w-6 h-6 cursor-pointer text-primary"
                    aria-label={`Mark subtask ${subtask.title} as completed`}
                  />
                  <span className={`text-base flex-1 ml-3 ${subtask.completed ? "line-through text-muted-foreground" : "text-card-foreground"}`}>
                    {subtask.title}
                  </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}



          {todo.completed && (
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
              <div className="flex items-center gap-3 text-green-700 dark:text-green-400">
                <CheckCircle size={20} />
                <div>
                  <p className="font-semibold">Task Completed</p>
                  <p className="text-sm text-green-600 dark:text-green-500">
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