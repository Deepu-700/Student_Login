import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    course: ""
  });

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "https://student-login-mj1y.onrender.com/api/register",
        form
      );

      const data = res.data;

      alert(data.message);

      // ✅ Register ke baad login page pe bhejo
      navigate("/");

    } catch (err) {
      console.error(err);

      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Registration failed");
      }
    }
  };

  return (
    <div className="container">   {/* ✅ center fix */}
      <div className="card">
        <h2>Register</h2>

        <input
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <input
          placeholder="Course"
          onChange={(e) => setForm({ ...form, course: e.target.value })}
        />

        <button onClick={handleSubmit}>Register</button>
      </div>
    </div>
  );
}

export default Register;