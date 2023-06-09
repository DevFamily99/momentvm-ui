import React, { FunctionComponent, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import styled from 'styled-components';
import MVMAutocomplete, { Option } from '../../MVMAutocomplete';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eaeaea;
  margin-bottom: 1rem;
  .mvm--autocomplete-wrapper {
    padding: 0.4rem;
    margin-left: 1rem;
    border: 1px solid #eaeaea;
    color: black;
    border-radius: 10rem;
  }
  .mvm--flyout-menu {
    padding: 1rem;
    border-radius: 1rem;
    background-color: white;
    max-width: 200px;
    max-height: 80vh;
    overflow-y: scroll;
  }
  .mvm--option-element {
    border-bottom: 1px solid #eaeaea;
    padding: 1rem;
  }
`;

export const GET_LOCALES = gql`
  {
    uniqueLocales {
      id
      name
      displayName
      displayLanguage
      code
      displayCountry
    }
  }
`;

export interface LocaleQueryData {
  uniqueLocales: Locale[];
}

export interface Locale {
  id: string;
  name: string;
  displayName: string;
  displayLanguage: string;
  code: string;
  displayCountry: string;
}

interface LocaleSelectProps {
  previewLocale: string;
  setPreviewLocale: React.Dispatch<React.SetStateAction<string>>;
}

const LocaleSelect: FunctionComponent<LocaleSelectProps> = ({
  previewLocale,
  setPreviewLocale,
}) => {
  // We comply with MVMAutocompletes Option type as input
  const [locales, setLocales] = useState<Option[]>([]);
  const { loading, error } = useQuery<LocaleQueryData>(GET_LOCALES, {
    onCompleted: (data) => {
      const localeOptions: Option[] = [];
      data.uniqueLocales.forEach((locale) => {
        localeOptions.push({ title: locale.name, id: locale.code });
        if (localeOptions.find((locale) => locale.id === previewLocale)) {
          setPreviewLocale(
            localeOptions.find((locale) => locale.id === previewLocale).id,
          );
        }
      });
      setLocales(localeOptions);
    },
  });

  if (loading) return <>Loading</>;
  if (error) return <>Error fetching Locales</>;
  if (locales.length === 0) return <>Loading locales...</>;

  return (
    <Wrapper>
      <p>Locale:</p>
      <MVMAutocomplete
        defaultOption={{ id: previewLocale, title: previewLocale }}
        options={locales}
        onSelectedOption={(option) => {
          setPreviewLocale(option.id);
        }}
      />
    </Wrapper>
  );
};

export default LocaleSelect;
