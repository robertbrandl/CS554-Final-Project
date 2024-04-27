import { useState } from "react";
import {
  doGoogleSignIn,
  doGithubSignIn,
  doFacebookSignIn
} from "../../firebase/FirebaseFunctions";
import axios from "axios";

const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=ecc83a6641e049bf952e546ede620995&response_type=code&redirect_uri=http://localhost:5173&scope=streaming%20user-read-email%20user-read-private`;

const SocialSignIn = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const googleSignOn = async () => {
    try {
      let user = await doGoogleSignIn();
      if (typeof user === "string") {
        throw user;
      } else {
        //check for if user exists
        const exist = await axios.get("/api/users/userexist", {
          params: {
            email: user.email,
          },
        });
        console.log(exist.data);
        console.log(user);
        if (!exist.data) {
          const response = await axios.post("/api/users/register", {
            displayName: user.displayName,
            email: user.email,
            image: user.photoURL,
            public: false,
            accountType: "google",
          });

          window.location.href = AUTH_URL;
        }
      }
    } catch (error) {
      if (typeof error == "string") {
        setErrorMessage(error);
      } else {
        setErrorMessage(error.message);
      }
    }
  };

  const facebookSignOn = async () => {
    try {
      let user = await doFacebookSignIn();
      if (typeof user === "string") {
        throw user;
      } else {
        //check for if user exists
        const exist = await axios.get("/api/users/userexist", {
          params: {
            email: user.email,
          },
        });
        console.log(exist.data);
        console.log(user);
        if (!exist.data) {
          const response = await axios.post("/api/users/register", {
            displayName: user.displayName,
            email: user.email,
            image: user.photoURL,
            public: false,
            accountType: "facebook",
          });

          window.location.href = AUTH_URL;
        }
      }
    } catch (error) {
      if (typeof error == "string") {
        setErrorMessage(error);
      } else {
        setErrorMessage(error.message);
      }
    }
  };
  
  const githubSignOn = async () => {
    try {
      let user = await doGithubSignIn();
      if (typeof user === "string") {
        throw user;
      } else {
        //check for if user exists
        console.log(user);
        const exist = await axios.get("/api/users/userexist", {
          params: {
            email: user.email,
          },
        });
        console.log(exist.data);
        console.log(user);
        if (!exist.data) {
          const response = await axios.post("/api/users/register", {
            displayName: user.displayName,
            email: user.email,
            image: user.photoURL,
            public: false,
            accountType: "github",
          });
        }
      }
    } catch (error) {
      if (typeof error == "string") {
        setErrorMessage(error);
      } else {
        setErrorMessage(error.message);
      }
    }
  };
  return (
    <div>
      {errorMessage && <h4 className="error">{errorMessage}</h4>}
      <img
        onClick={() => googleSignOn()}
        alt="google signin"
        src="/imgs/btn_google_signin.png"
      />
      <img
        onClick={() => facebookSignOn()}
        alt="facebook signin"
        src="/imgs/btn_facebook_signin.png"
      />
      <img
        onClick={() => githubSignOn()}
        alt="github signin"
        src="/imgs/github-mark.png"
      />
    </div>
  );
};

export default SocialSignIn;
