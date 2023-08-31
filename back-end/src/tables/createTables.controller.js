const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./createTables.service");


//CRUD FUNCTIONS 

async function list(req, res, next) {
  const data = await service.list();
  res.json({ data });
}


async function create(req, res, next) {
  const table = req.body.data;
  const newTable = await service.create(table);
  table.reservation_id = newTable.reservation_id;
  table.table_id = newTable.table_id;
  res.status(201).json({ data: table });
}


//middleware functions 



const _TABLE_VALID_FIELDS = ["table_name", "capacity"];

//chef if the table is valid 

function isValidTable(req, res, next) {
  const table = req.body.data;
  if (!table) {
    return next({ status: 400, message: "Required data attribute" });
  }

  _TABLE_VALID_FIELDS.forEach((field) => {
    if (!table[field]) {
      return next({ status: 400, message: `Required property ${field}.` });
    }
  });

  if (typeof table["capacity"] !== "number") {
    return next({
      status: 400,message: "The capacity needs to be a number exceeding 0.",});
  }

  if (table["table_name"].length < 2) {
    return next({
      status: 400, message: "The table_name should consist of a minimum of two characters.",});
  }
  next();
}



module.exports = {
  list: asyncErrorBoundary(list),
  create: [isValidTable, 
          asyncErrorBoundary(create)
          ],
  isValidTable,
};
