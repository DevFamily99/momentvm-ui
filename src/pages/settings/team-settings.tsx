import React, { useState } from 'react';
import { FormControl, Input, InputLabel, Select, MenuItem } from '@material-ui/core';
import { toast } from 'react-toastify';
import { gql, useQuery, useMutation } from '@apollo/client';
import styled from 'styled-components';
import Button from '../../components/MVMButton';
import checkPermission from '../../utils/permission';

const GET_TEAM = gql`
  query GetTeam($slug: String) {
    team(slug: $slug) {
      id
      name
      ownerEmail
      ownerFirstname
      ownerLastname
      initials
      previewWrapperUrl
      selector
      previewRenderAdditive
      clientId
      clientSecret
      plan {
        id
        name
      }
    }
  }
`;

const UPDATE_TEAM = gql`
  mutation updateTeam(
    $id: ID!
    $name: String
    $ownerEmail: String
    $ownerFirstname: String
    $ownerLastname: String
    $initials: String
    $previewWrapperUrl: String
    $selector: String
    $previewRenderAdditive: String
    $clientId: String
    $clientSecret: String
  ) {
    updateTeam(
      input: {
        id: $id
        name: $name
        ownerEmail: $ownerEmail
        ownerFirstname: $ownerFirstname
        ownerLastname: $ownerLastname
        initials: $initials
        previewWrapperUrl: $previewWrapperUrl
        selector: $selector
        previewRenderAdditive: $previewRenderAdditive
        clientId: $clientId
        clientSecret: $clientSecret
      }
    ) {
      team {
        id
        name
      }
    }
  }
`;

const GET_PLANS = gql`
  {
    plans {
      id
      name
    }
  }
`;

const Paragraph = styled.p`
  padding-bottom: 1rem;
  padding-top: 0.3rem;
`;

