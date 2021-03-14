import React from 'react';
import {NavLink, withRouter, BrowserRouter, Route, Switch} from 'react-router-dom'
import './AppIndex.css';
import MakeOrder from './orders/MakeOrder.js';
import MyOrders from './orders/MyOrders.js';
import MakeOffer from './offers/MakeOffer.js';
import MyOffers from './offers/MyOffers.js';

function AppIndex(props)
{
    // check if there is somebody logged in
    // if not, redirect to /
    if(props.username === "")
        props.history.push('/');

    // logout the user by setting the user-data to default in App.js and redirect to /
    function logoutUser() {
        props.setUser("");
        props.setId(0);
        props.setEmail("");
        props.history.push('/');
    }

    return (
        <div id="app_page">
            <div id="user_block">
                <p id="user_block_content">
                    USERNAME: <span id="username_app">{props.username}</span>
                    <input type="button" onClick={logoutUser.bind(this)} id="logout_button" value="LOGOUT" />
                    <NavLink to="/app/modify_user" id="user_profile">USER PROFILE</NavLink>
                </p> 
            </div>
            <BrowserRouter basename="/app">
                <div id="nav_bar">
                    <div id="buttons_div">
                        <NavLink to="/make_order"><input type="button" className="app_nav" id="make_order_btn" value="MAKE ORDER" /></NavLink>
                        <NavLink to="/my_orders"><input type="button" className="app_nav" id="my_orders_btn" value="MY ORDERS" /></NavLink> 
                        <NavLink to="/make_offer"><input type="button" className="app_nav" id="make_offer_btn" value="MAKE OFFER" /></NavLink>
                        <NavLink to="/my_offers"><input type="button" className="app_nav" id="my_offers_btn" value="MY OFFERS" /></NavLink>
                    </div>
                </div>
                <Switch>
                    <Route exact path="/make_order" render={() => (<MakeOrder username={props.username} id={props.id}/>)}/>
                    <Route exact path="/my_orders" render={() => (<MyOrders username={props.username} id={props.id}/>)}/>
                    <Route exact path="/make_offer" render={() => (<MakeOffer username={props.username} id={props.id}/>)}/>
                    <Route exact path="/my_offers" render={() => (<MyOffers username={props.username} id={props.id}/>)}/>
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default withRouter(AppIndex);