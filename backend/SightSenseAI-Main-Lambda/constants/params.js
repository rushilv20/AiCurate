import { S3_BUCKET_NAME, DYNAMODB_TABLE_NAME } from '../constants/aws.js';

export const DETECT_MODERATION_LABELS_REKOGNITION_PARAMS = {
  Image: {
    S3Object: {
      Bucket: S3_BUCKET_NAME,
      Name: null
    }
  },
  MinConfidence: 95
};

export const CELEBRITIES_REKOGNITION_PARAMS = {
  Image: {
    S3Object: {
      Bucket: S3_BUCKET_NAME,
      Name: null
    }
  }
};

export const DETECT_LABELS_REKOGNITION_PARAMS = {
  Image: {
    S3Object: {
      Bucket: S3_BUCKET_NAME,
      Name: null
    }
  },
  MaxLabels: 5,
  MinConfidence: 90
};

export const DYNAMODB_PUT_PARAMS = {
  TableName: DYNAMODB_TABLE_NAME,
  Item: {
    uuid: null,
    image_url: null,
    labels: null,
    email: null
  }
};

export const DYNAMODB_GET_PARAMS = {
  TableName: DYNAMODB_TABLE_NAME
};

export const S3_PRESIGNED_PARAMS = {
  Bucket: S3_BUCKET_NAME,
  Key: null,
  Expires: 3600
};

export const MESSENGER_QUEUE_SQS_PARAMS = {
  MessageBody: JSON.stringify({
    subject: null,
    message: null,
    email: null,
    image_url: null,
    labels: null
  }),
  QueueUrl: null
};
