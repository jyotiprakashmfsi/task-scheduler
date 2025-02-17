import React from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "../../assets/heroImage.png";

export default function HomeComponent() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50">
      <nav className="fixed w-full bg-white/80 backdrop-blur-sm shadow-sm z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-indigo-600">Task Seheduler</div>
          <div className="flex gap-4">
            <button 
              onClick={handleGetStarted}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl text-black/80 font-bold leading-tight">
              Schedule Your Tasks and{" "}
              <span className="text-indigo-600">Stay on Routine</span>
            </h1>
            <p className="text-xl text-gray-600">
              Boost your productivity with our intuitive task management platform.
              Organize, prioritize, and accomplish more every day.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleGetStarted}
                className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Start Now - It's Free
              </button>
              <button className="px-8 py-4 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>
          <div className="hidden lg:block">
            <img src={heroImage} alt="Task Scheduler" />
          </div>
        </div>
      </div>

      <div className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-6 rounded-xl hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Task Organization</h3>
              <p className="text-gray-600">Keep your tasks organized and prioritized with our intuitive interface.</p>
            </div>
            <div className="p-6 rounded-xl hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Time Management</h3>
              <p className="text-gray-600">Track your time effectively and meet all your deadlines with ease.</p>
            </div>
            <div className="p-6 rounded-xl hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
              <p className="text-gray-600">Monitor your progress and celebrate your achievements along the way.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
