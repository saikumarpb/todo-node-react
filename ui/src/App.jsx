import { useEffect, useState } from 'react';
import './App.css';
import { deleteTodo, fetchTodoList, postTodo } from './api';

function App() {
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [todoList, setTodoList] = useState([]);

  const getTodoList = async () => {
    try {
      const res = await fetchTodoList();
      if (res.data) {
        setTodoList(() => res.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const addTodo = async () => {
    try {
      await postTodo(newTodo);
      getTodoList();
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (e, key) =>
    setNewTodo((prev) => {
      if (key === 'title') {
        return { ...prev, title: e.target.value };
      } else {
        return { ...prev, description: e.target.value };
      }
    });

  const removeTodo = async(id) => {
      try{
     await deleteTodo(id)
     getTodoList()
    } catch(e){
      console.log(e)
    }
  }

  useEffect(() => {
    getTodoList();
  }, []);

  return (
    <>
      <h1>Todo App</h1>
      <div>
        <AddTodo
          title={newTodo.title}
          description={newTodo.description}
          handleChange={handleChange}
          addTodo={addTodo}
        />
        <div>
          <TodoList todoList={todoList} removeTodo={removeTodo}/>
        </div>
      </div>
    </>
  );
}

// function Todo(props) {
//   // Add a delete button here so user can delete a TODO.
//   return <div>{props.title}</div>;
// }

function AddTodo({ title, description, handleChange, addTodo }) {
  return (
    <div>
      <input
        type="text"
        value={title}
        onChange={(e) => handleChange(e, 'title')}
      />
      <input
        id="description"
        type="text"
        value={description}
        onChange={(e) => handleChange(e, 'description')}
      />
      <button onClick={addTodo}>Add</button>
    </div>
  );
}

function TodoList({ todoList, removeTodo }) {
  return todoList.map(({ id, title, description }) => (
    <Todo id={id} title={title} description={description}  removeTodo = {removeTodo} key={id} />
  ));
}

function Todo({ id, title, description, removeTodo }) {
  return (
    <div>
      <span>{title}</span>
      <span>{description}</span>
      <button onClick={()=>removeTodo(id)}>x</button>
    </div>
  );
}

export default App;
