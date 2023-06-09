import React, { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import styled from 'styled-components';
import { Input, InputLabel, Select, Chip, MenuItem, TextField } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { toast } from 'react-toastify';
import { navigate } from 'gatsby';
import MVMButton from '../MVMButton';
import PageSearch from '../PageSearch';
import { GET_TARGET_LANUGAGES } from '../../utils/queries';

const CREATE_TRANSLATION_PROJECT = gql`
  mutation CreateTranslationProject(
    $title: String!
    $deadline: String!
    $locales: [String!]!
    $pageIds: [ID!]!
    $provider: TranslationProvider!
  ) {
    createTranslationProject(
      input: {
        title: $title
        deadline: $deadline
        locales: $locales
        pageIds: $pageIds
        provider: $provider
      }
    ) {
      message
    }
  }
`;

const Form = styled.form`
  width: 60%;
  display: flex;
  flex-direction: column;
`;

const InputsWrapper = styled.div`
  height: 30vh;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

// The form for creating new translation project
const TranslationProject = () => {
  const [submitLabel, setSubmitLabel] = useState('Create');
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState(null);
  const [locales, setLocales] = useState([]);
  const [selectedLocales, setSelectedLocales] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);
  const minDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };
  useQuery(GET_TARGET_LANUGAGES, {
    onCompleted: (data) => setLocales(data.targetLanguages),
  });
  const [createTranslationProject] = useMutation(CREATE_TRANSLATION_PROJECT);

  const handlePageCheck = (id) => {
    const pageId = parseInt(id);
    const newSet = new Set(selectedPages);
    if (newSet.has(pageId)) {
      newSet.delete(pageId);
    } else {
      newSet.add(pageId);
    }
    setSelectedPages(Array.from(newSet.values()));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitLabel === 'Sending...') {
      toast.info('The Translation project is being created please wait.');
      return;
    }
    if (!selectedLocales.length) {
      toast.error('You need to select at least one locale.');
      return;
    }
    if (!selectedPages.length) {
      toast.error('You need to select at least one page.');
      return;
    }
    setSubmitLabel('Sending...');
    try {
      const response = await createTranslationProject({
        variables: {
          title,
          deadline,
          locales: selectedLocales,
          pageIds: selectedPages,
          provider: 'LW',
        },
      });
      toast.success(response.data.createTranslationProject.message);
      setSubmitLabel('Create');
    } catch (e) {
      setSubmitLabel('Create');
    }
  };

  return (
    <div>
      <br />
      <MVMButton label="Back" onClick={() => navigate('/translation-projects/')} />
      <h1>New Translation Project</h1>
      <Form onSubmit={handleSubmit}>
        <MVMButton label={submitLabel} type="submit" submit buttonState="highlight" />
        <InputsWrapper>
          <TextField
            label="Project Title"
            name="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDateTimePicker
              required
              label="Project Deadline"
              minDate={minDate()}
              format="dd.MM.yyyy (E) HH:mm"
              value={deadline}
              onChange={(date: string) => setDeadline(date)}
            />
          </MuiPickersUtilsProvider>
          <div>
            <InputLabel>Locales:</InputLabel>
            <Select
              multiple
              value={selectedLocales}
              input={<Input id="select-multiple-chip" />}
              onChange={(e) => setSelectedLocales(e.target.value as string[])}
              renderValue={(selected) => (
                <div>
                  {(selected as string[]).map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </div>
              )}
            >
              {locales.map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </div>
        </InputsWrapper>
        <PageSearch
          maxResults={10}
          selectable
          selected={selectedPages}
          setSelected={(id) => handlePageCheck(id)}
        />
      </Form>
    </div>
  );
};

export default TranslationProject;
