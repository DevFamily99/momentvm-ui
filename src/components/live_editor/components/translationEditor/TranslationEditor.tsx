import React, { useState } from 'react';
import { EditorState } from 'draft-js';
import { createEditorStateWithText } from 'draft-js-plugins-editor';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromElement } from 'draft-js-import-element';
import Autocomplete from '@material-ui/lab/Autocomplete';
import styled from 'styled-components';
import { Dialog, TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { useQuery, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import RichEditor from './RichEditor';
import Button from '../../../Button';
import CloseButton from '../../../CloseButton';
import {
  CREATE_TRANSLATION,
  UPDATE_TRANSLATION,
  GET_LOCALES,
  GET_TRANSLATION_EDITOR_COLORS,
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

const rgb2hex = (rgb) => {
  const match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
  function hex(x) {
    return `0${parseInt(x, 10).toString(16)}`.slice(-2);
  }
  return `#${hex(match[1])}${hex(match[2])}${hex(match[3])}`;
};

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

// Wrap text outside of html tags in  <p> tags
const wrapTextInTags = (initialElement: HTMLElement) => {
  const nodes = Array.from(initialElement.childNodes).filter(
    (node) =>
      node.nodeName === 'BR' ||
      (node.nodeType === 3 && node.textContent.trim().length > 1),
  );
  nodes.forEach((node) => {
    const paragraph = document.createElement('p');
    node.after(paragraph);
    paragraph.appendChild(node);
  });
};

const LocaleDropdown = ({ locales, addNewLocale }) => {
  const localesList =  locales.map((loc) => ({
    key: loc, value: loc
  }));
  const onOptionsChange = (event, values) => {
    if (values.value !== undefined) {
      addNewLocale(values.value);
    } 
  }
  return (
    <Autocomplete
      id="auto-complete"
      autoComplete
      options={localesList}
      getOptionLabel={(option) => option.value}
      style={{ width: 150 }}
      renderInput={(params) => <TextField {...params} label="Add Language" margin='normal' />}
      onChange={onOptionsChange}
    />)
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
  const [values, setValues] = useState({});
  const [customColors, setCustomColors] = useState(null);
  const setInitialValues = (customColors) => {
    const values = {};
    const inlineStyles = {
      customInlineFn: (element, { Style }) => {
        if (element.style.textTransform === 'uppercase') {
          return Style('UPPERCASE');
        }
        if (element.style.color) {
          let style;
          customColors.forEach((color) => {
            if (element.style.color === 'unset') return;
            if (rgb2hex(element.style.color) === color.hex) {
              style = Style(color.name);
            }
          });
          return style;
        }
        return null;
      },
    };
    Object.keys(translation).forEach((locale) => {
      const element = document.createElement('div');
      element.innerHTML = translation[locale];
      wrapTextInTags(element);
      values[locale] = EditorState.createWithContent(
        stateFromElement(element, inlineStyles),
      );
    });
    setValues(values);
    setCustomColors(customColors);
  };
  const [locales, setLocales] = useState([]);
  const { refetch: refetchColors } = useQuery(GET_TRANSLATION_EDITOR_COLORS, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => setInitialValues(data.translationEditorColors),
  });
  useQuery(GET_LOCALES, { onCompleted: (data) => setLocales(data.locales) });
  const [createTranslation] = useMutation(CREATE_TRANSLATION);
  const [updateTranslation] = useMutation(UPDATE_TRANSLATION);

  const handleSetValue = (locale, editorState) => {
    setValues({ ...values, [locale]: editorState });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const translationBody = {};
    const options = {
      inlineStyles: {
        BOLD: { style: { fontWeight: 700, color: 'unset' } },
        UPPERCASE: { style: { textTransform: 'uppercase' } },
      },
    };
    customColors.forEach((color) => {
      options.inlineStyles[color.name] = {
        style: { color: color.hex },
      };
    });
    Object.keys(values).forEach((key) => {
      if (key !== '') {
        const parsedHTML = stateToHTML(values[key].getCurrentContent(), options);
        if (parsedHTML !== '<p><br></p>') {
          translationBody[key] = parsedHTML.replace(/<\/?p>/g, '');
        }
      }
    });
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
    if (locale !== '' && locale !== undefined) {
      if (!Object.keys(values).find((key) => key === locale)) {
        setValues({ ...values, [locale]: createEditorStateWithText('') });
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
            <RichEditor
              locale={localeKey}
              editorState={values[localeKey]}
              setValue={handleSetValue}
              customColors={customColors}
              refetchColors={refetchColors}
            />
          </RichEditorWrapper>
        ))}
      </TranslationForm>
    </Dialog>
  );
};

export default withStyles(styles)(TranslationEditor);
