import React, {useState, useEffect} from 'react';
import {withRouter} from 'react-router-dom'
import Modali, { useModali } from 'modali';
import './Orders.css';

function Orders()
{
    const [userList, setUserList] = useState([]);
    const [orders, setOrders] = useState([]);
    const [searchForLatest, setSearchForLatest] = useState(false);
    const [commentToModify, setCommentToModify] = useState("");
    const [jobToModify, setJobToModify] = useState("");
    const [costToModify, setCostToModify] = useState(0);
    const [defaultOrders, setDefaultOrders] = useState([]);
    const [idToModify, setIdToModify] = useState(0);
    
    // modal for modifying the order
    const [completeExample, toggleCompleteModal] = useModali({
        animated: true,
        title: 'Here you can modify the order',
        message: [
            <div>
            {jobToModify}<input type="text" id="modify_order_price" placeholder="Cost" defaultValue={costToModify} /><br/>
            <input type="text" id="modify_order_comment" placeholder="Comment (max. 70 signs)" defaultValue={commentToModify} />
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
            onClick={() => {if(document.getElementById('modify_order_drop_box') === null)
                                modifyOrder(idToModify, document.getElementById('modify_order_description').value, document.getElementById('modify_order_comment').value, document.getElementById('modify_order_price').value);     
                            else
                                modifyOrder(idToModify, document.getElementById('modify_order_drop_box').value, document.getElementById('modify_order_comment').value, document.getElementById('modify_order_price').value);
                            toggleCompleteModal()}}
          />,
        ],
      });

    useEffect(() => {
        // fetch all userdata from the database
        fetch('http://localhost:3001/users', {method: "GET"})
        .then(response => response.json())
        .then(data => setUserList(data));
        
        // fetch all the default orders from the database
        fetch('http://localhost:3001/default_orders', {method: "GET"})
        .then(response => response.json())
        .then(data => setDefaultOrders(data));  
    }, []);

    // generate the options for the user drop box
    var users = userList.map((user, index) => {
        if(user.username !== "admin")
            return (
                <option key={index} value={user.id}>{user.username}</option>
    );})

    // fetch the latest order 
    // if latest == false fetch all orders depends on username and state
    // else fetch all orders with the state ORDERED
    function fetchOrders(latest) {
        let user = document.getElementById('user_drop_box').value;
        let state = document.getElementById('state_drop_box').value;
        let data = "";

        setSearchForLatest(latest)

        if(latest === true)
            data = "user_id=0&state=ORDERED"; 
        else
            data = "user_id=" + user + "&state=" + state;
                
        fetch('http://localhost:3001/orders_admin?' + data, {method: "GET"})
        .then(response => response.json())
        .then(data => setOrders(data));
    }

    // delete a single order
    async function deleteOrder(id) {
        let responseMessage;

        await fetch('http://localhost:3001/orders?id=' + id, {method: "DELETE"})
        .then(response => responseMessage = response)
        .then(response => response.json());

        if(responseMessage.status === 402)
            alert("Something went wrong!");
        // if order was deleted successfully fetch all orders one more time
        if(responseMessage.status === 200)
            fetchOrders(searchForLatest);
    }

    // convert date to the Finnish format
    function convertDate(date) {
        return "" + new Date(date).getDate() + "." + (new Date(date).getMonth()+1) + "." + new Date(date).getFullYear();   
    }

    // change the state of an order
    async function changeState(order_id, state) {
        let newState = "";
        let responseMessage;
        
        if(state === "ORDERED")
            newState = "STARTED";
        if(state === "STARTED")
            newState = "READY";

        let data = "id=" + order_id + "&state=" + newState;
    
        await fetch('http://localhost:3001/order_state?' + data, {method: "PUT"})
        .then(response => responseMessage = response)
        .then(response => response.json());
    
        if(responseMessage.status === 402)
            alert("Something went wrong!");
        // if order state were changed fetch all orders one more time
        if(responseMessage.status === 200)
            fetchOrders(searchForLatest);
    }

    // modifies the comment and the job of an order 
    async function modifyOrder(id, job, comment, price) {
        let responseMessage;
        let data = "id=" + id + "&comment=" + comment + "&price=" + price;

        // check if job is the number of a default order or if it is a description
        if(isNaN(job))
            data += "&description=" + job;
        else
            data += "&default_orders_id=" + job;

        await fetch('http://localhost:3001/orders?' + data, {method: "PUT"})
        .then(response => responseMessage = response)
        .then(response => response.json());

        if(responseMessage.status === 402)
            alert("Something went wrong!");
        // if order state were changed fetch all orders one more time
        if(responseMessage.status === 200)
            fetchOrders(searchForLatest);
    }

    // opens the modal
    function toggleModifyModal(order_id, comment, description, defaultOrdersId, cost) {
        
        // create default orders options for a drop box
        var defaultOrder = defaultOrders.map((order, index) => {
            return (
                <option key={index} value={order.id} selected={defaultOrdersId === order.id}>{order.description} ({order.price}€)</option>
        ); })

        // create an input field with the description for the job
        let jobDescriptionInput = <input type="text" id="modify_order_description" placeholder="Job Description (max. 70 signs)" defaultValue={description} />;
        
        // chenck if the default orders id is NULL
        // if the id is NULL the order is made of an offer and the admin can only change the description
        // else the admin can choose between the default orders
        if(defaultOrdersId !== null)
            setJobToModify(<select id="modify_order_drop_box">{defaultOrder}</select>);
        else
            setJobToModify(jobDescriptionInput);     

        setCostToModify(cost)
        setIdToModify(order_id);
        setCommentToModify(comment);

        toggleCompleteModal();
    }

    // generate the orders "list"
    var allOrders = orders.map((order, index) => {

        let stateBackgroundColor = "";
        let modifyButton = "";
        let deleteButton = <input type="button" onClick={deleteOrder.bind(this, order.id)} id="delete_order_btn" value="DELETE"/>
        let changeStateButton = "";

        // set color of the state span and create buttons, depending on the actual state
        if(order.state === "ORDERED") {
            stateBackgroundColor = "rgb(40, 106, 247)";
            changeStateButton = <input type="button" onClick={changeState.bind(this, order.id, order.state)} id="change_order_state_btn" value="CHANGE STATE" />;
            modifyButton = <input type="button" onClick={toggleModifyModal.bind(this, order.id, order.comment, order.description, order.default_orders_id, order.price)} id="modify_order_btn" value="MODIFY"/>
        }
        if(order.state === "STARTED") {
            stateBackgroundColor = "rgb(184, 255, 117)";
            changeStateButton = <input type="button" onClick={changeState.bind(this, order.id, order.state)} id="change_order_state_btn" value="CHANGE STATE" />;
            modifyButton = <input type="button" onClick={toggleModifyModal.bind(this, order.id, order.comment, order.description, order.default_orders_id, order.price)} id="modify_order_btn" value="MODIFY"/>
        }
        if(order.state === "READY") {
            stateBackgroundColor = "#57b846";
            modifyButton = <input type="button" onClick={toggleModifyModal.bind(this, order.id, order.comment, order.description, order.default_orders_id, order.price)} id="modify_order_btn" value="MODIFY"/>
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
                <div className="order_header">
                    {order.description} 
                    <span id="order_state" style={{backgroundColor: stateBackgroundColor}}>{order.state}</span>
                    {changeStateButton}
                    {modifyButton}
                </div>
                <div className="order_content">
                    <span className="order_fields">User:</span> {order.username}<br/>
                    <span className="order_fields">Ordered Date:</span> {orderedDate}<br/>
                    <span className="order_fields">Started Date:</span> {startedDate}<br/>
                    <span className="order_fields">Ready Date:</span> {readyDate}<br/>
                    <span className="order_fields">Accepted / Rejected Date:</span> {accRejDate}<br/>
                    <span className="order_fields">Cost:</span> {order.price}€<br/>
                    <span className="order_fields">Comment:</span> {order.comment}<br/>
                    {deleteButton}
                </div>
            </div>
        ); 
    })

    return (
        <div>
            <div id="search_orders_div">
                <p id="page_title">SEARCH FOR ORDERS</p><br/>
                <div>
                    <select className="orders_search_drop_box" id="user_drop_box">
                        <option value="0">Choose an user ...</option>
                        {users}
                    </select>
                    <select className="orders_search_drop_box" id="state_drop_box">
                        <option value="0">Choose a state ...</option>
                        <option value="ORDERED">ORDERED</option>
                        <option value="STARTED">STARTED</option>
                        <option value="READY">READY</option>
                        <option value="ACCEPTED">ACCEPTED</option>
                        <option value="REJECTED">REJECTED</option>
                    </select>
                    <input type="button" className="orders_btns" id="search_orders_btn" onClick={fetchOrders.bind(this, false)} value="SEARCH" />
                    <input type="button" className="orders_btns" id="latest_orders_btn" onClick={fetchOrders.bind(this, true)} value="NEW ORDERS" />
                </div>
            </div>
            <div id="listed_orders_div">
                <p id="page_title">ORDERS</p><br/>
                {allOrders}
                <Modali.Modal {...completeExample} />
            </div>
        </div>
    );
}

export default withRouter(Orders);