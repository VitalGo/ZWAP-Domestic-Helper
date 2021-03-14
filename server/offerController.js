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
  // create a new offer (user)
  createNewOffer: function(req,res){
    console.log("query (POST): ", req.query);

    let query = 'INSERT INTO offers (user_id, description, state, requested_date) VALUES (?, ?, "REQUESTED", CURDATE())';
    let c = req.query;
    
    console.log(query);

    connection.query(query, [c.user_id, c.description], function(error, results, fields){
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

  // fetch all the offers of a single user (user)
  fetchSingleUserOffers: function(req,res){

    let query = 'SELECT o.id, username, description, message_company, state, requested_date, answered_date, acc_rej_date, price FROM user u, offers o WHERE o.user_id = ? AND o.user_id = u.id ORDER BY o.id DESC';
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

  // delete a specific offer (user & admin)
  deleteSingleOffer: function(req,res){

    let query = 'DELETE FROM offers WHERE id=?';
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

  // delete all offers of a specific user (admin)
  deleteOffersOfUser: function(req,res){

    let query = 'DELETE FROM offers WHERE user_id=?';
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

  // change the offer state (user & admin)
  changeOfferState: function(req,res){
    
    let c = req.query;
    let dateToUpdate;

    if(c.state === "ACCEPTED" || c.state === "REJECTED")
      dateToUpdate = "acc_rej_date";
    else
      dateToUpdate = c.state + "_date";
  
    let query = 'UPDATE offers SET state=?, '+ dateToUpdate + '=CURDATE() WHERE id=?';
    
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

  // modify an offer (user & admin)
  modifyOffer: function(req,res){

    let c = req.query;
    let queryAdditional = "";

    if(c.message_company !== undefined && c.price !== undefined)
      queryAdditional = ", message_company='" + c.message_company + "' , price=" + c.price;

    let query = "UPDATE offers SET description=?" + queryAdditional + " WHERE id=?";
    
    console.log(query);

    connection.query(query, [c.description, c.id], function(error, results, fields){
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

  // create a new order if the offer were answered by the admin and the user accepts the conditions (user)
  createOrderMadeOfOffer: function(req,res){
    console.log("query (POST): ", req.query);

    let query = 'INSERT INTO orders (user_id, description, price, state, ordered_date) VALUES (?, ?, ?, "ORDERED", CURDATE())';
    let c = req.query;
    
    console.log(query);

    connection.query(query, [c.user_id, c.description, c.price], function(error, results, fields){
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

  // fetch all offers (admin)
  fetchOffersAdmin: function(req,res){

    let c = req.query;
    let queryAdditional = "";

    if(c.user_id !== "0")
      queryAdditional += "AND user_id=" + c.user_id;
    if(c.state !== "0")
      queryAdditional += " AND state='" + c.state + "'";
    
    let query = "SELECT o.id, username, description, message_company, state, requested_date, answered_date, acc_rej_date, price FROM user u, offers o WHERE u.id = o.user_id " + queryAdditional + " ORDER BY o.id DESC";
    
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
