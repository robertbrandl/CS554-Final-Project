import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    signInWithEmailAndPassword,
    updatePassword,
    signInWithPopup,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    EmailAuthProvider,
    reauthenticateWithCredential,
    OAuthProvider
  } from 'firebase/auth';
  
  async function doCreateUserWithEmailAndPassword(email, password, displayName) {
    const auth = getAuth();
    await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(auth.currentUser, {displayName: displayName});
  }
  
  async function doChangePassword(email, oldPassword, newPassword) {
    const auth = getAuth();
    let credential = EmailAuthProvider.credential(email, oldPassword);
    console.log(credential);
    await reauthenticateWithCredential(auth.currentUser, credential);
  
    await updatePassword(auth.currentUser, newPassword);
    await doSignOut();
  }
  
  async function doSignInWithEmailAndPassword(email, password) {
    let auth = getAuth();
    await signInWithEmailAndPassword(auth, email, password);
  }
  
  async function doGoogleSignIn() {
    let auth = getAuth();
    let socialProvider = new GoogleAuthProvider();
    let user = undefined;
    await signInWithPopup(auth, socialProvider).then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
    return user;
  }
  
  async function doPasswordReset(email) {
    let auth = getAuth();
    await sendPasswordResetEmail(auth, email);
  }
  
  async function doSignOut() {
    let auth = getAuth();
    await signOut(auth);
  }
  
  export {
    doCreateUserWithEmailAndPassword,
    doGoogleSignIn,
    doSignInWithEmailAndPassword,
    doPasswordReset,
    doSignOut,
    doChangePassword
  };