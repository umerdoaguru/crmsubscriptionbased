import React, { useState, useEffect } from "react";
import { FaCamera } from "react-icons/fa"; // Import the upload (camera) icon from react-icons

const UserProfile = () => {
  const [profile, setProfile] = useState({
    user_name: "",
    email: "",
    phone: "",
    mobile: "",
    address: "",
    bio: "", // Added bio to the profile state
    image: null, // Store file object here instead of Data URL
  });

  const [profileStrength, setProfileStrength] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    calculateProfileStrength();
  }, [profile]);

  const calculateProfileStrength = () => {
    if (!profile) return; // Return early if profile is null

    let score = 0;
    const fields = ["user_name", "email", "phone", "mobile", "address", "bio"];
    fields.forEach((field) => {
      if (profile[field]) {
        score += 100 / fields.length;
      }
    });
    setProfileStrength(Math.round(score));
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, image: file });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    // Use FormData for file and text fields
    const formData = new FormData();
    formData.append("user_name", profile.user_name);
    formData.append("email", profile.email);
    formData.append("phone", profile.phone);
    formData.append("mobile", profile.mobile);
    formData.append("address", profile.address);
    formData.append("bio", profile.bio); // Added bio to FormData
    // Add image file to the formData if an image is present
    if (profile.image) {
      formData.append("profile_picture", profile.image); // Match field name with backend
    }

    try {
      const response = await fetch("https://crmdemo.vimubds5.a2hosted.com/api/editProfile", {
        method: "POST",
        body: formData, // Send the formData instead of JSON
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      const result = await response.json();
      alert("Profile saved successfully!");
      console.log(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your profile?")) {
      try {
        const response = await fetch("https://crmdemo.vimubds5.a2hosted.com/api/deleteUser", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: profile.email }), // Pass email in the request body
        });

        if (!response.ok) {
          throw new Error("Failed to delete profile");
        }

        alert("Profile deleted successfully!");
        setProfile(null); // Clear profile data on successful deletion
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (profile === null) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-100">
        <p className="text-xl text-gray-500">Profile deleted</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full p-6 bg-gray-100">
      <div className="flex flex-col w-full h-full max-w-full overflow-hidden bg-white rounded-lg shadow-lg lg:flex-row">
        {/* Left Section */}
        <div className="flex flex-col items-center p-4 border-r border-gray-200 lg:w-1/3">
          {/* Profile Image */}
          <div className="relative mb-4">
            <img
              src={
                profile.image
                  ? URL.createObjectURL(profile.image)
                  : "https://via.placeholder.com/150"
              }
              alt="User"
              className="object-cover w-32 h-32 border-2 border-gray-200 rounded-full shadow-md"
            />
            <label className="absolute bottom-0 right-0 p-2 bg-gray-800 rounded-full cursor-pointer hover:bg-gray-700">
              <FaCamera className="w-6 h-6 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                title="Change profile picture"
              />
            </label>
          </div>

          <h2 className="mb-2 text-xl font-semibold text-center">
            <input
              type="text"
              name="user_name"
              value={profile.user_name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full text-center bg-transparent border-b border-gray-300 outline-none"
            />
          </h2>

          {/* Optional Bio Section */}
          <p className="text-center text-gray-600">
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows="3"
              placeholder="Write something about yourself..."
              className="w-full p-2 bg-transparent border border-gray-300 rounded-lg outline-none"
            />
          </p>
        </div>

        {/* Right Section */}
        <div className="flex flex-col p-4 overflow-auto lg:w-2/3">
          {/* User Information */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {["user_name", "email", "phone", "mobile", "address"].map(
              (field) => (
                <div className="text-left" key={field}>
                  <h3 className="font-semibold text-gray-700 capitalize">
                    {field.replace(/([A-Z])/g, " $1").toLowerCase()}
                  </h3>
                  <input
                    type="text"
                    name={field}
                    value={profile[field]}
                    onChange={handleChange}
                    placeholder={`Enter your ${field
                      .replace(/([A-Z])/g, " $1")
                      .toLowerCase()}`}
                    className="w-full p-2 mt-1 border border-gray-300 rounded-lg outline-none"
                  />
                </div>
              )
            )}
          </div>

          {/* Save and Delete Buttons */}
          <div className="flex justify-end mt-4 space-x-4">
            <button
              onClick={handleSave}
              className="px-6 py-2 text-white transition bg-green-600 rounded-lg hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
            <button
              onClick={handleDelete}
              className="px-6 py-2 text-white transition bg-red-600 rounded-lg hover:bg-red-700"
            >
              Delete Profile
            </button>
          </div>

          {/* Error Message */}
          {error && <p className="mt-4 text-red-600">{error}</p>}

          {/* Profile Strength Indicator */}
          <div className="flex flex-col mt-6 lg:flex-row lg:space-x-4">
            <div className="w-full p-4 bg-gray-100 rounded-lg shadow-md">
              <h4 className="mb-2 text-lg font-semibold">Profile Strength</h4>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className={`h-full bg-blue-600 rounded-full`}
                  style={{ width: `${profileStrength}%` }}
                ></div>
              </div>
              <p className="mt-2 text-gray-600">{profileStrength}% Complete</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
