import React, { useEffect, useState } from "react";
import Narbar from "../../Components/Narbar";
import Footer from "../../Components/Footer";
import { Link } from "react-router-dom";
import { 
  Users, 
  CheckSquare, 
  Download, 
  Award, 
  Star, 
  Heart, 
  TrendingUp, 
  Shield, 
  Clock 
} from "lucide-react";

const Home = () => {
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
    { 
      text: "Total Downloads", 
      value: "100+", 
      icon: Download, 
      color: "bg-purple-500",
      description: "App installations across platforms"
    },
    { 
      text: "User Rating", 
      value: "4.9", 
      icon: Star, 
      color: "bg-yellow-500",
      description: "Average user satisfaction score"
    },
    { 
      text: "Years of Trust", 
      value: "5+", 
      icon: Shield, 
      color: "bg-red-500",
      description: "Years of reliable service"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState({});

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
    <div className="bg-custom-gradient min-h-screen flex flex-col justify-center items-center w-full xl:w-[95rem] 2xl:w-full 3xl:w-full">
      <Narbar />
      <div className="bg-custom-gradient flex flex-col justify-center items-center w-full">
        <div className="flex flex-col items-center justify-center p-6 md:p-10 lg:p-24 xl:p-28 3xl:p-64 h-screen">
          <h1 className="text-black text-center p-10 text-xl font-bold md:text-3xl lg:text-5xl xl:text-7xl 3xl:text-9xl">
            It's All About Getting It Done, Stay <span className="text-yellow-500">Organized,</span> Stay <span className="text-yellow-500">Creative </span>
          </h1>
          <h2 className="flex items-center justify-center text-center font-normal text-base md:text-xl lg:text-2xl xl:text-3xl 3xl:text-5xl">
            Not organized? Join millions of people to capture ideas, <br /> organize tasks, and do something creative.
          </h2>
          <button className="relative flex h-12 w-40 items-center justify-center overflow-hidden bg-blue-800 text-white shadow-2xl transition-all 2xl:text-2xl 2xl:w-80 rounded-3xl 3xl:h-28 3xl:w-[38rem] 3xl:text-5xl 2xl:mt-12">
            <span className="relative z-10">
              <Link to='/register'>Get Started</Link>
            </span>
          </button>
        </div>

        <div className="w-full flex justify-center items-center mt-40" id="todo-section" data-animate>
          <div className={`flex flex-col md:flex-row justify-around items-center xl:w-[90rem] bg-yellow-50 shadow-custom-background text-black relative shadow-xl font-mono w-full p-6 transition-all duration-1000 ${
            isVisible['todo-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex items-start justify-start flex-col p-10 gap-5 xl:mt-28 ">
              <h1 className="text-blue-500 xl:text-2xl 3xl:text-3xl">Todo List</h1>
              <h2 className="font-bold text-lg md:text-2xl xl:text-5xl 3xl:text-6xl">
                Organize everything in <br /> your life
              </h2>
              <p className="font-light md:text-xl 3xl:text-4xl xl:text-xl">
                Whether it's work projects, personal tasks, or study <br /> plans,
                Uptrack helps you organize and confidently tackle everything in your life.
              </p>
            </div>
            <div className="flex flex-row justify-around items-center w-full md:w-1/2 h-full">
              <div className="flex-1 flex justify-center md:justify-start relative">
                <img 
                  src="/images/Screenshot from 2025-01-17 21-34-04.png" 
                  alt="Todo" 
                  className="w-full h-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 3xl:max-w-3xl transition-transform duration-300 hover:scale-105" 
                />
              </div>
              <div className="flex-1 flex justify-center md:justify-end relative mt-4 md:mt-0">
                <img 
                  src="/images/Screenshot from 2025-01-17 21-31-56.png" 
                  alt="Todo" 
                  className="w-full h-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 3xl:max-w-3xl hover:w-80 transition-all duration-300 hover:scale-105" 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="xl:mt-40 h-full xl:h-[50rem] bg-white flex items-center justify-around gap-8 p-8 w-full" id="tutorial-section" data-animate>
          <div className={`flex flex-col items-start justify-start max-w-xl space-y-6 transition-all duration-1000 ${
            isVisible['tutorial-section'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}>
            <div className="space-y-24 3xl:space-y-28">
              <h1 className="text-3xl font-bold 3xl:text-5xl">
                Don't Know How to Get Started <span className="text-yellow-500">?</span>
              </h1>
              <p className="text-lg md:text-xl 3xl:text-3xl">
                Just simply follow the tutorial beside and get full <br />  functionality 
                of our web app and become a pro  <br /> in managing and organizing
                your to-dos, <br />so you become efficient and productive.
              </p>
            </div>
          </div>

          <div 
            className={`flex justify-center items-center w-full xl:w-[45rem] 3xl:h-[40rem] xl:h-[30rem] bg-gray-200 rounded-xl shadow-xl overflow-hidden transition-all duration-1000 ${
              isVisible['tutorial-section'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
          >
            <video 
              src="/images/Screencast from 2025-01-20 23-09-56.webm" 
              className="w-full h-full object-cover" 
              controls 
              preload="metadata"
            />
          </div>
        </div>

        <div className="w-full p-8 mt-18 h-lvh" id="stats-section" data-animate>
          <div className={`max-w-7xl mx-auto transition-all duration-1000 ${
            isVisible['stats-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="text-center mt-44 3xl:mt-[28rem]">
              <h2 className="text-2xl font-bold text-blue-500 mb-2 3xl:text-4xl">In it for the long haul</h2>
              <h3 className="text-3xl font-bold mb-4 3xl:text-5xl">A todo web app you can trust for life</h3>
              <p className="text-gray-600 3xl:text-2xl">
                We've been building and improving our platform for years. Rest assured that we'll never sell out to the highest bidder.
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-4 flex-wrap  w-full">
              {statsData.map((stat, index) => (
                <div
                  key={index}
                  className={`relative flex items-center justify-center bg-white rounded-xl p-6 shadow-lg transition-all duration-500 transform hover:-translate-y-2 hover:shadow-xl w-full sm:w-[250px] md:w-[300px] lg:w-[140px] xl:w-[243px] 3xl:w-[390px] 3xl:gap-86 ${
                    currentIndex === index ? 'scale-105' : 'scale-100'
                  }`}
                >
                  <div className="3xl:mt-20">
                    <div className={`${stat.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:rotate-12`}>
                      <stat.icon className="text-white" size={32} strokeWidth={1.5} />
                    </div>
                    <div className="text-center">
                      <h4 className="text-xl font-bold text-gray-800 mb-1  3xl:text-3xl">{stat.value}</h4>
                      <p className="text-lg font-semibold text-gray-700 mb-2 3xl:text-2xl">{stat.text}</p>
                      <p className="text-sm text-gray-600">{stat.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <h1 className="text-center xl:text-5xl text-black 3xl:text-7xl">What Our Valued <span className="text-yellow-500">Customers</span> Say</h1>

        <div className="flex items-center justify-center flex-wrap gap-8 p-8 mt-16">

          {[
            {
              name: "Kryios Sancho",
              image: "/images/Screenshot from 2025-01-21 13-51-58.png", 
              review: "This app has helped me stay organized and on top of all my tasks. Highly recommend! The user interface is clean and intuitive, which makes it easy to use on a daily basis. It's really improved my productivity by helping me prioritize tasks and track my progress in a way I never could before.",
              rating: 5,
            },
            {
              name: "Jane Smith",
              image: "/images/pexels-glassesshop-gs-1317359316-30227635.jpg", 
              review: "Amazing! The UI is simple and clean, and it's perfect for tracking my to-dos. I especially love how I can categorize my tasks, set reminders, and view everything at a glance. It’s really made my day-to-day planning more efficient and less stressful. It has quickly become an essential tool for my routine.",
              rating: 4,
            },
            {
              name: "John Washington",
              image: "/images/Screenshot from 2025-01-21 13-48-07.png",
              review: "I’ve tried many productivity apps, but this one stands out. Great features and user-friendly! What sets it apart is the ability to customize task lists, set deadlines, and track progress with ease. The app is also very reliable, and I haven't experienced any glitches or crashes. It helps me stay focused and organized throughout the day.",
              rating: 4,
            },
            {
              name: "Ayuk Giress",
              image: "/images/Screenshot from 2025-01-21 13-42-57.png", 
              review: "A game-changer for my daily planning! I love the customizable task lists. The app lets me break down bigger projects into manageable chunks, which makes everything feel more achievable. The reminders and due dates ensure that I never miss a task. I’m definitely more productive now, and I find myself more on top of things than ever.",
              rating: 5,
            },
            {
              name: "Sophia Lee",
              image: "/images/istockphoto-172655546-1024x1024.jpg", 
              review: "Good app overall, but there could be a few more features for task prioritization. While I appreciate the task categories and the simplicity, sometimes I feel like I need more options to prioritize tasks based on urgency or importance. However, it's still a solid tool for everyday task management.",
              rating: 3,
            },
            {
              name: "David Wilson",
              image: "/images/Screenshot from 2025-01-17 21-31-56.png", 
              review: "Excellent! I feel more productive and organized than ever before. Worth every penny. The app has everything I need to stay on top of my work and personal tasks. I particularly like how I can sync my tasks across all devices and access them anytime, anywhere. It’s definitely a productivity booster, and I can't imagine my daily routine without it.",
              rating: 5,
            },
          ].map((review, index) => (
            <div
              key={index}
              id={`card-${index}`}
              data-animate
              className={`2xl:w-[28rem] xl:w-[25rem] w-[90%] sm:w-[20rem] lg:w-[18rem] bg-white xl:h-[28rem] 3xl:w-[44rem] 3xl:h-[37rem] h-[auto] rounded-2xl shadow-xl shadow-custom-background flex justify-start items-start p-6 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
                isVisible[`card-${index}`] ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
            >
              <div className="flex flex-col gap-4 w-full">
                <div className="flex items-center gap-4">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-800 3xl:text-4xl">{review.name}</h3>
                </div>
 
                <p className="text-lg text-gray-600 my-4 3xl:text-3xl">{review.review}</p>

                <div className="flex justify-end items-center gap-2 mt-auto ">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      size={20}
                      className={index < review.rating ? "text-yellow-500" : "text-gray-300"}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center flex-col gap-8 p-8 mt-16 h-full xl:h-[20rem] xl:mt-32 bg w-full mb-20">
          <h1 className="text-lg xl:text-2xl 3xl:text-5xl">What To Grab More Of What Our Platform Can Offer</h1>
          <button className="w-28 h-10 xl:w-52 rounded-2xl xl:h-12 3xl:w-[25rem] 3xl:h-20 bg-blue-600 text-white hover:bg-blue-800 3xl:text-3xl">Contact us Now</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;