const { select } = require("../db/connection");
const knex = require("../db/connection");


//function to insert a new reservation

async function create(reservation) {
    return knex("reservations as r")
      .insert(reservation)
      .returning("*")
      .then((newReservation) => newReservation[0]);
  }

//Read list of reservations 

function read(reservation_id) {
    return knex("reservations")
      .select("*")
      .where({ reservation_id }).first();
  }


//function for data retrieving list of reservations based on the date 

async function list() {
    return knex("reservations")
      .select("*")
      .orderBy("reservations.reservation_date");
  }

//function to retrieve reservations list by date and time 

function listByDate(reservation_date) {
    return knex("reservations")
      .select("*")
      .where({ reservation_date })
      .orderBy("reservations.reservation_time");
  }

  
// to update list of reservations 

async function update(reservation_id, status) {
    const updated = await knex("reservations")
        .select("*")
        .where({ reservation_id })
        .update({ status })
        .returning("*");
    return updated[0];
  }

// to finish a reservation 

function finish(reservation_id) {
    return knex("reservations")
      .select("*")
      .where({ reservation_id })
      .update({ status: "finished" });
  }

//to search a reservation by phone number

function search(mobile_number) {
    return knex("reservations")
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )
      .orderBy("reservation_date");
  }

//if the user wants to update reservation 

async function modify(reservation_id, reservation) {
    const updated = await knex("reservations")
        .select("*")
        .where({ reservation_id })
        .update(reservation, "*")
        .returning("*");
    return updated[0];
  }

module.exports={
    create,
    read, 
    list,
    listByDate,
    update,
    finish,
    search,
    modify
    }










