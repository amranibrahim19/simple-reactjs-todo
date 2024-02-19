const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

const { createProxyMiddleware } = require("http-proxy-middleware");

const cors = require("cors");

const app = express();

const PORT = 3001;

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

// app.use(
//   "/api",
//   createProxyMiddleware({
//     target: "http://localhost:3000", // Replace with the actual API server URL
//     changeOrigin: true,
//   })
// );

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.get("/api/todos", cors(corsOptions), (req, res) => {
  const data = fs.readFileSync("./data/lists.json");
  const todos = JSON.parse(data);

  res.json({ data: todos });
});

app.post("/api/todos", cors(corsOptions), (req, res) => {
  const data = fs.readFileSync("./data/lists.json");
  const todos = JSON.parse(data);
  const newTodo = {
    id: todos.length + 1,
    task: req.body.task,
    completed: false,
  };

  try {
    todos.push(newTodo);
    fs.writeFileSync("./data/lists.json", JSON.stringify(todos));
    res.json(newTodo);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
});

// view todo
app.get("/api/todos/:id", cors(corsOptions), (req, res) => {
    const data = fs.readFileSync("./data/lists.json");
    const todos = JSON.parse(data);
    const id = req.params.id;
    const todo = todos.find((todo) => todo.id === parseInt(id));
    
    if (!todo) {
        return res.status(404).json({ error: "Todo not found" });
    }
    
    res.json(todo); 
});

// update todo
app.put("/api/todos/:id", cors(corsOptions), (req, res) => {
  const data = fs.readFileSync("./data/lists.json");
  const todos = JSON.parse(data);
  const updatedTodo = req.body;
  const id = req.params.id;
  const completed = req.body.completed;

  const todoIndex = todos.findIndex((todo) => todo.id === parseInt(id));
  if (todoIndex === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }
  todos[todoIndex].completed = completed;

  try {
    fs.writeFileSync("./data/lists.json", JSON.stringify(todos));
    res.json(updatedTodo);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
});

// delete todo
app.delete("/api/todos/:id", cors(corsOptions), (req, res) => {
  const data = fs.readFileSync("./data/lists.json");
  const todos = JSON.parse(data);
  const id = req.params.id;

  const todoIndex = todos.findIndex((todo) => todo.id === parseInt(id));
  if (todoIndex === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }
  todos.splice(todoIndex, 1);

  try {
    fs.writeFileSync("./data/lists.json", JSON.stringify(todos));
    res.json({ id: parseInt(id) });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// The server is now running on port 3001. You can test the server by running the following command in the terminal:
