import React, {useState, useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import Modali, { useModali } from 'modali';
import './MyOrders.css';

function MyOrders(props)
{
    const [orders, setOrders] = useState([]);
    const [commentToModify, setCommentToModify] = useState("");
    const [idToModify, setIdToModify] = useState(0);
    const [defaultOrders, setDefaultOrders] = useState([]);
    const [defaultOrderDropBox, setDefaultOrderDropBox] = useState("");
    
    // modal for modifying the order
    const [completeExample, toggleCompleteModal] = useModali({
        animated: true,
        title: 'Here you can modify your order',
        message: [
            <div>
            <select id="modify_order_drop_box">
                {defaultOrderDropBox}
            </select><br/>
            <input type="text" id="modify_order_comment" placeholder="Comment (Max. 70 signs)" defaultValue={commentToModify} />
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
            onClick={() => {modifyOrder(idToModify, document.getElementById('modify_order_drop_box').value, document.getElementById('modify_order_comment').value);
                            toggleCompleteModal()}}
          />,
        ],
      });

    // fetch all the orders and the default order when the page is loaded for the first time
    useEffect(() => {
        fetchOrders(); 
        
        fetch('http://localhost:3001/default_orders', {method: "GET"})
        .then(response => response.json())
        .then(data => setDefaultOrders(data));   
    }, []);    

    // convert date to the Finnish format
    function convertDate(date) {
        return "" + new Date(date).getDate() + "." + (new Date(date).getMonth()+1) + "." + new Date(date).getFullYear();   
    }

    // fetch all orders of current user
    function fetchOrders() {
        fetch('http://localhost:3001/orders?id=' + props.id, {method: "GET"})
        .then(response => response.json())
        .then(data => setOrders(data));
    }

    // opens the modal
    function toggleModifyModal(id, defaultOrdersId, comment) {
        // create default orders options for a drop box
        var defaultOrder = defaultOrders.map((order, index) => {
            return (
                <option key={index} value={order.id} selected={defaultOrdersId === order.id}>{order.description} ({order.price}€)</option>
        ); })

        setDefaultOrderDropBox(defaultOrder);
        setIdToModify(id);
        setCommentToModify(comment);
        toggleCompleteModal();
    }

    // modifies the comment of an order 
    async function modifyOrder(id, defaultOrderId, comment) {
        let responseMessage;
        let data = "id=" + id + "&comment=" + comment + "&default_orders_id=" + defaultOrderId;

        await fetch('http://localhost:3001/orders?' + data, {method: "PUT"})
        .then(response => responseMessage = response)
        .then(response => response.json());

        // if order state were changed fetch all orders one more time
        if(responseMessage.status === 200)
            fetchOrders();
    }

    // change order state
    async function changeOrderState(id, state) {
        let responseMessage;
        let data = "id=" + id + "&state=" + state

        await fetch('http://localhost:3001/order_state?' + data, {method: "PUT"})
        .then(response => responseMessage = response)
        .then(response => response.json());

        // if order state were changed fetch all orders one more time
        if(responseMessage.status === 200)
            fetchOrders();
    }

    // delete a single order
    async function deleteOrder(id) {
        let responseMessage;

        await fetch('http://localhost:3001/orders?id=' + id, {method: "DELETE"})
        .then(response => responseMessage = response)
        .then(response => response.json());

        // if order were deleted fetch all orders one more time
        if(responseMessage.status === 200)
            fetchOrders();
    }

    // generate the orders "list"
    var myOrders = orders.map((order, index) => {

        let stateBackgroundColor = "";
        let modifyButton = "";
        let deleteButton = "";
        let acceptButton = "";
        let rejectButton = "";

        // set color of the state span and create buttons, depending on the actual state
        if(order.state === "ORDERED") {
            stateBackgroundColor = "rgb(40, 106, 247)";
            if(order.default_orders_id !== null)
                modifyButton = <input type="button" onClick={toggleModifyModal.bind(this, order.id, order.default_orders_id, order.comment)} id="modify_order_btn" value="MODIFY"/>
            deleteButton = <input type="button" onClick={deleteOrder.bind(this, order.id)} id="delete_order_btn" value="DELETE"/>
        }
        if(order.state === "STARTED")
            stateBackgroundColor = "rgb(184, 255, 117)";
        if(order.state === "READY") {
            stateBackgroundColor = "#57b846";
            acceptButton = <input type="button" onClick={changeOrderState.bind(this, order.id, "ACCEPTED")} id="accept_order_btn" value="ACCEPT"/>;
            rejectButton = <input type="button" onClick={changeOrderState.bind(this, order.id, "REJECTED")} id="reject_order_btn" value="REJECT"/>;
        }
        if(order.state === "REJECTED")
            stateBackgroundColor = "rgb(255, 81, 58)";
        if(order.state === "ACCEPTED")
            stateBackgroundColor = "black";
        
        let orderedDate = "";
        let startedDate = "";
        let readyDate = "";
        let accRejDate = "";

        // convert the date to the Finnish format
        if(order.ordered_date !== null)
            orderedDate = convertDate(order.ordered_date);
        if(order.started_date !== null)
            startedDate = convertDate(order.started_date);
        if(order.ready_date !== null)
            readyDate = convertDate(order.ready_date);
        if(order.acc_rej_date !== null)
            accRejDate = convertDate(order.acc_rej_date);

        return (
            <div key={index}>
                <div className="my_order_header">
                    {order.description} <span id="order_state" style={{backgroundColor: stateBackgroundColor}}>{order.state}</span> 
                    {modifyButton}
                </div>
                <div className="my_order_content">
                    <span className="order_fields">User:</span> {order.username}<br/>
                    <span className="order_fields">Ordered Date:</span> {orderedDate}<br/>
                    <span className="order_fields">Started Date:</span> {startedDate}<br/>
                    <span className="order_fields">Ready Date:</span> {readyDate}<br/>
                    <span className="order_fields">Accepted / Rejected Date:</span> {accRejDate}<br/>
                    <span className="order_fields">Cost:</span> {order.price}€<br/>
                    <span className="order_fields">Comment:</span> {order.comment}<br/>
                    {deleteButton}{acceptButton}{rejectButton}
                </div>
            </div>
        ); 
    })

    return (
        <div>
            <div id="my_orders_div">
                <p id="page_title">MY ORDERS</p><br/>
                {myOrders}
                <Modali.Modal {...completeExample} />
            </div>
        </div>
    );
}

export default withRouter(MyOrders);