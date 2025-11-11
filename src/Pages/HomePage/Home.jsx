import React, { useEffect, useState } from "react";
import Narbar from "../../Components/Narbar";
import Footer from "../../Components/Footer";
import { Link } from "react-router-dom";
import { useTheme } from "../../Components/ThemeContext";
import { useTranslation } from "react-i18next";
import {
  Users,
  CheckSquare,
  Download,
  Award,
  Star,
  Heart,
  TrendingUp,
  Shield,
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  Calendar,
  BarChart3,
  Smartphone,
  Globe,
  CheckCircle,
  Play,
  ChevronDown,
  MessageSquare,
  ThumbsUp,
  Award as AwardIcon,
  Plus,
  MapPin,
  Phone,
  Mail
} from "lucide-react";

const Home = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const statsData = [
    {
      text: "Active Users",
      value: "100+",
      icon: Users,
      color: "bg-blue-500",
      description: "Growing community of dedicated users"
    },
    {
      text: "Tasks Completed",
      value: "1000+",
      icon: CheckSquare,
      color: "bg-green-500",
      description: "Tasks successfully managed and completed"
    },
    // {
    //   text: "Total Downloads",
    //   value: "100+",
    //   icon: Download,
    //   color: "bg-purple-500",
    //   description: "App installations across platforms"
    // },
    {
      text: "User Rating",
      value: "4.9",
      icon: Star,
      color: "bg-yellow-500",
      description: "Average user satisfaction score"
    },
    {
      text: "Years of Trust",
      value: "1+",
      icon: Shield,
      color: "bg-red-500",
      description: "Years of reliable service"
    }
  ];

  const features = [
    {
      icon: Target,
      title: "Goal Setting",
      description: "Set clear objectives and track your progress with smart goal management."
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Organize your time efficiently with intelligent scheduling features."
    },
    {
      icon: BarChart3,
      title: "Progress Analytics",
      description: "Visualize your productivity with detailed analytics and insights."
    },
    {
      icon: Smartphone,
      title: "Cross-Platform Sync",
      description: "Access your tasks anywhere with seamless cross-device synchronization."
    },
    {
      icon: Globe,
      title: "Collaboration",
      description: "Work together with team members on shared projects and tasks."
    },
    {
      icon: Zap,
      title: "Quick Actions",
      description: "Perform common tasks with lightning-fast shortcuts and automation."
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [animatedStats, setAnimatedStats] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % statsData.length);
    }, 3000);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));

          // Animate stats when visible
          if (entry.isIntersecting && entry.target.id === 'stats-section') {
            statsData.forEach((stat, index) => {
              const targetValue = parseInt(stat.value.replace('+', ''));
              let currentValue = 0;
              const increment = targetValue / 50;
              const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= targetValue) {
                  currentValue = targetValue;
                  clearInterval(timer);
                }
                setAnimatedStats(prev => ({
                  ...prev,
                  [index]: Math.floor(currentValue)
                }));
              }, 30);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((element) => {
      observer.observe(element);
    });

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <Narbar />

      {/* Hero Section */}
      <section className={`relative min-h-screen flex items-center overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className={`absolute top-20 left-10 w-96 h-96 ${theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-200/30'} rounded-full blur-3xl animate-pulse`}></div>
          <div className={`absolute bottom-20 right-10 w-80 h-80 ${theme === 'dark' ? 'bg-gray-600/20' : 'bg-gray-300/20'} rounded-full blur-3xl animate-pulse delay-1000`}></div>
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] ${theme === 'dark' ? 'bg-gray-700/20' : 'bg-gray-100/20'} rounded-full blur-3xl`}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-8 border ${
                theme === 'dark' ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-200'
              }`}>
                <Sparkles className={`w-4 h-4 mr-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                Smart Task Management Platform
              </div>

              {/* Main Heading */}
              <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                <span className="block">{t("Complete Tasks, Get Verified").split(',')[0]},</span>
                <span className={`block ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t("Complete Tasks, Get Verified").split(',')[1]}
                </span>
              </h1>

              {/* Subheading */}
              <p className={`text-lg sm:text-xl md:text-2xl mb-12 max-w-2xl leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {t("Transform your productivity with intelligent task tracking. Assign reviewers, track completion, and build accountability in your workflow.")}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center mb-16">
                <Link to='/register'>
                  <button className="group relative px-8 py-4 bg-gray-900 text-white font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden min-w-[200px]">
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {t("Start Managing Tasks")}
                      <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={20} />
                    </span>
                    <div className="absolute inset-0 bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                  </button>
                </Link>

                <button className={`group px-8 py-4 border-2 font-semibold rounded-full transition-all duration-300 flex items-center justify-center gap-3 min-w-[200px] ${
                  theme === 'dark' ? 'border-gray-600 text-gray-300 hover:border-gray-500 hover:text-gray-200 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:border-gray-900 hover:text-gray-900 hover:bg-gray-50'
                }`}>
                  <Play className="transition-transform duration-300 group-hover:scale-110" size={20} />
                  {t("Watch Demo")}
                </button>
              </div>

              {/* Trust Indicators */}
              <div className={`flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8 text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className={`w-8 h-8 rounded-full border-2 border-white ${
                      theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                    }`}></div>
                    <div className={`w-8 h-8 rounded-full border-2 border-white ${
                      theme === 'dark' ? 'bg-gray-500' : 'bg-gray-400'
                    }`}></div>
                    <div className={`w-8 h-8 rounded-full border-2 border-white ${
                      theme === 'dark' ? 'bg-gray-400' : 'bg-gray-500'
                    }`}></div>
                    <div className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold ${
                      theme === 'dark' ? 'bg-gray-300' : 'bg-gray-600'
                    }`}>
                      +
                    </div>
                  </div>
                {t("10,000+ active users")}
                </div>
                {/* <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span>4.9/5 rating</span>
                </div> */}
              </div>
            </div>

            {/* Right Content - Task Demo */}
            <div className="relative">
              {/* Task Management Demo */}
              <div className={`relative rounded-2xl shadow-2xl p-8 border ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
              }`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{t("Today's Tasks")}</h3>
                  <div className={`flex items-center gap-2 text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <Clock className="w-4 h-4" />
                    {t("3 pending reviews")}
                  </div>
                </div>

                {/* Tasks */}
                <div className="space-y-4">
                  {/* Completed Task */}
                  <div className={`group flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 hover:shadow-md ${
                    theme === 'dark' ? 'bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-700' : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                  }`}>
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold line-through ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{t("Review project proposal")}</h4>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>{t("Completed • Verified by Sarah")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  {/* In Progress Task */}
                  <div className={`group flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 hover:shadow-md ${
                    theme === 'dark' ? 'bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border-blue-700' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
                  }`}>
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{t("Update client presentation")}</h4>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>{t("In Progress • Assigned to Mike")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-5 h-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  {/* Pending Review Task */}
                  <div className={`group flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 hover:shadow-md ${
                    theme === 'dark' ? 'bg-gradient-to-r from-orange-900/20 to-amber-900/20 border-orange-700' : 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200'
                  }`}>
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{t("Code review for API")}</h4>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>{t("Pending Review • Waiting for John")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-5 h-5 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  {/* New Task */}
                  <div className={`group flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 hover:shadow-md ${
                    theme === 'dark' ? 'bg-gradient-to-r from-purple-900/20 to-violet-900/20 border-purple-700' : 'bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200'
                  }`}>
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                        <Plus className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{t("Schedule team meeting")}</h4>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>{t("New Task • Assign reviewer")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-5 h-5 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className={`mt-6 pt-6 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className={`flex items-center justify-between text-sm mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {t("Today's Progress")}
                    {t("75% Complete")}
                  </div>
                  <div className={`w-full rounded-full h-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000" style={{width: '75%'}}></div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full flex items-center justify-center shadow-xl animate-bounce ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-800'
              }`}>
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <div className={`absolute -bottom-4 -left-4 w-16 h-16 rounded-full flex items-center justify-center shadow-xl animate-pulse ${
                theme === 'dark' ? 'bg-gray-500' : 'bg-gray-600'
              }`}>
                <Target className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className={`w-6 h-6 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`py-20 px-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t("Powerful Features for Maximum Productivity").split(' for ')[0]} for
              <span className={`block ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {t("Powerful Features for Maximum Productivity").split(' for ')[1]}
              </span>
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {t("Everything you need to stay organized, focused, and productive in one comprehensive platform.")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                }`}
              >
                <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="text-white" size={32} />
                </div>
                <h3 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t(feature.title)}</h3>
                <p className={`leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{t(feature.description)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className={`py-20 px-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-900'} text-white`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {t("See Tasky.Dev in Action").split(' Tasky.Dev ')[0]}
                <span className=" font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Tasky.Dev </span>
                {t("See Tasky.Dev in Action").split(' Tasky.Dev ')[1]}
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                {t("Watch how our intuitive interface helps you manage tasks effortlessly. From simple to-dos to complex project management, Tasky.Dev adapts to your workflow.")}
              </p>
              <button className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300">
                <Play className="transition-transform duration-300 group-hover:scale-110" size={20} />
                {t("Play Demo Video")}
              </button>
            </div>
            <div className="relative">
              <div className="aspect-video bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                <video
                  src="/images/Screencast from 2025-01-20 23-09-56.webm"
                  className="w-full h-full object-cover"
                  controls
                  preload="metadata"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center shadow-lg">
                <Play className="text-white ml-1" size={32} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-white" id="stats-section" data-animate>
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            isVisible['stats-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t("Join Thousands of Success Stories").split(' Thousands ')[0]}
              <span className="block text-gray-700">
                {t("Join Thousands of Success Stories").split(' Thousands ')[1]}
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("Real results from real users who have transformed their productivity and achieved their goals with Tasky.Dev.")}
            </p>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 transition-all duration-1000 ${
            isVisible['stats-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            {statsData.map((stat, index) => (
              <div
                key={index}
                className={`group relative bg-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-200 overflow-hidden ${
                  currentIndex === index ? 'ring-2 ring-gray-800 scale-105' : 'scale-100'
                }`}
              >
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative z-10 text-center">
                  <div className={`${stat.color} w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 shadow-lg`}>
                    <stat.icon className="text-white" size={28} strokeWidth={1.5} />
                  </div>
                  <h4 className="text-3xl font-bold text-gray-800 mb-2">
                    {animatedStats[index] !== undefined ? animatedStats[index] : stat.value}
                    {stat.value.includes('+') && '+'}
                  </h4>
                  <p className="text-lg font-semibold text-gray-700 mb-2">{stat.text}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{stat.description}</p>
                </div>

                {/* Subtle shine effect */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </div>
            ))}
          </div>

          {/* Additional Trust Indicators */}
          <div className="mt-16 text-center">
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-gray-600" />
                {t("Enterprise-grade security")}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-600" />
                {t("24/7 customer support")}
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gray-600" />
                {t("Continuous improvements")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl  font-bold text-gray-500 ">
                {t("About Tasky.Dev").split(' Tasky.Dev')[0]}  <span className="font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
                  Tasky.Dev
                  </span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {t("Tasky.Dev is a comprehensive productivity platform designed to help individuals and teams achieve their goals through intelligent task management and collaboration tools.")}
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{t("Our Mission")}</h3>
                    <p className="text-gray-600">{t("To empower everyone to reach their full potential by providing intuitive tools that simplify complex workflows and boost productivity.")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{t("Our Values")}</h3>
                    <p className="text-gray-600">{t("We believe in simplicity, reliability, and user-centric design. Every feature is built with your success in mind.")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{t("Our Vision")}</h3>
                    <p className="text-gray-600">{t("To become the world's most trusted productivity platform, helping millions achieve their goals and dreams.")}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gray-50 rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t("Why Choose Tasky.Dev?")}</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                    <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
                    {t("Intuitive and easy to use")}
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                    <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
                    {t("Powerful collaboration tools")}
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                    <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
                    {t("Real-time progress tracking")}
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                    <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
                    {t("Secure and reliable platform")}
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                    <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
                    {t("24/7 customer support")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t("Get In Touch")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("Have questions or need support? We'd love to hear from you. Reach out to our team and we'll get back to you as soon as possible.")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{t("Our Location")}</h3>
                  <p className="text-gray-600">{t("Yaoundé, Jouvence")}<br />{t("Cameroon")}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{t("Phone")}</h3>
                  <p className="text-gray-600">{t("+237 676 184 440")}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{t("Email")}</h3>
                  <p className="text-gray-600">{t("tasky.dev@gmail.com")}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{t("Send us a Message")}</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t("First Name")}</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                      placeholder={t("Your first name")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t("Last Name")}</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                      placeholder={t("Your last name")}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t("Email")}</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                    placeholder={t("your@email.com")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t("Message")}</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors resize-none"
                    placeholder={t("Tell us how we can help you...")}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-semibold"
                >
                  {t("Send Message")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t("Ready to Transform Your Productivity?")}
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            {t("Join thousands of users who have already taken control of their tasks and achieved their goals with Tasky.Dev.")}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to='/register'>
              <button className="group px-8 py-4 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-3">
                {t("Start Your Journey")}
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={20} />
              </button>
            </Link>
            <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300">
              {t("Learn More")}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;