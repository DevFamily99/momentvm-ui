import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  GoogleReCaptchaProvider,
  GoogleReCaptcha
} from 'react-google-recaptcha-v3';


import { toast } from 'react-toastify';
import styled from 'styled-components';
import TeamSignUpForm from '../components/TeamSignUpForm';
import MVMButton from '../components/MVMButton';

// import TeamSignUpThirdStep from './TeamSignUpThirdStep';
// workaround since the captcha bagde breaks the css for this
// document.getElementsByTagName('main-grid')[0].style.height = '100vh';

const FormContents = styled.div`
  margin: auto;
  height: 100%;
  text-align: center;
  h1 {
    font-size: 3rem;
    font-weight: 900;
  }
  form {
    display: flex;
    flex-direction: column;
    div {
      margin-bottom: 4%;
    }
  }
`;

const Registration = () => {
  const [siteKey, setSiteKey] = useState('');
  const [token, setToken] = useState('');
  const [values, setValues] = useState({});
  const [signupComplete, setSignupComplete] = useState(false);

  const verifyCallback = (token) => {
    setToken(token);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setValues({
      ...values,
      [e.target.name]: value,
    });
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (document.getElementsByClassName('sign-up-error-field').length > 0) {
      return;
    }
    axios
      .post(`${process.env.GATSBY_API_URL}/api/teams/create`, values, {
        headers: {
          'Captcha-Token': token,
          Accept: 'application/json',
        },
      })
      .then(() => {
        setSignupComplete(true);
      })
      .catch(() => {
        toast.error('Errors occured during signup. Did you register before?');
        // console.log(errors);
      });
  };
  useEffect(() => {
    // TODO fix captca
    // axios.get(`${process.env.GATSBY_API_URL}/captcha_site_key`).then((res) => {
    //   setSiteKey(res.data.site_key);
    //   loadReCaptcha(res.data.site_key);
    // });
  }, []);

  return (
    <FormContents>
      { siteKey ? (<GoogleReCaptchaProvider reCaptchaKey="[Your recaptcha key]">
          <GoogleReCaptcha onVerify={verifyCallback} />
      </GoogleReCaptchaProvider>) : null } 
      {!signupComplete ? (
        <>
          <h1>Sign up your Team</h1>

          <form onSubmit={submitForm}>
            <TeamSignUpForm handleChange={handleChange} />
          </form>
        </>
      ) : (
        <div style={{ width: '500px', textAlign: 'center' }}>
          <h1>Signup successful</h1>
          <p>
            Congratulations, you've signed up for a new team in MOMENTVM app. Our customer
            manager will check your application within 1 business day and approve your new
            team. Please check your e-mail inbox and your spam folder regularly. We will
            send you more information soon.
          </p>
          <br />
        </div>
      )}
    </FormContents>
  );
};

export default Registration;
