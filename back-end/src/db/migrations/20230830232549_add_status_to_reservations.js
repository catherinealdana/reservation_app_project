exports.up = function (knex) {
  return knex.schema.table("reservations", (table) => {
    table.string("status").defaultTo("booked"); // You can set a default value if needed
  });
};

exports.down = function (knex) {
  return knex.schema.table("reservations", (table) => {
    table.dropColumn("status");
  });
};
