import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import AttendanceLogs from "./AttendanceLogs";

export default function AttendanceDetails(props) {
  const [data, setData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [currentPeriodData, setCurrentPeriodData] = useState(null);
  const [loadingCurrentPeriod, setLoadingCurrentPeriod] = useState(true);
  const [teacherData, setTeacherData] = useState(null);
  const [loadingTeacherData, setLoadingTeacherData] = useState(true);
  const [periodName, setPeriodName] = useState(null);
  const [loadingPeriodName, setLoadingPeriodName] = useState(true);
  const [datatobesent, setDatatobesent] = useState(null);
  const [teacherName, setTeacherName] = useState(null);
  const [loadingTeacherName, setLoadingTeacherName] = useState(true);
  const [error, setError] = useState(null);
  const [stateofrequest, setStateofrequest] = useState(null);
  const today = new Date();

  const getPeriodCurrent = () => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayOfWeekString = daysOfWeek[today.getDay()];
  
    // Ensure data is not null before filtering
    if (data) {
      const periodswithday = data.filter(
        (record) => record.Day === dayOfWeekString
      );
  
      const currentTime = today.getHours() * 60 + today.getMinutes(); // Convert current time to minutes for easier comparison
  
      const currentPeriod = periodswithday.find((period) => {
        const startTimeParts = period.StartTime.split(":").map(Number);
        const endTimeParts = period.EndTime.split(":").map(Number);
        const startTime = startTimeParts[0] * 60 + startTimeParts[1]; // Convert start time to minutes
        const endTime = endTimeParts[0] * 60 + endTimeParts[1]; // Convert end time to minutes
  
        // Check if current time is within the period's time range
        return currentTime >= startTime && currentTime <= endTime;
      });
  
      setCurrentPeriodData(currentPeriod);
      setLoadingCurrentPeriod(false);
    }
  };
  

  useEffect(() => {
    getTimeTable(props.data);
  }, []);

  useEffect(() => {
    const d = getPeriodCurrent(data);
    console.log();
  }, [data]); // Run when data changes

  useEffect(() => {
    if (currentPeriodData) {
      getPeriodData(currentPeriodData.TeacherPeriodID);
    }
  }, [currentPeriodData]); // Run when currentPeriodData changes

  const getTimeTable = async (data2) => {
    try {
      let res = await fetch("/api/gettimetable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: data2.TimeTableID }),
        credentials: "include", // Include credentials
      });
      if (res.ok) {
        var fetchedData = await res.json();
        setData(fetchedData);
        setLoadingData(false);
      } else {
        throw new Error("Failed to fetch timetable data");
      }
    } catch (error) {
      setError(error.message);
      setLoadingData(false);
    }
  };

  const getPeriodData = async (teacherPeriodID) => {
    try {
      const res = await fetch("/api/getteacherperiod", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: teacherPeriodID }),
        credentials: "include", // Include credentials
      });
      if (res.ok) {
        const data = await res.json();
        setTeacherData(data);
        setLoadingTeacherData(false);
      } else {
        throw new Error("Failed to fetch teacher period data");
      }
    } catch (error) {
      setError(error.message);
      setLoadingTeacherData(false);
    }
  };

  const getPeriodName = async (data) => {
    try {
      const res1 = await fetch("/api/getperiod", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: data.PeriodID }),
        credentials: "include", // Include credentials
      });
      if (res1.ok) {
        const periodData = await res1.json();
        setPeriodName(periodData);
        setLoadingPeriodName(false);
      } else {
        throw new Error("Failed to fetch period name data");
      }

      const res2 = await fetch("/api/getteacher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: data.TeacherID }),
        credentials: "include", // Include credentials
      });
      if (res2.ok) {
        const teacherData = await res2.json();
        setTeacherName(teacherData);
        setLoadingTeacherName(false);
      } else {
        throw new Error("Failed to fetch teacher name data");
      }
    } catch (error) {
      setError(error.message);
      setLoadingPeriodName(false);
      setLoadingTeacherName(false);
    }
  };

  useEffect(() => {
    if (teacherData) {
      getPeriodName(teacherData[0]);
    }
  }, [teacherData]);

  useEffect(() => {
    console.log(data, teacherData, currentPeriodData);
    if (teacherData && periodName && currentPeriodData && teacherName) {
      setDatatobesent({
        StudentID: props.data.StudentID,
        TeacherID: teacherData[0].TeacherID,
        TimeTableID: props.data.TimeTableID,
        day: currentPeriodData.Day,
        TeacherPeriodID: teacherData[0].TeacherPeriodID,
        TeacherName: teacherName[0].Name,
        // Add other properties here if needed
      });
    }
  }, [teacherData, periodName, currentPeriodData, teacherName]);

  const handleAttendanceRequest = () => {
    // Emit the 'studentAttendanceRequest' event to the server
    const socket = io("/api", { transports: ["websocket"] });

    socket.emit(
      `studentAttendanceRequest`,
      datatobesent.StudentID,
      datatobesent.TeacherID,
      datatobesent.TimeTableID,
      datatobesent.day,
      datatobesent.TeacherPeriodID
    );
  };

  useEffect(() => {
    const socket = io("/api", { transports: ["websocket"] });
    console.log(datatobesent);

    socket.on(
      `attendanceRejected:${props.data.StudentID}`,
      handleAttendanceRejected
    );
    socket.on(
      `attendanceMarked:${props.data.StudentID}`,
      handleAttendanceMarked
    );

    return () => {
      // Clean up event listeners when the component unmounts
      socket.off(
        `attendanceRejected:${props.data.StudentID}`,
        handleAttendanceRejected
      );
      socket.off(
        `attendanceMarked:${props.data.StudentID}`,
        handleAttendanceMarked
      );
    };
  }, [props.data.StudentID]);

  const handleAttendanceRejected = (data) => {
    console.log("Attendance rejected event received:", data);
    setStateofrequest(data);
    setTimeout(() => {
      setStateofrequest(null);
    }, 5000); // 5 seconds timeout
  };

  const handleAttendanceMarked = (data) => {
    setStateofrequest(data);
    setTimeout(() => {
      setStateofrequest(null);
    }, 5000); // 5 seconds timeout
  };

  return (
    <div className="flex justify-center w-full">
      <div className="flex flex-col justify-items-center w-max items-center">
        <div className="flex flex-row justify-center">
          {!loadingData &&
            !loadingCurrentPeriod &&
            !loadingTeacherData &&
            !loadingPeriodName &&
            !loadingTeacherName && (
              <div className="w-full max-w-4xl">
                {JSON.stringify(data)}
                <div className="bg-blue-100 shadow-lg rounded-lg overflow-hidden">
                  <div className="p-8">
                    <div className="text-lg text-gray-700 mb-6">
                      Teacher: {teacherName && teacherName[0].Name}
                    </div>
                    {currentPeriodData && (
                      <div>
                        <div className="text-lg text-gray-700 mb-6">
                          {currentPeriodData.PeriodName === "Short Break" && (
                            <p>It's currently a Short Break.</p>
                          )}
                          {currentPeriodData.PeriodName === "Lunch Break" && (
                            <p>It's currently a Lunch Break.</p>
                          )}
                          {today.getHours() >= 15 && (
                            <p>College has ended for today.</p>
                          )}
                        </div>
                        <div className="text-2xl font-semibold mb-6 text-blue-900">
                          Current Period:{" "}
                          {periodName && periodName[0].PeriodName}
                        </div>
                      </div>
                    )}
                    {stateofrequest ? (
                      <div
                        className={`fixed bottom-0 right-0 m-4 p-4 rounded-lg text-white ${
                          stateofrequest.type === "rejected"
                            ? "bg-red-500"
                            : "bg-green-500"
                        }`}
                      >
                        {stateofrequest.message}
                      </div>
                    ) : (
                      !(
                        (
                          currentPeriodData &&
                          ((currentPeriodData.PeriodName === "Short Break" &&
                            currentTime >= 660 &&
                            currentTime <= 670) || // 11:00 - 11:10
                            (currentPeriodData.PeriodName === "Lunch Break" &&
                              currentTime >= 790 &&
                              currentTime <= 835) || // 13:10 - 13:55
                            (today.getHours() >= 15 &&
                              today.getMinutes() >= 45))
                        ) // After college hours
                      ) && (
                        <button
                          onClick={handleAttendanceRequest}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded focus:outline-none focus:ring focus:ring-blue-400"
                          disabled={!!stateofrequest}
                        >
                          Mark Attendance
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
        </div>
        <div className="mt-8">
          <AttendanceLogs data={props.data} />
        </div>
      </div>
    </div>
  );
}
