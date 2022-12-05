import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import LoadingPage from "../new-components/utils/LoadingPage";
import axios from "axios";
import logo from "../images/logo.png";
import "../styles/LoginPage.css";

const initialData = {
  email: "",
  password: "",
};

const LoginPage = () => {
  const history = useHistory();
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name } = e.target;
    setFormData({ ...formData, [name]: e.target.value });
  };
  const handleLogin = async () => {
    if (formData.email && formData.password) {
      setLoading(true);
      try {
        const { data } = await axios.post(
          "https://aspire-kappa.vercel.app/auth/login",
          formData
        );
        console.log(data);
        setLoading(false);
        localStorage.setItem("aspire", JSON.stringify(data?.data));
        history.push("/property");
      } catch (error) {
        setLoading(false);
        alert("Something went wrong, please try later!");
      }
    } else {
      alert("Both fields required");
    }
  };

  return (
    <div className="loginPage-container">
      {loading ? (
        <LoadingPage />
      ) : (
        <div className="loginPage-formDiv">
          <div className="loginPage-formHeaderDiv">
            <div className="logoContainer">
              <img src={logo} alt="logo" className="logoImage" />
            </div>
            <div className="loginPage-headerContent">
              <h3 className="loginPage-headerTitle">Log In to Dashboard </h3>
              <p className="loginPage-headerSub">
                Enter your email and password below
              </p>
            </div>
          </div>

          <div className="loginPage-formContent">
            <div className="loginPage-formFieldDiv">
              <label className="loginPage-inputLabel">Email</label>
              <input
                type="email"
                name="email"
                className="loginPage-inputField"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="loginPage-formFieldDiv">
              <div className="loginPage-passDiv">
                <label className="loginPage-inputLabel">Password</label>
                <label className="loginPage-inputLabel forgotPass">
                  Forgot password?
                </label>
              </div>

              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                value={formData.password}
                className="loginPage-inputField"
              />
            </div>
            <div className="loginPage-submitBtnDiv">
              <button className="loginPage-submitBtn" onClick={handleLogin}>
                Log In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
