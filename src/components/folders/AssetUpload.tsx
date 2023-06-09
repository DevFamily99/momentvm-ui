import React, { FC } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import ImageUpload from '../ImageUpload';
import { FolderType } from './types';
import MVMButton from '../MVMButton';

interface Props {
  currentFolder: FolderType;
  refetch: () => void;
}

const AssetUpload: FC<Props> = ({ currentFolder, refetch }) => {
  const handleUpload = async (images) => {
    if (!images.length) return;
    const bodyFormData = new FormData();
    for (let image of images) {
      bodyFormData.append('images[]', image);
    }
    bodyFormData.append('asset_folder_id', currentFolder.id);
    axios.defaults.headers.post.Accept = 'application/json';
    axios
      .post(`${process.env.GATSBY_API_URL}/api/assets`, bodyFormData, {
        headers: {
          apiToken: localStorage.getItem('apiToken'),
        },
      })
      .then(() => {
        refetch();
        toast.success('File was uploaded sucessfully.');
      })
      .catch((e) => {
        if (e.response) {
          toast.error(String(e.response.data.error));
        } else {
          toast.error(String(e));
        }
      });
  };

  return (
    <div style={{ width: '200px', height: '100px' }}>
      <ImageUpload uploadHandler={(images) => handleUpload(images)}>
        <MVMButton label="Upload new image" buttonState="highlight" />
      </ImageUpload>
    </div>
  );
};

export default AssetUpload;
