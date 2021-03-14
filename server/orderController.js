'use strict'

// npm install mysql --save
var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'zwap_dh_db'
});

module.exports = 
{
  // fetch all default orders (user & admin)
  fetchDefaultOrders: function(req,res){

    let query = 'SELECT * FROM default_orders';
    let c = req.query;
    
    console.log(query);

    connection.query(query, function(error, results, fields){
          if ( error ){
            console.log("Error fetching data from db, reason: " + error);
            res.send(error);
          }
          else
          {
            console.log("Data = " + JSON.stringify(results));
            res.statusCode = 200;
            res.send(results); 
          }
      });
  },

  // modify an order (user & admin)
  modifyOrder: function(req,res){

    let c = req.query;
    let queryAdditionalOrderOffer = "";
    let queryAdditionalOrder = "";

    // if somebody modifies an order that was made of an offer
    if(c.description !== undefined && c.price === undefined)
      queryAdditionalOrderOffer = ", description='" + c.description;

    // if the admin modifies an order that was made of an offer
    if(c.description !== undefined && c.price !== undefined)
    queryAdditionalOrderOffer = ", description='" + c.description + "'" + ", price=" + c.price;

    // if the customer modifies an order, the price will be set automatically
    if(c.default_orders_id !== undefined && c.price === undefined)
      queryAdditionalOrder = ", price=(SELECT price FROM default_orders WHERE id=" + c.default_orders_id + "), description=(SELECT description FROM default_orders WHERE id=" + c.default_orders_id + ")";

    // if the admin modifies an order, the price can be set by the admin
    if(c.default_orders_id !== undefined && c.price !== undefined)
      queryAdditionalOrder = ", price=" + c.price + ", description=(SELECT description FROM default_orders WHERE id=" + c.default_orders_id + ")";

    let query = "UPDATE orders SET comment=?, default_orders_id=?" + queryAdditionalOrderOffer + queryAdditionalOrder + " WHERE id=?";
    
    
    console.log(query);

    connection.query(query, [c.comment, c.default_orders_id, c.id], function(error, results, fields){
          if ( error ){
            console.log("Error fetching data from db, reason: " + error);
            res.send(error);
          }
          else
          {
            console.log("Data = " + JSON.stringify(results));
            res.statusCode = 200;
            res.send(results); 
          }
      });
  },

  // create a new order (user)
  createNewOrder: function(req,res){
    console.log("query (POST): ", req.query);

    let query = 'INSERT INTO orders (user_id, default_orders_id, description, price, comment, state, ordered_date) VALUES (?, ?, (SELECT description FROM default_orders WHERE id=?), (SELECT price FROM default_orders WHERE id=?),?, "ORDERED", CURDATE())';
    let c = req.query;
    
    console.log(query);

    connection.query(query, [c.user_id, c.default_orders_id, c.default_orders_id, c.default_orders_id, c.comment], function(error, results, fields){
          if ( error ){
            console.log("Error fetching data from db, reason: " + error);
            res.send(error);
          }
          else
          {
            console.log("Data = " + JSON.stringify(results));
            res.statusCode = 200;
            res.send(results); 
          }
      });
  },

  // fetch all orders of a single user (user)
  fetchSingleUserOrders: function(req,res){

    let query = 'SELECT o.id, username, state, ordered_date, started_date, ready_date, acc_rej_date, price, comment, description, default_orders_id FROM orders o INNER JOIN user ON (o.user_id = user.id) WHERE user.id =? ORDER BY o.id DESC';
    let c = req.query;
    
    console.log(query);

    connection.query(query, [c.id], function(error, results, fields){
          if ( error ){
            console.log("Error fetching data from db, reason: " + error);
            res.send(error);
          }
          else
          {
            console.log("Data = " + JSON.stringify(results));
            res.statusCode = 200;
            res.send(results); 
          }
      });
  },

  // delete one specific order (user & admin)
  deleteSingleOrder: function(req,res){

    let query = 'DELETE FROM orders WHERE id=?';
    let c = req.query;
    
    console.log(query);

    connection.query(query, [c.id], function(error, results, fields){
          if ( error ){
            console.log("Error deleting data from db, reason: " + error);
            res.send(error);
          }
          else
          {
            console.log("Data = " + JSON.stringify(results));
            res.statusCode = 200;
            res.send(results); 
          }
      });
  },

  // delete all orders of one user (admin)
  deleteOrdersOfUser: function(req,res){

    let query = 'DELETE FROM orders WHERE user_id=?';
    let c = req.query;
    
    console.log(query);

    connection.query(query, [c.user_id], function(error, results, fields){
          if ( error ){
            console.log("Error deleting data from db, reason: " + error);
            res.send(error);
          }
          else
          {
            console.log("Data = " + JSON.stringify(results));
            res.statusCode = 200;
            res.send(results);      
          }
      });
  },

  // change the order state and set a date of the new state (user & admin)
  changeOrderState: function(req,res){
    
    let c = req.query;
    let dateToUpdate;

    if(c.state === "ACCEPTED" || c.state === "REJECTED")
      dateToUpdate = "acc_rej_date";
    else
      dateToUpdate = c.state + "_date";
  
    let query = 'UPDATE orders SET state=?, '+ dateToUpdate + '=CURDATE() WHERE id=?';
    
    console.log(query);

    connection.query(query, [c.state, c.id], function(error, results, fields){
          if ( error ){
            console.log("Error deleting data from db, reason: " + error);
            res.send(error);
          }
          else
          {
            console.log("Data = " + JSON.stringify(results));
            res.statusCode = 200;
            res.send(results); 
          }
      });
  },

  // fetch the orders depends on user id and state (admin)
  fetchOrdersAdmin: function(req,res){

    let c = req.query;
    let queryAdditional = "";

    if(c.user_id !== "0" && c.state !== "0")
      queryAdditional = "WHERE user_id=" + c.user_id + " AND state='" + c.state + "'";
    else if(c.user_id !== "0")
      queryAdditional = "WHERE user_id=" + c.user_id;
    else if(c.state !== "0")
      queryAdditional = "WHERE state='" + c.state + "'";
    
    let query = "SELECT o.id, username, state, ordered_date, started_date, ready_date, acc_rej_date, price, comment, description, default_orders_id FROM orders o INNER JOIN user ON (o.user_id = user.id) " + queryAdditional + " ORDER BY o.id DESC";
    
    console.log(query);

    connection.query(query, function(error, results, fields){
          if ( error ){
            console.log("Error fetching data from db, reason: " + error);
            res.send(error);
          }
          else
          {
            console.log("Data = " + JSON.stringify(results));
            res.statusCode = 200;
            res.send(results); 
          }
      });
  },
}
