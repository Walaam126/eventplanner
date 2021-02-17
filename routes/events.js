const express = require("express");
const { Event } = require("../db/models");
const { Op } = require("sequelize");
const {
  eventList,
  fullBooked,
  eventDetail,
  eventCreate,
  eventUpdate,
  eventDelete,
} = require("../controllers/eventController");
//declare the router
const router = express();

router.get("/", eventList);

router.get("/full", fullBooked);

router.get("/:eventid", eventDetail);

router.post("/", eventCreate);

router.put("/:eventId", eventUpdate);

router.delete("/delete", eventDelete);

module.exports = router;
