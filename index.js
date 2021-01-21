const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const Person = require("./models/person");
const app = express();

//middleware
app.use(express.static("build"));
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

//get all
app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons);
    })
    .catch((error) => next(error));
});

//get one person with id.
app.get("/api/persons/:id", (req, res, next) => {
  console.log("entered get with id");
  console.log(
    "########",
    "req.params.id = ",
    req.params.id,
    "type =",
    typeof req.params.id
  );
  Person.findById(req.params.id)
    .then((person) => {
      res.json(person);
    })
    .catch((error) => {
      console.log("entered catch");
      next(error);
    });
});

//get info
app.get("/info", (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.send(
        `Phonebook has info for ${persons.length} people. <br> ${new Date()}`
      );
    })
    .catch((error) => next(error));
});

//post
app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  if (body === undefined) {
    return res.status(400).json({
      error: "content missing",
    });
  }
  const person = new Person({ name: body.name, number: body.number });

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => {
      next(error);
    });
});

//delete
app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch((error) => next(error));
});

//put
app.put("/api/persons/", (req, res, next) => {
  const body = req.body;

  const updatedPerson = { name: body.name, number: body.number };

  Person.findByIdAndUpdate(body.id, updatedPerson, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => {
      next(error);
    });
});

//error handling middleware
const errorHandler = (error, req, res, next) => {
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    //logging error
    console.log(
      "######",
      "VARIABLE NAME:",
      "error",
      "TYPEOF error:",
      typeof error,
      "VALUE:",
      error,
      "######"
    );
    //end of logging

    return res.status(400).send(error);
  }

  next(error);
};

app.use(errorHandler);

//connection
const PORT = process.env.PORT;

app.listen(PORT, () => `Server running on port ${PORT}.`);
