import React, { FunctionComponent } from 'react';
import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import { TRANSLATION_PROJECT_STATUS } from '../../utils/queries';

const Label = styled.p`
  font-size: 1rem;
`;

interface TranslationStatusProps {
  pageId: string;
}

interface GetTranslationProjectStatusResponse {
  translationProjectStatus: string;
}

interface GetTranslationProjectStatusVars {
  pageId: string;
}

/**
 * Used to indicate the status of a translation project
 * @param status String
 */
const TranslationStatus: FunctionComponent<TranslationStatusProps> = ({ pageId }) => {
  // load the translation status
  const { data, loading, error } = useQuery<
    GetTranslationProjectStatusResponse,
    GetTranslationProjectStatusVars
  >(TRANSLATION_PROJECT_STATUS, {
    variables: { pageId },
  });
  if (!loading && !error) {
    const status = data.translationProjectStatus;
    switch (status) {
      case 'NOTSENT':
        return <Label>Page has not been sent to be translated.</Label>;
      case 'PENDING':
        return <Label>Translations are pending.</Label>;
      case 'READY':
        return <Label>Translations are ready to be imported.</Label>;
      default:
        return <Label>Could not get the translation project status.</Label>;
    }
  }
  return <div />;
};

export default TranslationStatus;
