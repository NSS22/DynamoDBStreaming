const SNS = require('aws-sdk/clients/sns');

const snsClient = new SNS({ region: 'eu-central-1' });

exports.processDynamoDBStream = async (event) => {
    try {
        const subject = process.env.SNS_TOPIC_NAME;
        const topicArn = process.env.SNS_TOPIC_ARN;

        for (const record of event.Records) {
            await snsClient.publish({
                Subject: subject,
                TopicArn: topicArn,
                MessageGroupId: 'SaveEvent',
                MessageDeduplicationId: `${record.eventID}`,
                Message: JSON.stringify(record.dynamodb.NewImage),
            }).promise();
        }
    } catch (error) {
        console.log(`SNS publish to topic error: ${JSON.stringify(error)}`);
    }
};
