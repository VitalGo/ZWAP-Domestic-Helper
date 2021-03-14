var express = require('express');
var app = express();
var userController = require('./userController');
var orderController = require('./orderController');
var offerController = require('./offerController');
var bodyParser = require('body-parser');

const hostname = '127.0.0.1';
const port = process.env.PORT || 3001;

//CORS middleware Cross-Origin Resource Sharing 
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.use(allowCrossDomain);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// REST API
app.route('/login')
    .post(userController.checkLoginData)

app.route('/users')
    .get(userController.fetchAllUsers)
    .delete(userController.deleteUser)
    .put(userController.updateUser)
    .post(userController.createUser)

app.route('/default_orders')
    .get(orderController.fetchDefaultOrders)

app.route('/orders')
    .get(orderController.fetchSingleUserOrders)
    .post(orderController.createNewOrder)
    .delete(orderController.deleteSingleOrder)
    .put(orderController.modifyOrder)

app.route('/orders_admin')
    .get(orderController.fetchOrdersAdmin)
    .delete(orderController.deleteOrdersOfUser)

app.route('/order_state')
    .put(orderController.changeOrderState)

app.route('/offers')
    .get(offerController.fetchSingleUserOffers)
    .delete(offerController.deleteSingleOffer)
    .post(offerController.createNewOffer)
    .put(offerController.modifyOffer)

app.route('/offers_admin')
    .get(offerController.fetchOffersAdmin)
    .delete(offerController.deleteOffersOfUser)

app.route('/offer_state')
    .put(offerController.changeOfferState)
    .post(offerController.createOrderMadeOfOffer)

app.listen(port, hostname, () => {
  console.log(`Server running AT http://${hostname}:${port}/`);
});
