import { useEffect, useState } from "react";
import "./styles/App.less";

import { Todo, ModalWindow } from "./components";

import { db } from "./firebase";
import { collection, orderBy, onSnapshot, query } from "firebase/firestore";

function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    onSnapshot(
      query(collection(db, "todos"), orderBy("timestamp")),
      (snapshot) => {
        setTodos(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })),
        );
      },
    );
  }, []);

  return (
    <div className="App">
      <ModalWindow />

      <ul className="todo-list">
        {todos?.map((todo) => {
          const {
            id,
            title,
            description,
            dateOfCompletion,
            images,
            timestamp,
            completed,
            performed,
            timeIsUp,
          } = todo;
          return (
            <Todo
              key={id}
              title={title}
              description={description}
              dateOfCompletion={dateOfCompletion}
              images={images}
              todoId={id}
              time={timestamp}
              completed={completed}
              performed={performed}
              timeIsUp={timeIsUp}
            />
          );
        })}
      </ul>
    </div>
  );
}

export default App;
