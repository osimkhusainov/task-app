// const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;
const { MongoClient, ObjectId } = require("mongodb");
// const id = new ObjectId();
// console.log(id);
const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (err, client) => {
  if (err) {
    return console.log("Connection error");
  }
  const db = client.db(databaseName);

  //create

  //   db.collection("users").insertMany(
  //     [
  //       { name: "Osim", age: 26 },
  //       { name: "Maxim", age: 30 },
  //       { name: "Ruslan", age: 20 },
  //     ],
  //     (err, result) => {
  //       if (err) {
  //         return console.log("Error detected");
  //       }
  //       console.log(result.insertedIds);
  //     }
  //   );

  //---------

  // read
  db.collection("users").findOne(
    { _id: new ObjectId("61d603286d0b33344c3c7405") },
    (err, res) => {
      if (err) {
        return console.log("Error detected");
      }
      console.log(res);
    }
  );

  // find all Osims
  db.collection("users")
    .find({ name: "Osim" })
    .toArray((err, res) => console.log(res));

  // find length
  db.collection("users")
    .find({ name: "Osim" })
    .count((err, res) => console.log(res));

  db.collection("tasks")
    .find({ completed: false })
    .toArray((err, res) => console.log(res));

  db.collection("tasks").findOne(
    { _id: new ObjectId("61d6020ea3842d0e2e44af89") },
    (err, res) => {
      if (err) {
        return console.log("Error detected");
      }
      console.log(res);
    }
  );

  //---------------

  //update
  db.collection("tasks")
    .updateMany(
      { completed: false },
      {
        $set: {
          completed: true,
        },
      }
    )
    .then((res) => console.log(res.modifiedCount))
    .catch((err) => console.log(err));

  //delete

  db.collection("users")
    .deleteOne({ age: 26 })
    .then((res) => console.log(res));
  db.collection("users")
    .deleteMany({ name: "Osim" })
    .then((res) => console.log(res.deletedCount));
  db.collection("tasks")
    .deleteMany({ descrioption: "third" })
    .then((res) => console.log(res.deletedCount))
    .catch((err) => console.log(err));
});
