import React, {useState, useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import Modali, { useModali } from 'modali';
import './Offers.css';

function Offers()
{
    const [userList, setUserList] = useState([]);
    const [offers, setOffers] = useState([]);
    const [searchForLatest, setSearchForLatest] = useState(false);
    const [offerToModify, setOfferToModify] = useState("");
    const [messageToModify, setMessageToModify] = useState("");
    const [costToModify, setCostToModify] = useState(0);
    const [idToModify, setIdToModify] = useState(0);
    // modal for modifying the the offer description, price and the message from the admin
    const [completeExample, toggleCompleteModal] = useModali({
        animated: true,
        title: 'Here you can modify the offer',
        message: [
            <div>
            {offerToModify} <input type="text" id="modify_offer_price" placeholder="Cost" defaultValue={costToModify} /><br/>
            <input type="text" id="modify_offer_message" placeholder="Message from Admin (max. 70 signs)" defaultValue={messageToModify} />
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
            onClick={() => {if(document.getElementById('modify_offer_description').value === "" || document.getElementById('modify_offer_price').value === "")
                                alert("You have to set a description of the job and the price befor you can modify!");
                            else {
                                modifyOffer(idToModify, document.getElementById('modify_offer_description').value, document.getElementById('modify_offer_message').value, document.getElementById('modify_offer_price').value);
                                toggleCompleteModal()}}}
          />,
        ],
      });

    useEffect(() => {
        // fetch all userdata from the database
        fetch('http://localhost:3001/users', {method: "GET"})
        .then(response => response.json())
        .then(data => setUserList(data));
    }, []);

    var users = userList.map((user, index) => {
        if(user.username !== "admin")
            return (
                <option key={index} value={user.id}>{user.username}</option>
    );})

    // convert date to the Finnish format
    function convertDate(date) {
        return "" + new Date(date).getDate() + "." + (new Date(date).getMonth()+1) + "." + new Date(date).getFullYear();   
    }

    // fetch all offers of current user
    function fetchOffers(latest) {
        let user = document.getElementById('user_drop_box').value;
        let state = document.getElementById('state_drop_box').value;
        let data = "";

        setSearchForLatest(latest)

        if(latest === true)
            data = "user_id=0&state=REQUESTED"; 
        else
            data = "user_id=" + user + "&state=" + state;
                
        fetch('http://localhost:3001/offers_admin?' + data, {method: "GET"})
        .then(response => response.json())
        .then(data => setOffers(data));
    }

    // opens the modal
    function toggleModifyModal(offer_id, message, description, cost) {

        // create an input field with the description for the job
        let jobDescriptionInput = <input type="text" id="modify_offer_description" placeholder="Job Description (max. 70 signs)" defaultValue={description} />;
         
        setOfferToModify(jobDescriptionInput);
        setCostToModify(cost)
        setIdToModify(offer_id);
        setMessageToModify(message);

        toggleCompleteModal();
    }

    // modifies the offer 
    async function modifyOffer(id, description, message, price) {
        let responseMessage;
        console.log(id, description, message, price);
        let data = "id=" + id + "&description=" + description + "&message_company=" + message + "&price=" + price;

        await fetch('http://localhost:3001/offers?' + data, {method: "PUT"})
        .then(response => responseMessage = response)
        .then(response => response.json());

        if(responseMessage.status === 402)
            alert("Something went wrong!");
        // if offer state were changed fetch all offers one more time
        if(responseMessage.status === 200)
            fetchOffers(searchForLatest);
    }

    // change offer state
    async function changeState(offer_id, state, price) {
        let responseMessage;
        let newState = ""

        if(state === "REQUESTED")
            newState = "ANSWERED";

        let data = "id=" + offer_id + "&state=" + newState;

        if(price === null) {
            alert("You forgot to set the price. Please do it before you change the state.");
        } else {
            await fetch('http://localhost:3001/offer_state?' + data, {method: "PUT"})
            .then(response => responseMessage = response)
            .then(response => response.json());

            if(responseMessage.status === 402)
                alert("Something went wrong!");
            // if offer state were changed fetch all offers one more time
            if(responseMessage.status === 200)
                fetchOffers(searchForLatest); 
        }

    }

    // delete a single offer
    async function deleteOffer(id) {
        let responseMessage;

        await fetch('http://localhost:3001/offers?id=' + id, {method: "DELETE"})
        .then(response => responseMessage = response)
        .then(response => response.json());

        if(responseMessage.status === 402)
            alert("Something went wrong!");
        // if offer was deleted successfully fetch all offers one more time
        if(responseMessage.status === 200)
            fetchOffers(searchForLatest);
    }

    // generate the offers "list"
    var myOffers = offers.map((offer, index) => {
        let stateBackgroundColor = "";
        let modifyButton = "";
        let deleteButton = <input type="button" onClick={deleteOffer.bind(this, offer.id)} id="delete_offer_btn" value="DELETE"/>;
        let changeStateButton = "";

        // set color of the state span
        if(offer.state === "REQUESTED") {
            stateBackgroundColor = "rgb(40, 106, 247)";
            modifyButton = <input type="button" onClick={toggleModifyModal.bind(this, offer.id, offer.message_company, offer.description, offer.price)} id="modify_offer_btn" value="MODIFY"/>
            changeStateButton = <input type="button" onClick={changeState.bind(this, offer.id, offer.state, offer.price)} id="change_offer_state_btn" value="CHANGE STATE" />;
        }
        if(offer.state === "ANSWERED") {
            stateBackgroundColor = "#57b846";
            modifyButton = <input type="button" onClick={toggleModifyModal.bind(this, offer.id, offer.message_company, offer.description, offer.price)} id="modify_offer_btn" value="MODIFY"/>
        }
        if(offer.state === "REJECTED")
            stateBackgroundColor = "rgb(255, 81, 58)";
        if(offer.state === "ACCEPTED")
            stateBackgroundColor = "black";
        
        let requestedDate = "";
        let answeredDate = "";
        let accRejDate = "";

        // convert the date to the Finnish format
        if(offer.requested_date !== null)
            requestedDate = convertDate(offer.requested_date);
        if(offer.answered_date !== null)
            answeredDate = convertDate(offer.answered_date);
        if(offer.acc_rej_date !== null)
            accRejDate = convertDate(offer.acc_rej_date);

        let cost = "";
        if(offer.price !== null)
            cost = offer.price + "€";

        return (
            <div key={index}>
                <div className="offer_header">
                    {offer.description} <span id="offer_state" style={{backgroundColor: stateBackgroundColor}}>{offer.state}</span>
                    {changeStateButton}
                    {modifyButton}
                </div>
                <div className="offer_content">
                    <span className="offer_fields">User:</span> {offer.username}<br/>
                    <span className="offer_fields">Requested Date:</span> {requestedDate}<br/>
                    <span className="offer_fields">Answered Date:</span> {answeredDate}<br/>
                    <span className="offer_fields">Accepted / Rejected Date:</span> {accRejDate}<br/>
                    <span className="offer_fields">Message from Company:</span> {offer.message_company}<br/>
                    <span className="offer_fields">Cost:</span> {cost}<br/>
                    {deleteButton}
                </div>
            </div>
        ); 
    })

    return (
        <div>
            <div id="search_offers_div">
                <p id="page_title">SEARCH FOR OFFERS</p><br/>
                <div>
                    <select className="offers_search_drop_box" id="user_drop_box">
                        <option value="0">Choose an user ...</option>
                        {users}
                    </select>
                    <select className="offers_search_drop_box" id="state_drop_box">
                        <option value="0">Choose a state ...</option>
                        <option value="REQUESTED">REQUESTED</option>
                        <option value="ANSWERED">ANSWERED</option>
                        <option value="ACCEPTED">ACCEPTED</option>
                        <option value="REJECTED">REJECTED</option>
                    </select>
                    <input type="button" className="offers_btns" id="search_offers_btn" onClick={fetchOffers.bind(this, false)} value="SEARCH" />
                    <input type="button" className="offers_btns" id="latest_offers_btn" onClick={fetchOffers.bind(this, true)} value="NEW OFFERS" />
                </div>
            </div>
            <div id="listed_offers_div">
                <p id="page_title">OFFERS</p><br/>
                {myOffers}
                <Modali.Modal {...completeExample} />
            </div>
        </div>
    );
}

export default withRouter(Offers);