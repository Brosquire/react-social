import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login } from "../../actions/auth";

const Login = ({ login, isAuthenticated }) => {
  //setting our state data needed to populate our forms and capture user input and setting it to the useState() hook function
  //first parameter in the array is similar to  state = name it whatever is conventional for the app and readability
  //the second parameter is similar to  setState({}) = name it in line with the first parameter
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  //destructuring useState data
  const { email, password } = formData;

  //creating onChange function to capture user input and setState IN THIS CASE WE USE setFormData - refer to above notes
  //we first spread in the formData, then similar to capturing events from user ([name] : e.target.value) WE USE [e.target.name]: e.target.value
  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  //creating an onSubmit function
  const onSubmit = async e => {
    e.preventDefault();
    login(email, password);
  };

  //Redirect if user is logged in
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <Fragment>
      <h1 className='large tex-primary'>Sign In</h1>
      <p className='lead'>
        <i className='fas fa-user'></i>Sign Into Your Account
      </p>
      <form onSubmit={e => onSubmit(e)} className='form'>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={e => onChange(e)}
          />
          <small className='form-text'>
            This website uses Gravatar, so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            minLength='6'
            value={password}
            onChange={e => onChange(e)}
          />
        </div>

        <div className='form-group'>
          <input type='submit' className='btn btn-primary' value='Login' />
        </div>
      </form>
      <p className='my-1'>
        Don't already have an account? <Link to='/register'>Register</Link>
      </p>
    </Fragment>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login })(Login);
