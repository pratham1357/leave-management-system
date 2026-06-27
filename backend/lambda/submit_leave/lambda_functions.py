"""
AWS Lambda entry point for Leave Management System.
"""
import json
from leave_service import submit_leave


def lambda_handler(event, context):
    """
    AWS Lambda handler for leave submission.
    """

    try:
        body = event.get("body")

        if body:
            request = json.loads(body)
        else:
            request = event

        result = submit_leave(request)

        return {
            "statusCode": 201,
            "body": json.dumps(result)
        }

    except ValueError as e:
        return {
            "statusCode": 400,
            "body": json.dumps({
                "status": "ERROR",
                "message": str(e)
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({
                "status": "ERROR",
                "message": "Internal Server Error",
                "details": str(e)
            })
        }