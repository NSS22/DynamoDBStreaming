aws cloudformation create-stack --stack-name s3-resource \
    --template-body file://resources/s3.yaml \
    --capabilities CAPABILITY_NAMED_IAM
aws cloudformation wait stack-create-complete --stack-name s3-resource

aws s3api put-object \
  --body ./src/lambda/sqsHandler/index.zip \
  --bucket nss-deployment-bucket \
  --key sqsHandler

aws s3api put-object \
  --body ./src/lambda/streamHandler/index.zip \
  --bucket nss-deployment-bucket \
  --key streamHandler

aws cloudformation create-stack --stack-name dynamodb-materialised-view \
    --template-body file://resources/dynamodb.yaml \
    --capabilities CAPABILITY_NAMED_IAM
aws cloudformation wait stack-create-complete --stack-name dynamodb-materialised-view

aws cloudformation create-stack --stack-name sqs-resource \
    --template-body file://resources/sqs.yaml \
    --capabilities CAPABILITY_NAMED_IAM
aws cloudformation wait stack-create-complete --stack-name sqs-resource

aws cloudformation create-stack --stack-name sns-resource \
    --template-body file://resources/sns.yaml \
    --capabilities CAPABILITY_NAMED_IAM
aws cloudformation wait stack-create-complete --stack-name sns-resource

aws cloudformation create-stack --stack-name lambda-function-handlers \
    --template-body file://resources/lambda.yaml \
    --capabilities CAPABILITY_NAMED_IAM
aws cloudformation wait stack-create-complete --stack-name lambda-function-handlers
