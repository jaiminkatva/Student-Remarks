import express from "express";
import morgan from "morgan";
import moment from "moment";
import mongoose from "mongoose";
import Student from "./model/Student.js";
import Remark from "./model/Remark.js";

const app = express();
const PORT = process.env.PORT || 80

app.use(morgan("dev"));

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://admin:1234@cluster0.mgxihpr.mongodb.net/student-remarks?retryWrites=true&w=majority"
    // {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // }
  )
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("AddStudent");
});

app.post("/", async (req, res) => {
  const info = {
    name: req.body.name,
    email: req.body.email,
    age: req.body.age,
  };

  await Student.create(info);
  console.log("Data Inserted Successfully");
  res.redirect("/stud");
});

app.get("/stud", async (req, res) => {
  await Student.find().then((stud) => {
    res.render("ShowStudent", { stud });
  });
});

app.get("/stud/:id", async (req, res) => {
  const { id } = req.params;
  await Student.findById(id).then((stud) => {
    res.render("AddRemark", { stud });
  });
});

app.post("/stud/:id", async (req, res) => {
  const info = {
    text: req.body.text,
    student: req.body.student,
    date: Date.now(),
  };
  await Remark.create(info).then(() => {
    console.log("Remark Added");
    res.redirect("/stud");
  });
});

app.get("/stud/show_details/:id", async (req, res) => {
  const { id } = req.params;
  Student.findById(id).then((stud) => {
    Remark.find().then((remarks) => {
      res.render("ShowStudentDetails", { stud, remarks, moment });
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
