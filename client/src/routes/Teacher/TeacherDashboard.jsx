import React, { useState, useEffect } from "react";
import { IoPersonCircle } from "react-icons/io5";
import Home from "./Home";
import AttendanceDetails from "./AttendanceDetails";
import Circular from "./Circular";
import Leave from "./Leave";

export default function TeacherDashboard() {
  const [home, setHome] = useState(true);
  const [details, setDetails] = useState(false);
  const [leave, setLeave] = useState(false);
  const [circular, setCircular] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const storedData = localStorage.getItem("data");
      if (storedData) {
        setData(JSON.parse(storedData));
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleHome = () => {
    setHome(true);
    setCircular(false);
    setDetails(false);
    setLeave(false);
    setSidebarOpen(false);
  };
  const handleDetails = () => {
    setHome(false);
    setCircular(false);
    setDetails(true);
    setLeave(false);
    setSidebarOpen(false);
  };
  const handleLeave = () => {
    setHome(false);
    setCircular(false);
    setDetails(false);
    setLeave(true);
    setSidebarOpen(false);
  };
  const handleCircular = () => {
    setHome(false);
    setCircular(true);
    setDetails(false);
    setLeave(false);
    setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="min-h-full flex">
        <div
          className={`sidebar ${
            sidebarOpen ? "w-56" : "w-0"
          } h-full fixed bg-gray-200 flex flex-col items-center pt-40 top-160 left-0 transition-width duration-300 ease-in-out overflow-hidden`}
        >
          <IoPersonCircle size={50} />

          <div className="flex flex-col m-2">
            <div
              className="bg-slate-500 p-1 rounded-lg m-1"
              style={{ backgroundColor: "#DBE2EF" }}
            >
              <div className="text-2xl">{data.Name}</div>
            </div>
            <div
              className="bg-slate-500 p-1 rounded-lg m-1"
              style={{ backgroundColor: "#DBE2EF" }}
            >
              <div className="text-lg font-thin">{data.TeacherID}</div>
            </div>

          </div>

          <div className="mt-4">
            <button
              onClick={handleHome}
              className={`block py-2 px-4 rounded-lg text-gray-800 hover:bg-gray-300 hover:text-gray-900 ${
                home ? "bg-gray-300 text-gray-900" : ""
              }`}
            >
              Home
            </button>
            <button
              onClick={handleDetails}
              className={`block py-2 px-4 rounded-lg text-gray-800 hover:bg-gray-300 hover:text-gray-900 ${
                details ? "bg-gray-300 text-gray-900" : ""
              }`}
            >
              Attendance Details
            </button>
            <button
              onClick={handleCircular}
              className={`block py-2 px-4 rounded-lg text-gray-800 hover:bg-gray-300 hover:text-gray-900 ${
                circular ? "bg-gray-300 text-gray-900" : ""
              }`}
            >
              Circulars
            </button>
            <button
              onClick={handleLeave}
              className={`block py-2 px-4 rounded-lg text-gray-800 hover:bg-gray-300 hover:text-gray-900 ${
                leave ? "bg-gray-300 text-gray-900" : ""
              }`}
            >
              Leave Letters
            </button>
          </div>
        </div>
        <div className={`content flex-grow flex ${sidebarOpen ? 'ml-56' : 'ml-9'}`}>
          <button
            onClick={toggleSidebar}
            className="toggle-btn fixed left-0 p-6 rounded-lg"
          >
            ☰
          </button>
          <div className="pl-8 pr-4 py-4">
            {home && <Home data={data} />}
            {details && <AttendanceDetails data={data} />}
            {circular && <Circular />}
            {leave && <Leave />}
          </div>
        </div>
      </div>
    );
  }
}
