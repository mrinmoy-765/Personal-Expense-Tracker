const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// Allow frontend origin
// CORS
//middleware
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
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

    const verifyToken = (req, res, next) => {
      const token = req.cookies.accessToken;
      // console.log("inside verify token", token);

      if (!token) return res.status(401).send("Unauthorized");

      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).send("Forbidden");
        req.user = decoded;
        console.log("Decoded JWT:", decoded);
        next();
      });
    };

    //create user
    app.post("/register", async (req, res) => {
      try {
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

        // generate JWT
        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        // send as HTTP-only cookie
        res.cookie("accessToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({
          message: "Login successful",
          user: { _id: user._id, username: user.username },
        });
      } catch (error) {
        res.status(500).json({ message: "Server error" });
      }
    });

    //add expense
    app.post("/addExpense", verifyToken, async (req, res) => {
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

    //get expenses
    app.get("/getExpenses/:uid", verifyToken, async (req, res) => {
      const userId = req.params.uid;
      try {
        const expenses = await PET_expenseCollection.find({ userId }).toArray();

        res.json(expenses);
      } catch (err) {
        console.error("Error fetching expenses", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    //delete expense
    app.delete("/deleteExpense/:id", verifyToken, async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await PET_expenseCollection.deleteOne(query);

        res.json(result);
      } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
      }
    });

    // Update expense
    app.patch("/updateExpense/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const { title, amount, category, date } = req.body;

      try {
        const result = await PET_expenseCollection.updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              title,
              amount,
              category,
              date,
            },
          }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ error: "Expense not found" });
        }

        res.json({ message: "Expense updated successfully", result });
      } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ error: "Failed to update expense" });
      }
    });

    // Get total expense for a user
    app.get("/totalExpense/:uid", async (req, res) => {
      const userId = req.params.uid;

      try {
        const totalResult = await PET_expenseCollection.aggregate([
          { $match: { userId } },
          { $group: { _id: null, total: { $sum: { $toDouble: "$amount" } } } },
        ]).toArray();

        const total = totalResult[0]?.total || 0;

        res.json({ total });
      } catch (error) {
        console.error("Error fetching total expense:", error);
        res.status(500).json({ error: "Internal Server Error" });
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
