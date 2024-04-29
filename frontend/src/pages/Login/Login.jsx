import "./Login.css";
import { useContext, useState } from "react";
import SocialSignIn from "./SocialSignIn";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../firebase/Auth";
import {
  doSignInWithEmailAndPassword,
  doPasswordReset,
} from "../../firebase/FirebaseFunctions";

export const Login = () => {
  console.log(AuthContext);
  const { currentUser } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [sentEmail, setSentEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const handleLogin = async (event) => {
    event.preventDefault();
    let { email, password } = event.target.elements;

    try {
      setLoading(true);
      await doSignInWithEmailAndPassword(email.value, password.value);
      setErrorMessage('');
      setSentEmail('');
      setLoading(false);
    } catch (error) {
      setErrorMessage(error.message);
      setSentEmail('');
      setLoading(true);
    }
  };

  const passwordReset = (event) => {
    event.preventDefault();
    let email = document.getElementById("email").value;
    if (email) {
      doPasswordReset(email);
      setSentEmail("If you have an account, an email was sent to it! If you need to reset your password for a social provider, click the links above!");
      setErrorMessage('');
    } else {
      setErrorMessage(
        "Please enter an email address below before you click the forgot password link"
      );
      setSentEmail('');
    }
  };
  if (currentUser) {
    return <Navigate to="/spotifyauth" />;
  }
  if (loading){
    return <div>Loading...</div>
  }
  return (
    <div>
      <div className="card">
        <h1>Log-In</h1>
        <SocialSignIn />
        {errorMessage && <h4 className='error'>{errorMessage}</h4>}
        {sentEmail && <h4 >{sentEmail}</h4>}
        <form className="form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>
              Email Address:
              <br />
              <input
                name="email"
                id="email"
                type="email"
                placeholder="Email"
                required
                autoFocus={true}
              />
            </label>
          </div>
          <br />
          <div className="form-group">
            <label>
              Password:
              <br />
              <input
                name="password"
                type="password"
                placeholder="Password"
                autoComplete="off"
                required
              />
            </label>
          </div>

          <button className="button" type="submit">
            Log in
          </button>

          <button className="forgotPassword" onClick={passwordReset}>
            Forgot Password
          </button>
        </form>

        <br />
      </div>
    </div>
  );
};
