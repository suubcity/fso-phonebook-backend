import express from "express";
import morgan from "morgan";
import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json());

morgan.token("postData", (req) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :postData"
  )
);

let persons = [
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
  {
    name: "Marty",
    number: "1234",
    id: 5,
  },
  {
    name: "Tickle",
    number: "12314414",
    id: 6,
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = +req.params.id;

  const person = persons.find((person) => person.id === id);
  morgan.token("tiny");
  res.json(person);
});

app.get("/info", (req, res) => {
  res.send(
    `Phonebook has info for ${persons.length} people. <br> ${new Date()}`
  );
});

app.delete("/api/persons/:id", (req, res) => {
  const id = +req.params.id;
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.post("/api/persons", (req, res) => {
  const newPerson = req.body;

  if (!newPerson.name || !newPerson.number) {
    return res.status(400).json({ error: "content missing" });
  }
  if (persons.find((person) => person.name === newPerson.name)) {
    return res.status(400).json({ error: "name must be unique" });
  }

  newPerson.id = getRandomInt(10, 9999);

  persons = persons.concat(newPerson);

  res.json(newPerson);
});

app.put("/api/persons/:id", (req, res) => {
  const id = +req.params.id;
  const newPerson = req.body;
  newPerson.id = id;
  persons = persons.filter((person) => person.id !== id);
  persons = persons.concat(newPerson);
  res.json(persons);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => `Server running on port ${PORT}.`);
