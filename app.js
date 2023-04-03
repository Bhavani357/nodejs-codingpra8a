const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
module.exports = app;

const dbPath = path.join(__dirname, "todoApplication.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/todos/", async (request, response) => {
  const { status } = request.query;
  const getTodo = `
    SELECT 
     *
    FROM
     todo
    WHERE 
      status = '${status}';
      `;
  const result = await db.all(getTodo);
  response.send(result);
});

app.get("/todos/", async (request, response) => {
  const { priority } = request.query;
  const getTodoPriority = `
    SELECT 
     *
    FROM
     todo
    WHERE 
      priority LIKE '${priority}';
      `;
  const result = await db.all(getTodoPriority);
  response.send(result);
});

app.get("/todos/", async (request, response) => {
  const { priority, status } = request.query;
  const getTodoPriorityAndStatus = `
    SELECT 
     *
    FROM
     todo
    WHERE 
      priority LIKE '${priority}' AND status LIKE '${status}';
      `;
  const result = await db.all(getTodoPriorityAndStatus);
  response.send(result);
});

app.get("/todos/", async (request, response) => {
  const { search_q } = request.query;
  const getTodoPriorityAndStatus = `
    SELECT 
     *
    FROM
     todo
    WHERE 
      todo LIKE '%${search_q}%';
      `;
  const result = await db.all(getTodoPriorityAndStatus);
  response.send(result);
});

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getTodoPriorityAndStatus = `
    SELECT 
     *
    FROM
     todo
    WHERE 
      id = '${todoId}';
      `;
  const result = await db.get(getTodoPriorityAndStatus);
  response.send(result);
});

app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status } = request.body;

  const postTodoPriorityAndStatus = `
    INSERT INTO 
    todo(id,todo,priority,status)
    VALUES ('${id}',
    '${todo}','${priority}','${status}');
      `;
  const result = await db.run(postTodoPriorityAndStatus);
  response.send("Todo Successfully Added");
});
