import React from 'react';
import {withRouter} from 'react-router-dom'
import './MakeOffer.css';

function MakeOffer(props)
{
    // generate the data string for the createOffer function
    function generateOfferData() {
        let description = document.getElementById('make_offer_description').value;
    
        let dataString = "user_id=" + props.id + "&description=" + description;
    
        createOffer(dataString);
    }

    // create a new offer
    async function createOffer(data) {
        const response = await fetch('http://localhost:3001/offers?' + data, {method: "POST"});

        if(response.status === 200) {
            alert("You have made a new offer :)");
            document.getElementById('make_offer_description').value = "";
        }
    }

    return (
        <div>
            <div id="make_offer_div">
                <p id="page_title">MAKE AN OFFER</p><br/>
                <div>
                <div id="make_offer_inner_div_left">
                    <input id="make_offer_description" type="text" placeholder="Description (max. 70 signs)"/>
                </div>
                <div id="make_offer_inner_div_right">
                    <input type="button" id="make_offer_button" onClick={generateOfferData.bind(this)} value="CREATE" />
                </div>
                </div>
            </div>
        </div>
    );
}

export default withRouter(MakeOffer);