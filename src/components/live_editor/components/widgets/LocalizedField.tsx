import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import { useQuery } from '@apollo/client';
import Button from '../../../Button';
import StyledTooltip from '../../../styled/StyledTooltip';
import TranslationEditor from '../translationEditor/TranslationEditor';
import { GET_TRANSLATION } from '../../../../utils/queries';
import { getTranslationId, stripHTML } from './translationFns';
import TranslationSearch from './TranslationSearch';
import Indicator from './ReusedTranslationIndicator';

const LocalizedField = ({ value, formContext: { formRef, reloadPreview }, onChange }) => {
  const translationId = getTranslationId(value);
  const [editorOpen, setEditorOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [translation, setTranslation] = useState({ default: '' });

  // happens when reordering
  if (!translationId && translation.default !== '') {
    setTranslation({ default: '' });
  }

  const handleSearch = (e) => {
    if (!translationId) {
      setSearchTerm(e.target.value);
    }
  };

  const { refetch } = useQuery(GET_TRANSLATION, {
    notifyOnNetworkStatusChange: true,
    variables: { id: translationId },
    skip: !translationId,
    onCompleted: (data) => {
      if (data) {
        setTranslation(data.translation.body);
      }
    },
  });

  return (
    <div data-translation-id={translationId || 'null'}>
      {translationId && <Indicator translationId={translationId} />}
      <TextField
        type="text"
        placeholder="Search for a translation..."
        onChange={handleSearch}
        variant="outlined"
        value={stripHTML(translation.default) || searchTerm}
      />
      {!translationId && searchTerm && (
        <TranslationSearch searchTerm={searchTerm} onChange={onChange} />
      )}
      <div>
        <Button
          onClick={() => {
            setEditorOpen(true);
          }}
          data-translation-id={translationId || 'null'}
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
        <TranslationEditor
          translation={translation}
          translationId={translationId}
          setEditorOpen={setEditorOpen}
          formRef={formRef}
          reloadPreview={reloadPreview}
          onChange={onChange}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default LocalizedField;
