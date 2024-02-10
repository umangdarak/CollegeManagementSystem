import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";

export default function LoginForm() {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const redirectToDashboard = useCallback(
    (userType) => {
      switch (userType) {
        case "Student":
          navigate("/studentdashboard");
          break;
        case "Teacher":
          navigate("/teacherdashboard");
          break;
        case "Admin":
          navigate("/admindashboard");
          break;
        default:
          // Handle unknown userType
          console.error("Unknown userType:", userType);
      }
    },
    [navigate]
  );

 useEffect(() => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");

    if (token && userType) {
      redirectToDashboard(userType);
    }
  }, [redirectToDashboard]);// Add redirectToDashboard as a dependency

  const handleForm = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      const res = await fetch("/api/loginuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include", // Include credentials
      });


      if (!res.ok) {
        // Handle non-successful responses
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const { token, userType, data } = await res.json();
      localStorage.setItem("token", token);
      localStorage.setItem("userType", userType);
      localStorage.setItem("data", JSON.stringify(data));

      // Now you can use token and userType as needed
      redirectToDashboard(userType);
    } catch (error) {
      // Handle fetch or JSON parsing errors
      console.error("Error during fetch:", error.message);
    }
  };

  return (
    <form className="mx-auto max-w-md p-4 bg-white rounded-lg shadow-md m-8 text-[1.2rem] ">
      <div className="mb-4 b">
        <label
          htmlFor="Login"
          className="block font-bold mb-2 text-[2rem] text-center"
        >
          Login
        </label>
      </div>
      <div className="mb-4">
        <label htmlFor="username" className="block font-bold mb-2">
          Enter your id
        </label>
        <input
          type="text"
          id="id"
          onChange={handleChange}
          className="appearance-none border border-gray-700 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block font-bold mb-2">
          Password
        </label>
        <input
          type="password"
          id="password"
          onChange={handleChange}
          className="appearance-none border border-gray-700 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="flex flex-col items-center">
        <button
          className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-center"
          onClick={handleForm}
        >
          Log In
        </button>
      </div>
    </form>
  );
}
