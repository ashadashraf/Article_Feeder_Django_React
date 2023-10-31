import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {useHistory, Link} from 'react-router-dom';
import axios from 'axios';

function UserLogin() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");

  const history = useHistory();

  const handleValidation = (event) => {
    let formIsValid = true;

    if (!email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
      formIsValid = false;
      setEmailError("Email Not Valid");
      return false;
    } else {
      setEmailError("");
    }

    if (!password.match(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/)) {
      formIsValid = false;
      setPasswordError("Password must contain at least 8 characters with at least one alphabet and one number.");
      return false;
    } else {
      setPasswordError("");
    }

    return formIsValid;
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    const validated = handleValidation();
    if (validated) {
      try {
        const response = await axios.post('http://localhost:8000/api/user/token/', {
          email: email,
          password: password,
        });
        const token = response.data.access;
        console.log('Request was successful:', response);
        localStorage.setItem('auth-token', token);
        history.push('/');
      } catch (error) {
        console.log('Error:', error);
        console.log('Response Data:', error.response.data);
      }
    }
  };

  return (
    <div className="UserLogin">
      <div className="container-fluid p-5">
        <div className="row d-flex justify-content-center">
          <div className="col-md-4 p-4 bg-warning">
            <h2 className="d-flex justify-content-center p-3">Login</h2>
            <form id="loginform" onSubmit={loginSubmit}>
              <div className="form-group">
                <label>Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="EmailInput"
                  name="EmailInput"
                  aria-describedby="emailHelp"
                  placeholder="Enter email"
                  onChange={(event) => setEmail(event.target.value)}
                />
                <small id="emailHelp" className="text-danger form-text">
                  {emailError}
                </small>
              </div>
              <div className="form-group mt-3">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="exampleInputPassword1"
                  placeholder="Password"
                  onChange={(event) => setPassword(event.target.value)}
                />
                <small id="passworderror" className="text-danger form-text">
                  {passwordError}
                </small>
              </div>
              <div className="d-flex justify-content-center mt-3">
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
              </div>
            </form>
            <Link to="/signup" className="d-flex justify-content-center mt-3">Signup ?</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default UserLogin;
