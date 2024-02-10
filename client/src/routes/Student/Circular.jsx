import React, { useState, useEffect } from "react";
import img from "../../assets/cvrrr.png";

const Circular = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/getcircular", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include credentials
        });

        if (!res.ok) {
          // If response status is not OK, throw an error
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        console.log(data);
        setData(JSON.parse(data));
        setExpandedCards(new Array(data.length).fill(false));
        setLoading(false);
      } catch (error) {
        // Catch any errors that occur during fetch or JSON parsing
        console.error("Error fetching circular data:", error);
        // Set an appropriate error message or handle the error in your UI
        // For example, you can update state to show an error message to the user
        // setError("Failed to fetch circular data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  const handleCardClick = (index) => {
    setExpandedCards((prevExpandedCards) => {
      const newExpandedCards = [...prevExpandedCards];
      newExpandedCards[index] = !newExpandedCards[index];
      return newExpandedCards;
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        {data.map((card, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(index)}
            className="border p-4 cursor-pointer h-max"
          >
            <div className="text-lg font-bold">{card.Date}</div>
            {expandedCards[index] && (
              <div className="w-full">
                <div className="flex flex-row items-center h-36  w-full">
                  <img className="h-max " src={img} alt="CVRR Logo" />
                </div>
                {/* Error messages */}

                <div className="w-full h-px left-[199px] top-[110px]  border border-black"></div>
                <div className="flex flex-col items-end">
                  <div className="flex flex-row items-end w-full justify-end mt-4">
                    <div className="w-16 h-10 text-black text-lg font-normal font-['Poppins']">
                      DATE:
                    </div>
                    <div>{card.date}</div>
                  </div>
                </div>
                <div className="flex flex-row justify-center">
                  <div className="w-40 h-10  text-black text-3xl font-b font-['Poppins']">
                    CIRCULAR{" "}
                  </div>
                </div>
                <div className="w-40 h-10 left-[238px] top-[250px] text-black text-xl font-normal font-['Poppins']">
                  INFORMATION:
                </div>
                <div>{card.Information}</div>

                <div className="w-40 h-10 left-[238px] top-[650px] text-black text-xl font-normal font-['Poppins']">
                  COPY TO:
                </div>
                <div>{card.CopyTo}</div>
                <div className="flex flex-row items-end w-full justify-end mt-15">
                  <div className="flex flex-col">
                    <div className="w-32 h-px left-[940px] top-[698px] border border-black"></div>
                    <div className="w-36 h-10 text-black text-xl font-normal font-['Poppins'] flex-row flex justify-center">
                      PRINCIPAL
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
};

export default Circular;
