import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import img from "../assets/login.png"; // 👈 apni image add karo

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "https://student-login-mj1y.onrender.com/api/login",
        form
      );

      const data = res.data;

      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        alert(data.message || "Login failed");
      }

    } catch (err) {
      console.error(err);
      alert("Invalid email or password");
    }
  };

  return (
    <div className="login-container">

      {/* LEFT SIDE IMAGE */}
      <div className="login-left">
        <img src={img} alt="login" />
      </div>

      {/* RIGHT SIDE FORM */}
      <div className="login-right">
        <h2>Login</h2>

        <input
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button onClick={handleSubmit}>Login</button>

        <p>
          Don’t have account?{" "}
          <span onClick={() => navigate("/register")}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;