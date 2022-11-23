import React, { useRef, useState } from "react";
import crossIcon from "../../assets/images/delete-button.png";
import paperClip from "../../assets/images/paper-clip.png";

import { updateDoc, doc, arrayUnion, deleteDoc } from "firebase/firestore";

import {
  db,
  imageRef,
  storageRef,
  storageDeletFolderRef,
} from "../../firebase";
import {
  deleteObject,
  getDownloadURL,
  uploadString,
  listAll,
} from "firebase/storage";

export const Todo = ({
  todoId,
  title,
  description,
  dateOfCompletion,
  images = [],
  time,
}) => {
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

  const imgRef = useRef(null);
  console.log();
  const handleAddFile = async () => {
    if (selectedFile) {
      try {
        const imagePath = imageRef(todoId, selectedFileName);

        await uploadString(imagePath, selectedFile, "data_url").then(
          async () => {
            const downloadUrl = await getDownloadURL(imagePath);

            if (downloadUrl) {
              await updateDoc(doc(db, "todos", todoId), {
                images: arrayUnion(downloadUrl),
              });
            }

            setSelectedFile("");
            setSelectedFileName("");
          },
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const addFileToState = async (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      setSelectedFileName(e.target.files[0].name);
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  const handleDeleteTodo = async () => {
    deleteDoc(doc(db, "todos", todoId));

    listAll(storageRef(todoId))
      .then((res) => {
        res.items.forEach((itemRef) => {
          deleteObject(storageDeletFolderRef(itemRef.fullPath)).catch((error) =>
            console.log(error),
          );
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <li className="todo">
      <div className="title-container">
        <h2>{title}</h2>
        <button onClick={handleDeleteTodo}>
          <img className="cross" src={crossIcon} alt="Cross" />
        </button>
      </div>

      <div className="description-container">
        <p>{description}</p>
        <div>{dateOfCompletion}</div>
      </div>

      <div className="image-container">
        {images?.map((image) => (
          <img key={image} src={image} alt="" />
        ))}
      </div>

      <input
        className="input-file"
        type="file"
        onChange={addFileToState}
        accept="image/*"
        ref={imgRef}
      />

      <div className="upload-container">
        {selectedFile && <p>File selected</p>}
        <img
          className="paper-clip"
          onClick={() => {
            imgRef.current.click();
          }}
          src={paperClip}
          alt="paper-clip"
        />
        <button className="uplad-button" onClick={handleAddFile}>
          Upload
        </button>
      </div>
    </li>
  );
};
