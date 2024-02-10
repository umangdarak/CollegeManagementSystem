import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import StudentDashboard from "./routes/Student/StudentDashboard";
import TeacherDashboard from "./routes/Teacher/TeacherDashboard";
import AdminDashboard from "./routes/Admin/AdminDashboard";
import Header from "./components/Header";
import Login from "./Login";
import { useEffect, useState } from "react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthentication = () => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");

    if (token && userType) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []); // Empty dependency array

  return (
    <BrowserRouter>
      <Header />
      <div className="w-full"> {/* Adjust py-12 for padding */}
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route
            path="/studentdashboard"
            element={
              isAuthenticated ? (
                <StudentDashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/teacherdashboard"
            element={
              isAuthenticated ? (
                <TeacherDashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/admindashboard"
            element={
              isAuthenticated ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
