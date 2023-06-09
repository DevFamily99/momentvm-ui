import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import styled from 'styled-components';
import Button from '../../components/MVMButton';
import CountryGroupForm from '../../components/country_groups/CountryGroupForm';
import CountryGroup from '../../components/country_groups/CountryGroup';
import {
  CountryGroup as CountryGroupType,
  GetCountryGroupsQueryResult,
} from '../../types';
import checkPermission from '../../utils/permission';

export const GET_COUNTRY_GROUPS = gql`
  {
    countryGroups {
      id
      name
      description
      locales {
        id
        code
      }
      sites {
        id
        name
        salesforceId
        locales {
          displayName
          code
        }
      }
    }
  }
`;

const GET_SITES = gql`
  {
    sites {
      id
      name
      salesforceId
      locales {
        id
        name
        code
      }
    }
  }
`;

const NoCountryGroups = styled.div`
  margin: 1rem 0;
`;

const CountryGroupsPage = () => {
  if (!checkPermission('can_see_settings')) {
    window.location.href = '/';
    return null;
  }
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [countryGroup, setCountryGroup] = useState<CountryGroupType>(null);
  const { loading, error, data, refetch } =
    useQuery<GetCountryGroupsQueryResult>(GET_COUNTRY_GROUPS);
  const { loading: loadingS, error: errorS, data: { sites } = {} } = useQuery(GET_SITES);
  if (loading || loadingS) return <>Loading</>;
  if (error || errorS) return <>Error</>;

  return (
    <>
      <h1>Country Groups</h1>
      <p>
        Country Groups consists of countries (SFCC Sites) which you can import in
        settings.
      </p>

      <div className="countryGroup-list">
        {data.countryGroups.map((countryGroup) => (
          <CountryGroup
            key={countryGroup.id}
            refetch={refetch}
            countryGroup={countryGroup}
            setCountryGroup={setCountryGroup}
            setNewModalOpen={setNewModalOpen}
          />
        ))}
      </div>

      {data.countryGroups.length === 0 && (
        <NoCountryGroups>
          <p>You don&apos;t have yet created any country groups.</p>
        </NoCountryGroups>
      )}

      <div>
        <Button
          onClick={() => {
            setCountryGroup(null);
            setNewModalOpen(true);
          }}
          label="New Country Group"
          buttonState="highlight"
        />
        {newModalOpen && (
          <CountryGroupForm
            countryGroup={countryGroup}
            sites={sites}
            setNewModalOpen={setNewModalOpen}
            refetch={refetch}
          />
        )}
      </div>
    </>
  );
};

export default CountryGroupsPage;