const TeamSettings = () => {
  if (!checkPermission('can_see_settings')) {
    window.location.href = '/';
    return null;
  }
  const [values, setValues] = useState(null);
  const [initialsError, setInitialsError] = useState(false);
  const handleChange = (e) => {
    const { value } = e.target;
    if (e.target.name === 'initials') {
      if (value.match(/^[a-z0-9-_]+$/i)) {
        setInitialsError(false);
      } else {
        setInitialsError(true);
      }
    }
    setValues({
      ...values,
      [e.target.name]: value,
    });
  };

  let slug = window.location.href.match(/admin\/teams\/([a-z]+)/);
  if (slug) {
    [, slug] = slug;
  }

  const { data: Pdata } = useQuery(GET_PLANS, { skip: !slug });
  const { data, loading, error } = useQuery(GET_TEAM, {
    variables: { slug },
  });

  if (!loading && !error && !values) {
    setValues(data.team);
  }

  const [updateTeam] = useMutation(UPDATE_TEAM, {
    refetchQueries: [{ query: GET_TEAM, variables: { slug } }],
  });

  const handleChangePlan = (e) => {
    const { value } = e.target;
    const newPlan = Pdata.plans.find((plan) => plan.id === value);
    setValues({ ...values, plan: newPlan });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (document.getElementsByClassName('sign-up-error-field').length === 0) {
      const res = await updateTeam({
        variables: {
          ...values,
        },
      });
      if (res.data) {
        toast.success('Team settings were successfully updated.');
        return;
      }
      if (res.errors) {
        toast.error(res.errors[0]);
      }
    }
  };

  if (loading || !values) {
    return 'Loading Team...';
  }
  if (!Pdata && slug) {
    return 'Loading plans...';
  }

  return (
    <div>
      <h1>Team Settings</h1>
      <form style={{ width: '50%' }} onSubmit={submitForm}>
        <FormControl margin="normal" fullWidth>
          <InputLabel htmlFor="team_name">Team Name</InputLabel>
          <Input
            // placeholder="Team Name"
            inputProps={{ className: 'team-signup-react' }}
            id="team_name"
            name="name"
            value={values.name}
            onChange={(e) => handleChange(e)}
          />
          <br />
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <InputLabel htmlFor="initials">Team Initials</InputLabel>
          <Input
            error={initialsError}
            inputProps={{ className: 'team-signup-react' }}
            id="initials"
            name="initials"
            value={values.initials || ''}
            onChange={(e) => handleChange(e)}
          />
          <br />
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <InputLabel htmlFor="ownerFirstname">Team Owner First Name</InputLabel>
          <Input
            // placeholder="Team Owner First Name"
            inputProps={{ className: 'team-signup-react' }}
            id="ownerFirstname"
            name="ownerFirstname"
            value={values.ownerFirstname}
            onChange={(e) => handleChange(e)}
          />
          <br />
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <InputLabel htmlFor="ownerLastname">Team Owner Last Name</InputLabel>
          <Input
            // placeholder="Team Owner Last Name"
            inputProps={{ className: 'team-signup-react' }}
            id="ownerLastname"
            name="ownerLastname"
            value={values.ownerLastname}
            onChange={(e) => handleChange(e)}
          />
          <br />
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <InputLabel htmlFor="ownerEmail">Team Owner Email</InputLabel>
          <Input
            // placeholder="Team Owner Email"
            inputProps={{ className: 'team-signup-react' }}
            id="ownerEmail"
            name="ownerEmail"
            type="email"
            value={values.ownerEmail}
            onChange={(e) => handleChange(e)}
          />
          <br />
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <InputLabel htmlFor="previewWrapperUrl">Preview Wrapper Url</InputLabel>
          <Input
            // placeholder="Preview Wrapper Url"
            inputProps={{ className: 'team-signup-react' }}
            id="previewWrapperUrl"
            name="previewWrapperUrl"
            value={values.previewWrapperUrl}
            onChange={(e) => handleChange(e)}
          />
          <Paragraph>
            Use a url of your website which will serve as the frame for your content
          </Paragraph>
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <InputLabel htmlFor="team_selector">Selector</InputLabel>
          <Input
            // placeholder="Selector"
            inputProps={{ className: 'team-signup-react' }}
            id="team_selector"
            name="selector"
            value={values.selector}
            onChange={(e) => handleChange(e)}
          />
          <Paragraph>
            The element which matches the selector will be replaced by the cms content
          </Paragraph>
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <InputLabel htmlFor="team_selector">Preview Render Additive</InputLabel>
          <Input
            multiline
            inputProps={{ className: 'team-signup-react' }}
            id="team_preview_render_additive"
            name="previewRenderAdditive"
            value={values.previewRenderAdditive || ''}
            onChange={(e) => handleChange(e)}
          />
          <Paragraph>
            Additional content added to the preview (for example for lazy loading support
            or to hide a cookie layer in the preview etc.)
          </Paragraph>
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <InputLabel htmlFor="team_client_id">OCAPI Client Id</InputLabel>
          <Input
            // placeholder="Client Id"
            inputProps={{ className: 'team-signup-react' }}
            id="team_client_id"
            name="clientId"
            value={values.clientId || ''}
            onChange={(e) => handleChange(e)}
          />
          <br />
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <InputLabel htmlFor="team_client_secret">OCAPI Client Secret</InputLabel>
          <Input
            inputProps={{ className: 'team-signup-react' }}
            id="team_client_secret"
            name="clientSecret"
            value={values.clientSecret || ''}
            onChange={(e) => handleChange(e)}
          />
          <br />
        </FormControl>
        {slug && (
          <FormControl margin="normal" fullWidth>
            <InputLabel htmlFor="team_client_secret">Plan</InputLabel>
            <Select
              name="plan"
              value={values.plan ? values.plan.id : null}
              onChange={(e) => handleChangePlan(e)}
            >
              {Pdata.plans.map((plan) => (
                <MenuItem key={plan.id} value={plan.id}>
                  {plan.name}
                </MenuItem>
              ))}
            </Select>
            <br />
          </FormControl>
        )}
        <span className="text-success" id="edit-team-success" />
        <br />
        <Button type="submit" label="Update" submit buttonState="highlight" />
      </form>
    </div>
  );
};

export default TeamSettings;
