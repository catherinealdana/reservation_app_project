/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");


//routing list to "/"

router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

//routing reservation to id reservation 

router
  .route("/:reservation_Id")
  .get(controller.read)
  .put(controller.modify)
  .all(methodNotAllowed);

//routing reservation to update it 

router
  .route("/:reservation_Id/status")
  .put(controller.update)
  .all(methodNotAllowed);



module.exports = router;
