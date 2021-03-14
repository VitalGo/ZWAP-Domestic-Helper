import React, {useState, useEffect} from 'react';
import {withRouter} from 'react-router-dom'
import Modali, { useModali } from 'modali';
import './Users.css';

function Users()
{
    const [userList, setUserList] = useState([]);
    const [userToModify, setUserToModify] = useState({});
    
    // modal for modifying the user data
    const [completeExample, toggleCompleteModal] = useModali({
        animated: true,
        title: 'Here you can modify the user',
        message: [
            <div>
            <input type="text" className="modify_user" id="username_input" placeholder="Username" defaultValue={userToModify.username}/><br/>
            <input type="text" className="modify_user" id="name_input" placeholder="Name" defaultValue={userToModify.name}/><br/>
            <input type="text" className="modify_user" id="address_input" placeholder="Address" defaultValue={userToModify.address}/><br/>
            <input type="text" className="modify_user" id="email_input" placeholder="E-Mail" defaultValue={userToModify.email}/><br/>
            </div>
        ],
        buttons: [
          <Modali.Button
            label="Cancel"
            isStyleCancel
            onClick={() => toggleCompleteModal()}
          />,
          <Modali.Button
            label="Modify"
            isStyleDestructive
            onClick={() => {if(document.getElementById('username_input') !== "" && document.getElementById('name_input') !== "" && document.getElementById('address_input') !== "" && document.getElementById('email_input') !== "")
                                modifyUser(userToModify.id, document.getElementById('username_input').value, document.getElementById('name_input').value, document.getElementById('address_input').value, document.getElementById('email_input').value);     
                            else
                                alert("No empty fields allowed!")
                            toggleCompleteModal()}}
          />,
        ],
      });

    // fetch all the users when the page is loaded for the first time  
    useEffect(() => {
        fetchAllUsers();
    }, []);

    // fetch all userdata from the database
    function fetchAllUsers() {
        fetch('http://localhost:3001/users', {method: "GET"})
        .then(response => response.json())
        .then(data => setUserList(data));
    }

    // delete a single user
    async function deleteUser(id) {
        let responseMessage;

        // delete all orders with a specific user id
        await fetch('http://localhost:3001/orders_admin?user_id=' + id, {method: "DELETE"})
        .then(response => responseMessage = response)
        .then(response => response.json());

        if(responseMessage.status === 200) {
            // delete all offers with a specific user id
            await fetch('http://localhost:3001/offers_admin?user_id=' + id, {method: "DELETE"})
            .then(response => responseMessage = response)
            .then(response => response.json());

            if(responseMessage.status === 200) {
                // delete user with a specific id
                await fetch('http://localhost:3001/users?user_id=' + id, {method: "DELETE"})
                .then(response => responseMessage = response)
                .then(response => response.json());

                if(responseMessage.status === 200)
                    fetchAllUsers();
            }
        }
    }


    // modifies the user data 
    async function modifyUser(userId, username, name, address, email) {
        let responseMessage;
        let data = "id=" + userId + "&username=" + username + "&name=" + name + "&address=" + address + "&email=" + email;

        await fetch('http://localhost:3001/users?' + data, {method: "PUT"})
        .then(response => responseMessage = response)
        .then(response => response.json());

        // if user data were modified, fetch all users one more time
        if(responseMessage.status === 200)
            fetchAllUsers();
    }

    // opens the modal and set the states
    function toggleModifyModal(userId, username, name, address, email) { 
        setUserToModify({
            id: userId,
            username: username,
            name: name,
            address: address,
            email: email
        });

        toggleCompleteModal();
    }

    // generate the users "list"
    var users = userList.map((user, index) => {

        let modifyButton = <input type="button" onClick={toggleModifyModal.bind(this, user.id, user.username, user.name, user.address, user.email)} id="modify_user_btn" value="MODIFY"/>;
        let deleteButton = <input type="button" onClick={deleteUser.bind(this, user.id)} id="delete_user_btn" value="DELETE"/>

        if(user.admin_value === 0) {
            return (
                <div key={index}>
                    <div className="user_header">
                        {user.username} 
                        {modifyButton}
                    </div>
                    <div className="user_content">
                        <span className="user_fields">Name:</span> {user.name}<br/>
                        <span className="user_fields">Address:</span> {user.address}<br/>
                        <span className="user_fields">E-Mail:</span> {user.email}<br/>
                        {deleteButton}
                    </div>
                </div>
            );
        } 
    })

    return (
        <div>
            <div id="users_div">
                <p id="page_title">USERS</p><br/>
                {users}
                <Modali.Modal {...completeExample} />
            </div>
        </div>
    );
}

export default withRouter(Users);