import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

import imageCompression from "browser-image-compression";

export default function AttendanceDetails(props) {
  const [attendanceRequests, setAttendanceRequests] = useState([]);
  const [teacherPeriods, setTeacherPeriods] = useState(null);
  const [loadingteacher, setLoadingTeacher] = useState(true);
  const [done, setDone] = useState(false);
  const [studentImages, setStudentImages] = useState([]); // State to store student images
  // const videoRef = useRef(null);
  // Create an array of refs to store video elements
  const decompressAndDisplayImage = async (data) => {
    // Extract the base64-encoded image from the data
    const base64String = data.bytearray;

    // Decompress the image
    const decompressedImage = await decompressImage(base64String);

    // Create a URL representing the compressed image
    const imageUrl = URL.createObjectURL(decompressedImage);

    // Set the student's image when attendance request is received
    setStudentImages((prevStudentImages) => [...prevStudentImages, imageUrl]);
  };

  const decompressImage = async (base64String) => {
    // Decode the base64-encoded image
    const decodedImage = atob(base64String);

    // Convert the decoded image to a Uint8Array
    const imageArray = new Uint8Array(decodedImage.length);
    for (let i = 0; i < decodedImage.length; i++) {
      imageArray[i] = decodedImage.charCodeAt(i);
    }

    // Convert the Uint8Array to a Blob object
    const blob = new Blob([imageArray], { type: "image/jpeg" });

    // Compress the Blob object
    const compressedImage = await imageCompression(blob, {
      unCompress: true,
    });

    return compressedImage;
  };

  useEffect(() => {
    const socket = io("http://localhost:5000", { transports: ["websocket"] });

    const handleAttendanceRequest = (data) => {
      // Update the attendance requests state with the received data
      setAttendanceRequests((prevAttendanceRequests) => [
        ...prevAttendanceRequests,
        data,
      ]);

      // Extract the image from the data and display it
      decompressAndDisplayImage(data);
    };

    socket.on(
      `attendanceRequest:${props.data.TeacherID}`,
      handleAttendanceRequest
    );

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.off(
        `attendanceRequest:${props.data.TeacherID}`,
        handleAttendanceRequest
      );
    };
  }, [props.data.TeacherID, attendanceRequests]);
  const handleAccept = async (id, index, request) => {
    // Handle accepting the attendance request
    const socket = io("http://localhost:5000", { transports: ["websocket"] });
    if (attendanceRequests[index].StudentID !== null) {
      socket.emit("markAttendance", id, "approved");
    }
    const res = await fetch("/api/postattendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        StudentID: id,
        TimeTableID: request.timetableID,
        Date: request.date,
        TeacherPeriodID: request.teacherperiodID,
      }),
      credentials: "include", // Include credentials
    });
    if (res.ok) {
      console.log("worked");
    }
    // Remove the request from state and localStorage
    const updatedRequests = [...attendanceRequests];
    updatedRequests.splice(index, 1);
    const updatedImages = [...studentImages];
    updatedImages.splice(index, 1);
    setStudentImages(updatedImages);
    setAttendanceRequests(updatedRequests);
    localStorage.setItem("attendanceRequests", JSON.stringify(updatedRequests));
  };

  const handleReject = (id, index) => {
    // Handle rejecting the attendance request
    const socket = io("http://localhost:5000", { transports: ["websocket"] });
    console.log(id);
    socket.emit("markAttendance", id, "rejected");

    // Remove the request from state and localStorage
    const updatedRequests = [...attendanceRequests];
    updatedRequests.splice(index, 1);
    setAttendanceRequests(updatedRequests);
    localStorage.setItem("attendanceRequests", JSON.stringify(updatedRequests));
    const updatedImages = [...studentImages];
    updatedImages.splice(index, 1);
    setStudentImages(updatedImages);
  };
  const fetchData = async () => {
    if (props.data && props.data.TeacherID) {
      const res = await fetch("/api/getteacherperiodid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: props.data.TeacherID }),
        credentials: "include", // Include credentials
      });
      if (res.ok) {
        const teacherPeriodsData = await res.json();
        setTeacherPeriods(teacherPeriodsData);
        setLoadingTeacher(false);
      }
    }
  };
  useEffect(() => {
    fetchData();
    setDone(false);
  }, []);

  const handleAcceptClass = async () => {
    const res = await fetch("/api/updateteacher", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: attendanceRequests[0].teacherperiodID }),
      credentials: "include", // Include credentials
    });
    if (res.ok) {
      setDone(true);
    }
  };
  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>
      {attendanceRequests.length >= 1 && !done && (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
          <div className="md:flex">
            <div className="p-8">
              <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                Confirm Class?
              </div>
              <p className="mt-2 text-gray-500">
                {attendanceRequests[0].teacherperiodID}
              </p>
              <div className="mt-4">
                <button
                  className="confirm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handleAcceptClass}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}{" "}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Render attendance requests */}
        {attendanceRequests.map((request, index) => (
          <div key={index} className="border rounded-lg p-4 bg-white shadow-md">
            <h2 className="text-lg font-semibold mb-2">Attendance Request</h2>
            <p className="mb-2">
              <span className="font-semibold">Student ID:</span>{" "}
              {request.studentID}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Teacher ID:</span>{" "}
              {request.teacherID}
            </p>
            <p className="mb-4">
              <span className="font-semibold">Date:</span> {request.date}
            </p>
            <div className="flex justify-between">
              <div className="flex justify-between">
                <button
                  onClick={() =>
                    handleAccept(request.studentID, index, request)
                  }
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-green-400"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(request.studentID, index)}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-red-400"
                >
                  Reject
                </button>
              </div>
            </div>
            {studentImages[index] && (
              <img src={studentImages[index]} alt="Student" className="my-4" />
            )}
          </div>
        ))}
      </div>
      <p className="mt-4 text-gray-500">
        Total Attendance Requests: {attendanceRequests.length}
      </p>
    </div>
  );
}
