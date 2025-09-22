"use client";

import { useState, useEffect } from "react";
import { auth, googleProvider, twitterProvider } from "../Firebase/firebase";
import {
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signInWithPopup,
  isSignInWithEmailLink,
  linkWithCredential,
  fetchSignInMethodsForEmail,
  EmailAuthProvider,
  signInWithEmailAndPassword
} from "firebase/auth";
import axios from "axios";

export default function Authentication() {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState<any>(null);

useEffect(() => {
  const handleEmailSignIn = async () => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      try {
        const emailForSignIn =
          window.localStorage.getItem("emailForSignIn") || email;

        const result = await signInWithEmailLink(
          auth,
          emailForSignIn,
          window.location.href
        );

        // Clear email from storage
        window.localStorage.removeItem("emailForSignIn");

        // Get Firebase ID Token
        const token = await result.user.getIdToken();
        console.log("Firebase ID Token (Email Link):", token);

        // Send token to your backend to get your JWT
        await sendTokenToBackend(token);

        setUser(result.user);
      } catch (err) {
        console.error("Email link sign-in error:", err);
      }
    }
  };

  handleEmailSignIn();
}, [email]);


  const handleEmailLink = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    const actionCodeSettings = {
      url: window.location.href, // Redirect back to this page after sign-in
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      alert("Check your email for the login link!");
    } catch (err) {
      console.error(err);
      alert("Failed to send email link");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      console.log("Firebase ID Token (Google):", token);
            const res = await sendTokenToBackend(token);
      console.log("response", res)
      console.log(result)
      setUser(result.user);
    } catch (err) {
      console.error(err);
      alert("Google login failed");
    }
  };

const handleTwitterLogin = async () => {
  try {
    const result = await signInWithPopup(auth, twitterProvider);
    const token = await result.user.getIdToken();
    console.log("Firebase ID Token (Twitter):", token);
    const res = await sendTokenToBackend(token);
    console.log("response", res);
    setUser(result.user);
  } catch (err: any) {
    console.error("Twitter login error:", err);
    
    if (err.code === 'auth/account-exists-with-different-credential') {
      // Extract the email from the error
      const email = err.customData?.email;
      
      if (email) {
        try {
          // Fetch the sign-in methods for this email
          const methods = await fetchSignInMethodsForEmail(auth, email);
          
          if (methods.length > 0) {
            // Inform the user they already have an account with a different provider
            let providerName = "another provider";
            
            if (methods.includes('password')) {
              providerName = "email/password";
            } else if (methods.includes('google.com')) {
              providerName = "Google";
            }
            
            alert(
              `You already have an account with this email (${email}) using ${providerName}. ` +
              `Please sign in with that method first.`
            );
            
            // Optional: Automatically redirect to the appropriate sign-in method
            if (methods.includes('google.com')) {
              if (window.confirm("Would you like to sign in with Google instead?")) {
                await handleGoogleLogin();
              }
            }
          }
        } catch (fetchError) {
          console.error("Error fetching sign-in methods:", fetchError);
          alert("An error occurred. Please try signing in with your original method.");
        }
      } else {
        alert("It looks like you already have an account with a different sign-in method. Please use your original sign-in method.");
      }
    } else if (err.code === 'auth/popup-blocked') {
      alert("Popup was blocked by your browser. Please allow popups for this site.");
    } else if (err.code === 'auth/popup-closed-by-user') {
      alert("You closed the login popup before completing authentication.");
    } else {
      alert("Twitter login failed: " + err.message);
    }
  }
};
const sendTokenToBackend = async (firebaseToken: string) => {
  try {
    const response = await axios.post("http://localhost:8080/api/user/auth", {}, {
      headers: {
        authorization: `Bearer ${firebaseToken}`,
      },
    });
    console.log("Backend response:", response.data);
  } catch (err) {
    console.error("Backend error:", err);
  }
};
  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
      {!user ? (
        <>
          <h1 className="text-2xl font-bold">Sign In</h1>

          {/* Email link */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <button onClick={handleEmailLink} className="bg-blue-500 text-white px-4 py-2 rounded">
            Sign in with Email Link
          </button>

          {/* Google */}
          <button
            onClick={handleGoogleLogin}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Sign in with Google
          </button>

          {/* Twitter */}
          <button
            onClick={handleTwitterLogin}
            className="bg-blue-400 text-white px-4 py-2 rounded"
          >
            Sign in with Twitter
          </button>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold">Welcome, {user.displayName || user.email}</h1>
          {user.photoURL && <img src={user.photoURL} alt="Avatar" className="w-20 h-20 rounded-full" />}
          <button onClick={handleLogout} className="bg-gray-500 text-white px-4 py-2 rounded">
            Logout
          </button>
        </>
      )}
    </main>
  );
}
