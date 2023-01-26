import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../firebase.config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import OAuth from "../Components/OAuth";

function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { name, email, password, confirmPassword } = formData; //are used as "value" in form fields

  const onChange = (e) => {
    //controls the form input
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value, //e.target.id selects either email or password based on what we are typing into using the id we gave to each input in form
    }));
  };

  const checkEmpty = () => {
    if (
      name === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    )
      return true;
    else return false;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (checkEmpty() === true) {
      toast.warn("Please fill all the details");
      return;
    }

    if (password !== confirmPassword) {
      toast.warn("Password & Confirm Password don't match");
      return;
    }

    try {
      const auth = getAuth();

      //this function registers user and returns a promise
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      updateProfile(auth.currentUser, { displayName: name });

      //adding user data to the database
      const formDataCopy = { ...formData }; //copy everything from formdata state
      //remove the password
      delete formDataCopy.password;
      delete formDataCopy.confirmPassword;
      //add timestamp
      formDataCopy.timeStamp = serverTimestamp();
      //adds user to users collection
      await setDoc(doc(db, "users", user.uid), formDataCopy);
      navigate("/"); //redirect to explore
      toast.success("Account created successfully");
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };
  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
        </header>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            className="nameInput"
            placeholder="Name"
            id="name"
            value={name}
            onChange={onChange}
          />
          <input
            type="email"
            className="emailInput"
            placeholder="Email"
            id="email"
            value={email}
            onChange={onChange}
          />
          <div className="passwordInputDiv">
            <input
              type={showPassword ? "text" : "password"}
              className="passwordInput"
              placeholder="Password"
              id="password"
              value={password}
              onChange={onChange}
            />
            <img
              src={visibilityIcon}
              alt="showPassword"
              className="showPassword"
              onClick={() => setShowPassword((prevState) => !prevState)} //gets the previous state and sets it to opposite
            />
          </div>
          <div className="passwordInputDiv">
            <input
              type={showPassword ? "text" : "password"}
              className="passwordInput"
              placeholder="Confirm Password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
            />
            <img
              src={visibilityIcon}
              alt="showPassword"
              className="showPassword"
              onClick={() => setShowPassword((prevState) => !prevState)} //gets the previous state and sets it to opposite
            />
          </div>
          <div className="signUpBar">
            <p className="signUpText">Sign Up</p>
            <button className="signUpButton">
              <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
            </button>
          </div>
        </form>
        <OAuth />
        <Link to="/signIn" className="registerLink">
          Sign In Instead
        </Link>
      </div>
    </>
  );
}

export default SignUp;
