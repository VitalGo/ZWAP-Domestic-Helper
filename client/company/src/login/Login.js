import React from 'react';
import {withRouter} from 'react-router-dom'
import './Login.css';

function Login(props)
{
    const { history } = props;

    // generates the data json and fetch the user-data
    function loginUser() {
        let username = document.getElementById('username').value;
        let password = document.getElementById('password').value;
            
        let data = {username: username,
                    password: password,
                    admin_value: 1};

        fetchData(data);
    }

    async function fetchData(data) {
        let responseMessage;
        let userData;

        // fetch the user-data by an username and a password
        await fetch('http://localhost:3001/login' , {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            method: "POST"})
        .then(response => responseMessage = response)
        .then(response => response.json())
        .then(data => userData = data);

        // if there is no username + password match, show an alert-message
        if(responseMessage.status === 401)
            alert("Wrong Username or Password!");
        // if the user fetched successfully and it is an admin, set the states in App.js
        if(responseMessage.status === 200) {
            props.setAdmin(userData[0].admin_value);
            // redirect to /app
            history.push('/app');
        }
        
    }

    return (
        <div id="login_window">
            <p id="login_text">Member Login</p>
            <div id="login_form">
                <input type="text" id="username" className="login_input" name="username" placeholder="Username"/><br/><br/>
                <input type="password" id="password" className="login_input" name="password" placeholder="Password" /><br/><br/>
                <input type="button" onClick={loginUser.bind(this)} id="login_button" value="LOGIN" />
            </div><br/>
        </div>
    );
}

export default withRouter(Login);