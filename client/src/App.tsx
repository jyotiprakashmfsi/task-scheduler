import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import HomeComponent from "./pages/Homepage";
import { Signup } from "./pages/Auth/signup";
import { Login } from "./pages/Auth/login";
// import { createContext } from "react";
import React from 'react';
import { UserProvider } from './context/UserContext';
import ProtectedRoute from "./componnets/protected/protected-route";
import TasksPage from "./pages/Tasks";
import NotificationComponent from "./componnets/notification/notification";
import SettingsPage from "./pages/Settings";

// const UserContext = createContext(null);

function App() {
  // const [cookies, setCookie] = useCookies(['token'])
  // // const [user, setUser] = useState(null);
  // const handleLogin = (token)=>{
  //   setCookie('token', token)
  //   console.log(token)
  // }

  return (
    <UserProvider>
      <div className="flex ">

      {/* <Sidebar/> */}
        <BrowserRouter>
        <div className="w-screen">

          <Routes>
            <Route path="/" element={<HomeComponent />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<TasksPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </div>
        {/* <NotificationComponent /> */}
        </BrowserRouter>
      </div>
    </UserProvider>
  );
}

export default App;
