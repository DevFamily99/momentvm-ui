import React from 'react';
import { Mutation } from 'react-apollo';
import { TagBox } from 'react-tag-box';
import { GET_SCHEDULE, CREATE_COUNTRY_GROUP_REFERENCE, DELETE_COUNTRY_GROUP_REFERENCE } from '../utils/queries';
import '../../page_view/styles/country-group-select.scss';
import * as Types from '../types';

interface CountryGroupSelectProps {
  schedule: Types.Schedule;
  countryGroups: Types.CountryGroup[];
}

/**
 * A search field where the user can enter country groups to add
 * @param props CountryGroupSelectProps
 */
const CountryGroupSelect = ({ schedule, countryGroups }: CountryGroupSelectProps) => {
  const allCountryGroupTags = countryGroups.map(countryGroup => {
    return { label: countryGroup.name, value: countryGroup.id };
  });
  const scheduleCountryGroupTags = schedule.countryGroups.map(countryGroup => {
    return { label: countryGroup.name, value: countryGroup.id };
  });

  return (
    <div className="tag-box-select">
      <Mutation
        mutation={CREATE_COUNTRY_GROUP_REFERENCE}
        refetchQueries={[{ query: GET_SCHEDULE, variables: { id: schedule.id } }]}
        /*update={(cache, { data: { createCountryGroupReference } }) => {
          // update receives two params: cache and data.
          // createCountryGroupReference is the data we receive back from the mutation query
          const { schedule: scheduleFromCache } = cache.readQuery({ query: GET_SCHEDULE, variables: { id: schedule.id } });
          let updatedSchedule = scheduleFromCache;
          updatedSchedule.countryGroups = updatedSchedule.countryGroups.concat([createCountryGroupReference.countryGroup])
          cache.writeQuery({
            query: GET_SCHEDULE,
            data: { schedule: updatedSchedule },
          });
        }}*/
      >
        {createCountryGroupReference => (
          <Mutation
            mutation={DELETE_COUNTRY_GROUP_REFERENCE}
            refetchQueries={[{ query: GET_SCHEDULE, variables: { id: schedule.id } }]}
          >
            {deleteCountryGroupReference => (
              <TagBox
                tags={allCountryGroupTags}
                selected={scheduleCountryGroupTags}
                search={(tag, input) => {
                  return tag.label.toLowerCase().includes(input.toLowerCase());
                }}
                onSelect={tag => {
                  createCountryGroupReference({
                    variables: {
                      scheduleID: schedule.id,
                      countryGroupID: tag.value,
                    },
                  });
                }}
                removeTag={tag => {
                  deleteCountryGroupReference({
                    variables: {
                      scheduleID: schedule.id,
                      countryGroupID: tag.value,
                    },
                  });
                }}
                backspaceDelete
                placeholder="Add a country group…"
              />
            )}
          </Mutation>
        )}
      </Mutation>
    </div>
  );
};

export default CountryGroupSelect;
