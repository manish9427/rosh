import "./App.css";

import React, { useState, useEffect } from "react";

const App = () => {
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState("");
  const [images, setImages] = useState([]);
  const [userInfoArray, setUserInfoArray] = useState([]);

  useEffect(() => {
    refreshAllImages();
    refreshUserInfo();
  }, []);

  const handleUpload = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    try {
      const response = await fetch(
        "https://roshbackend-production.up.railway.app/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        refreshAllImages();
        refreshUserInfo();
      } else {
        console.error("Error uploading image:", response.status);
        setMessage("Error uploading image. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage("Error uploading image. Please try again.");
    }
  };

  const handleUserInfoSubmit = async (event) => {
    event.preventDefault();

    const age = event.target.age.value;
    const name = event.target.name.value;
    const profession = event.target.profession.value;

    try {
      const response = await fetch(
        "https://roshbackend-production.up.railway.app/addUserInfo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ age, name, profession }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        refreshUserInfo();
      } else {
        console.error("Error adding user information:", response.status);
        setMessage("Error adding user information. Please try again.");
      }
    } catch (error) {
      console.error("Error adding user information:", error);
      setMessage("Error adding user information. Please try again.");
    }
  };

  const refreshAllImages = async () => {
    try {
      const response = await fetch(
        "https://roshbackend-production.up.railway.app/allImages"
      );
      if (response.ok) {
        const images = await response.json();
        setImages(images);
      } else {
        console.error("Error retrieving all images:", response.status);
      }
    } catch (error) {
      console.error("Error retrieving all images:", error);
    }
  };

  const downloadImage = async (id) => {
    try {
      const response = await fetch(
        `https://roshbackend-production.up.railway.app/download/${id}`
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "image.jpg";
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        console.error("Error downloading image:", response.status);
      }
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  const deleteImage = async (id) => {
    try {
      const response = await fetch(
        `https://roshbackend-production.up.railway.app/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        refreshAllImages();
      } else {
        console.error("Error deleting image:", response.status);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const refreshUserInfo = async () => {
    try {
      const response = await fetch(
        "https://roshbackend-production.up.railway.app/allUserInfo"
      );
      if (response.ok) {
        const userInfoArray = await response.json();
        setUserInfoArray(userInfoArray);
      } else {
        console.error("Error retrieving user information:", response.status);
      }
    } catch (error) {
      console.error("Error retrieving user information:", error);
    }
  };

  return (
    <div>
      <h1>Image Upload</h1>
      <form
        id="uploadForm"
        encType="multipart/form-data"
        onSubmit={handleUpload}
      >
        <input type="file" name="image" accept="image/*" required />
        <button type="submit">Upload Image</button>
      </form>
      <div id="message">{message}</div>
      <div id="progress">{progress}</div>

      <div>
        {images.map((image) => (
          <div key={image._id}>
            <img
              src={`data:${image.contentType};base64,${image.data}`}
              alt="Uploaded"
              style={{ maxWidth: "100%" }}
            />
            <button onClick={() => downloadImage(image._id)}>Download</button>
            <button onClick={() => deleteImage(image._id)}>Delete</button>
          </div>
        ))}
      </div>

      <h2>Add User Information</h2>
      <form id="userInfoForm" onSubmit={handleUserInfoSubmit}>
        <label htmlFor="age">Age:</label>
        <input type="number" id="age" name="age" required />

        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" required />

        <label htmlFor="profession">Profession:</label>
        <input type="text" id="profession" name="profession" required />

        <button type="submit">Add User Info</button>
      </form>

      <div>
        {userInfoArray.map((userInfo) => (
          <div key={userInfo._id}>
            <h2>User Information</h2>
            <p>
              <strong>Age:</strong> {userInfo.age}
            </p>
            <p>
              <strong>Name:</strong> {userInfo.name}
            </p>
            <p>
              <strong>Profession:</strong> {userInfo.profession}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
