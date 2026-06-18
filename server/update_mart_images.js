const db = require('./db');

const queries = [
  "UPDATE mart_items SET img_url='https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' WHERE category='CHICKEN ITEMS'",
  "UPDATE mart_items SET img_url='https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' WHERE category='PIZZA'",
  "UPDATE mart_items SET img_url='https://images.unsplash.com/photo-1588168333986-5078d3ae3976?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' WHERE category='MOMOS'",
  "UPDATE mart_items SET img_url='https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' WHERE category='DRINKS'"
];

Promise.all(queries.map(q => db.query(q)))
  .then(() => {
    console.log('Images updated successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
