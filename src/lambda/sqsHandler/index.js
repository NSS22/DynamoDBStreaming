const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

exports.processSQSMessages = async (event) => {
    const listenerTableName = process.env.LISTENER_DYNAMODB_TABLE_NAME;

    console.log('Event Records: ', JSON.stringify(event.Records));

    try {
      const dynamoDBItems = event.Records.map(({ body }) => {
            return {
                PutRequest: {
                    Item: JSON.parse(body)
                }
            }
        });

        await documentClient.batchWrite({
            RequestItems: {
                [listenerTableName]: dynamoDBItems
            }
        }).promise();
    } catch (error) {
        console.log(`Error: ${JSON.stringify(error)}`);
    }
};
