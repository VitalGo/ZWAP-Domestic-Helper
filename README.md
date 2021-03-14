# ZWAP-Domestic-Helper

This is a project that was developed during the **Modern Web Applications using React.js and Node.js** course at the OTH Regensburg. The Application is splitted into a customer part and a company part.

## About the App
The Application is splitted into a customer part and a company part.

The Customer-App can be used to create predefined orders or request personalized one in form of an offer.

The Company-App can be used to accept or reject order and offer requests and to change the status of current orders. In addition you can modify all users, orders and offers.

## Testing

1. Install the customer, company and server packages.
```
cd client/customer
npm install
```
```
cd client/company
npm install
```
```
cd server
npm install
```

2. Import the MySQL sample dataset using [import.sql](import.sql).

3. Run server
```
cd server
node server.js
```

4. Run customer application
```
cd client/customer
npm start
```

5. Run customer application
```
cd client/company
npm start
```

## Sample Users
**Company-App**
| User | Password |
| --- | --- |
| admin | password |

**Customer-App**
| User | Password |
| --- | --- |
| user1 | password1 |
| user2 | password2 |
| user3 | password3 |
| user5 | password5 |
| user5 | password6 |


