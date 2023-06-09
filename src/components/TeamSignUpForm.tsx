import React from 'react';
import { FormControl, Checkbox, TextField, FormControlLabel } from '@material-ui/core';
import Button from './MVMButton';
import { Link } from 'gatsby';

const TeamSignUpForm = ({ handleChange }) => (
  <>
    <FormControl margin="none">
      <TextField
        placeholder="Team Name"
        inputProps={{ className: 'team-signup-react' }}
        id="team_name"
        name="name"
        type="text"
        required
        onChange={(e) => handleChange(e)}
      />
    </FormControl>
    <FormControl margin="none">
      <TextField
        placeholder="Team Owner First Name"
        inputProps={{ className: 'team-signup-react' }}
        id="team_owner_first_name"
        name="owner_firstname"
        type="text"
        required
        onChange={(e) => handleChange(e)}
      />
    </FormControl>
    <FormControl margin="none">
      <TextField
        placeholder="Team Owner Last Name"
        inputProps={{ className: 'team-signup-react' }}
        id="team_owner_last_name"
        name="owner_lastname"
        type="text"
        required
        onChange={(e) => handleChange(e)}
      />
    </FormControl>
    <FormControl margin="none">
      <TextField
        placeholder="Team Owner Email"
        inputProps={{ className: 'team-signup-react' }}
        id="team_owner_email"
        name="owner_email"
        type="email"
        required
        onChange={(e) => handleChange(e)}
      />
    </FormControl>
    <FormControl margin="none">
      <FormControlLabel
        label={
          <>
            {' '}
            I accept the terms and conditions written{' '}
            <a
              href="/Terms-and-Conditions.html"
              target="_blank"
              style={{ color: 'black', fontWeight: 'bold' }}
            >
              here
            </a>
          </>
        }
        control={<Checkbox required onChange={(e) => handleChange(e)} />}
      ></FormControlLabel>
    </FormControl>

    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Link to="/login">
        <Button label="Back to Login" />
      </Link>
      <Button type="submit" label="Next Step" submit buttonState="highlight" />
    </div>
  </>
);

export default TeamSignUpForm;
