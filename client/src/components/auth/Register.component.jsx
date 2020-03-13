import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  //setting our state data needed to populate our forms and capture user input and setting it to the useState() hook function
  //first parameter in the array is similar to  state = name it whatever is conventional for the app and readability
  //the second parameter is similar to  setState({}) = name it in line with the first parameter
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: ""
  });

  //destructuring useState data
  const { name, email, password, password2 } = formData;

  //creating onChange function to capture user input and setState IN THIS CASE WE USE setFormData - refer to above notes
  //we first spread in the formData, then similar to capturing events from user ([name] : e.target.value) WE USE [e.target.name]: e.target.value
  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  //creating an onSubmit function
  const onSubmit = async e => {
    e.preventDefault();
    //checking if both passwords entered match before submitting
    if (password !== password2) {
      console.log("Passwords Do Not Match");
    } else {
      console.log("Success");
    }
  };

  return (
    <Fragment>
      <h1 className='large tex-primary'>Sign Up</h1>
      <p className='lead'>
        <i className='fas fa-user'></i>Create Your Account
      </p>
      <form onSubmit={e => onSubmit(e)} className='form'>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Name'
            name='name'
            value={name}
            onChange={e => onChange(e)}
            required
          />
        </div>
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
          <input
            type='password'
            placeholder='Confirm Password'
            name='password2'
            minLength='6'
            value={password2}
            onChange={e => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input type='submit' className='btn btn-primary' value='Register' />
        </div>
      </form>
      <p className='my-1'>
        Already have an account?
        <Link to='/login'>Sign In</Link>
      </p>
    </Fragment>
  );
};

export default Register;
