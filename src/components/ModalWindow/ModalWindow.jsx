import React, { useState } from "react";
import { Input } from "../Input";
import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";

import { db, imageRef } from "../../firebase";
import { getDownloadURL, uploadString } from "firebase/storage";

export const ModalWindow = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateOfCompletion, setDateOfCompletion] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

  const handleAddNewTodo = async () => {
    if (title.trim()) {
      try {
        const docRef = await addDoc(collection(db, "todos"), {
          title: title,
          description: description,
          dateOfCompletion: dateOfCompletion,
          completed: false,
          timestamp: serverTimestamp(),
        });

        const imagePath = imageRef(docRef.id, selectedFileName);

        if (selectedFile) {
          await uploadString(imagePath, selectedFile, "data_url")
            .then(async () => {
              const downloadUrl = await getDownloadURL(imagePath);

              if (downloadUrl) {
                await updateDoc(doc(db, "todos", docRef.id), {
                  images: [downloadUrl],
                });
              }
            })
            .catch((error) => console.log(error));
        }

        setTitle("");
        setDescription("");
        setDateOfCompletion("");
        setSelectedFile("");
        setSelectedFileName("");
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  const addFileToState = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      setSelectedFileName(e.target.files[0].name);
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  return (
    <div className="modal">
      <h2>Title</h2>
      <Input value={title} onChange={(e) => setTitle(e.target.value)} />

      <h2>Description</h2>
      <Input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <h2>Date</h2>
      <Input
        type="datetime-local"
        value={dateOfCompletion}
        onChange={(e) => setDateOfCompletion(e.target.value)}
      />

      <Input type="file" onChange={addFileToState} accept="image/*" />

      <button type="submit" className="modal-button" onClick={handleAddNewTodo}>
        Add new todo
      </button>
    </div>
  );
};
