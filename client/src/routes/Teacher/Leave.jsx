import React, { useEffect, useState } from "react";

export default function Leave() {
  const [leaveData, setLeaveData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/getleaves", {
        method: "GET",
        credentials: "include", // Include credentials
      });
      if (res.ok) {
        const data = await res.json();
        setLeaveData(data);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Leave Details</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <table className="table-auto border-collapse border border-gray-800">
            <thead>
              <tr className="bg-gray-800 text-white">
                {Object.keys(leaveData[0])
                  .filter((key) => key !== "_id" && key !== "__v") // Exclude specified keys from headers
                  .map((key) => (
                    <th className="px-4 py-2" key={key}>
                      {key}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {leaveData.map((leave, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-200" : ""}>
                  {Object.entries(leave)
                    .filter(([key]) => key !== "_id" && key !== "__v") // Exclude specified keys from data
                    .map(([key, value], cellIndex) => (
                      <td className="border px-4 py-2" key={cellIndex}>
                        {value}
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
