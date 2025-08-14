//port bcrypt from "bcrypt";
const express = require("express");
//const jwt = require("jsonwebtoken");
//const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
//const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// Allow frontend origin
// CORS
//middleware
//app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    // credentials: true,
  })
);

app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ncoxxcy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    const PET_userCollection = client
      .db("PersonalExpenseTracker")
      .collection("users");

    const PET_expenseCollection = client
      .db("PersonalExpenseTracker")
      .collection("expenses");

    //create user
    app.post("/register", async (req, res) => {
      try {
        console.log("hitted");
        const { username, password } = req.body;

        const existingUser = await PET_userCollection.findOne({ username });
        if (existingUser) {
          return res.status(409).json({ message: "Username already taken" });
        }

        const result = await PET_userCollection.insertOne({
          username,
          password,
          createdAt: new Date(),
        });

        res.status(201).json({
          message: "User registered successfully",
          userId: result.insertedId,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
      }
    });

    //log in user
    app.post("/login", async (req, res) => {
      try {
        const { username, password } = req.body;

        const user = await PET_userCollection.findOne({ username });
        if (!user) {
          return res
            .status(401)
            .json({ message: "Invalid username or password" });
        }

        if (password !== user.password) {
          return res
            .status(401)
            .json({ message: "Invalid username or password" });
        }

        res.json({
          message: "Login successful",
          user: { _id: user._id, username: user.username },
        });
      } catch (error) {
        res.status(500).json({ message: "Server error" });
      }
    });

    //add expense
    app.post("/addExpense", async (req, res) => {
      const newExpense = {
        ...req.body,
        createdAt: new Date(),
      };

      try {
        const result = await PET_expenseCollection.insertOne(newExpense);
        res.send(result);
      } catch (error) {
        console.error("Failed to insert Expense:", error);
        res.status(500).send({ error: "Insertion failed" });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("personal expense tracker is running");
});

app.listen(port, () => {
  console.log(` Personal Expense Tracker
 is running on port: ${port}`);
});
