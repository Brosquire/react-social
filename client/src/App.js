//Dependencies
import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

//Components
import Navbar from "./components/layout/Navbar.component";
import Landing from "./components/layout/Landing.component";
import Login from "./components/auth/Login.component";
import Register from "./components/auth/Register.component";
import Alert from "./components/layout/Alert.component";
import Dashboard from "./components/dashboard/Dashboard.component";
import CreateProfile from "./profile-forms/CreateProfile.component";
import EditProfile from "./profile-forms/EditProfile.component";
import AddExperience from "./profile-forms/AddExperience.component";
import AddEducation from "./profile-forms/AddEducation.component";
import Profiles from "./components/profiles/Profiles.component";

//Routing
import PrivateRoute from "./components/routing/PrivateRoute";

//Redux
import { Provider } from "react-redux";
import { store } from "./store";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";

//CSS
import "./App.css";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  //useEffect is similar to componountDidMount with class based lifecycle, passing it empty brackets as a second parameter will make it run ONLY once, not continuously in a loop
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    //wrapping entire App in Provider from redux setting our store variable we created
    <Provider store={store}>
      {/* wrapping entire App layout in Router imported above*/}
      <Router>
        <Fragment>
          <Navbar />
          {/* setting path equal to the home directory and rendering the Landing component */}
          <Route exact path='/' component={Landing} />
          <section className='container'>
            <Alert />
            <Switch>
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
              <Route exact path='/profiles' component={Profiles} />
              <PrivateRoute exact path='/dashboard' component={Dashboard} />
              <PrivateRoute
                exact
                path='/create-profile'
                component={CreateProfile}
              />
              <PrivateRoute
                exact
                path='/edit-profile'
                component={EditProfile}
              />
              <PrivateRoute
                exact
                path='/add-experience'
                component={AddExperience}
              />
              <PrivateRoute
                exact
                path='/add-education'
                component={AddEducation}
              />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
