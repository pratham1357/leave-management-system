import boto3

sns = boto3.client('sns')

TOPIC_ARN = "arn:aws:sns:us-east-1:364042450737:Leavenotification:adde33f7-2734-430a-b886-875f7ddbcfca"

def lambda_handler(event, context):

    employee_name = event['employee_name']
    leave_type = event['leave_type']
    status = event['status']

    message = f"""
Hello {employee_name},

Your leave request has been {status}.

Leave Type: {leave_type}

Regards,
HR Team
"""

    sns.publish(
        TopicArn=arn:aws:sns:us-east-1:364042450737:Leavenotification:adde33f7-2734-430a-b886-875f7ddbcfca,
        Subject="Leave Request Status",
        Message=message
    )

    return {
        "statusCode": 200,
        "body": "Notification Sent Successfully"
    }

    unzipimport boto3

sns = boto3.client('sns')

TOPIC_ARN = "arn:aws:sns:us-east-1:364042450737:Leavenotification:adde33f7-2734-430a-b886-875f7ddbcfca"

def lambda_handler(event, context):

    employee_name = event['employee_name']
    leave_type = event['leave_type']
    status = event['status']

    message = f"""
Hello {employee_name},

Your leave request has been {status}.

Leave Type: {leave_type}

Regards,
HR Team
"""

    sns.publish(
        TopicArn=arn:aws:sns:us-east-1:364042450737:Leavenotification:adde33f7-2734-430a-b886-875f7ddbcfca,
        Subject="Leave Request Status",
        Message=message
    )

    return {
        "statusCode": 200,
        "body": "Notification Sent Successfully"
    }

    unzip 
    
