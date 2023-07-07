import { useEffect, useState } from 'react';
import './App.css';
import { deleteTodo, fetchTodoList, postTodo, updateTodo } from './api';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';

function App() {
  const emptyTodo = { title: '', description: '' };
  const [newTodo, setNewTodo] = useState(emptyTodo);
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
      setNewTodo(() => emptyTodo);
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

  const removeTodo = async (id) => {
    try {
      await deleteTodo(id);
      getTodoList();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getTodoList();
  }, []);

  return (
    <div
      className="p-3 d-flex m-auto justify-content-center"
      style={{ maxWidth: '750px' }}
    >
      <div className="d-flex flex-column align-items-center justify-content-center">
        <h1 style={{ fontStyle: 'italic' }}>Todo</h1>
        <div>
          <AddTodo
            title={newTodo.title}
            description={newTodo.description}
            handleChange={handleChange}
            addTodo={addTodo}
          />
          <div className="pt-3 d-flex flex-row">
            <TodoList
              todoList={todoList}
              removeTodo={removeTodo}
              getTodoList={getTodoList}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function TodoList({ todoList, removeTodo, getTodoList }) {
  return (
    <Stack gap={2} className="col-md-5 mx-auto">
      {todoList.map(({ id, title, description }) => (
        <Todo
          id={id}
          title={title}
          description={description}
          removeTodo={removeTodo}
          key={id}
          getTodoList={getTodoList}
        />
      ))}
    </Stack>
  );
}

function AddTodo({ title, description, handleChange, addTodo }) {
  return (
    <div className="mw-50">
      <Form className="d-flex flex-column">
        <Form.Group className="mb-3" controlId="title">
          <Form.Control
            type="text"
            placeholder="Title"
            onChange={(e) => handleChange(e, 'title')}
            value={title}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="description">
          <Form.Control
            type="text"
            placeholder="description"
            onChange={(e) => handleChange(e, 'description')}
            value={description}
          />
        </Form.Group>

        <Button variant="success" type="submit" onClick={addTodo}>
          Add
        </Button>
      </Form>
    </div>
  );
}

function Todo({ id, title, description, removeTodo, getTodoList }) {
  const [isEditing, setIsEditing] = useState(false);
  const [todo, setTodo] = useState({ id, title, description });

  const handleChange = (e, key) => {
    setTodo((prev) => {
      if (key === 'title') {
        return { ...prev, title: e.target.value };
      } else {
        return { ...prev, description: e.target.value };
      }
    });
  };

  const handleSave = async () => {
    try {
      await updateTodo(todo);
      setIsEditing(false);
      getTodoList();
    } catch (e) {
      console.log(e);
    }
  };

  const cancelEdit = () => setIsEditing(false);

  return (
    <div>
      {isEditing ? (
        <EditTodo
          id={todo.id}
          title={todo.title}
          description={todo.description}
          handleChange={handleChange}
          removeTodo={removeTodo}
          handleSave={handleSave}
          cancelEdit={cancelEdit}
        />
      ) : (
        <div>
          <span className="px-3">{title}</span>
          <span>{description}</span>
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Edit
          </Button>
          <Button variant="outline-danger" onClick={() => removeTodo(id)}>
            Delete
          </Button>
        </div>
      )}
    </div>
  );
}

function EditTodo({
  title,
  description,
  handleChange,
  cancelEdit,
  handleSave,
}) {
  return (
    <div>
      <Form className="d-flex flex-column">
        <Form.Group className="mb-3" controlId="title">
          <Form.Control
            type="text"
            placeholder="Title"
            onChange={(e) => handleChange(e, 'title')}
            value={title}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="description">
          <Form.Control
            type="text"
            placeholder="description"
            onChange={(e) => handleChange(e, 'description')}
            value={description}
          />
        </Form.Group>

        <Button variant="success" type="submit" onClick={handleSave}>
          Save
        </Button>

        <Button variant="success" type="submit" onClick={cancelEdit}>
          Cancel
        </Button>
      </Form>
    </div>
  );
}

export default App;
