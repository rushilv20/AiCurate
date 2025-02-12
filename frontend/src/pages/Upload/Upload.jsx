import React, { useState, useContext, useEffect } from 'react';
import { TextField, Button, ButtonBase, Avatar } from '@material-ui/core';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import { v4 as uuidv4 } from 'uuid';

import useStyles from './Upload.styles';
import { AppContext } from '../../context';
import { callRekognitionAPI } from '../../api/crud.js';
import { Loader, Toast } from '../../components';
import { STATUS_TOAST_MAP } from '../../constants';
import { S3 } from '../../clients';

const Upload = () => {
  const { setAppContext } = useContext(AppContext);
  const classes = useStyles();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    type: null,
    message: null
  });

  const [image, setImage] = useState(null);

  useEffect(() => {
    setAppContext({
      buttonRoute: '/gallery',
      buttonTitle: 'View Gallery'
    });
  }, []);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailPattern.test(value)) {
      setEmailError('');
    } else {
      setEmailError('Invalid email address');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async () => {
    // show loader
    setLoading(true);

    const url = await handleUpload();

    // api
    const { status, message } = await callRekognitionAPI(url, email);

    // display toast
    setToast({
      type: STATUS_TOAST_MAP[status],
      message
    });

    setEmailError('');
    setEmail('');
    setImage(null);

    setLoading(false);
  };

  const handleUpload = async () => {
    if (image) {
      const uuid1 = uuidv4();

      const fileExtension = image.name.split('.').pop();

      // Create the new file name with UUID in between
      const fileName = `${image.name}-${uuid1}.${fileExtension}`;

      try {
        const uploadParams = {
          Bucket: 'aicurate-bucket',
          Key: fileName,
          Body: image,
          ContentType: image.type
        };

        const uploadResult = await S3.upload(uploadParams).promise();

        if (uploadResult && uploadResult.Location) {
          return uploadResult.Location;
        } else {
          console.error('Error uploading image to S3.');
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const isSubmitButtonDisabled = !image || emailError || email === '';

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.imageSelectorContainer}>
          <ButtonBase className={classes.imageSelector} component="label">
            {image ? (
              <img
                className={classes.image}
                src={URL.createObjectURL(image)}
                alt="Selected"
              />
            ) : (
              <Avatar className={classes.avatar}>
                <PhotoCameraIcon fontSize="large" />
              </Avatar>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={classes.imageInput}
            />
          </ButtonBase>
        </div>
        <TextField
          label="Email"
          variant="outlined"
          type="email"
          value={email}
          onChange={handleEmailChange}
          error={Boolean(emailError)}
          helperText={emailError}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={isSubmitButtonDisabled}
        >
          Submit
        </Button>
      </div>
      <Toast toast={toast} />
      {loading ? <Loader loading={loading} /> : null}
    </div>
  );
};

export default Upload;
