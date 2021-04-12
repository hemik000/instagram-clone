import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { db, storage } from "../Config/firebase";
import firebase from "firebase";
import "./Upload.css";
function Upload({ username }) {
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const handleUpload = () => {
    console.log(image);
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const newProgress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(newProgress);
      },
      (error) => {
        console.log(error.message);
        alert(error.message);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username,
            });
            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };

  return (
    <div className="uploadImg">
      <progress
        className="upload__progress"
        value={progress}
        max="100"
      ></progress>
      <input
        type="text"
        placeholder="Enter Caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      ></input>
      <input type="file" onChange={handleChange} />
      <Button onClick={handleUpload}>Post</Button>
    </div>
  );
}

export default Upload;
