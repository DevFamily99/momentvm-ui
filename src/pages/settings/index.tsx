import React, { useState } from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import Button from '../../components/MVMButton';
import ImportCountries from '../../components/ImportCountries';
import ClearAllCountries from '../../components/ClearAllCountries';
import checkPermission from '../../utils/permission';

interface CurrentBuiltDate {
  currentBuildDate: CurrentDate;
}
interface CurrentDate {
  currentDate: string;
}

const BuildDate = styled.p`
  margin-top: 50px;
  color: #9e9e9e;
`;

const Settings: React.FC = () => {
  if (!checkPermission('can_see_settings')) {
    window.location.href = '/';
    return null;
  }

  const builtAt = useStaticQuery<CurrentBuiltDate>(graphql`
    query {
      currentBuildDate {
        currentDate
      }
    }
  `);
  const [importCountriesDialog, setImportCountriesDialog] = useState(false);
  const [confirmClearAllDialog, setConfirmClearAllDialog] = useState(false);
  return (
    <div>
      <h1>Settings</h1>
      <h2>Team Management</h2>
      <Link to="team-settings">
        <Button label="Team Settings" />
      </Link>
      <Link to="page-contexts">
        <Button label="Page Contexts" />
      </Link>
      <Link to="publishing-targets">
        <Button label="Publishing Targets" />
      </Link>
      <Link to="country-groups">
        <Button label="Country Groups" />
      </Link>
      <Link to="customer-groups">
        <Button label="Customer Groups" />
      </Link>
      <Link to="image-sizes">
        <Button label="Image Sizes" />
      </Link>
      <Link to="tags">
        <Button label="Tags" />
      </Link>

      <h2>Salesforce Site Management</h2>
      <Button label="Import Sites" onClick={() => setImportCountriesDialog(true)} />
      <Button
        label="Delete all Team Sites"
        buttonState="delete"
        onClick={() => setConfirmClearAllDialog(true)}
      />

      {/* DIALOGS */}
      {importCountriesDialog && (
        <ImportCountries setImportCountriesDialog={setImportCountriesDialog} />
      )}
      {confirmClearAllDialog && (
        <ClearAllCountries setConfirmClearAllDialog={setConfirmClearAllDialog} />
      )}

      <h2>User Management</h2>
      <Link to="users">
        <Button label="Users" />
      </Link>
      <Link to="roles">
        <Button label="Roles" />
      </Link>
      <BuildDate>
        System last deployed {String(builtAt.currentBuildDate.currentDate) || null}
      </BuildDate>
    </div>
  );
};
export default Settings;
