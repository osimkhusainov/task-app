const mongoose = require("mongoose");
mongoose.connect(`mongodb://${process.env.MONGODB_URL}`, {
  useNewUrlParser: true,
});

// const user = new User({
//   name: "Maxim",
//   email: "maxim@",
//   age: 27,
//   password: "jikolkh",
// });
// user
//   .save()
//   .then((usr) => console.log(usr))
//   .catch((err) => console.log(err.errors));

// const home = new Task({ description: "Play football", completed: false });
// home
//   .save()
//   .then(() => console.log(home))
//   .catch((err) => console.log(err));
