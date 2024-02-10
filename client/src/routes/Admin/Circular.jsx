import { useState } from "react";
import img from "../../assets/cvrrr.png";

export default function Circular() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    // Check if required fields are filled
    const requiredFields = ["date", "information"];
    const newErrors = {};
    let hasErrors = false;

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
    } else {
      const res = await fetch("/api/addcircular", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include", // Include credentials
      });

      if (res.ok) {
        // Clear errors if no errors
        setErrors({});
        // Clear form data
        setFormData({
          date: "",
          information: "",
          copyto: "", // Clear any other fields if necessary
        });
      }
    }
  };

  return (
    <div>
      <div className="flex flex-row items-center h-44 w-full">
        <img className="h-max " src={img} alt="CVRR Logo" />
      </div>
      {/* Error messages */}

      <div className="w-full h-px left-[199px] top-[110px]  border border-black"></div>
      <div className="flex flex-col items-end">
        <div className="flex flex-row items-end w-full justify-end mt-4">
          <div className="w-16 h-10 text-black text-lg font-normal font-['Poppins']">
            DATE:
          </div>
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={handleChange}
            className="appearance-none border border-gray-700 rounded w-32 py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {errors.date && <div className="text-red-500">{errors.date}</div>}
      </div>
      <div className="flex flex-row justify-center">
        <div className="w-40 h-10  text-black text-3xl font-b font-['Poppins']">
          CIRCULAR{" "}
        </div>
      </div>
      <div className="w-40 h-10 left-[238px] top-[250px] text-black text-xl font-normal font-['Poppins']">
        INFORMATION:
      </div>
      <textarea
        id="information"
        onChange={handleChange}
        value={formData.information}
        className="appearance-none border border-gray-700 rounded w-full  h-80 py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
      />
      {errors.information && (
        <div className="text-red-500">{errors.information}</div>
      )}
      <div className="w-40 h-10 left-[238px] top-[650px] text-black text-xl font-normal font-['Poppins']">
        COPY TO:
      </div>
      <textarea
        id="copyto"
        onChange={handleChange}
        value={formData.copyto}
        className="appearance-none border border-gray-700 rounded w-56 py-2 px-3 h-32 leading-tight focus:outline-none focus:shadow-outline"
      ></textarea>
      <div className="flex flex-row items-end w-full justify-end mt-15">
        <div className="flex flex-col">
          <div className="w-32 h-px left-[940px] top-[698px] border border-black"></div>
          <div className="w-36 h-10 text-black text-xl font-normal font-['Poppins'] flex-row flex justify-center">
            PRINCIPAL
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-end w-full">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleSubmit}
        >
          Confirm Circular
        </button>
      </div>
    </div>
  );
}
