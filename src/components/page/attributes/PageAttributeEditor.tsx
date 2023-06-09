import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import TextField from '@material-ui/core/TextField';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { GET_TRANSLATION, DELETE_TRANSLATION, GET_LOCALES } from '../../../utils/queries';
// import Button from '../../Button';
import Button from '../../MVMButton';
import AttributeForm from './AttributeForm';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 500px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 1rem;
`;

const TextFieldWrapper = styled.div`
  width: 10rem;
`;

const AttributeField = ({ name, value, openEditor, deleteTranslation }) => {
  const { data, loading, error } = useQuery(GET_TRANSLATION, {
    variables: { id: value },
    skip: !value,
  });
  let displayValue = '';
  if (!loading && !error && value) {
    displayValue = data.translation.body[Object.keys(data.translation.body)[0]];
  }

  return (
    <Field>
      <TextFieldWrapper>
        <TextField
          disabled
          value={displayValue}
          label={name.charAt(0).toUpperCase() + name.slice(1)}
          name={name}
        />
      </TextFieldWrapper>

      <Button
        onClick={() => openEditor(name)}
        label={value ? 'Edit Translation' : 'New Translation'}
      />
      {value && (
        <Button onClick={() => deleteTranslation(name)} label="Delete Translation" />
      )}
    </Field>
  );
};

const PageAttributeEditor = ({ page, theme }) => {
  const [currentField, setCurrentField] = useState('');
  const [fieldData, setFieldData] = useState({
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    url: page.url,
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [locales, setLocales] = useState([]);

  useQuery(GET_LOCALES, { onCompleted: (data) => setLocales(data.locales) });

  const [deleteTranslation] = useMutation(DELETE_TRANSLATION);

  const deleteT = async (field) => {
    const response = await deleteTranslation({
      variables: {
        id: fieldData[field],
        pageId: page.id,
        attributeField: field,
        attributeTranslation: true,
      },
    });
    if (response.data) {
      toast.success('Localization deleted successfully.');
      setFieldData({ ...fieldData, [field]: '' });
      return;
    }
    toast.error('Error deleting Translation.');
  };

  const openEditor = (field) => {
    setCurrentField(field);
    setDialogOpen(true);
  };

  const closeEditor = () => {
    setDialogOpen(false);
    setCurrentField('');
  };

  return (
    <Wrapper>
      <form autoComplete="off">
        <AttributeField
          name="title"
          value={fieldData.title}
          openEditor={openEditor}
          deleteTranslation={deleteT}
        />
        <AttributeField
          name="description"
          value={fieldData.description}
          openEditor={openEditor}
          deleteTranslation={deleteT}
        />
        <AttributeField
          name="keywords"
          value={fieldData.keywords}
          openEditor={openEditor}
          deleteTranslation={deleteT}
        />
        <AttributeField
          name="url"
          value={fieldData.url}
          openEditor={openEditor}
          deleteTranslation={deleteT}
        />
      </form>
      {dialogOpen && (
        <AttributeForm
          fieldData={fieldData}
          setFieldData={setFieldData}
          pageId={page.id}
          allLocales={locales}
          dialogOpen={dialogOpen}
          closeEditor={closeEditor}
          currentField={currentField}
          translationId={fieldData[currentField]}
        />
      )}
    </Wrapper>
  );
};

export default PageAttributeEditor;
