import React from 'react';
import {NavLink} from 'react-router-dom'
import './CreateAccount.css';

export default function CreateAccount(props)
{
    // generate the data string and create a new user
    function createDataString() {
        let name = document.getElementById('name').value;
        let address = document.getElementById('address').value;
        let email = document.getElementById('email').value;
        let username = document.getElementById('username').value;
        let password = document.getElementById('password').value;

        if(email === "" || username === "" || password === "" || name === "" || address === "")
            alert("No empty fields allowed!");
        else {
            let data = "email=" + email + "&username=" + username + "&password=" + password + "&name=" + name + "&address=" + address;
            createNewUser(data);
        }  
    }

    // create a new user
    async function createNewUser(data) {
        const response = await fetch('http://localhost:3001/users?' + data, {method: "POST"});
        if(response.status === 400)
            alert("User already exist!");
        if(response.status === 200) {
            await alert("You have a new Account now :)\nYou will be automatically redirected to the login page, after you press OK.");
            props.history.push('/');
        }
    }

    return (
        <div id="register_window">
            <p id="register_text">Create your Account</p>
            <div id="register_form">
                <input type="text" id="username" className="register_input" name="username" placeholder="Username"/><br/><br/>
                <input type="text" id="name" className="register_input" name="name" placeholder="Name"/><br/><br/>
                <input type="text" id="address" className="register_input" name="address" placeholder="Address"/><br/><br/>
                <input type="text" id="email" className="register_input" name="email" placeholder="E-Mail"/><br/><br/>
                <input type="password" id="password" className="register_input" name="password" placeholder="Password" /><br/><br/>
                <input type="button" onClick={createDataString.bind(this)} id="register_button" value="CREATE ACCOUNT" />
            </div><br/>
            <NavLink className="link" to="/"><span id="go_to_login">You already have an Account? Sign In</span></NavLink>
        </div>
    );
}