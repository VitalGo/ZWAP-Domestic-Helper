import React, {useState} from 'react';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'
import './App.css';
import Login from './login/Login.js';
import CreateAccount from './create_account/CreateAccount.js';
import AppIndex from './app/AppIndex.js';
import ModifyProfile from './modify_profile/ModifyProfile.js';

function App(props) {

  // user-data of the current logged in user
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [id, setId] = useState(0);

  return (
    <div>
      <BrowserRouter basename="">
        <Switch>
          <Route exact path="/" render={() => (<Login setId={setId.bind(this)} setUser={setUsername.bind(this)} setEmail={setEmail.bind(this)} setName={setName.bind(this)} setAddress={setAddress.bind(this)}/>)}/>
          <Route exact path="/create_account" component={CreateAccount}/>
          <Route exact path="/app" render={() => (<AppIndex username={username} id={id} setId={setId.bind(this)} setEmail={setEmail.bind(this)} setUser={setUsername.bind(this)}/>)}/>
          <Route exact path="/app/modify_user" render={() => (<ModifyProfile email={email} id={id} name={name} address={address} setEmail={setEmail.bind(this)} setName={setName.bind(this)} setAddress={setAddress.bind(this)}/>)}/>
          {/* every address that is not defined will redirect the user to the login page */}
          <Route render={() => <Redirect to="/" />} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
