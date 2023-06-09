import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import styled from 'styled-components';
import { navigate } from 'gatsby';
import { Input } from '@material-ui/core';
import { toast } from 'react-toastify';
import Button from '../../components/MVMButton';
import checkPermission from '../../utils/permission';
import { GET_TAGS, CREATE_TAG } from '../../components/TagSelect';

const DELETE_TAG = gql`
  mutation DeleteTag($id: ID!) {
    deleteTag(input: { id: $id }) {
      tag {
        id
      }
    }
  }
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 700;
  display: inline-flex;
  width: fit-content;
  height: 40px;
  margin-right: 20px;
  padding: 6px;
`;

const TagWrapepr = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: left;
  grid-template-columns: 300px;
`;

const NewTag = ({ refetch }) => {
  const [tagName, setTagName] = useState('');
  const [createTag] = useMutation(CREATE_TAG);
  const handleSubmit = (e) => {
    e.preventDefault();
    createTag({ variables: { name: tagName } }).then(() => {
      toast.success('Tag created.');
      refetch();
      setTagName('');
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        placeholder="Create a new tag"
        value={tagName}
        onChange={(e) => setTagName(e.target.value)}
      />
      <Button label="Create" buttonState="highlight" submit type="submit" />
    </form>
  );
};

const Tag = ({ tag, refetch }) => {
  const [deleteTag] = useMutation(DELETE_TAG);
  const handleDelete = (id) => {
    if (confirm('Delete this tag?')) {
      deleteTag({ variables: { id } }).then(() => {
        refetch();
        toast.success('Tag deleted.');
      });
    }
  };
  return (
    <TagWrapepr>
      <Title>{tag.name}</Title>

      <Button label="Delete" buttonState="delete" onClick={() => handleDelete(tag.id)} />
    </TagWrapepr>
  );
};

const Tags = () => {
  if (!checkPermission('can_see_settings')) {
    navigate('/');
    return null;
  }
  const { data, loading, refetch } = useQuery(GET_TAGS);
  if (loading) {
    return <>Loading tags...</>;
  }

  return (
    <>
      <h1>Tags</h1>
      <p>Tags help you find things in search more easily.</p>
      <NewTag refetch={refetch} />
      <p>All your tags:</p>
      <div>
        {data.tags.map((tag) => (
          <Tag key={tag.name} tag={tag} refetch={refetch} />
        ))}
      </div>
    </>
  );
};

export default Tags;
