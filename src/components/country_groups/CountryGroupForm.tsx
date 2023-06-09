import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Select from 'react-select';
import { gql, ApolloQueryResult, useMutation } from '@apollo/client';
import { TextField, withStyles } from '@material-ui/core';
import { Link } from 'gatsby';
import { DiffEditor } from '@monaco-editor/react';
import StyledTooltip from '../styled/StyledTooltip';
import Button from '../MVMButton';
import MVMDialog from '../MVMDialog';
import { CountryGroup, Site } from '../../types';
import LocaleFilterDialog from './LocaleFilterDialog';
import SiteFilterButton from './SiteFilterButton';

const UPDATE_COUNTRY_GROUP = gql`
  mutation UpdateCountryGroup(
    $id: ID!
    $name: String
    $description: String
    $siteIds: [String!]!
    $localeIds: [String!]!
  ) {
    updateCountryGroup(
      input: {
        id: $id
        name: $name
        description: $description
        siteIds: $siteIds
        localeIds: $localeIds
      }
    ) {
      countryGroup {
        id
        name
        description
      }
    }
  }
`;
const CREATE_COUNTRY_GROUP = gql`
  mutation CreateCountryGroup(
    $name: String!
    $description: String
    $siteIds: [String!]!
    $localeIds: [String!]!
  ) {
    createCountryGroup(
      input: {
        name: $name
        description: $description
        siteIds: $siteIds
        localeIds: $localeIds
      }
    ) {
      countryGroup {
        id
        name
        description
        sites {
          id
          name
          salesforceId
        }
      }
    }
  }
`;

const CountryGroupWrapper = styled.div`
  height: 600px;
`;

const ErrorWrapper = styled.div`
  .settingsButton {
    margin-top: 1rem;
    div {
      margin: 0;
      padding: 0;
    }
  }
`;

const selectStyles = {
  menu: (provided) => ({
    ...provided,
    height: 400,
    zIndex: 2000,
    overflow: 'hidden',
  }),
};

const erroredSelectStyles = {
  menu: (provided) => ({
    ...provided,
    height: 100,
    zIndex: 2000,
    overflow: 'hidden',
  }),
  control: (base) => ({
    ...base,
    borderColor: 'red',
    '&:hover': {
      borderColor: 'red',
    },
  }),
};

const StyledTextField = withStyles({
  root: {
    width: '100%',
    marginBottom: '10%',
  },
})(TextField);
interface Props {
  refetch: (variables?: Record<string, any>) => Promise<ApolloQueryResult<any>>;
  setNewModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  countryGroup: CountryGroup;
  sites: [Site];
}

