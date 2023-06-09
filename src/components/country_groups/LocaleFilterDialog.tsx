import React, { FC } from 'react';
import styled from 'styled-components';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { toast } from 'react-toastify';
import Button from '../MVMButton';
import { Site } from '../../types';
import CheckBox from '../styled/StyledCheckbox';
import StyledTooltip from '../styled/StyledTooltip';

const LocaleCheckboxWrapper = styled.div`
  margin: auto;
  width: 200px;
  display: flex;
  justify-content: space-between;
  p {
    font-weight: bold;
  }
`;
interface Props {
  site: Site;
  selectedLocales: [string];
  setFilterSite: (images) => void;
  setSelectedLocales: (images) => void;
}

const LocaleFilterDialog: FC<Props> = ({
  site,
  setFilterSite,
  selectedLocales,
  setSelectedLocales,
}: Props) => {
  const handleLocaleChange = (e) => {
    if (e.target.checked) {
      setSelectedLocales([...selectedLocales, e.target.name]);
    } else {
      const siteLocales = site.locales.map((loc) => loc.id);
      if (selectedLocales.filter((loc) => siteLocales.includes(loc)).length === 1) {
        toast.error('At least one locale needs to be selected.');
        return;
      }
      setSelectedLocales([...selectedLocales.filter((loc) => loc !== e.target.name)]);
    }
  };

  const oneLocale = site.locales.length === 1;
  const tooltipTitle = oneLocale
    ? 'This site has only one locale, to remove the locale remove the site from the country group'
    : '';

  return (
    <Dialog transitionDuration={0} open onClose={() => setFilterSite(null)}>
      <DialogTitle>
        {site.name}
        {' - '}
        {site.salesforceId}
      </DialogTitle>
      <DialogContent>
        <p>Select the locales you want to be published.</p>
        {site.locales.map((locale) => (
          <StyledTooltip key={locale.code} title={tooltipTitle}>
            <LocaleCheckboxWrapper>
              <p>{locale.code}</p>

              <CheckBox
                checked={selectedLocales.includes(locale.id)}
                disabled={oneLocale}
                onChange={handleLocaleChange}
                name={locale.id}
              />
            </LocaleCheckboxWrapper>
          </StyledTooltip>
        ))}
      </DialogContent>
      <DialogActions>
        <Button label="Close" onClick={() => setFilterSite(null)} />
      </DialogActions>
    </Dialog>
  );
};

export default LocaleFilterDialog;
