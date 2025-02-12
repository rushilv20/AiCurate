export const SUCCESS_RESPONSE_OBJECT = {
  REKOGNITION: {
    status: 'Success',
    message:
      "Awesome! Your image is now in the Gallery and accessible worldwide. We've recognized the labels. Search your images in Gallery using labels or your email. Enjoy exploring your beautiful moments in the Gallery!"
  }
};

export const FAIL_RESPONSE_OBJECT = {
  INVALID_PARAMS: {
    status: 'Fail',
    message: 'Invalid Input Params'
  },
  MODERATION: {
    status: 'Fail',
    message: `Image Rejected. Our moderation system has detected inappropriate content in the image, which is not allowed as per our guidelines.`
  },
  CELEBRITY: {
    status: 'Fail',
    message:
      'Image Rejected. We are unable to upload the image as it contains a popular celebrity, which is not allowed as per our guidelines.'
  }
};

export const ERROR_RESPONSE_OBJECT = {
  MODERATION: {
    status: 'Error',
    message: 'Something went wrong while detecting moderation in image.'
  },
  CELEBRITY: {
    status: 'Error',
    message: 'Something went wrong while detecting celebrity in image.'
  },
  LABELS: {
    status: 'Error',
    message: 'Something went wrong while detecting labels in image.'
  },
  DYNAMO_PUT: {
    status: 'Error',
    message: 'Something went wrong while storing data in DynamoDB.'
  },
  IMAGE_METADATA_GET: {
    status: 'Error',
    message: 'Something went wrong while accessing data from DynamoDB.'
  }
};
