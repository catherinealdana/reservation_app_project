const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");


/**
 * List handler for reservation resources
 * 
 */




//CRUD controller functions 


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

async function update(req, res) {
  const { reservation_Id } = req.params;
  const { status } = req.body.data;
  const reservation = await service.update(reservation_Id, status);
  res.json({ data: reservation });
}

//modify reservation 

async function modify(req, res ) {
  const { reservation_Id } = req.params;
  const reservation = req.body.data;
  const data = await service.modify(reservation_Id, reservation);
  reservation.reservation_id = data.reservation_id;
  res.json({ data: reservation });
}



//VALIDATE FUNCTIONS/ MIDDLEWARE 

//variable to wrap fields and use to validate functions 

const _VALID_RESERVATION_FIELDS = [
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
    return next({ status: 400, message: `Required data attribute.` });
  }

  _VALID_RESERVATION_FIELDS.forEach((field) => {
    if (!reservation[field]) {
      return next({ status: 400, message: `${field} field required` });
    }

    if (field === "people" && typeof reservation[field] !== "number") {
      return next({status: 400,message: "Number of people must be a numeric value.", });
    }

    if (field === "reservation_date" && !Date.parse(reservation[field])) {
      return next({ status: 400, message: `${field} is not a valid date.` });
    }

    if (field === "reservation_time") {
      if (!validateTime(reservation[field])) {
        return next({ status: 400, message: `${field} is not a valid time.` });
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


//to verify is not Tuesday 

function isNotTuesday(req, res, next) {
  const { reservation_date } = req.body.data;
  console.log("date", reservation_date)
  const [year, month, day] = reservation_date.split("-");
  const date = new Date(`${month}-${day}-${year}`);
  res.locals.date = date;
  if (date.getDay() === 2) {
    console.log("tuesday validation failed")
    return next({ status: 400, message: "Location is closed on Tuesdays." });
  }
  next();
}

// to verify reservations are future only

function isFutureOnly(req, res, next) {
  const date = res.locals.date;
  const today = new Date();
  if (date < today) {
    console.log("tuesday validation failed")
    return next({ status: 400, message: "Must be a future date." });
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


// to verify is within open hours

function isWithinOpenHours(req, res, next) {
  const reservation = req.body.data;
  const [hour, minute] = reservation.reservation_time.split(":");
  
  if (hour < 10 || hour > 20) {
    return next({
      status: 400,
      message: "Reservation must be made within business hours.",
    });
  }
  
  if (
    (hour === 10 && minute < 30) ||  
    (hour === 20 && minute > 30)      
  ) {
    return next({
      status: 400,
      message: "Reservation must be made within business hours",
    });
  }
  
  next();
}







module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    asyncErrorBoundary(isValidReservation),
    isNotTuesday,
    isFutureOnly,
    isWithinOpenHours,
    asyncErrorBoundary(create),
    
  ],
  read: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(read),
  ],
  update:[
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(update),
    finishedReservation,
   
  ],
  modify:[
    isValidReservation,
    isNotTuesday,
    isFutureOnly,
    isWithinOpenHours,
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(modify),
  

  ],
};