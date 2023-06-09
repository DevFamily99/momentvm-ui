import React from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/client';
import Highlighter from 'react-highlight-words';
import { stripHTML } from './translationFns';
import useDebounce from '../../../../hooks/debounceHook';
import { SEARCH_TRANSLATIONS } from '../../../../utils/queries';

const SuggestionsWrapper = styled.div`
  max-height: 600px;
  overflow-y: scroll;
`;

const SuggestionText = styled.div`
  border-top: 1px solid black;
  padding-top: 5px;
  padding-bottom: 5px;
  margin: 5 5 5 5;
  :hover {
    background-color: lightblue;
  }
`;

/**
 * Used in the LocalizedField and PlainTextLocalizedField components.
 * Does a search for a given term, shows highlighted suggestions
 *
 * @param searchTerm string
 * @param onChange forms onChange function
 */
const TranslationSearch = ({ searchTerm, onChange }) => {
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data } = useQuery(SEARCH_TRANSLATIONS, {
    variables: { query: debouncedSearchTerm },
    skip: searchTerm.length < 3,
  });

  if (!data) {
    return <p>No matches found, create a new Translation</p>;
  }

  return (
    <SuggestionsWrapper>
      {data.searchTranslations.map((t) => (
        <SuggestionText onClick={() => onChange(`loc::${t.id}`)}>
          <Highlighter
            searchWords={[searchTerm]}
            textToHighlight={stripHTML(t.body.default)}
          />
        </SuggestionText>
      ))}
    </SuggestionsWrapper>
  );
};

export default TranslationSearch;
