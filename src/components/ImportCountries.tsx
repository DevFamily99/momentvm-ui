import React, { useState } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { toast } from 'react-toastify';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';
import { Select, InputLabel, MenuItem } from '@material-ui/core';
import { gql, useQuery } from '@apollo/client';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import CheckBox from './styled/StyledCheckbox';
import Tooltip from './styled/StyledTooltip';
import Button from './MVMButton';
import MVMLoadingLogo from './MVMLoadingLogo';
import CloseButton from './CloseButton';

const PUBLISHING_TARGETS = gql`
  {
    publishingTargets {
      id
      name
    }
  }
`;

const TEAM_SITES = gql`
  query teamSites($publishingTargetId: ID!) {
    currentTeam {
      slug
      salesforceSites(publishingTargetId: $publishingTargetId)
      sites {
        id
      }
    }
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`;

const DialogTitleWrapper = styled.div`
  h2 {
    display: flex;
    justify-content: space-between;
    min-width: 20rem;
  }
`;

const SiteWrapper = styled.div`
  margin: 10px;
  width: 200px;
  display: flex;
  justify-content: space-between;
`;

const SiteName = styled.p`
  margin-top: 10px !important;
`;

const InputWrapper = styled.div`
  width: 100%;
  min-width: 300px;
  text-align: left;
`;

const Site = ({ site, checked, handleCheckChange, disabled }) => (
  <SiteWrapper>
    <SiteName>{`${site.display_name.default} (${site.id})`}</SiteName>
    <Tooltip
      disableHoverListener={!disabled}
      title="You can not remove already imported sites. Clear all the countries if you want to remove them."
    >
      <span>
        <CheckBox
          name={site.id}
          checked={!!checked}
          onChange={handleCheckChange}
          disabled={!!disabled}
        />
      </span>
    </Tooltip>
  </SiteWrapper>
);

const PublishingTargetSelector = ({ publishingTarget, setPublishingTarget }) => {
  const { data, loading } = useQuery(PUBLISHING_TARGETS);
  return (
    <InputWrapper>
      <InputLabel>Publishing Target</InputLabel>
      <Select
        style={{ width: '100%' }}
        value={publishingTarget}
        onChange={(e) => setPublishingTarget(e.target.value)}
      >
        {!loading && !data.publishingTargets.length ? (
          <MenuItem disabled>You need to create a publishing target first</MenuItem>
        ) : null}
        {!loading &&
          data.publishingTargets.map((pt) => (
            <MenuItem key={pt.id} value={pt.id}>
              {pt.name}
            </MenuItem>
          ))}
      </Select>
    </InputWrapper>
  );
};

const ImportCountries = ({ setImportCountriesDialog }) => {
  const [sites, setSites] = useState([]);
  const [countryLimit, setCountryLimit] = useState(null);
  const [publishingTarget, setPublishingTarget] = useState('');
  const [checkStatus, setCheckStatus] = useState({});
  const [disabled, setDisabled] = useState({});
  useQuery(TEAM_SITES, {
    variables: { publishingTargetId: publishingTarget },
    skip: !publishingTarget,
    onCompleted: (data) => {
      if (data) {
        const checkStatus = {};
        data.currentTeam.salesforceSites.forEach((site) => {
          checkStatus[site.id] = !!data.currentTeam.sites.find(
            (s) => s.salesforce_id === site.id,
          );
        });
        setSites(data.currentTeam.salesforceSites);
        setCheckStatus(checkStatus);
        // setCountryLimit(response.data.limit);
        setDisabled(checkStatus);
      }
    },
  });

  const initialCheckCount = Object.values(disabled).filter((el) => el).length;
  const currentCheckCount = Object.values(checkStatus).filter((el) => el).length;

  const handleCheckChange = (e) => {
    // check limit
    // if (currentCheckCount >= countryLimit && e.target.checked) {
    //   toast.error(
    //     'You have reached the country limit for your plan. Upgrade your plan if you want to import more countries.',
    //     { autoClose: 6000 },
    //   );
    //   return;
    // }
    const { name } = e.target;
    const newCheckstatus = { ...checkStatus };
    newCheckstatus[name] = !newCheckstatus[name];
    setCheckStatus(newCheckstatus);
  };

  const handleCheckAll = () => {
    const allChecked = Object.fromEntries(sites.map((site) => [site.id, true]));
    const noneChecked = Object.fromEntries(sites.map((site) => [site.id, false]));
    if (JSON.stringify(allChecked) === JSON.stringify(checkStatus)) {
      setCheckStatus(noneChecked);
      return;
    }
    setCheckStatus(allChecked);
  };

  const handleSubmit = () => {
    // see if anything changed
    if (initialCheckCount === currentCheckCount) {
      toast.info('No changes made.');
      setImportCountriesDialog(false);
      return;
    }
    axios
      .post(
        `${process.env.GATSBY_API_URL}/api/teams/import_sites`,
        {
          team: { sites: checkStatus },
          publishing_target_id: publishingTarget,
        },
        {
          headers: {
            apiToken: localStorage.getItem('apiToken'),
          },
        },
      )
      .then((res) => {
        toast.success(res.data.message);
        setImportCountriesDialog(false);
      });
  };

  const inDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let theme = createTheme();
  if (inDarkMode) {
    theme = createTheme({
      palette: {
        background: {
          paper: '#2c2830',
        },
        type: 'dark',
      },
    });
  }

  return (
    <ThemeProvider theme={theme}>
      <Dialog open onClose={() => setImportCountriesDialog(false)}>
        <DialogTitleWrapper>
          <DialogTitle>
            Import Sites
            <CloseButton
              func={() => {
                setImportCountriesDialog(false);
              }}
            />
          </DialogTitle>
        </DialogTitleWrapper>
        <DialogContent>
          <ContentWrapper>
            <PublishingTargetSelector
              publishingTarget={publishingTarget}
              setPublishingTarget={setPublishingTarget}
            />
            {publishingTarget !== '' && !sites.length && (
              <MVMLoadingLogo strokeWidth={4} duration={4} />
            )}
            {sites.length > 0 && (
              <>
                <div style={{ width: '100%' }}>
                  <SiteWrapper>
                    <SiteName>Select all</SiteName>
                    <CheckBox onChange={handleCheckAll} />
                  </SiteWrapper>
                </div>
                <br />
                {sites.map((site) => (
                  <Site
                    key={site.id}
                    site={site}
                    checked={checkStatus[site.id]}
                    handleCheckChange={handleCheckChange}
                    disabled={disabled[site.id]}
                  />
                ))}
              </>
            )}
          </ContentWrapper>
        </DialogContent>
        <DialogActions>
          <Button label="Done" buttonDownLabel="Loading..." onClick={handleSubmit} />
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};
export default ImportCountries;
