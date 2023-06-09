import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import StyledTooltip from './styled/StyledTooltip';

export const GET_TAGS = gql`
  {
    tags {
      id
      name
    }
  }
`;

export const CREATE_TAG = gql`
  mutation CreateTag($name: String!) {
    createTag(input: { name: $name }) {
      tag {
        id
        name
      }
    }
  }
`;

const TagSelect = ({ tagIds, setTagIds }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useQuery(GET_TAGS, {
    onCompleted: (data) => {
      const selectOptions = data.tags.map((tag) => ({ label: tag.name, value: tag.id }));
      setOptions(selectOptions);
    },
  });

  const [createTag] = useMutation(CREATE_TAG);

  const createNewOption = (name) => {
    setLoading(true);
    createTag({ variables: { name } }).then(({ data }) => {
      setOptions([
        ...options,
        { label: data.createTag.tag.name, value: data.createTag.tag.id },
      ]);
      setTagIds([...tagIds, data.createTag.tag.id]);
      setLoading(false);
    });
  };

  const handleChange = (selected) => {
    if (selected && selected.length) {
      setTagIds(selected.map((s) => s.value));
    } else {
      setTagIds([]);
    }
  };

  const selectedOptions = options.filter((op) => tagIds.includes(op.value));

  return (
    <>
      <StyledTooltip title="Tags help you find templates easier" placement="bottom-start">
        <h2>Tags</h2>
      </StyledTooltip>
      <CreatableSelect
        isClearable
        isLoading={loading}
        value={selectedOptions}
        options={options}
        onChange={handleChange}
        onCreateOption={createNewOption}
        isMulti
      />
    </>
  );
};

export default TagSelect;
