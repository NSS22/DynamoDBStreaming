const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();
const sqsClient = new AWS.SQS({ region: 'eu-west-1', apiVersion: '2012-11-05' });

exports.processSQSMessages = async (event) => {
    const params = {
        QueueUrl: process.env.SQS_URL,
        VisibilityTimeout: 600,
    };

    console.log('SQS event: ', JSON.stringify(event));

    try {
        const messages = await sqsClient.receiveMessage(params).promise();
        const dynamoDBItems = messages.map(({ messageId, body }) => {
            return {
                PutRequest: {
                    Item: {
                        'id': { 'S': messageId },
                        'body': { 'S': body },
                    }
                }
            }
        });
        await documentClient.batchWrite({
            RequestItems: {
                'indications-table': dynamoDBItems
            }
        }).promise();
    } catch (error) {
        console.log(`Error: ${JSON.stringify(error)}`);
    }
};
