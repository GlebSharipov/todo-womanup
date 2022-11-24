import React, { useRef, useState } from "react";
import crossIcon from "../../assets/images/delete-button.png";
import paperClip from "../../assets/images/paper-clip.png";
import dayjs from "dayjs";
import { Input } from "../Input";

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
  completed,
  timeIsUp,
}) => {
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isEditModeTitle, setIsEditModeTitle] = useState(false);
  const [isEditModeDescription, setIsEditDescription] = useState(false);

  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description);

  const imgRef = useRef(null);

  const timeToCompletion = dayjs(dateOfCompletion).$d - dayjs().$d;

  if (timeToCompletion > 0) {
    setTimeout(() => {
      updateDoc(doc(db, "todos", todoId), {
        timeIsUp: true,
      });
    }, timeToCompletion);
  } else if (timeToCompletion < 0) {
    updateDoc(doc(db, "todos", todoId), {
      timeIsUp: true,
    });
  }

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

  const handleChangeTitle = (e) => {
    if (e.code === "Enter") {
      if (editTitle.trim() !== title) {
        updateDoc(doc(db, "todos", todoId), {
          title: editTitle,
        });
      }

      setIsEditModeTitle(false);
    }
  };

  const handleChangeDescription = (e) => {
    if (e.code === "Enter") {
      if (editDescription.trim() !== description) {
        updateDoc(doc(db, "todos", todoId), {
          description: editDescription,
        });
      }

      setIsEditDescription(false);
    }
  };

  const handleOnBlurTitle = () => {
    if (editTitle.trim() !== title) {
      updateDoc(doc(db, "todos", todoId), {
        title: editTitle,
      });
    }

    setIsEditModeTitle(false);
  };

  const handleOnBlurDescription = () => {
    if (editDescription.trim() !== description) {
      updateDoc(doc(db, "todos", todoId), {
        description: editDescription,
      });
    }
    setIsEditDescription(false);
  };

  const handleTaskCompletion = () => {
    updateDoc(doc(db, "todos", todoId), {
      completed: true,
    });
  };

  return (
    <li className="todo">
      <div className="title-container">
        <Input type="checkbox" onClick={handleTaskCompletion} />
        <div className="todo-complited">{timeIsUp && "Task timed out :("}</div>
        <button onClick={handleDeleteTodo}>
          <img className="cross" src={crossIcon} alt="Cross" />
        </button>
      </div>

      <div className="description-container">
        {isEditModeTitle ? (
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleChangeTitle}
            onBlur={handleOnBlurTitle}
            autoFocus
          />
        ) : (
          <h2 onClick={() => setIsEditModeTitle(true)}>{title}</h2>
        )}

        {isEditModeDescription ? (
          <Input
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            onKeyDown={handleChangeDescription}
            onBlur={handleOnBlurDescription}
            autoFocus
          />
        ) : (
          <p onClick={() => setIsEditDescription(true)}>{description}</p>
        )}
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
        <div className="date">{dateOfCompletion}</div>

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
