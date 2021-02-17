const { Op } = require("sequelize");
const EventModel = (sequelize, DataTypes) => {
  const Event = sequelize.define(
    "Event",
    {
      organizer: { type: DataTypes.STRING(20), unique: true },
      name: {
        type: DataTypes.STRING,
        validate: { notContains: "event" },
      },
      email: {
        type: DataTypes.STRING,
        validate: { isEmail: true, notEmpty: true },
      },
      numOfSeats: { type: DataTypes.INTEGER, validate: { min: 0 } },
      bookedSeats: {
        type: DataTypes.INTEGER,
        validate: {
          isGreaterThanOtherField(value) {
            if (parseInt(value) > parseInt(this.numOfSeats)) {
              throw new Error(
                "booked seats must be less than number of seates."
              );
            }
          },
        },
      },
      startDate: {
        type: DataTypes.DATE,
        isAfter: new Date(),
      },
      endDate: {
        type: DataTypes.DATEONLY,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isUrl: true },
      },
    },
    { timestamps: false }
  );

  Event.beforeBulkCreate((events, options) => {
    for (const event of events) {
      if ((event.startDate === null) !== (event.endDate === null)) {
        throw new Error(
          "bulkcreate hook: either start date & end date null or neither"
        );
      }
    }
  });

  Event.beforeUpdate((event) => {
    if ((event.startDate === null) !== (event.endDate === null)) {
      throw new Error(
        "Update hook: either start date & end date null or neither"
      );
    }
  });
  Event.prototype.fullybooked = function () {
    return this.bookedSeats === this.numOfSeats;
  };

  return Event;
};

module.exports = EventModel;
