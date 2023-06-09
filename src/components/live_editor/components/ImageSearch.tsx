import React, { useState } from 'react';
import styled from 'styled-components';
import { InputBase, IconButton, Dialog } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { withStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/client';
import axios from 'axios';
import { toast } from 'react-toastify';
import CloseButton from '../../CloseButton';
import useDebounce from '../../../hooks/debounceHook';
import { GET_IMAGES } from '../../../utils/queries';
import ImageResultName from '../../ImageResultName';
import ImageUpload from '../../ImageUpload';
import MVMButton from '../../MVMButton';

const ImageSearchContainer = styled.div`
  height: 70vh;
  width: 55vw;
  background-color: #fff;
`;

const DialogHeading = styled.div`
  display: flex;
  height: 73px;
  align-items: center;
  justify-content: space-between;
`;

const Image = styled.img`
  width: 100%;
  max-height: 200px;
  object-fit: cover;
`;

const SearchbarContainer = styled.div`
  width: 100%;
  display: flex;
`;

const SingleResultContainer = styled.div`
  width: 25%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const SearchResultContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  p {
    font-size: 0.8rem;
  }
`;

const NoSearchResults = styled.p`
  font-family: 'Nunito Sans', sans-serif;
  color: #232323;
  font-size: 1rem;
`;

const ShowMoreWrapper = styled.div`
  width: 100%;
  text-align: center;
  margin-bottom: 30px;
  margin-top: 10px;
`;

const styles = () => ({
  searchbar: {
    width: '80%',
    color: 'rgba(0, 0, 0, 0.87)',
    borderRadius: '0.28571429rem',
    paddingLeft: '1rem',
    background: '#f3f3f3',
  },
  dialog: {
    zIndex: 1299,
    maxWidth: 'unset',
  },
  paper: {
    maxWidth: 'unset',
    padding: '20px 40px',
  },
});

const ImageSearch = ({ setDialogOpen, onChange, classes: c }) => {
  const [images, setImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [numOfResults, setNumOfResults] = useState(50);
  const [hasNextPage, setHasNextPage] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 350);

  const { refetch } = useQuery(GET_IMAGES, {
    variables: { searchTerm: debouncedSearchTerm, first: numOfResults },
    onCompleted: (data) => {
      setImages(data.images.nodes);
      setHasNextPage(data.images.pageInfo.hasNextPage);
    },
    notifyOnNetworkStatusChange: true,
  });

  const uploadAssetImage = (images) => {
    if (!images) {
      return;
    }
    const bodyFormData = new FormData();
    images.forEach(async (file) => bodyFormData.append('images[]', await file));
    axios.defaults.headers.post.Accept = 'application/json';
    axios
      .post(`${process.env.GATSBY_API_URL}/api/assets`, bodyFormData, {
        headers: {
          apiToken: localStorage.getItem('apiToken'),
        },
      })
      .then(() => {
        refetch();
      })
      .catch((errors) => toast.error(String(errors)));
  };

  return (
    <Dialog
      open
      onClose={() => setDialogOpen(false)}
      classes={{ root: c.dialog, paper: c.paper }}
    >
      <ImageSearchContainer>
        <DialogHeading>
          <CloseButton
            func={() => {
              setDialogOpen(false);
            }}
          />
          <SearchbarContainer>
            <InputBase
              classes={{ root: c.searchbar }}
              placeholder="Search images..."
              inputProps={{ 'aria-label': 'search images' }}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IconButton aria-label="search">
              <SearchIcon />
            </IconButton>

            <ImageUpload uploadHandler={uploadAssetImage}>
              <MVMButton label="Upload image" buttonState="highlight" />
            </ImageUpload>
          </SearchbarContainer>
        </DialogHeading>
        <SearchResultContainer>
          {images.length > 0 ? (
            <>
              {images.map((img) => (
                <SingleResultContainer
                  key={img.name}
                  onClick={() => {
                    onChange(img.name);
                    setDialogOpen(false);
                  }}
                  onKeyPress={() => {
                    onChange(img.name);
                    setDialogOpen(false);
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div style={{ padding: '10px' }}>
                    <Image src={img.thumbnail} alt={img.name} />
                  </div>

                  <ImageResultName name={img.name} />
                </SingleResultContainer>
              ))}

              {hasNextPage && (
                <ShowMoreWrapper>
                  <MVMButton
                    onClick={() => {
                      setNumOfResults(numOfResults + 50);
                      refetch();
                    }}
                    label="Show more results"
                    buttonState="highlight"
                  />
                </ShowMoreWrapper>
              )}
            </>
          ) : (
            <NoSearchResults>No images found</NoSearchResults>
          )}
        </SearchResultContainer>
      </ImageSearchContainer>
    </Dialog>
  );
};

export default withStyles(styles)(ImageSearch);
