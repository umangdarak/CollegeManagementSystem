import React, { useEffect, useState } from "react";
import { IoPersonCircle } from "react-icons/io5";
import AttendanceDetails from "./AttendanceDetails";
import Circular from "./Circular";
import Leave from "./Leave";

export default function AdminDashboard() {
  const [details, setDetails] = useState(true);
  const [leave, setLeave] = useState(false);
  const [circular, setCircular] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleDetails = () => {
    setCircular(false);
    setDetails(true);
    setLeave(false);
    setSidebarOpen(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      const storedData = localStorage.getItem("data");
      if(storedData){
        setData(JSON.parse(storedData));
        setLoading(false);
        }
    };
    fetchData();
  }, []);


  const handleLeave = () => {
    setCircular(false);
    setDetails(false);
    setLeave(true);
    setSidebarOpen(false);
  };

  const handleCircular = () => {
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
    <div className="min-h-screen flex">
      <div className={`sidebar ${sidebarOpen ? "w-56" : "w-0"} h-full fixed bg-gray-200 flex flex-col items-center pt-40 transition-width duration-300 ease-in-out overflow-hidden`}>
        <IoPersonCircle size={50} />
        <div className="text-xl mt-2">{data.Name}</div>
        <div className="mt-4">
          <button onClick={handleDetails} className="block py-2 px-4 rounded-lg text-gray-800 hover:bg-gray-300 hover:text-gray-900">Attendance Monitoring</button>
          <button onClick={handleCircular} className="block py-2 px-4 rounded-lg text-gray-800 hover:bg-gray-300 hover:text-gray-900">Circulars</button>
          <button onClick={handleLeave} className="block py-2 px-4 rounded-lg text-gray-800 hover:bg-gray-300 hover:text-gray-900">Leave Letters</button>
        </div>
      </div>
      <div className={`content flex-grow flex transition-all duration-300 ${
            sidebarOpen ? "ml-56" : "ml-9"
          }`}> {/* Adjust margin-left to fit the width of sidebar */}
        <button onClick={toggleSidebar} className="toggle-btn fixed left-0 z-30  p-6 rounded-lg">
          ☰
        </button>
        <div className="pl-8 pr-4 py-4">
          {details && <AttendanceDetails />}
          {circular && <Circular />}
          {leave && <Leave />}
        </div>
      </div>
    </div>
  );
}}
