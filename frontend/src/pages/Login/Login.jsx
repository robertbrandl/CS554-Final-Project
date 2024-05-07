import "./Login.css";
import { useContext, useState } from "react";
import SocialSignIn from "./SocialSignIn";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../firebase/Auth";
import {
  doSignInWithEmailAndPassword,
  doPasswordReset,
} from "../../firebase/FirebaseFunctions";
import { Typography } from "@mui/material";

export const Login = () => {
  console.log(AuthContext);
  const { currentUser } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [sentEmail, setSentEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = async (event) => {
    event.preventDefault();
    let { email, password } = event.target.elements;

    try {
      setLoading(true);
      await doSignInWithEmailAndPassword(email.value, password.value);
      setErrorMessage("");
      setSentEmail("");
      setLoading(false);
    } catch (error) {
      if (error.message.includes("auth/invalid-credential")) {
        setErrorMessage("The combination of username and password entered was incorrect.")
      }
      else{
        setErrorMessage(error.message)
      }
      setSentEmail("");
      setLoading(false);
    }
  };

  const passwordReset = (event) => {
    event.preventDefault();
    let email = document.getElementById("email").value;
    if (email) {
      doPasswordReset(email);
      setSentEmail(
        "If you have an account, an email was sent to it! If you need to reset your password for a social provider, click the links above!"
      );
      setErrorMessage("");
    } else {
      setErrorMessage(
        "Please enter an email address below before you click the forgot password link"
      );
      setSentEmail("");
    }
  };
  if (currentUser) {
    return <Navigate to="/" />;
  }
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="login">
      <h4>Log-In</h4>
      <SocialSignIn />
      {errorMessage && <Typography color="error">{errorMessage}</Typography>}
      {sentEmail && <Typography>{sentEmail}</Typography>}
      <br />
      <form onSubmit={handleLogin}>
        <div className="text_area">
          <input
            name="email"
            id="email"
            type="email"
            placeholder="Email"
            className="text_input"
            required
            autoFocus
          />
        </div>
        <div className="text_area">
          <input
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="off"
            className="text_input"
            required
          />
        </div>
        <button type="submit" className="btn">
          Log in
        </button>
        <br />
        <button onClick={passwordReset} className="btn">
          Forgot Password?
        </button>
      </form>
    </div>
  );
};
