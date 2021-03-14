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
  // fetch a single user by username and password (user & admin)
  checkLoginData: function(req,res){
    console.log("body (POST): ", JSON.stringify(req.body));

    let query = 'SELECT * FROM user WHERE username = ? AND password = ? AND admin_value = ?';
    let c = req.body;
    
    console.log(query);

    connection.query(query, [c.username, c.password, c.admin_value], function(error, results, fields){
          if ( error ){
            console.log("Error fetching data from db, reason: " + error);
            res.send(error);
          }
          else
          {
            // if username or password doesn't match, send status code 401
            if(results.length === 0) {
              res.statusCode = 401;
              res.send(results)
            } 
            else
            {
              console.log("Data = " + JSON.stringify(results));
              res.statusCode = 200;
              res.send(results); 
            }
          }
      });
  },

  // fetch all users (admin)
  fetchAllUsers: function(req,res){
    console.log("query (GET): ", req.query);

    let query = 'SELECT * FROM user';
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

  // create a new user (user)
  createUser: function(req,res){
    console.log("query (POST): ", req.query);

    // first query check if there is already an user with this username
    let query = 'SELECT * FROM user WHERE username = ?';
    // second query creates an user with this username
    let createQuery = 'INSERT INTO user (username, password, email, name, address) VALUES (?, ?, ?, ?, ?)';
    let c = req.query;
    
    console.log(query);

    connection.query(query, [c.username], function(error, results, fields){
          if ( error ){
            console.log("Error fetching data from db, reason: " + error);
            res.send(error);
          }
          else
          { // if a user have been fetched, it means that this username already exists
            if(results.length !== 0) {
              res.statusCode = 400;
              res.send(results)
            }
            else
            { // else create a new user
              connection.query(createQuery, [c.username, c.password, c.email, c.name, c.address], function(error, results, fields){
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
            }
          }
      });
  },
  
  // modify a specific user (user & admin)
  updateUser: function(req,res){
    let c = req.query;
    let queryAdditional = "";

    // seperate if the request is from an admin or an user

    // an admin can change a users username
    if(c.username !== undefined)
      queryAdditional = ", username='" + c.username + "'";
    // an user can change the password his password
    if(c.password !== undefined)
      queryAdditional = ", password='" + c.password + "'";
    
    let query = "UPDATE user SET email=?, name=?, address=?" + queryAdditional + " WHERE id=?";
    
    
    console.log(query);

    connection.query(query, [c.email, c.name, c.address, c.id], function(error, results, fields){
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

  // delete a specific user (admin)
  deleteUser: function(req,res){

    let query = 'DELETE FROM user WHERE id=?';
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
}
