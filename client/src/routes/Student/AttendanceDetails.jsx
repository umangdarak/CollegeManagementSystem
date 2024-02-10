import { useState, useEffect, useRef } from "react";
import AttendanceLogs from "./AttendanceLogs";
import io from "socket.io-client";
import imageCompression from "browser-image-compression";

export default function AttendanceDetails(props) {
  const [timetableData, setTimeTableData] = useState(null);
  const [currentPeriodData, setCurrentPeriodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teacherData, setTeacherData] = useState(null);
  const [loadingTeacherData, setLoadingTeacherData] = useState(true);
  const [stateofrequest, setStateofrequest] = useState(null);
  const today = new Date();
  const currentTime = today.getHours() * 100 + today.getMinutes();
  const videoRef = useRef(null);
  // Convert current time to a format like 1130 for 11:30 AM

  useEffect(() => {
    // Initialize videoRefs array when attendanceRequests change
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });
  }, []);
  useEffect(() => {
    if (props.data) {
      getTimeTable(props.data);
    }
  }, [props.data]);

  const getTimeTable = async (data2) => {
    let res = await fetch("/api/gettimetable", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: data2.TimeTableID }),
      credentials: "include",
    });
    if (res.ok) {
      var fetchedData = await res.json();
      setTimeTableData(fetchedData);
    }
  };

  const getCurrentPeriod = (timetableData) => {
    const today = new Date();
    const currentTime = today.getHours() * 100 + today.getMinutes(); // Convert current time to a format like 1130 for 11:30 AM
    const currentDay = today.toLocaleString("en-US", { weekday: "long" });

    // Filter timetableData based on the current day
    const todayTimetable = timetableData.filter(
      (item) => item.Day.toLowerCase() === currentDay.toLowerCase()
    );

    // Find the period that matches the current time
    const currentPeriod = todayTimetable.find((item) => {
      const startTime = parseInt(item.StartTime.replace(":", ""));
      const endTime = parseInt(item.EndTime.replace(":", ""));
      return currentTime >= startTime && currentTime <= endTime;
    });

    return currentPeriod;
  };

  useEffect(() => {
    if (timetableData) {
      setCurrentPeriodData(getCurrentPeriod(timetableData));
      setLoading(false);
    }
  }, [timetableData]);

  useEffect(() => {
    if (currentPeriodData) {
      getPeriodData(currentPeriodData.TeacherPeriodID);
    }
  }, [currentPeriodData]);
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
      setLoadingTeacherData(false);
    }
  };
  let breakStatus = null;
  if (currentTime >= 1100 && currentTime <= 1110) {
    breakStatus = "Short Break";
  } else if (currentTime >= 1310 && currentTime <= 1355) {
    breakStatus = "Lunch Break";
  } else if (currentTime >= 1545) {
    breakStatus = "College Ends";
  }

  const handleAttendance = async () => {
    const socket = io("http://localhost:5000", { transports: ["websocket"] });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg");

    // Convert dataURL to Blob
    const base64String = dataUrl.split(",")[1];
    const byteArray = atob(base64String);
    const byteNumbers = new Array(byteArray.length);
    for (let i = 0; i < byteArray.length; i++) {
      byteNumbers[i] = byteArray.charCodeAt(i);
    }
    const byteArrayBlob = new Blob([new Uint8Array(byteNumbers)], {
      type: "image/jpeg",
    });

    // Compress the image
    const compressedImageBlob = await imageCompression(byteArrayBlob, {
      maxSizeMB: 0.5, // Set the maximum size in MB
      maxWidthOrHeight: 800, // Set maximum width or height
      useWebWorker: true, // Use web workers for faster compression
    });

    // Convert the compressed image Blob to base64 string
    const reader = new FileReader();
    reader.readAsDataURL(compressedImageBlob);

    reader.onloadend = () => {
      const compressedBase64String = reader.result.split(",")[1];

      socket.emit(
        `studentAttendanceRequest`,
        props.data.StudentID,
        teacherData[0].TeacherID,
        currentPeriodData.TimeTableID,
        currentPeriodData.Day,
        currentPeriodData.TeacherPeriodID,
        compressedBase64String // Sending compressed image bytes along with attendance request
      );
    };
  };

  useEffect(() => {
    const socket = io("/api", { transports: ["websocket"] });

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
    console.log(data);

    console.log("Attendance rejected event received:", data);
    setStateofrequest(data);
    setTimeout(() => {
      setStateofrequest(null);
    }, 5000); // 5 seconds timeout
  };

  const handleAttendanceMarked = (data) => {
    console.log(data);
    setStateofrequest(data);
    setTimeout(() => {
      setStateofrequest(null);
    }, 5000); // 5 seconds timeout
  };

  return (
    <div>
      <div>
        {breakStatus ? (
          <p>{`Currently: ${breakStatus}`}</p>
        ) : (
          <div>
            {loading ? (
              <div>loading..</div>
            ) : (
              <div>
                <div>
                  {loadingTeacherData ? (
                    <div></div>
                  ) : (
                    <div>
                      <div className="max-w-xs mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="px-6 py-4">
                          <div className="font-bold text-xl mb-2">
                           Current Period:{currentPeriodData.PeriodName}
                          </div>
                          <button
                            onClick={handleAttendance}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                          >
                            Request Attendance
                          </button>
                        </div>
                      </div>
                      {stateofrequest && (
                        <div
                          className={`fixed bottom-0 right-0 m-4 p-4 rounded-lg text-white ${
                            stateofrequest.type === "rejected"
                              ? "bg-red-500"
                              : "bg-green-500"
                          }`}
                        >
                          {stateofrequest.message}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <video
        ref={videoRef}
        autoPlay
        style={{
          maxWidth: "500px",
          maxHeight: "375px",
          width: "auto",
          height: "auto",
        }}
        className="hidden"
      ></video>
      <div className="mt-8">
        <AttendanceLogs data={props.data} />
      </div>
    </div>
  );
}
