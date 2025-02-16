import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomeComponent() {
    const navigate = useNavigate();


    const handleGetStarted = ()=>{
        navigate("/dashboard")
    }
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-4xl text-black font-bold">
          Schedule Your Tasks and Stay on Routine.
        </h1>
        <button className="border bg-black p-2 rounded-lg w-xs hover:bg-black/90" onClick={handleGetStarted}>Get Started</button>
      </div>
    </div>
  );
}