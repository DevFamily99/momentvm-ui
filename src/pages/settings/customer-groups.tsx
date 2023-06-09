import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import styled from 'styled-components';
import Button from '../../components/MVMButton';
import CustomerGroupForm from '../../components/customer_groups/CustomerGroupForm';
import CustomerGroup from '../../components/customer_groups/CustomerGroup';
import {
  CustomerGroup as CustomerGroupType,
  GetCustomerGroupsQueryResult,
} from '../../types';
import checkPermission from '../../utils/permission';

export const GET_CUSTOMER_GROUPS = gql`
  {
    customerGroups {
      id
      name
    }
  }
`;

const NoCustomerGroups = styled.div`
  margin: 1rem 0;
`;

const CustomerGroupsPage = () => {
  if (!checkPermission('can_see_settings')) {
    window.location.href = '/';
    return null;
  }
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [customerGroup, setCustomerGroup] = useState<CustomerGroupType>(null);
  const { loading, error, data, refetch } =
    useQuery<GetCustomerGroupsQueryResult>(GET_CUSTOMER_GROUPS);
  if (loading) return <>Loading</>;
  if (error) return <>Error</>;

  return (
    <>
      <h1>Customer Groups</h1>
      <p>
        Dynamic customer groups enable you to create customer segments for targeted
        campaigns, micro-sites and product lines. You can assign your pages to customer
        groups according to Salesforce Commerce Cloud. Please read the SFCC documentation
        how to create customer groups.
      </p>
      <div className="customerGroup-list">
        {data.customerGroups.map((customerGroup) => (
          <CustomerGroup
            key={customerGroup.id}
            refetch={refetch}
            customerGroup={customerGroup}
            setCustomerGroup={setCustomerGroup}
            setNewModalOpen={setNewModalOpen}
          />
        ))}
      </div>

      {data.customerGroups.length === 0 && (
        <NoCustomerGroups>
          <p>You don&apos;t have yet created any customer groups.</p>
        </NoCustomerGroups>
      )}

      <div>
        <Button
          onClick={() => {
            setCustomerGroup(null);
            setNewModalOpen(true);
          }}
          label="New Customer Group"
          buttonState="highlight"
        />
        {newModalOpen && (
          <CustomerGroupForm
            customerGroup={customerGroup}
            setNewModalOpen={setNewModalOpen}
            refetch={refetch}
          />
        )}
      </div>
    </>
  );
};

export default CustomerGroupsPage;
