import React, { Component } from "react";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Footer from "./components/layout/Footer";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Defects from "./components/defects/Defects";
import EditDefect from './components/defects/EditDefect';
import EditQueries from "./components/editQueries/EditQueries";
import LoggedIn from "./components/layout/LoggedIn";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/set-auth-token";
import { setCurrentUser } from "./actions/loginActions";
import { Provider } from "react-redux";
import store from "./store";
import PrivateRoute from './components/common/PrivateRoute';
import { logoutUser } from "./actions/loginActions";

// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Clear current profile from localStorage
    localStorage.removeItem("jwtToken");
    // Redirect to login
    window.location.href = "/login";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Switch>
              <Route exact path="/" component={Landing} />
              <PrivateRoute exact path='/logged-in' component={LoggedIn} />
            </Switch>
            <div className="container">
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
            </div>
            <Switch>
              <PrivateRoute exact path='/defects' component={Defects} />
              <PrivateRoute path='/defects/edit/:id' component={EditDefect} />
              <PrivateRoute exact path='/defects/new' component={EditDefect} />
              <PrivateRoute exact path='/queries/edit/:thingType' component={EditQueries} />
            </Switch>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
