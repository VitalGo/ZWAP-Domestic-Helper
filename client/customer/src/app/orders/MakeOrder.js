import React, {useState, useEffect} from 'react';
import {withRouter} from 'react-router-dom'
import './MakeOrder.css';

function MakeOrder(props)
{
    const [defaultOrders, setDefaultOrders] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/default_orders', {method: "GET"})
        .then(response => response.json())
        .then(data => setDefaultOrders(data));   
    }, []);

    var defaultOrder = defaultOrders.map((order, index) => {
        return (
            <option key={index} value={order.id}>{order.description} ({order.price}€)</option>
    ); })

    function generateOrderData() {
        let defaultOrdersID = document.getElementById('order_drop_box').value;
        let comment = document.getElementById('make_order_comment').value;

        let dataString = "user_id=" + props.id + "&default_orders_id=" + defaultOrdersID + "&comment=" + comment;

        createOrder(dataString);
    }

    async function createOrder(data) {
        const response = await fetch('http://localhost:3001/orders?' + data, {method: "POST"});
        if(response.status === 200) {
            alert("You have made a new order :)");
        }
    }

    return (
        <div>
            <div id="make_order_div">
                <p id="page_title">MAKE AN ORDER</p><br/>
                <div>
                <div id="make_order_inner_div_left">
                    <select id="order_drop_box">
                        {defaultOrder}
                    </select>
                    <input id="make_order_comment" type="text" placeholder="Comment (max. 70 signs)"/>
                </div>
                <div id="make_order_inner_div_right">
                    <input type="button" onClick={generateOrderData.bind(this)} id="make_order_button" value="CREATE" />
                </div>
                </div>
            </div>
        </div>
    );
}

export default withRouter(MakeOrder);