import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import { useQuery } from '@apollo/client';
import Button from '../../../Button';
import StyledTooltip from '../../../styled/StyledTooltip';
import { GET_TRANSLATION } from '../../../../utils/queries';
import PlainTextEditor from '../translationEditor/PlainTextEditor';
import Indicator from './ReusedTranslationIndicator';
import { getTranslationId } from './translationFns';
import TranslationSearch from './TranslationSearch';

const PlainTextLocalizedField = ({
  value,
  formContext: { formRef, reloadPreview },
  onChange,
}) => {
  const translationId = getTranslationId(value);
  const [editorOpen, setEditorOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [translation, setTranslation] = useState({ default: '' });

  // happens when reordering
  if (!translationId && translation.default !== '') {
    setTranslation({
      default: '',
    });
  }

  const handleSearch = (e) => {
    if (!translationId) {
      setSearchTerm(e.target.value);
    }
  };

  const { refetch } = useQuery(GET_TRANSLATION, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id: translationId,
    },
    skip: !translationId,
    onCompleted: (data) => {
      if (data) {
        setTranslation(data.translation.body);
      }
    },
  });

  return (
    <>
      {translationId && <Indicator translationId={translationId} />}
      <TextField
        type="text"
        variant="outlined"
        value={translation.default || searchTerm}
        onChange={handleSearch}
      />
      {!translationId && searchTerm && (
        <TranslationSearch searchTerm={searchTerm} onChange={onChange} />
      )}
      <div>
        <Button
          onClick={() => {
            setEditorOpen(true);
          }}
          text={translationId ? 'Edit Localization' : 'New Translation'}
        />
        {translationId && (
          <StyledTooltip title="Deletes the localization only from this module">
            <span>
              <Button text="Unlink Localization" onClick={() => onChange('')} />
            </span>
          </StyledTooltip>
        )}
      </div>
      {editorOpen && (
        <PlainTextEditor
          translation={translation}
          translationId={translationId}
          setEditorOpen={setEditorOpen}
          formRef={formRef}
          reloadPreview={reloadPreview}
          onChange={onChange}
          refetch={refetch}
        />
      )}
    </>
  );
};

export default PlainTextLocalizedField;
