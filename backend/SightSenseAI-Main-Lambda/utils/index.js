import { basename } from 'path';

export const getFileNameFromImageUrl = (imageUrl) => {
  const fileName = basename(imageUrl);

  // remove any query parameters or fragments from the file name
  const cleanFileName = fileName.split('?')[0].split('#')[0];

  return cleanFileName;
};
