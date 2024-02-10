import React, { useState, useEffect } from "react";

export default function AttendanceDetails() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [teacherData, setTeacherData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res1 = await fetch("/api/getstudents", {
      method: "POST",
      credentials: "include", // Include credentials
    });
    if (res1.ok) {
      const jsonData = await res1.json();
      setStudentData(jsonData);
    }
    const res2 = await fetch("/api/getteachers", {
      method: "POST",
      credentials: "include", // Include credentials
    });
    if (res2.ok) {
      const jsonData = await res2.json();
      setTeacherData(jsonData);
    }
    const res = await fetch("/api/adminattendance", {
      method: "POST",
      credentials: "include", // Include credentials
    });
    if (res.ok) {
      const jsonData = await res.json();
      setData(jsonData);
      setLoading(false);
    }
  };

  return (
    <div className="w-screen m-12">
      <h1 className="text-5xl font-bold mb-4">Attendance Details:</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="table-auto border-collapse border border-gray-800">
            <thead>
              <tr className="bg-gray-800 text-white">
                {Object.keys(data[0])
                  .filter((key) => key !== "_id" && key !== "__v") // Exclude _id from headers
                  .map((key) => (
                    <th className="px-4 py-2" key={key}>
                      {key}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {data.map((attendance, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-200" : ""}
                >
                  {Object.entries(attendance)
                    .filter(([key]) => key !== "_id" && key !== "__v") // Exclude _id from data
                    .map(([key, value], index) => (
                      <td className="border px-4 py-2" key={index}>
                        {value.toString()}
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
          <table className="table-auto border-collapse border border-gray-800">
            <thead>
              <tr className="bg-gray-800 text-white">
                {Object.keys(studentData[0])
                  .filter((key) => key !== "_id" && key !== "__v") // Exclude _id from headers
                  .map((key) => (
                    <th className="px-4 py-2" key={key}>
                      {key}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {studentData.map((attendance, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-200" : ""}
                >
                  {Object.entries(attendance)
                    .filter(([key]) => key !== "_id" && key !== "__v") // Exclude _id from data
                    .map(([key, value], index) => (
                      <td className="border px-4 py-2" key={index}>
                        {value.toString()}
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
          <table className="table-auto border-collapse border border-gray-800">
            <thead>
              <tr className="bg-gray-800 text-white">
                {Object.keys(teacherData[0])
                  .filter((key) => key !== "_id" && key !== "__v") // Exclude _id from headers
                  .map((key) => (
                    <th className="px-4 py-2" key={key}>
                      {key}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {teacherData.map((attendance, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-200" : ""}
                >
                  {Object.entries(attendance)
                    .filter(([key]) => key !== "_id" && key !== "__v") // Exclude _id from data
                    .map(([key, value], index) => (
                      <td className="border px-4 py-2" key={index}>
                        {value.toString()}
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
