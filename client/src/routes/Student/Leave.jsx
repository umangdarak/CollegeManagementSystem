import React, { useState,useEffect } from 'react';

export default function Leave() {
  const [datasend,setDataSent]=useState(false);
  const [formData, setFormData] = useState({
    Name: '',
    StudentID: '',
    BranchID: '',
    Year: '',
    Reason: '',
    Days: '',
    StartDate: '',
    EndDate: '',
  });
  const [formErrors, setFormErrors] = useState({
    Name: false,
    StudentID: false,
    BranchID: false,
    Year: false,
    Reason: false,
    Days: false,
    StartDate: false,
    EndDate: false,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
    setFormErrors({
      ...formErrors,
      [id]: value.trim() === '',
    });
  };

  const handleSubmit = async() => {
    const errors = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key].trim() === '') {
        errors[key] = true;
      }
    });

    if (Object.keys(errors).length === 0) {
      let res = await fetch("/api/addleave", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
      credentials: "include", // Include credentials
    });
    if(res.ok){
      setDataSent(true);
    }
    } else {
      setFormErrors(errors);
      alert('Please fill in all fields.');
    }
    handleReset();
  };

  const handleReset = () => {
    setFormData({
      Name: '',
      StudentID: '',
      BranchID: '',
      Year: '',
      Reason: '',
      Days: '',
      StartDate: '',
      EndDate: '',
    });
    setFormErrors({
      Name: false,
      StudentID: false,
      BranchID: false,
      Year: false,
      Reason: false,
      Days: false,
      StartDate: false,
      EndDate: false,
    });
  };
  useEffect(() => {
    if (datasend) {
      setTimeout(() => {
        setDataSent(false);
      }, 3000); // Reset datasend after 3 seconds
    }
  }, [datasend]);
  return (
    <div className="flex items-center justify-center h-screen">
    <div className="flex flex-col gap-5 m-16 w-full">
      <div className="text-pretty text-4xl">Leave Letter</div>
      <div className="w-full flex flex-row items-center">
        <div className="w-40">Name:</div>
        <input
          type="text"
          id="Name"
          value={formData.Name}
          onChange={handleChange}
          className="appearance-none border border-gray-700 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ml-4"
        />
        {formErrors.Name && <span className="text-red-500 ml-2">Required</span>}
      </div>

      <div className="w-full flex flex-row items-center">
        <div className="w-40">Student ID:</div>
        <input
          type="text"
          id="StudentID"
          value={formData.StudentID}
          onChange={handleChange}
          className="appearance-none border border-gray-700 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ml-4"
        />
        {formErrors.StudentID && <span className="text-red-500 ml-2">Required</span>}
      </div>

      <div className="w-full flex flex-row items-center">
        <div className="w-40">Branch ID:</div>
        <input
          type="text"
          id="BranchID"
          value={formData.BranchID}
          onChange={handleChange}
          className="appearance-none border border-gray-700 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ml-4"
        />
        {formErrors.BranchID && <span className="text-red-500 ml-2">Required</span>}
      </div>

      <div className="w-full flex flex-row items-center">
        <div className="w-40">Year:</div>
        <input
          type="text"
          id="Year"
          value={formData.Year}
          onChange={handleChange}
          className="appearance-none border border-gray-700 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ml-4"
        />
        {formErrors.Year && <span className="text-red-500 ml-2">Required</span>}
      </div>

      <div className="w-full flex flex-row items-center">
        <div className="w-40">Reason:</div>
        <input
          type="text"
          id="Reason"
          value={formData.Reason}
          onChange={handleChange}
          className="appearance-none border border-gray-700 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ml-4"
        />
        {formErrors.Reason && <span className="text-red-500 ml-2">Required</span>}
      </div>

      <div className="w-full flex flex-row items-center">
        <div className="w-40">Days:</div>
        <input
          type="text"
          id="Days"
          value={formData.Days}
          onChange={handleChange}
          className="appearance-none border border-gray-700 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ml-4"
        />
        {formErrors.Days && <span className="text-red-500 ml-2">Required</span>}
      </div>

      <div className="w-full flex flex-row items-center">
        <div className="w-40">Start Date:</div>
        <input
          type="text"
          id="StartDate"
          value={formData.StartDate}
          onChange={handleChange}
          className="appearance-none border border-gray-700 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ml-4"
        />
        {formErrors.StartDate && <span className="text-red-500 ml-2">Required</span>}
      </div>

      <div className="w-full flex flex-row items-center">
        <div className="w-40">End Date:</div>
        <input
          type="text"
          id="EndDate"
          value={formData.EndDate}
          onChange={handleChange}
          className="appearance-none border border-gray-700 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ml-4"
        />
        {formErrors.EndDate && <span className="text-red-500 ml-2">Required</span>}
      </div>

      <div className="flex flex-row justify-between">
        <button
          onClick={handleSubmit}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
        <button
          onClick={handleReset}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Reset
        </button>
      </div>
      {datasend && (
        <div className="fixed bottom-0 left-0 right-0 bg-green-500 text-white p-4 text-center">
          Form submitted successfully!
        </div>
      )}
    </div>
    </div>
  );
}
