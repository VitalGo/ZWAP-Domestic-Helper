import React, {useState} from 'react';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'
import './App.css';
import Login from './login/Login.js';
import AppIndex from './app/AppIndex.js';

function App(props) {

  // state to check, if there is an admin logged in or not
  const [isAdmin, setIsAdmin] = useState(0);

  return (
    <div>
      <BrowserRouter basename="">
        <Switch>
          <Route exact path="/" render={() => (<Login setAdmin={setIsAdmin.bind(this)}/>)}/>
          <Route exact path="/app" render={() => (<AppIndex isAdmin={isAdmin} setAdmin={setIsAdmin.bind(this)}/>)}/>
          <Route render={() => <Redirect to="/" />} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
