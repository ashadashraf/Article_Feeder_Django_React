import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import {useHistory, Link} from 'react-router-dom';

function UserSignup() {
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [userNameError, setUserNameError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [dobError, setDobError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const history = useHistory();

  const handleValidation = (event) => {
    let formIsValid = true;
    if (userName === "") {
      setUserNameError("This field cannot be empty");
      return false;
    } else if (!userName.match(/^[a-zA-Z0-9!@#$%^&*()-_+=`~]*$/)) {
      formIsValid = false;
      setUserNameError("Invalid characters in the username");
      return false;
    } else {
      setUserNameError("");
    }

    if (firstName === "") {
      setFirstNameError("This field cannot be empty");
      return false;
    } else if (!firstName.match(/^[a-zA-Z0-9!@#$%^&*()-_+=`~]*$/)) {
      formIsValid = false;
      setFirstNameError("Invalid characters in the first name");
      return false;
    } else {
      setFirstNameError("");
    }

    if (lastName === "") {
      setLastNameError("This field cannot be empty");
      return false;  
    } else if (!lastName.match(/^[a-zA-Z0-9!@#$%^&*()-_+=`~ ]*$/)) {
      formIsValid = false;
      setLastNameError("Invalid characters in the last name");
      return false;
    } else {
      setLastNameError("");
    }

    if (!phoneNumber.match(/^[0-9]+$/)) {
      formIsValid = false;
      setPhoneNumberError("Phone number can only contain numbers.");
      return false;
    } else {
      setPhoneNumberError("");
    }

    if (!email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
      formIsValid = false;
      setEmailError("Email Not Valid");
      return false;
    } else {
      setEmailError("");
    }

    if (!dob.match(/^\d{4}-\d{2}-\d{2}$/)) {
      formIsValid = false;
      setDobError("Invalid date format. Please use yyyy-mm-dd.");
      return false;
    } else {
      setDobError("");
    }

    if (!password.match(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/)) {
      formIsValid = false;
      setPasswordError("Password must contain at least 8 characters with at least one alphabet and one number.");
      return false;
    } else {
      setPasswordError("");
    }

    if (confirmPassword !== password) {
      formIsValid = false;
      setConfirmPasswordError("password does not match eachother");
      return false;
    } else {
      setConfirmPasswordError("");
    }

    return formIsValid;
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    const validated = handleValidation();

    if (validated) {
      const formData = new FormData();

      formData.append('username', userName);
      formData.append('first_name', firstName);
      formData.append('last_name', lastName);
      formData.append('phone_number', phoneNumber);
      formData.append('email', email);
      formData.append('dob', dob);
      formData.append('password', password);
      formData.append('confirm_password', confirmPassword);

      try {
        const response = await axios.post('http://localhost:8000/api/user/create/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Request was successful:', response);
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
            <h2 className="d-flex justify-content-center p-3">Signup</h2>
            <form id="loginform" onSubmit={loginSubmit}>
              <div className="form-group mt-3">
                <label>Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="UserNameInput"
                  name="UserNameInput"
                  aria-describedby="userNameHelp"
                  placeholder="Enter Username"
                  onChange={(event) => setUserName(event.target.value)}
                />
                <small id="userNameHelp" className="text-danger form-text">
                  {userNameError}
                </small>
              </div>
              <div className="form-group mt-3">
                <label>First Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="FirstNameInput"
                  name="FirstNameInput"
                  aria-describedby="firstNameHelp"
                  placeholder="Enter First Name"
                  onChange={(event) => setFirstName(event.target.value)}
                />
                <small id="firstNameHelp" className="text-danger form-text">
                  {firstNameError}
                </small>
              </div>
              <div className="form-group mt-3">
                <label>Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="LastNameInput"
                  name="LastNameInput"
                  aria-describedby="lastNameHelp"
                  placeholder="Enter Last Name"
                  onChange={(event) => setLastName(event.target.value)}
                />
                <small id="lastNameHelp" className="text-danger form-text">
                  {lastNameError}
                </small>
              </div>
              <div className="form-group mt-3">
                <label>Phone Number</label>
                <input
                  type="number"
                  className="form-control"
                  id="PhoneNumberInput"
                  name="PhoneNumberInput"
                  aria-describedby="phoneNumberHelp"
                  placeholder="Enter Phone Number"
                  onChange={(event) => setPhoneNumber(event.target.value)}
                />
                <small id="phoneNumberHelp" className="text-danger form-text">
                  {phoneNumberError}
                </small>
              </div>
              <div className="form-group mt-3">
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
                <label>DOB</label>
                <input
                  type="date"
                  className="form-control"
                  id="DobInput"
                  name="DobInput"
                  aria-describedby="dobHelp"
                  placeholder="Enter DOB"
                  onChange={(event) => setDob(event.target.value)}
                />
                <small id="dobHelp" className="text-danger form-text">
                  {dobError}
                </small>
              </div>
              <div className="form-group mt-3">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="Password1"
                  placeholder="Password"
                  onChange={(event) => setPassword(event.target.value)}
                />
                <small id="passworderror" className="text-danger form-text">
                  {passwordError}
                </small>
              </div>
              <div className="form-group mt-3">
                <label>Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="Password2"
                  placeholder="Confirm Password"
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
                <small id="confirmpassworderror" className="text-danger form-text">
                  {confirmPasswordError}
                </small>
              </div>
              <div className="d-flex justify-content-center mt-3">
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
              </div>
            </form>
            <Link to="/login" className="d-flex justify-content-center mt-3">Login ?</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default UserSignup;
