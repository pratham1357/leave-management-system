import json
import boto3

sns = boto3.client('sns')

# Replace with your SNS Topic ARN
TOPIC_ARN = "arn:aws:sns:us-east-1:364042450737:Leavenotififcation"

def lambda_handler(event, context):

    employee_name = event.get("employee_name", "Employee")
    employee_email = event.get("employee_email", "employee@example.com")
    leave_type = event.get("leave_type", "Leave")
    status = event.get("status", "Approved")

    subject = f"Leave Request {status}"

    message = f"""
Hello {employee_name},

Your leave request has been {status}.

Leave Type: {leave_type}

Status: {status}

Regards,
HR Team
"""

    sns.publish(
        TopicArn=TOPIC_ARN,
        Subject=subject,
        Message=message
    )

    return {
        "statusCode": 200,
        "body": json.dumps("Notification Sent Successfully")
    }
