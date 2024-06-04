const express = require("express");
const app = express();
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");

const port = process.env.PORT;
const uri = process.env.DATABASE_URL;
const secret= process.env.Secret;

app.use(cors());
app.use(express.json());

function createToken(user) {
  const token = jwt.sign(
    {
      email: user.email,
    },
    secret,
    { expiresIn: "7d" }
  );
  return token;
}

function verifyToken(req, res, next) {
  if(!req.headers.authorization){
    return res.send("You are not authorized");
  }
  const token = req.headers.authorization.split(" ")[1];
 
  const verify = jwt.verify(token, secret);
  if (!verify?.email) {
    return res.send("You are not authorized");
  }
  req.user = verify.email;
  next();
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const productDB = client.db("productDB");
    const userDB = client.db("userDB");
    const computerCollection = productDB.collection("computerCollection");
    const userCollection = userDB.collection("userCollection");

    // product

    app.post("/computer", verifyToken, async (req, res) => {
      const computerData = req.body;
      const result = await computerCollection.insertOne(computerData);
      res.send(result);
    });

    app.get("/computer", async (req, res) => {
      const computerData = computerCollection.find();
      const result = await computerData.toArray();
      res.send(result);
    });

    app.get("/computer/:id", async (req, res) => {
      const id = req.params.id;
      const computerData = await computerCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(computerData);
    });
    app.patch("/computer/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      const result = await computerCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      );
      res.send(result);
    });
    app.delete("/computer/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const result = await computerCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // user

    app.post("/user", async (req, res) => {
      const user = req.body;
      const token = createToken(user);
      const isUserExist = await userCollection.findOne({ email: user?.email });
      if (isUserExist?._id) {
       res.send({
          status: "success",
          message: "Login success",
          token,
        });
      } else{
        await userCollection.insertOne(user);
        res.send({ token });
      }
      
    });

    app.get("/user/get/:id",  async (req, res) => {
      const id = req.params.id;
      const result = await userCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.get("/user/:email",  async (req, res) => {
      const email = req.params.email;
      const result = await userCollection.findOne({ email });
      res.send(result);
    });

    app.patch("/user/:email",  async (req, res) => {
      const email = req.params.email;
      const userData = req.body;
      const result = await userCollection.updateOne(
        { email },
        { $set: userData },
        { upsert: true }
      );
      res.send(result);
    });
   
    app.get("*", (req, res) => {
      res.send("Route Not Found");
    });

    console.log("Database is connected");
  } finally {
    
  }
}
run().catch(err=>{
  console.log(err);
});

app.get("/", (req, res) => {
  res.send("Computer Shop server is running");
});

app.listen(port, (req, res) => {
  console.log("App is listening on port :", port);
});

