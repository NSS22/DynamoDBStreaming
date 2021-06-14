const AWS = require('aws-sdk');

const snsClient = new AWS.SNS({ region: 'eu-west-1' });

exports.processDynamoDBStream = async (event) => {
    try {
        const subject = process.env.SNS_TOPIC_NAME;
        const topicArn = process.env.SNS_TOPIC_ARN;

        for (const record of event.Records) {
            const dynamoDBNewImage = AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage);

            await snsClient.publish({
                Subject: subject,
                TopicArn: topicArn,
                Message: JSON.stringify(dynamoDBNewImage),
            }).promise();
        }
    } catch (error) {
        console.log(`SNS publish to topic error: ${JSON.stringify(error)}`);
    }
};
