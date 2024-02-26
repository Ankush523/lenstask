import React, { useState } from "react";
import axios from "axios";

const Profile = () => {
  const [handle, setHandle] = useState("");
  const [address, setAddress] = useState(
    process.env.WALLET_ADDR
  );
  const [profileId, setProfileId] = useState("");
  const [authResult, setAuthResult] = useState<any>(null);
  const [profileResult, setProfileResult] = useState<any>(null);
  const [managedProfiles, setManagedProfiles] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [textMessage, setTextMessage] = useState("");
  const [postedContents, setPostedContents] = useState<any>([]);
  const [posting, setPosting] = useState(false);
  const [postResult, setPostResult] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const createProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "https://lensserver.onrender.com/createProfile",
        {
          handle,
          to: address,
        }
      );
      setProfileResult(response.data);
      setIsLoggedIn(true); // Assume creating a profile also logs you in
    } catch (err: any) {
      setError(err.response?.data?.error || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchManagedProfiles = async () => {
    setLoadingProfiles(true);
    setError("");
    try {
      const response = await axios.get(
        `https://lensserver.onrender.com/getManagedProfiles?walletAddress=${address}`
      );
      setManagedProfiles(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "An error occurred while fetching managed profiles"
      );
    } finally {
      setLoadingProfiles(false);
    }
  };

  const loginProfile = async () => {
    setLoadingAuth(true);
    setError("");
    try {
      const response = await axios.post(
        "https://lensserver.onrender.com/loginProfile",
        {
          address,
          profile_id: profileId,
        }
      );
      setAuthResult(response.data);
      setIsLoggedIn(true); // Set login state to true upon successful login
    } catch (err: any) {
      setError(err.response?.data?.error || "An error occurred during login");
    } finally {
      setLoadingAuth(false);
    }
  };

  const postContent = async () => {
    setPosting(true);
    setError("");
    try {
      const response = await axios.post(
        "https://lensserver.onrender.com/postContent",
        {
          textMessage,
        }
      );
      setPostResult("Content posted successfully!");
      setPostedContents((prevContents: any) => [...prevContents, textMessage]);
      console.log(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.error || "An error occurred while posting content"
      );
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-black">
      {!isLoggedIn ? (
        <>
          <div className="bg-white p-6 rounded-lg shadow-lg mb-4 w-[30%]">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Create Lens Profile
            </h2>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Handle"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="p-2 w-full border rounded-md"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="p-2 w-full border rounded-md"
              />
            </div>
            <button
              onClick={createProfile}
              disabled={loading}
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            >
              Create Profile
            </button>
            {loading && <p className="mt-4">Creating profile...</p>}
            {error && <p className="mt-4 text-red-500">{error}</p>}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg mt-4 w-[30%]">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Login to Profile
            </h2>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Profile ID"
                value={profileId}
                onChange={(e) => setProfileId(e.target.value)}
                className="p-2 w-full border rounded-md"
              />
            </div>
            <button
              onClick={loginProfile}
              disabled={loadingAuth}
              className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 disabled:bg-green-300"
            >
              Login
            </button>
            {loadingAuth && <p className="mt-4">Logging in...</p>}
            {error && <p className="mt-4 text-red-500">{error}</p>}
          </div>
        </>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg w-[30%]">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Welcome !</h2>
          <p>
            {profileResult
              ? `Your Lens profile ${handle} has been created successfully.`
              : "You are logged in successfully."}
          </p>
        </div>
      )}

      {managedProfiles ? (
        !isLoggedIn && (
          <div className="bg-white p-6 rounded-lg shadow-lg mt-4 w-[30%]">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Managed Profiles
            </h2>
            {Array.isArray(managedProfiles) ? (
              managedProfiles.map((profile, index) => (
                <div key={index} className="mb-2">
                  <p>Profile Id: {profile.id}</p>
                  <p>Handle: {profile.handle.fullHandle}</p>
                </div>
              ))
            ) : (
              <div className="mb-2">
                <p>Profile Id: {managedProfiles.id}</p>
                <p>Handle: {managedProfiles.handle.fullHandle}</p>
              </div>
            )}
          </div>
        )
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg mt-4 w-[30%]">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Managed Profiles
          </h2>
          <p>No managed profiles found.</p>
        </div>
      )}

      {!isLoggedIn && (
        <button
          onClick={fetchManagedProfiles}
          disabled={loadingProfiles}
          className="mt-4 bg-purple-500 text-white p-2 rounded-md hover:bg-purple-600 disabled:bg-purple-300"
        >
          Fetch Managed Profiles
        </button>
      )}
      {loadingProfiles && <p className="mt-4">Fetching managed profiles...</p>}

      {isLoggedIn && (
        <div className="bg-white p-6 rounded-lg shadow-lg mt-4 w-[30%]">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Post Content
          </h2>
          <input
            type="text"
            placeholder="Enter message to post"
            value={textMessage}
            onChange={(e) => setTextMessage(e.target.value)}
            className="p-2 w-full border rounded-md mb-4"
          />
          <button
            onClick={postContent}
            disabled={posting}
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            Submit
          </button>
          {posting && <p className="mt-4">Posting content...</p>}
          {postResult && <p className="mt-4 text-green-500">{postResult}</p>}
          {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
      )}
      {postedContents.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-lg mt-4 w-[30%]">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Posted Content
          </h2>
          {postedContents.map((content: any, index: any) => (
            <div key={index} className="mb-2 p-2 border-b">
              {content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
