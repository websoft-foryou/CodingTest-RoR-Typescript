import React, { useEffect, useState } from "react";
import { Container, ListGroup, Form } from "react-bootstrap";
import { ResetButton } from "./uiComponent";
import axios from "axios";

type TodoItem = {
  id: number;
  title: string;
  checked: boolean;
};

type Props = {
  todoItems: TodoItem[];
};

const TodoList: React.FC<Props> = ({ todoItems }) => {  
  const [state, setState] = React.useState<{ selections: number[] }>({ selections: [] });

  useEffect(() => {
    const token = document.querySelector(
      "[name=csrf-token]"
    ) as HTMLMetaElement;
    axios.defaults.headers.common["X-CSRF-TOKEN"] = token.content;
    
    let sel = state.selections;
    todoItems.map((item) => {
      if (item.checked) sel.push(item.id);
    });
    setState({ selections: sel});
  }, []);

  const checkBoxOnCheck = (
    e: React.ChangeEvent<HTMLInputElement>,
    todoItemId: number
  ): void => {
    axios.post("/todo", {
      id: todoItemId,
      checked: e.target.checked,
    });

    let sel = state.selections;
    let find = sel.indexOf(todoItemId);
    if (find > -1) {
      sel.splice(find, 1);
    } else {
      sel.push(todoItemId);
    }

    setState({ selections: sel});
  };

  const resetButtonOnClick = (): void => {
    axios.post("/reset").then(() => location.reload());
  };

  return (
    <Container>
      <h3>2022 Wish List</h3>
      <ListGroup>
        {todoItems.map((todo) => (
          <ListGroup.Item key={todo.id}>
            <Form.Check
              type="checkbox"
              label={todo.title}
              checked={state.selections.includes(todo.id)}
              onChange={(e) => checkBoxOnCheck(e, todo.id)}
            />
          </ListGroup.Item>
        ))}
        <ResetButton onClick={resetButtonOnClick}>Reset</ResetButton>
      </ListGroup>
    </Container>
  );
};

export default TodoList;
