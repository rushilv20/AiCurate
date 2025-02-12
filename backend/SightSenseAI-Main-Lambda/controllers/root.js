import { RecognizeCelebritiesCommand } from '@aws-sdk/client-rekognition';
import { GetQueueUrlCommand } from '@aws-sdk/client-sqs';
import { QUEUE_NAME } from '../constants/aws.js';
import {
  DETECT_MODERATION_LABELS_REKOGNITION_PARAMS,
  S3_PRESIGNED_PARAMS,
  CELEBRITIES_REKOGNITION_PARAMS,
  DETECT_LABELS_REKOGNITION_PARAMS,
  DYNAMODB_PUT_PARAMS,
  DYNAMODB_GET_PARAMS,
  MESSENGER_QUEUE_SQS_PARAMS
} from '../constants/params.js';
import {
  SUCCESS_RESPONSE_OBJECT,
  FAIL_RESPONSE_OBJECT,
  ERROR_RESPONSE_OBJECT
} from '../constants/response.js';
import { EMAIL_CONTENT } from '../constants/email.js';
import {
  REKOGNITION_CLIENT,
  REKOGNITION,
  SQS,
  S3,
  SQS_CLIENT,
  DYNAMODB_CLIENT
} from '../clients/index.js';
import { getFileNameFromImageUrl } from '../utils/index.js';

const pushToQueue = async ({ labels, type, s3Url, email }) => {
  // generate presigned s3 url
  const s3PresignedUrl = getPreSignedUrl(s3Url);

  // get queue url
  const { QueueUrl } = await SQS_CLIENT.send(
    new GetQueueUrlCommand({ QueueName: QUEUE_NAME })
  );

  // construct queue message body
  const messageBodyObject = JSON.parse(MESSENGER_QUEUE_SQS_PARAMS.MessageBody);

  messageBodyObject.subject = EMAIL_CONTENT[type].subject;
  messageBodyObject.message = EMAIL_CONTENT[type].message;
  messageBodyObject.email = email;
  messageBodyObject.image_url = s3PresignedUrl;
  messageBodyObject.labels = labels;

  MESSENGER_QUEUE_SQS_PARAMS.MessageBody = JSON.stringify(messageBodyObject);
  MESSENGER_QUEUE_SQS_PARAMS.QueueUrl = QueueUrl;

  // add to queue
  await SQS.sendMessage(MESSENGER_QUEUE_SQS_PARAMS).promise();
};

const doRekognition = async (req, res) => {
  // 1. Rekognition
  // -> 1.1 Check for moderation - SQS
  // -> 1.2 Celebrity Detection - SQS
  // -> 1.3 Detect labels
  // 2. Dynamo

  const { email, file, uuid } = req.body;
  const s3Url = file;
  if (!email || !file) {
    return res.status(200).json(FAIL_RESPONSE_OBJECT.INVALID_PARAMS);
  }

  const fileName = getFileNameFromImageUrl(s3Url);

  // 1. Rekognition
  try {
    DETECT_MODERATION_LABELS_REKOGNITION_PARAMS.Image.S3Object.Name = fileName;

    // 1.1 Detect Moderation
    const data = await REKOGNITION.detectModerationLabels(
      DETECT_MODERATION_LABELS_REKOGNITION_PARAMS
    ).promise();
    const moderationLabels = data.ModerationLabels;

    if (moderationLabels.length > 0) {
      // S3 and SQS
      await pushToQueue({
        s3Url,
        type: 'MODERATION_EMAIL',
        labels: moderationLabels.map((item) => item.Name),
        email
      });

      // Return
      return res.status(200).json(FAIL_RESPONSE_OBJECT.MODERATION);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json(ERROR_RESPONSE_OBJECT.MODERATION);
  }

  // 1.2 Celebrity Detection
  try {
    CELEBRITIES_REKOGNITION_PARAMS.Image.S3Object.Name = fileName;

    const response = await REKOGNITION_CLIENT.send(
      new RecognizeCelebritiesCommand(CELEBRITIES_REKOGNITION_PARAMS)
    );
    const celebrityNames = response.CelebrityFaces.map(
      (celebrity) => celebrity.Name
    );

    if (celebrityNames.length > 0) {
      // S3 and SQS
      await pushToQueue({
        s3Url,
        type: 'CELEBRITY_DETECTION_EMAIL',
        labels: celebrityNames,
        email
      });

      // Return
      return res.status(200).json(FAIL_RESPONSE_OBJECT.CELEBRITY);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json(ERROR_RESPONSE_OBJECT.CELEBRITY);
  }

  // 1.3 Detect Labels
  let labels = [];
  try {
    DETECT_LABELS_REKOGNITION_PARAMS.Image.S3Object.Name = fileName;

    const data = await REKOGNITION.detectLabels(
      DETECT_LABELS_REKOGNITION_PARAMS
    ).promise();
    labels = data.Labels.map((labelObject) => labelObject.Name);
  } catch (err) {
    console.error(err);
    return res.status(500).json(ERROR_RESPONSE_OBJECT.LABELS);
  }

  // 2. DynamoDB
  try {
    DYNAMODB_PUT_PARAMS.Item.uuid = uuid;
    DYNAMODB_PUT_PARAMS.Item.image_url = s3Url;
    DYNAMODB_PUT_PARAMS.Item.labels = labels;
    DYNAMODB_PUT_PARAMS.Item.email = email;

    await DYNAMODB_CLIENT.put(DYNAMODB_PUT_PARAMS).promise();
  } catch (err) {
    console.error(err);
    return res.status(500).json(ERROR_RESPONSE_OBJECT.DYNAMO_PUT);
  }

  return res.status(200).json(SUCCESS_RESPONSE_OBJECT.REKOGNITION);
};

const getPreSignedUrl = (s3Url) => {
  S3_PRESIGNED_PARAMS.Key = getFileNameFromImageUrl(s3Url);
  const s3PresignedUrl = S3.getSignedUrl('getObject', S3_PRESIGNED_PARAMS);

  return s3PresignedUrl;
};

const getImageMetaData = async (req, res) => {
  try {
    const result = await DYNAMODB_CLIENT.scan(DYNAMODB_GET_PARAMS).promise();

    const imagesMetaData = result.Items.map((item) => {
      return {
        ...item,
        image_url: getPreSignedUrl(item.image_url)
      };
    });

    res.status(200).json({
      imagesMetaData
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(ERROR_RESPONSE_OBJECT.IMAGE_METADATA_GET);
  }
};

export { getImageMetaData, doRekognition };
