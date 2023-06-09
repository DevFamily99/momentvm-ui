import React, { useState, useEffect, FunctionComponent } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import TextField from '@material-ui/core/TextField';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import styled from 'styled-components';

import {
  CREATE_TRANSLATION,
  GET_TRANSLATION,
  UPDATE_TRANSLATION,
} from '../../../utils/queries';
import CloseButton from '../../CloseButton';
import Button from '../../MVMButton';

const FieldsWraper = styled.div`
  width: 400px;
  display: flex;
  flex-direction: column;
`;

const DialogTitleWrapper = styled.div`
  h2 {
    display: flex;
    justify-content: space-between;
  }
`;

const FieldWraper = styled.div`
  margin: 20px;
`;

interface UpdateMutationResponse {
  data: { updateTranslation: { message: string } };
}
interface CreateMutationResponse {
  createTranslation: { translation: { id: string } };
}

interface CreateMutationVariables {
  pageId: string;
  translationBody: any;
  attributeTranslation: boolean;
  attributeField: string;
}

interface UpdateMutationVariables {
  id: string;
  translationBody: any;
}

interface GetTranslationResponse {
  translation: Translation;
}

interface Translation {
  id: string;
  body: { string: string };
}

interface Props {
  fieldData: any;
  setFieldData: any;
  pageId: string;
  allLocales: [any];
  dialogOpen: boolean;
  closeEditor: any;
  currentField: any;
  // Can be null if a new translation should be created
  translationId?: string;
}

const AttributeForm: FunctionComponent<Props> = ({
  fieldData,
  setFieldData,
  pageId,
  allLocales,
  dialogOpen,
  closeEditor,
  currentField,
  translationId,
}) => {
  const [fields, setFields] = useState({});
  const [filter, setFilter] = useState('');

  const { data, loading, error, refetch } = useQuery<GetTranslationResponse, any>(
    GET_TRANSLATION,
    {
      variables: { id: translationId },
      skip: !translationId,
    },
  );

  const [createTranslation] = useMutation<
    CreateMutationResponse,
    CreateMutationVariables
  >(CREATE_TRANSLATION);
  const [updateTranslation] = useMutation<
    UpdateMutationResponse,
    UpdateMutationVariables
  >(UPDATE_TRANSLATION);

  useEffect(() => {
    const onCompleted = (data) => {
      if (data) {
        setFields(data.translation.body);
      }
    };
    const onError = (error) => {
      if (translationId) {
        toast.error('Error fetching Localization.');
      }
    };
    if (onCompleted || onError) {
      if (onCompleted && !loading && !error) {
        onCompleted(data);
      } else if (onError && !loading && error) {
        onError(error);
      }
    }
  }, [loading, data, error]);
  const handleChange = (e: { target: { name: string; value: string } }) => {
    const {
      target: { name, value },
    } = e;
    setFields({ ...fields, [name]: value });
  };

  const handleSearch = (e: { target: { value: string } }) => {
    const {
      target: { value },
    } = e;
    setFilter(value);
  };

  const create = () => {
    createTranslation({
      variables: {
        pageId,
        translationBody: fields,
        attributeTranslation: true,
        attributeField: currentField,
      },
    })
      .then((result) => {
        setFieldData({
          ...fieldData,
          [currentField]: result.data.createTranslation.translation.id,
        });
        toast.success('Localization Saved.');
        refetch();
      })
      .catch((error) => {
        toast.error(`An error occured while saving the translation. ${error.message} `);
      });
  };
  const update = () => {
    updateTranslation({
      variables: {
        id: translationId,
        translationBody: fields,
      },
    })
      .then(() => {
        toast.success('Translation Updated');
        refetch();
      })
      .catch(() => toast.error('Error occured while updating the translation'));
  };

  /**
   * **Form submit**
   *
   * Handles both create and update translation
   * @param e FormEvent
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (translationId) {
      update();
    } else {
      create();
    }
  };

  if (loading) {
    return <>Loading Form</>;
  }
  if (error) {
    return <>An error has occured while loading the form</>;
  }

  const visibleLocales = allLocales.filter((loc) => loc.toLowerCase().includes(filter));
  const uniqueLocales = [...new Set(visibleLocales)];

  return (
    <Dialog
      maxWidth="xl"
      open={dialogOpen}
      onClose={closeEditor}
      aria-labelledby="form-dialog-title"
    >
      <form style={{ minHeight: '950px' }} autoComplete="off" onSubmit={handleSubmit}>
        <DialogTitleWrapper>
          <DialogTitle id="form-dialog-title">
            Localize Page{' '}
            {`${currentField.charAt(0).toUpperCase()}${currentField.slice(1)}`}
            <CloseButton func={closeEditor} />
          </DialogTitle>
        </DialogTitleWrapper>
        <DialogActions>
          <Button label="Save" buttonState="highlight" submit type="submit" />
        </DialogActions>
        <DialogContent>
          <FieldsWraper>
            <TextField
              value={filter}
              onChange={handleSearch}
              placeholder="Search for locale..."
            />
            {uniqueLocales.map((locale: string) => (
              <FieldWraper key={locale}>
                <TextField
                  name={locale}
                  rows={1}
                  rowsMax={1}
                  label={locale}
                  variant="outlined"
                  value={fields[locale] || ''}
                  InputLabelProps={{ shrink: !!fields[locale] }}
                  onChange={handleChange}
                  fullWidth
                />
              </FieldWraper>
            ))}
          </FieldsWraper>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default AttributeForm;
