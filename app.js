const express = require("express");
const app = express();
const db = require("./db/models");
const router = require("./routes/events");

app.use(express.json());
app.use("/events", router);
console.log(new Date());
db.sequelize.sync();
app.listen(8001, () => {
  console.log("The application is running on localhost:8001");
});