const CountryGroupForm = ({ countryGroup, sites, setNewModalOpen, refetch }: Props) => {
  const [values, setValues] = useState({ id: null, name: '', description: '' });
  const [selectedSites, setSelectedSites] = useState([]);
  const [selectedLocales, setSelectedLocales] = useState([]);
  const [errors, setErrors] = useState([]);
  const [saveCountryGroup] = countryGroup
    ? useMutation(UPDATE_COUNTRY_GROUP)
    : useMutation(CREATE_COUNTRY_GROUP);
  const [title, setTitle] = useState('New country group');

  useEffect(() => {
    if (countryGroup) {
      setTitle('Edit country group');
      if (Object.keys(countryGroup).length > 0) {
        setValues({
          id: countryGroup.id,
          name: countryGroup.name,
          description: countryGroup.description,
        });
        const selectedSites = countryGroup.sites.map((s) => s.id);
        setSelectedSites(selectedSites);
        const selectedLocales = countryGroup.locales.map((l) => l.id);
        setSelectedLocales(selectedLocales);
      }
    }
  }, []);

  const options = sites.map((site: { id: any; name: any }) => ({
    value: site.id,
    label: site.name,
  }));
  const selectValues = options.filter((op) => selectedSites.includes(op.value));

  const validations = () => {
    setErrors([]);
    if (selectedSites.length === 0) {
      const newErrors = [...errors];
      newErrors.push({ field: 'countrySelect', message: 'required' });
      setErrors(newErrors);
    }
  };

  const handleChange = ({ target: { name, value } }) => {
    setErrors([]);
    const newValues = { ...values };
    newValues[name] = value;
    setValues(newValues);
  };

  const handleCountryChange = (selected) => {
    if (selected) {
      let newErrors = [...errors];
      newErrors = newErrors.filter((e) => {
        if (e.field === 'countrySelect' && e.message === 'required') {
          return false;
        }
        return true;
      });
      setErrors(newErrors);
      const newSeleced = selected.map((s) => s.value);
      const addedSite = newSeleced.filter((x) => !selectedSites.includes(x))[0];
      const removedSite = selectedSites.filter((x) => !newSeleced.includes(x))[0];
      if (addedSite) {
        // add all the sites locales to selectedLocales
        const addedLocales = sites
          .find((site) => site.id === addedSite)
          .locales.map((loc) => loc.id);
        setSelectedLocales([...selectedLocales, ...addedLocales]);
      }
      if (removedSite) {
        // remove the sites locales from selectedLocales
        const removedLocales = sites
          .find((site) => site.id === removedSite)
          .locales.map((loc) => loc.id);
        setSelectedLocales(selectedLocales.filter((x) => !removedLocales.includes(x)));
      }
      setSelectedSites(newSeleced);
    } else {
      setSelectedSites([]);
    }
  };

  const dialogContent = (
    sites,
    values,
    errors,
    handleChange,
    selectValues,
    handleCountryChange,
    options,
  ) => {
    const [filterSite, setFilterSite] = useState(null);
    return (
      <>
        {sites.length > 0 ? (
          <CountryGroupWrapper>
            <StyledTooltip
              title="name already taken"
              open={!!errors.find((e) => e.field === 'name')}
            >
              <StyledTextField
                value={values.name}
                onChange={handleChange}
                required
                name="name"
                label="Name"
              />
            </StyledTooltip>
            <StyledTextField
              value={values.description}
              onChange={handleChange}
              name="description"
              label="Description"
            />
            <p>Sites:</p>
            <Select
              required
              styles={
                errors.find((e) => e.field === 'countrySelect')
                  ? erroredSelectStyles
                  : selectStyles
              }
              value={selectValues}
              onChange={handleCountryChange}
              options={options}
              isMulti
              isSeachable
            />

            <p>Locale Filters:</p>
            {filterSite && (
              <LocaleFilterDialog
                site={filterSite}
                setFilterSite={setFilterSite}
                selectedLocales={selectedLocales}
                setSelectedLocales={setSelectedLocales}
              />
            )}
            {selectValues.map((siteOption) => (
              <SiteFilterButton
                key={siteOption.value}
                selectedLocales={selectedLocales}
                site={sites.find((s) => s.id === siteOption.value)}
                setFilterSite={setFilterSite}
              />
            ))}
          </CountryGroupWrapper>
        ) : (
          <ErrorWrapper>
            <p>
              You have not yet imported any sites from Salesforce. Create a publishing
              target and import sites from Salesforce.
            </p>
            <Link to="/settings">
              <Button
                label="Go to Settings"
                buttonState="none"
                trailingIcon="triangle"
                className="settingsButton"
              />
            </Link>
          </ErrorWrapper>
        )}
      </>
    );
  };

  return (
    <MVMDialog
      showDialog={setNewModalOpen}
      title={title}
      content={dialogContent(
        sites,
        values,
        errors,
        handleChange,
        selectValues,
        handleCountryChange,
        options,
      )}
      validations={validations}
      mutation={saveCountryGroup}
      mutationVariables={{
        ...values,
        siteIds: selectedSites,
        localeIds: selectedLocales,
      }}
      refetch={refetch}
      errors={errors}
      setErrors={setErrors}
      submitButtonState={
        values.name && selectedSites.length > 0 ? 'highlight' : 'disabled'
      }
      showSubmitButton={sites.length > 0}
    />
  );
};

export default CountryGroupForm;
