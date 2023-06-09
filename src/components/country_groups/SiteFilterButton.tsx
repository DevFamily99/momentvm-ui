import React, { FC } from 'react';
import Button from '../MVMButton';
import { Site } from '../../types';
import Funnel from '../../images/funnel-svg.svg';

interface Props {
  site: Site;
  selectedLocales: [string];
  setFilterSite: (images) => void;
}

const SiteFilterButton: FC<Props> = ({ site, setFilterSite, selectedLocales }) => {
  const localeIds = site.locales.map((loc) => loc.id);
  const isFiltered = !localeIds.every((loc) => selectedLocales.includes(loc));
  return (
    <div style={{ width: '100%', padding: '0 0 20px 0' }}>
      <Button
        label={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>{site.name}</span>
            <Funnel
              style={{ marginLeft: '10px' }}
              height="28px"
              width="15px"
              fill={isFiltered ? '#ff7e00' : 'grey'}
            />
          </div>
        }
        onClick={() => setFilterSite(site)}
      />
    </div>
  );
};

export default SiteFilterButton;
