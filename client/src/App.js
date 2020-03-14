//Dependencies
import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

//Components
import Navbar from "./components/layout/Navbar.component";
import Landing from "./components/layout/Landing.component";
import Login from "./components/auth/Login.component";
import Register from "./components/auth/Register.component";
import Alert from "./components/layout/Alert.component";

//Redux
import { Provider } from "react-redux";
import { store } from "./store";

//CSS
import "./App.css";

const App = () => {
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
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
