import React, {useState, useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import Modali, { useModali } from 'modali';
import './MyOffers.css';

function MyOffers(props)
{
    const [offers, setOffers] = useState([]);
    const [offerToModify, setOfferToModify] = useState("");
    const [idToModify, setIdToModify] = useState(0);
    // modal for modifying the offer
    const [completeExample, toggleCompleteModal] = useModali({
        animated: true,
        title: 'Here you can modify your offer',
        message: [
            <input type="text" id="modify_offer_description" placeholder="Description (Max. 70 signs)" defaultValue={offerToModify} />
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
            onClick={() => {modifyOffer(idToModify, document.getElementById('modify_offer_description').value);
                            toggleCompleteModal()}}
          />,
        ],
      });

    // fetch all the offers when the page is loaded for the first time  
    useEffect(() => {
        fetchOffers(); 

    }, []);

    // convert date to the Finnish format
    function convertDate(date) {
        return "" + new Date(date).getDate() + "." + (new Date(date).getMonth()+1) + "." + new Date(date).getFullYear();   
    }

    // fetch all offers of current user
    function fetchOffers() {
        fetch('http://localhost:3001/offers?id=' + props.id, {method: "GET"})
        .then(response => response.json())
        .then(data => setOffers(data));
    }

    // opens the modal
    function toggleModifyModal(id, offer) {
        setIdToModify(id);
        setOfferToModify(offer);
        toggleCompleteModal();
    }

    // modifies the offer
    async function modifyOffer(id, offer) {
        let responseMessage;
        let data = "id=" + id + "&description=" + offer

        await fetch('http://localhost:3001/offers?' + data, {method: "PUT"})
        .then(response => responseMessage = response)
        .then(response => response.json());

        // if offer state were changed fetch all offers one more time
        if(responseMessage.status === 200)
            fetchOffers();
    }

    // change offer state
    async function changeOfferState(id, state, description, price) {
        let responseMessage;
        let data = "id=" + id + "&state=" + state

        if(state === "ACCEPTED") {
            let offerData = "user_id=" + props.id + "&description=" + description + "&price=" + price;

            // create a new order if the user accepts the offer
            await fetch('http://localhost:3001/offer_state?' + offerData, {method: "POST"})
            .then(response => responseMessage = response)
            .then(response => response.json());

            if(responseMessage.status === 200) {
                alert("Now you can find this offer under My Orders :)");
            }
        }

        // change the offer state
        await fetch('http://localhost:3001/offer_state?' + data, {method: "PUT"})
        .then(response => responseMessage = response)
        .then(response => response.json());

        // if offer state were changed fetch all offers one more time
        if(responseMessage.status === 200)
            fetchOffers();
    }

    // delete a single offer
    async function deleteOffer(id) {
        let responseMessage;

        await fetch('http://localhost:3001/offers?id=' + id, {method: "DELETE"})
        .then(response => responseMessage = response)
        .then(response => response.json());

        // if offer were deleted fetch all offers one more time
        if(responseMessage.status === 200)
            fetchOffers();
    }

    // generate the offers "list"
    var myOffers = offers.map((offer, index) => {
        let stateBackgroundColor = "";
        let modifyButton = "";
        let deleteButton = "";
        let acceptButton = "";
        let rejectButton = "";

        // set color of the state span and create buttons, depending on the actual state
        if(offer.state === "REQUESTED") {
            stateBackgroundColor = "rgb(40, 106, 247)";
            modifyButton = <input type="button" onClick={toggleModifyModal.bind(this, offer.id, offer.description)} id="modify_offer_btn" value="MODIFY"/>
            deleteButton = <input type="button" onClick={deleteOffer.bind(this, offer.id)} id="delete_offer_btn" value="DELETE"/>
        }
        if(offer.state === "ANSWERED") {
            stateBackgroundColor = "#57b846";
            acceptButton = <input type="button" onClick={changeOfferState.bind(this, offer.id, "ACCEPTED", offer.description, offer.price)} id="accept_offer_btn" value="ACCEPT"/>;
            rejectButton = <input type="button" onClick={changeOfferState.bind(this, offer.id, "REJECTED")} id="reject_offer_btn" value="REJECT"/>;
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
                <div className="my_offer_header">
                    {offer.description}<span id="offer_state" style={{backgroundColor: stateBackgroundColor}}>{offer.state}</span>
                    {modifyButton}
                </div>
                <div className="my_offer_content">
                    <span className="offer_fields">User:</span> {offer.username}<br/>
                    <span className="offer_fields">Requested Date:</span> {requestedDate}<br/>
                    <span className="offer_fields">Answered Date:</span> {answeredDate}<br/>
                    <span className="offer_fields">Accepted / Rejected Date:</span> {accRejDate}<br/>
                    <span className="offer_fields">Message from Company:</span> {offer.message_company}<br/>
                    <span className="offer_fields">Cost:</span> {cost}<br/>
                    {deleteButton}{acceptButton}{rejectButton}
                </div>
            </div>
        ); 
    })

    return (
        <div>
            <div id="my_offers_div">
                <p id="page_title">MY OFFERS</p><br/>
                {myOffers}
                <Modali.Modal {...completeExample} />
            </div>
        </div>
    );
}

export default withRouter(MyOffers);