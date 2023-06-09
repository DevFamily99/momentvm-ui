import React, { useState } from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import styled from 'styled-components';
import { Dialog, TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { useQuery, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import Button from '../../../Button';
import CloseButton from '../../../CloseButton';
import {
  CREATE_TRANSLATION,
  UPDATE_TRANSLATION,
  GET_LOCALES,
} from '../../../../utils/queries';

const styles = () => ({
  searchbar: {
    width: '80%',
    color: 'rgba(0, 0, 0, 0.87)',
    borderRadius: '0.28571429rem',
    paddingLeft: '1rem',
    background: '#f3f3f3',
  },
  dialog: {
    zIndex: 1299,
    maxWidth: 'unset',
  },
  paper: {
    maxWidth: 'unset',
    padding: '20px 40px',
  },
});

const RichEditorWrapper = styled.div`
  margin-top: 30px;
`;

const LocaleLabel = styled.div`
  width: max-content;
  font-size: 18px;
`;

const RemoveLocaleBtn = styled.button`
  background-color: #fff;
  color: #808080;
  border: solid;
  border-radius: 4px;
  border-width: 1px;
  margin-top: 5px;
  margin-left: 15px;
  padding: 0;
  padding-left: 8px;
  padding-right: 8px;
`;

const TranslationForm = styled.form`
  font-family: 'Nunito Sans', sans-serif;
  background-color: white;
  z-index: 1500;
  height: 800px;
  width: 70vw;
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LocaleDropdown = ({ locales, addNewLocale }) => {
  const options = locales.map((loc) => (
    <MenuItem className="menu-select" key={loc} value={loc}>
      {loc}
    </MenuItem>
  ));
  return (
    <Select
      value="Add Language"
      onChange={(e) => {
        return addNewLocale(e.target.value);
      }}
    >
      <MenuItem value="Add Language">Add Language</MenuItem>
      {options}
    </Select>
  );
};

const TranslationEditor = ({
  translation,
  translationId,
  setEditorOpen,
  formRef,
  onChange,
  reloadPreview,
  refetch,
  classes: c,
}) => {
  const [values, setValues] = useState({ ...translation });
  const [locales, setLocales] = useState([]);

  useQuery(GET_LOCALES, { onCompleted: (data) => setLocales(data.locales) });
  const [createTranslation] = useMutation(CREATE_TRANSLATION);
  const [updateTranslation] = useMutation(UPDATE_TRANSLATION);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const translationBody = values;
    if (translationId) {
      const res = await updateTranslation({
        variables: { id: translationId, translationBody },
      });
      if (res) {
        refetch();
        reloadPreview();
        toast.success('Translation updated successfully.');
      }
      return;
    }

    const res = await createTranslation({ variables: { translationBody } });
    if (res) {
      onChange(`loc::${res.data.createTranslation.translation.id}`);
      formRef.submit();
      toast.success('Translation created successfully.');
    }
  };

  const addNewLocale = (locale) => {
    if (locale !== 'Add Language') {
      if (!Object.keys(values).find((key) => key === locale)) {
        setValues({ ...values, [locale]: '' });
      }
    }
  };

  const removeLocale = (locale) => {
    if (window.confirm(`Are you sure you want to delete this locale: ${locale}`)) {
      const newValues = { ...values };
      delete newValues[locale];
      setValues(newValues);
    }
  };

  return (
    <Dialog
      open
      onClose={() => setEditorOpen(false)}
      classes={{ root: c.dialog, paper: c.paper }}
    >
      <TranslationForm onSubmit={(e) => handleSubmit(e)}>
        <FormHeader>
          <Button onClick={() => true} text="Save Translation" type="submit" />
          <CloseButton
            id="close-translation-btn"
            func={() => {
              setEditorOpen(false);
            }}
          />
        </FormHeader>
        <h3 data-translation-id={translationId}>EDIT TRANSLATION</h3>
        <LocaleDropdown addNewLocale={addNewLocale} locales={locales} />
        {Object.keys(values).map((localeKey) => (
          <RichEditorWrapper key={localeKey}>
            <div style={{ display: 'flex' }}>
              <LocaleLabel>{localeKey}</LocaleLabel>
              {localeKey !== 'default' && (
                <RemoveLocaleBtn
                  type="button"
                  onClick={() => {
                    removeLocale(localeKey);
                  }}
                >
                  X
                </RemoveLocaleBtn>
              )}
            </div>
            <TextField
              fullWidth
              name={localeKey}
              value={values[localeKey]}
              onChange={(e) => setValues({ ...values, [localeKey]: e.target.value })}
            />
          </RichEditorWrapper>
        ))}
      </TranslationForm>
    </Dialog>
  );
};

export default withStyles(styles)(TranslationEditor);
