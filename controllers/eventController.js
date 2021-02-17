const { Event } = require("../db/models");
const { Op } = require("sequelize");

//all events
exports.eventList = async (req, res) => {
  try {
    // if (!Object.keys(req.body).length) console.log("empty");
    if (req.body["endDate"]) {
      const date = req.body["endDate"];
      const eventslist = await Event.findAll({
        where: {
          startDate: {
            [Op.gt]: date,
          },
        },
        attributes: ["id", "name", "image"],
        order: ["startDate", "name"],
      });
      res.json(eventslist);
    } else {
      const eventslist = await Event.findAll({
        attributes: ["id", "name", "image"],
        order: ["startDate", "name"],
      });
      res.json(eventslist);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/////FullyBooked V2
exports.fullBooked = async (req, res) => {
  try {
    const eventsList = await Event.findAll({
      where: {
        numOfSeats: {
          [Op.col]: "bookedSeats",
        },
      },
    });
    res.json(eventsList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//event detail
exports.eventDetail = async (req, res) => {
  const eventid = +req.params.eventid;
  try {
    const eventdetail = await Event.findAll({
      where: {
        id: {
          [Op.eq]: eventid,
        },
      },
    });
    res.json(eventdetail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//create event
exports.eventCreate = async (req, res) => {
  try {
    const newEvents = await Event.bulkCreate(req.body);
    res.status(201).json(newEvents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//update event
exports.eventUpdate = async (req, res) => {
  try {
    const updated = await Event.findByPk(req.params.eventId);
    if (updated) {
      await updated.update(req.body);
      res.status(204).end();
    } else {
      res.status(404).json({ message: "event not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//delete event
exports.eventDelete = async (req, res) => {
  try {
    let missingID = null;

    for (const event of req.body) {
      let deleted = await Event.findByPk(event);
      if (!deleted) missingID = event;
    }

    if (missingID) {
      res.status(404).json({ message: `event ${missingID} not found` });
    } else {
      const deletedevents = await Event.destroy({ where: { id: req.body } });
      res.status(204).end();
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
