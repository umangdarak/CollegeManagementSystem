import React, { useState, useEffect } from "react";
import TeacherHome from "./test";

export default function Home(props) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teacherPeriods, setTeacherPeriods] = useState(null);
  const [loadingteacher, setLoadingTeacher] = useState(true);

  useEffect(() => {
    fetchData();
  }, [loadingteacher]);

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
        fetchAttendanceData(teacherPeriodsData);
      }
    }
  };

  const fetchAttendanceData = async (teacherPeriodsData) => {
    const promises = teacherPeriodsData.map(async (item) => {
      const res = await fetch("/api/teacherattendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: item.TeacherPeriodID }),
        credentials: "include", // Include credentials
      });
      if (res.ok) {
        return res.json();
      }
    });
    const attendanceDataArray = await Promise.all(promises);
    setData(attendanceDataArray.flat()); // Flatten the nested array
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Attendance Details</h1>
      {loading ? (
        <div>Loading...</div>
      ) : data.length === 0 ? (
        <div>No student has attendance for this period.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-800">
            <thead>
              <tr className="bg-gray-800 text-white">
                {Object.keys(data[0])
                  .filter(
                    (key) =>
                      key !== "_id" &&
                      key !== "__v" &&
                      key !== "TeacherPeriodID"
                  ) // Exclude specified keys from headers
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
                    .filter(
                      ([key]) =>
                        key !== "_id" &&
                        key !== "__v" &&
                        key !== "TeacherPeriodID"&& key!=="Password"
                    ) // Exclude specified keys from data
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
      <TeacherHome data={props.data}/>
    </div>
  );
}

