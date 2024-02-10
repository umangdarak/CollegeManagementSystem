import React, { useState, useEffect } from "react";

export default function AttendanceLogs(props) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await fetch("/api/studentattendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: props.data.StudentID }),
      credentials: "include", // Include credentials
    });
    if (res.ok) {
      const jsonData = await res.json();
      setData(jsonData);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <h1 className="text-2xl font-bold mb-4">Attendance Details</h1>
      {loading ? (
        <div>Loading...</div>
      ) : data && data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-800">
            <thead>
              <tr className="bg-gray-800 text-white">
                {Object.keys(data[0])
                  .filter((key) => key !== "_id" && key !== "__v")
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
                    .filter(([key]) => key !== "_id" && key !== "__v")
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
      ) : (
        <div>No attendance data available</div> // Render message when data is empty
      )}
    </div>
  );
}
