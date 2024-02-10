import React, { useState, useEffect } from "react";

const Home = (props) => {
  const [timetableData, setTimeTableData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [percentage, setPercentage] = useState({});
  const [loadingPercentage, setLoadingPercentage] = useState(true);
  const [averagePercentage, setAveragePercentage] = useState(0);

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
      setTimeTableData(fetchedData);
    }
    setLoading(false);
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

  const getAttendanceData = async () => {
    setLoadingPercentage(true);
    const teacherperiodids = timetableData.map((each) => each.TeacherPeriodID);
    const res = await fetch("/api/getteacherperiods", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: teacherperiodids }),
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      const count = {};
      data.forEach((each) => {
        count[each.TeacherPeriodID] = each.Count;
      });

      const res1 = await fetch("/api/studentattendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: props.data.StudentID }),
        credentials: "include",
      });
      if (res1.ok) {
        const data = await res1.json();
        const count1 = {};
        data.forEach((item) => {
          const { TeacherPeriodID } = item;
          count1[TeacherPeriodID] = (count1[TeacherPeriodID] || 0) + 1;
        });

        const percentages = {};
        let totalPercentage = 0;
        let totalSubjects = 0;
        Object.keys(count).forEach((key) => {
          const value1 = count[key] || 0;
          const value2 = count1[key] || 0;

          if (value2 === 0) {
            percentages[key] = "No class attended";
          } else {
            const percentage = (value1 / value2) * 100;
            totalPercentage += percentage;
            totalSubjects++;
            percentages[key] = percentage.toFixed(2); // Limit to 2 decimal places
          }
        });
        setPercentage(percentages);

        // Calculate average percentage
        const averagePercentage =
          totalSubjects > 0 ? (totalPercentage / totalSubjects).toFixed(2) : 0;
        setAveragePercentage(averagePercentage);
      }
    }
    setLoadingPercentage(false);
  };

  return (
    <div className="flex flex-col">
      <div className="w-full">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="mx-auto">
            <h2 className="text-xl font-semibold mb-4">Student Timetable</h2>
            {GenerateTimetable()}
          </div>
        )}
      </div>
      <div>
        <button
          onClick={getAttendanceData}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Get Attendance Details
        </button>
      </div>
      {loadingPercentage ? (
        <div></div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-2">Attendance Percentages</h2>
          <div className="space-y-2">
            {Object.keys(percentage).map((key) => (
              <div key={key} className="flex justify-between">
                <span>{key}:</span>
                <span className="font-bold">{percentage[key]}</span>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <span className="font-semibold">Average Percentage:</span>
            <span className="ml-2 font-bold">{averagePercentage}%</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
