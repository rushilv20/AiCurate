import AWS from 'aws-sdk';
import { RekognitionClient } from '@aws-sdk/client-rekognition';
import { REGION } from '../constants/aws.js';
import { SQSClient } from '@aws-sdk/client-sqs';

AWS.config.update({ region: REGION });

export const REKOGNITION_CLIENT = new RekognitionClient({
  region: REGION
});

export const REKOGNITION = new AWS.Rekognition();

export const SQS = new AWS.SQS({ region: REGION });

export const DYNAMODB_CLIENT = new AWS.DynamoDB.DocumentClient();

export const SQS_CLIENT = new SQSClient({ region: REGION });

export const S3 = new AWS.S3({
  signatureVersion: 'v4',
  region: REGION
});
