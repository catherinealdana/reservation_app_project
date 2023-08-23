const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");


/**
 * List handler for reservation resources
 * 
 */


//CRUD controller functions 

//creation reservation controller 

async function create(req, res) {
  const reservation = req.body.data;
  const { reservation_id } = await service.create(reservation);
  reservation.reservation_id = reservation_id;
  res.status(201).json({ data: reservation });
}

//read reservation 

async function read(req, res) {
  const reservation = res.locals.reservation;
  res.json({ data: reservation });
}

//update reservation 

async function update(req, res, next) {
  const { reservation_Id } = req.params;
  const { status } = req.body.data;
  const reservation = await service.update(reservation_Id, status);
  res.json({ data: reservation });
}

//modify reservation 

async function modify(req, res, next) {
  const { reservation_Id } = req.params;
  const reservation = req.body.data;
  const data = await service.modify(reservation_Id, reservation);
  reservation.reservation_id = data.reservation_id;
  res.json({ data: reservation });
}

//to retrieve list of reservations by phone number 

async function list(req, res) {
  const { date, mobile_number } = req.query;
  let reservations;
  if (mobile_number) {
    reservations = await service.search(mobile_number);
  } else {
    reservations = date ? await service.listByDate(date) : await service.list();
  }
  res.json({
    data: reservations,
  });
}

//VALIDATE FUNCTIONS 

//variable to wrap fields and use to validate functions 

const validReservationFields = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

// to validate input time 

function validateTime(string) {
  const [hour, minute] = string.split(":");

  if (hour.length > 2 || minute.length > 2) {
    return false;
  }
  if (hour < 1 || hour > 23) {
    return false;
  }
  if (minute < 0 || minute > 59) {
    return false;
  }
  return true;
}

//to validate reservation 

function isValidReservation(req, res, next) {
  const reservation = req.body.data;

  if (!reservation) {
    return next({ status: 400, message: `Reservation does not exist.` });
  }

  validReservationFields.forEach((field) => {
    if (!reservation[field]) {
      return next({ status: 400, message: `${field} field required` });
    }

    if (field === "people" && typeof reservation[field] !== "number") {
      return next({
        status: 400,
        message: "people is not a number", // Update the error message here
      });
    }

    if (field === "reservation_date" && !Date.parse(reservation[field])) {
      return next({ status: 400, message: `${field} is not a valid date.` });
    }

    if (field === "reservation_time") {
      if (!validateTime(reservation[field])) {
        return next({ status: 400, message: `${field} is not a valid time` });
      }
    }
  });

  next();
}

// to verify reservation is finished 

function finishedReservation(req, res, next) {
  const { status } = res.locals.reservation;
  if (status === "finished") {
    return next({
      status: 400,
      message: "Reservation is already finished.",
    });
  }
  next();
}

//to verify reservation exists 

const reservationExists = async (req, res, next) => {
  const { reservation_Id } = req.params;
  const reservation = await service.read(reservation_Id);

  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation_id ${reservation_Id} does not exist.`,
  });
};


module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    asyncErrorBoundary(isValidReservation),
    asyncErrorBoundary(create),
  ],
  read: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(read)
  ],
  update:[
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(update),
    finishedReservation,
  ],
  modify:[
    isValidReservation,
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(modify),
  ],
};
