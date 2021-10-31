const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5050;
const { MongoClient } = require("mongodb");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

const app = express();

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DATABASE_USER_NAME}:${process.env.DATABASE_USER_PASS}@cluster0.upkhf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const bookinaDB = async () => {
  try {
    await client.connect();
    const database = client.db("bookina");
    const services = database.collection("services");
    const bookings = database.collection("bookings");

    // get all services
    app.get("/services", async (req, res) => {
      const cursor = services.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    // get one service by id
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await services.findOne(query);
      res.send(result);
    });

    // get all bookings

    app.get("/allBookings", async (req, res) => {
      const cursor = bookings.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    // get  bookings for particular user

    app.get("/bookings", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = bookings.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // post bookings to database
    app.post("/bookings", async (req, res) => {
      const bookingInfo = req.body;
      const result = await bookings.insertOne(bookingInfo);
      res.send(result);
    });

    // post service to database
    app.post("/services", async (req, res) => {
      const serviceInfo = req.body;
      const result = await services.insertOne(serviceInfo);
      res.send(result);
    });

    // update  booking status
    app.put("/bookings", async (req, res) => {
      const id = req.body.id;
      console.log(req.body);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };

      const updateDoc = {
        $set: {
          status: req.body.status,
        },
      };
      const result = await bookings.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    // delete service from database
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await services.deleteOne(query);
      res.send(result);
    });

    // delete bookings from database
    app.delete("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookings.deleteOne(query);
      res.send(result);
    });
  } catch {
    (err) => console.log(err);
  }
};

bookinaDB();

app.get("/books", async (req, res) => {
  res.send("hello");
});

app.listen(port, () => {
  console.log(`listening on port : http://localhost:${port}`);
});
