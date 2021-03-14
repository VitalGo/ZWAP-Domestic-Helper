import React from 'react';
import {NavLink, withRouter, BrowserRouter, Route, Switch} from 'react-router-dom';
import './AppIndex.css';
import Orders from './orders/Orders.js';
import Offers from './offers/Offers.js';
import Users from './users/Users.js';

function AppIndex(props)
{
    // check if there is an admin logged in
    // if not, redirect to /
    if(props.isAdmin === 0)
        props.history.push('/');        

    // logout the admin by setting the admin-state to 0 in App.js and redirect to /
    function logoutUser() {
        props.setAdmin(0);
        props.history.push('/');
    }

    return (
        <div id="app_page">
            <div id="user_block">
                <p id="user_block_content">
                    <span id="admin_text">ADMIN</span>
                    <input type="button" onClick={logoutUser.bind(this)} id="logout_button" value="LOGOUT" />
                </p> 
            </div>
            <BrowserRouter basename="/app">
                <div id="nav_bar">
                    <div id="buttons_div">
                        <NavLink to="/orders"><input type="button" className="app_nav" id="orders_btn" value="ORDERS" /></NavLink>
                        <NavLink to="/users"><input type="button" className="app_nav" id="users_btn" value="USERS" /></NavLink>
                        <NavLink to="/offers"><input type="button" className="app_nav" id="offers_btn" value="OFFERS" /></NavLink> 
                    </div>
                </div>
                <Switch>
                <Route exact path="/orders" render={() => (<Orders />)}/> 
                <Route exact path="/offers" render={() => (<Offers />)}/> 
                <Route exact path="/users" render={() => (<Users />)}/> 
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default withRouter(AppIndex);