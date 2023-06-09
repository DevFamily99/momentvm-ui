import React from 'react';
import { useQuery } from '@apollo/client';
import { REUSED_TRANSLATION } from '../../../../utils/queries';
import StyledTooltip from '../../../styled/StyledTooltip';
import InfoShape from '../../../InfoShape';

const Indicator = ({ translationId }) => {
  const { data } = useQuery(REUSED_TRANSLATION, { variables: { translationId } });

  const pages = (): string[] => {
    return Array.from(
      new Set(data.reusedTranslation.map((t) => (t.page ? t.page.name : ''))),
    );
  };

  if (data && data.reusedTranslation.length > 1) {
    return (
      <p>
        Used in {pages().length} pages{' '}
        <StyledTooltip
          title={
            <>
              {pages().map((page) => (
                <p key={page}>{page}</p>
              ))}
            </>
          }
        >
          <span>
            <InfoShape />
          </span>
        </StyledTooltip>
      </p>
    );
  }

  return null;
};

export default Indicator;
