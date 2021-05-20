import SQS from 'aws-sdk/clients/sqs'
import DynamoDB from 'aws-sdk/clients/sqs';

const sqsClient = new SQS({ region: 'eu-central-1', apiVersion: '2012-11-05' });
const dynamoDBClient = new DynamoDB({ region: 'eu-central-1' });

exports.processSQSMessages = async (event) => {
    const params = {
        QueueUrl: process.env.SQS_URL,
        VisibilityTimeout: 600,
    };

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
        await dynamoDBClient.batchWriteItem({
            RequestItems: {
                'indications-table': dynamoDBItems
            }
        }).promise();
    } catch (error) {
        console.log(`Error: ${JSON.stringify(error)}`);
    }
};
