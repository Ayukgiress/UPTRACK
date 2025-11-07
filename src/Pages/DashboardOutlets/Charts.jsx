import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import {
  BarChart3,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  Target,
  Award,
  Activity,
  PieChart,
  LineChart,
  MessageCircleMore
} from "lucide-react";
import { useTranslation } from 'react-i18next';
import { API_BASE_URL } from "../../lib/constants";

const Charts = () => {
  const { t } = useTranslation();
  const [analytics, setAnalytics] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    completionRate: 0,
    tasksThisWeek: 0,
    tasksThisMonth: 0,
    averageCompletionTime: 0,
    priorityDistribution: { high: 0, medium: 0, low: 0 },
    weeklyProgress: [],
    monthlyProgress: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, currentUser, currentUserLoading } = useAuth();

  useEffect(() => {
    fetchAnalytics();
  }, [currentUser, isAuthenticated]);

  const fetchAnalytics = async () => {
    if (currentUserLoading || !isAuthenticated) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    setIsLoading(true);
    try {
      // Fetch todos created by the user
      const createdResponse = await axios.get(
        `${API_BASE_URL}/todos/api/todos/${currentUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Fetch todos assigned to the user
      const assignedResponse = await axios.get(
        `${API_BASE_URL}/todos/api/todos/assigned/${currentUser.email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Combine both created and assigned todos
      const allTodos = [...createdResponse.data, ...assignedResponse.data];

      // Remove duplicates based on _id
      const todos = allTodos.filter((todo, index, self) =>
        index === self.findIndex(t => t._id === todo._id)
      );
      const completed = todos.filter(todo => todo.completed);
      const pending = todos.filter(todo => !todo.completed);

      // Calculate analytics
      const completionRate = todos.length > 0 ? Math.round((completed.length / todos.length) * 100) : 0;

      // Tasks this week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const tasksThisWeek = todos.filter(todo =>
        new Date(todo.createdAt) >= oneWeekAgo
      ).length;

      // Tasks this month
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const tasksThisMonth = todos.filter(todo =>
        new Date(todo.createdAt) >= oneMonthAgo
      ).length;

      // Priority distribution
      const priorityDistribution = todos.reduce((acc, todo) => {
        const priority = todo.priority || 'low';
        acc[priority] = (acc[priority] || 0) + 1;
        return acc;
      }, { high: 0, medium: 0, low: 0 });

      // Weekly progress (last 7 days)
      const weeklyProgress = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);

        const dayCompleted = completed.filter(todo =>
          new Date(todo.completedAt || todo.updatedAt) >= dayStart &&
          new Date(todo.completedAt || todo.updatedAt) <= dayEnd
        ).length;

        weeklyProgress.push({
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          completed: dayCompleted
        });
      }

      setAnalytics({
        totalTasks: todos.length,
        completedTasks: completed.length,
        pendingTasks: pending.length,
        completionRate,
        tasksThisWeek,
        tasksThisMonth,
        averageCompletionTime: 0, // Could be calculated if we had creation vs completion timestamps
        priorityDistribution,
        weeklyProgress,
        monthlyProgress: [] // Could be expanded for monthly trends
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
          <MessageCircleMore className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('Charts')}</h1>
          <p className="text-muted-foreground mt-1">{t('Connect and collaborate with your team')}</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-2xl shadow-lg border border-border hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('Total Tasks')}</p>
              <p className="text-3xl font-bold text-foreground mt-1">{analytics.totalTasks}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl shadow-lg border border-border hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('Completed')}</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">{analytics.completedTasks}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl shadow-lg border border-border hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('Pending')}</p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{analytics.pendingTasks}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl shadow-lg border border-border hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('Completion Rate')}</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-1">{analytics.completionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Productivity Trend Chart */}
        <div className="bg-card p-6 rounded-2xl shadow-lg border border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 dark:from-blue-900/20 to-indigo-100 dark:to-indigo-900/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-card-foreground">{t('Productivity Trend')}</h3>
              <p className="text-muted-foreground text-sm">{t('Daily task completion over the last week')}</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Mini bar chart simulation */}
            <div className="flex items-end justify-between h-32 gap-2">
              {analytics.weeklyProgress.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col items-center mb-2">
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-lg transition-all duration-700 ease-out"
                      style={{
                        height: `${Math.max((day.completed / Math.max(...analytics.weeklyProgress.map(d => d.completed), 1)) * 100, 8)}%`,
                        minHeight: '8px'
                      }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{day.day}</span>
                  <span className="text-xs text-muted-foreground/70 mt-1">{day.completed}</span>
                </div>
              ))}
            </div>

            {/* Trend indicator */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${analytics.completionRate > 50 ? 'bg-green-500 dark:bg-green-600' : 'bg-yellow-500 dark:bg-yellow-600'}`}></div>
                <span className="text-sm text-muted-foreground">
                  {analytics.completionRate > 50 ? t('Trending Up') : t('Needs Improvement')}
                </span>
              </div>
              <span className="text-sm font-medium text-card-foreground">
                {analytics.weeklyProgress.reduce((sum, day) => sum + day.completed, 0)} {t('total this week')}
              </span>
            </div>
          </div>
        </div>

        {/* Task Completion Analysis */}
        <div className="bg-card p-6 rounded-2xl shadow-lg border border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-100 dark:from-green-900/20 to-emerald-100 dark:to-emerald-900/20 rounded-xl flex items-center justify-center">
              <PieChart className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-card-foreground">{t('Completion Analysis')}</h3>
              <p className="text-muted-foreground text-sm">{t('Task completion breakdown and insights')}</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Completion rate visualization */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('Completion Rate')}</span>
                <span className="font-medium text-card-foreground">{analytics.completionRate}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-500 dark:from-green-600 to-green-600 dark:to-green-700 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${analytics.completionRate}%` }}
                ></div>
              </div>
            </div>

            {/* Task status breakdown */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">{t('Completed')}</span>
                </div>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{analytics.completedTasks}</p>
                <p className="text-xs text-green-600 dark:text-green-300">{t('tasks done')}</p>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">{t('Pending')}</span>
                </div>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{analytics.pendingTasks}</p>
                <p className="text-xs text-yellow-600 dark:text-yellow-300">{t('tasks remaining')}</p>
              </div>
            </div>

            {/* Performance insights */}
            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl">
              <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">{t('Performance Insight')}</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {analytics.completionRate >= 80
                  ? t("Excellent! You're maintaining high productivity levels.")
                  : analytics.completionRate >= 60
                  ? t("Good progress! Keep up the momentum.")
                  : t("Room for improvement. Focus on completing more tasks daily.")
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analytics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Analysis */}
        <div className="bg-card p-6 rounded-2xl shadow-lg border border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-red-100 dark:from-red-900/20 to-pink-100 dark:to-pink-900/20 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-card-foreground">{t('Priority Focus')}</h3>
              <p className="text-muted-foreground text-sm">{t('Task priority breakdown')}</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { label: t('High Priority'), count: analytics.priorityDistribution.high, color: 'red', bg: 'bg-red-50 dark:bg-red-900/10', text: 'text-red-700 dark:text-red-300' },
              { label: t('Medium Priority'), count: analytics.priorityDistribution.medium, color: 'yellow', bg: 'bg-yellow-50 dark:bg-yellow-900/10', text: 'text-yellow-700 dark:text-yellow-300' },
              { label: t('Low Priority'), count: analytics.priorityDistribution.low, color: 'green', bg: 'bg-green-50 dark:bg-green-900/10', text: 'text-green-700 dark:text-green-300' }
            ].map((priority, index) => (
              <div key={index} className={`${priority.bg} p-3 rounded-lg`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 bg-${priority.color}-500 dark:bg-${priority.color}-600 rounded-full`}></div>
                    <span className={`text-sm font-medium ${priority.text}`}>{priority.label}</span>
                  </div>
                  <span className={`font-bold ${priority.text}`}>{priority.count}</span>
                </div>
                <div className="mt-2 w-full bg-card rounded-full h-1.5">
                  <div
                    className={`bg-${priority.color}-500 dark:bg-${priority.color}-600 h-1.5 rounded-full transition-all duration-500`}
                    style={{
                      width: analytics.totalTasks > 0 ? `${(priority.count / analytics.totalTasks) * 100}%` : '0%'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time-based Analysis */}
        <div className="bg-card p-6 rounded-2xl shadow-lg border border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 dark:from-indigo-900/20 to-purple-100 dark:to-purple-900/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-card-foreground">{t('Time Analysis')}</h3>
              <p className="text-muted-foreground text-sm">{t('Activity over time periods')}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-medium text-indigo-800 dark:text-indigo-200">{t('This Week')}</span>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{analytics.tasksThisWeek}</p>
                <p className="text-xs text-indigo-600 dark:text-indigo-300">{t('tasks created')}</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-teal-50 dark:bg-teal-900/10 rounded-lg">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="text-sm font-medium text-teal-800 dark:text-teal-200">{t('This Month')}</span>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-teal-600 dark:text-teal-400">{analytics.tasksThisMonth}</p>
                <p className="text-xs text-teal-600 dark:text-teal-300">{t('tasks created')}</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-pink-50 dark:bg-pink-900/10 rounded-lg">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                <span className="text-sm font-medium text-pink-800 dark:text-pink-200">{t('Avg. Daily')}</span>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-pink-600 dark:text-pink-400">
                  {analytics.tasksThisWeek > 0 ? (analytics.tasksThisWeek / 7).toFixed(1) : '0'}
                </p>
                <p className="text-xs text-pink-600 dark:text-pink-300">{t('tasks/day')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-card p-6 rounded-2xl shadow-lg border border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 dark:from-emerald-900/20 to-cyan-100 dark:to-cyan-900/20 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-card-foreground">{t('Performance Score')}</h3>
              <p className="text-muted-foreground text-sm">{t('Overall productivity metrics')}</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Performance score visualization */}
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={analytics.completionRate >= 80 ? "#10B981" : analytics.completionRate >= 60 ? "#F59E0B" : "#EF4444"}
                    strokeWidth="2"
                    strokeDasharray={`${analytics.completionRate}, 100`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">{analytics.completionRate}%</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{t('Completion Score')}</p>
            </div>

            {/* Achievement level */}
            <div className="bg-gradient-to-r from-blue-50 dark:from-blue-900/10 to-indigo-50 dark:to-indigo-900/10 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-900 dark:text-blue-200">{t('Achievement Level')}</span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {analytics.completionRate >= 90 ? t("🏆 Productivity Champion") :
                 analytics.completionRate >= 80 ? t("⭐ High Achiever") :
                 analytics.completionRate >= 70 ? t("✅ Consistent Performer") :
                 analytics.completionRate >= 60 ? t("📈 Steady Progress") :
                 t("🎯 Getting Started")}
              </p>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-muted p-2 rounded">
                <p className="text-xs text-muted-foreground">{t('Total')}</p>
                <p className="font-bold text-card-foreground">{analytics.totalTasks}</p>
              </div>
              <div className="bg-muted p-2 rounded">
                <p className="text-xs text-muted-foreground">{t('Rate')}</p>
                <p className="font-bold text-card-foreground">{analytics.completionRate}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-2xl shadow-lg border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-medium text-card-foreground">{t('This Week')}</span>
          </div>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{analytics.tasksThisWeek}</p>
          <p className="text-sm text-muted-foreground">{t('Tasks created')}</p>
        </div>

        <div className="bg-card p-6 rounded-2xl shadow-lg border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <span className="font-medium text-card-foreground">{t('This Month')}</span>
          </div>
          <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{analytics.tasksThisMonth}</p>
          <p className="text-sm text-muted-foreground">{t('Tasks created')}</p>
        </div>

        <div className="bg-card p-6 rounded-2xl shadow-lg border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            <span className="font-medium text-card-foreground">{t('Achievement')}</span>
          </div>
          <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
            {analytics.completionRate >= 80 ? t("High Performer") :
             analytics.completionRate >= 60 ? t("Good Progress") : t("Keep Going")}
          </p>
          <p className="text-sm text-muted-foreground">{t('Performance level')}</p>
        </div>
      </div>
    </div>
  );
};

export default Charts;
