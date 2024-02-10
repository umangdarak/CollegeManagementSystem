import React, { useState, useEffect } from "react";

const TeacherHome = (props) => {
  const [timetableData, setTimeTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [numClasses, setNumClasses] = useState(0);
  const [teacherperiodId, setTeacherPeriodID] = useState([]);

  useEffect(() => {
    if (props.data) {
      getTimeTable(props.data);
    }
  }, [props.data]);

  const getTimeTable = async (data2) => {
    setLoading(true);
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
      console.log(fetchedData);
      setTimeTableData(fetchedData);
      setNumClasses(fetchedData.length);
    }
    setLoading(false);
  };

  const getTeacherPeriodIds = async () => {
    let res = await fetch("/api/getteacherperiodid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: props.data.TeacherID }),
      credentials: "include",
    });
    if (res.ok) {
      var fetchedData = await res.json();
      setTeacherPeriodID(fetchedData);
    }
  };

  const GenerateTimetable = () => {
    if (!timetableData) {
      return <div>No timetable data available</div>;
    }
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const times = [
      "09:00 - 10:00",
      "10:00 - 11:00",
      "11:00 - 11:10",
      "11:10 - 12:10",
      "12:10 - 13:10",
      "13:10 - 13:55",
      "13:55 - 14:55",
      "14:55 - 15:45",
    ];
    const periods = [];
    // Generate periods for each day
    days.forEach((day) => {
      const dayPeriods = timetableData.filter((period) => period.Day === day);
      const dayCells = [];

      times.forEach((time) => {
        const [startTime, endTime] = time.split(" - ");
        const period = dayPeriods.find(
          (p) => p.StartTime === startTime && p.EndTime === endTime
        );
        let periodName = period ? period.PeriodName : "";

        // Check if the time slot corresponds to Short Break or Lunch Break
        if (time === "11:00 - 11:10") {
          periodName = "Short Break";
        } else if (time === "13:10 - 13:55") {
          periodName = "Lunch Break";
        }

        dayCells.push(
          <td key={`${day}-${time}`} className="border px-4 py-2">
            {periodName}
          </td>
        );
      });

      periods.push(
        <tr key={day}>
          <td className="border px-4 py-2">{day}</td>
          {dayCells}
        </tr>
      );
    });

    return (
      <table className="table-auto w-max">
        <thead>
          <tr>
            <th className="border px-4 py-2">Time</th>
            {times.map((time) => (
              <th key={time} className="border px-4 py-2">
                {time}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{periods}</tbody>
      </table>
    );
  };

  return (
    <div className="flex flex-col">
      <div className="w-full">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="mx-auto">
            <h2 className="text-xl font-semibold mb-4">
              Teacher Day Schedule ({numClasses} classes)
            </h2>
            {GenerateTimetable()}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherHome;
