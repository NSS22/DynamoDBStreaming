aws cloudformation delete-stack --stack-name dynamodb-materialised-view
aws cloudformation wait stack-delete-complete --stack-name dynamodb-materialised-view

aws cloudformation delete-stack --stack-name sqs-resource
aws cloudformation wait stack-delete-complete --stack-name sqs-resource

aws cloudformation delete-stack --stack-name sns-resource
aws cloudformation wait stack-delete-complete --stack-name sns-resource

aws cloudformation delete-stack --stack-name lambda-function-handlers
aws cloudformation wait stack-delete-complete --stack-name lambda-function-handlers