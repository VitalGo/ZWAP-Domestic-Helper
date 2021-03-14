import React, {useEffect} from 'react';
import {withRouter} from 'react-router-dom'
import './ModifyProfile.css';
import arrowBack from './long-arrow-left.png';

function ModifyProfile(props)
{
    // check if there is somebody logged in
    // if not, redirect to /
    if(props.id === 0)
        props.history.push('/');

    // fill all the text-inputs with the user-data when the page is loaded for the first time
    useEffect(() => {
        document.getElementById('email').value = props.email;
        document.getElementById('name').value = props.name;
        document.getElementById('address').value = props.address;    
    }, []);

    // generates a data string and call the updateUser function
    function modifyUser() {
        let email = document.getElementById('email').value;
        let name = document.getElementById('name').value;
        let address = document.getElementById('address').value;
        let password = document.getElementById('password').value;
        
        let id = props.id;

        if(email === "" || password === "" || name === "" || address === "")
            alert("No empty fields allowed!");
        else {
            let data = "id=" + id + "&email=" + email + "&name=" + name + "&address=" + address + "&password=" + password;
            updateUser(data);
        }
    }

    // update the user-data in the database and replace the old user-data by the new one in App.js
    async function updateUser(data) {
        let responseMessage;

        await fetch('http://localhost:3001/users?' + data, {method: "PUT"})
        .then(response => responseMessage = response)
        .then(response => response.json());

        if(responseMessage.status === 200) {
            props.setEmail(document.getElementById('email').value);
            props.setName(document.getElementById('name').value);
            props.setAddress(document.getElementById('address').value);
            await alert("You have updated your Profile :)\nYou will be automatically redirected back, after you press OK.");
            props.history.push('/app');
        }
    }

    return (
        <div>
            <img id="arrow_back" src ={arrowBack} onClick={() => {props.history.push('/app')}} alt="arrow_back" />
            <div id="modify_window">
                <p id="modify_text">Modify your Profile</p>
                <div id="modify_form">
                    <input type="text" id="name" className="modify_input" name="name" placeholder="Name"/><br/><br/>
                    <input type="text" id="address" className="modify_input" name="address" placeholder="Address"/><br/><br/>
                    <input type="text" id="email" className="modify_input" name="email" placeholder="E-Mail"/><br/><br/>
                    <input type="password" id="password" className="modify_input" name="password" placeholder="Password" /><br/><br/>
                    <input type="button" onClick={modifyUser.bind(this)} id="modify_button" value="MODIFY" />
                </div><br/>
            </div>
        </div>
    );
}

export default withRouter(ModifyProfile);