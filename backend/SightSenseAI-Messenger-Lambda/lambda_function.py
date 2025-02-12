import json
import boto3

def lambda_handler(event, context):
    try:
        sqs = boto3.client('sqs')
        sns = boto3.client('sns')
        queue_name = 'MessengerQueue'
        topic_name = 'SendEmail'

        # get sqs url
        queue_url_response = sqs.get_queue_url(QueueName=queue_name)
        queue_url = queue_url_response['QueueUrl']

        # get sns topic arn
        topic_arn_response = sns.list_topics()
        topics = topic_arn_response['Topics']
        topic_arn = None

        for topic in topics:
            if topic_name in topic['TopicArn']:
                topic_arn = topic['TopicArn']
                break

        if topic_arn is None:
            print(f"error: sns topic '{topic_name}' not found.")
            return

        for record in event['Records']:
            # parse json body
            body = json.loads(record['body'])

            subject = body.get('subject')            
            message = body.get('message')
            email = body.get('email')
            labels = body.get('labels')
            image_url = body.get('image_url')

            if image_url and message:
                # send email to sns topic
                email_message = f"{message} \n\nEmail: {email} \n\nLabels: {labels} \n\nImage URL: {image_url} \n\nBest,\nTeam AiCurate"
                sns.publish(TopicArn=topic_arn, Message=email_message, Subject=subject)

                # delete message from queue
                receipt_handle = record['receiptHandle']
                sqs.delete_message(QueueUrl=queue_url, ReceiptHandle=receipt_handle)

    except Exception as e:
        print(f"error processing messages: {e}")

    return 'messenger process completed...'