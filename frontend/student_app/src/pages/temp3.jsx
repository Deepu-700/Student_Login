import { useEffect, useState } from "react";

function Dashboard() {
  const [user, setUser] = useState({});
  const [course, setCourse] = useState("");
  const [pass, setPass] = useState({
    oldPassword: "",
    newPassword: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          "https://student-login-mj1y.onrender.com/api/dashboard",
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        const data = await res.json();
        setUser(data);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        alert("Error loading user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // 🔥 Loader improved
  if (loading)
    return (
      <div className="container">
        <div className="card">
          <h2>Loading...</h2>
        </div>
      </div>
    );

  // 🔹 Update Course
  const updateCourse = async () => {
    if (!course) return alert("Enter course first");

    try {
      await fetch(
        "https://student-login-mj1y.onrender.com/api/update-course",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({ course }),
        }
      );

      alert("Course updated");
      setUser({ ...user, course });
      setCourse(""); // reset input

    } catch {
      alert("Error updating course");
    }
  };

  // 🔹 Update Password
  const updatePassword = async () => {
    if (!pass.oldPassword || !pass.newPassword)
      return alert("Fill all fields");

    try {
      await fetch(
        "https://student-login-mj1y.onrender.com/api/update-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify(pass),
        }
      );

      alert("Password updated");
      setPass({ oldPassword: "", newPassword: "" });

    } catch {
      alert("Error updating password");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="container dashboard">
      <div className="card">
        <h2>Dashboard</h2>

        <p><b>Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Course:</b> {user.course}</p>

        {/* 🔥 UPDATE COURSE SECTION */}
        <div className="section">
          <h3>Update Course</h3>
          <input
            placeholder="Enter new course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />
          <button onClick={updateCourse}>Update Course</button>
        </div>

        {/* 🔥 PASSWORD SECTION */}
        <div className="section">
          <h3>Change Password</h3>
          <input
            type="password"
            placeholder="Old Password"
            value={pass.oldPassword}
            onChange={(e) =>
              setPass({ ...pass, oldPassword: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="New Password"
            value={pass.newPassword}
            onChange={(e) =>
              setPass({ ...pass, newPassword: e.target.value })
            }
          />
          <button onClick={updatePassword}>Change Password</button>
        </div>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;