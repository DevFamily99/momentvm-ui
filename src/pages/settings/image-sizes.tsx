import React from 'react';
import { navigate } from 'gatsby';
import checkPermission from '../../utils/permission';
import YAMLSettingEditor from '../../components/YAMLSettingEditor';

const ImageSizesPage = () => {
  if (!checkPermission('can_see_settings')) {
    navigate('/');
    return <></>;
  }

  return (
    <>
      <h1>Image Sizes</h1>
      <p>
        If you are using dynamic images in your templates, you need to set the image sizes
        here.{' '}
      </p>
      <YAMLSettingEditor setting="image-sizes" />
    </>
  );
};

export default ImageSizesPage;
