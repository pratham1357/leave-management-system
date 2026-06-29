import json
import os
import uuid
import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource("dynamodb")

REQUEST_TABLE = dynamodb.Table("lms-leave-requests")
BALANCE_TABLE = dynamodb.Table("lms-leave-balances")


def response(status_code, message):
    return {
        "statusCode": status_code,
        "body": json.dumps(message)
    }


def lambda_handler(event, context):

    try:
        body = json.loads(event.get("body", "{}"))

        request_id = body.get("requestId")
        action = body.get("action")

        # -----------------------------
        # Validate Input
        # -----------------------------
        if not request_id or not action:
            return response(
                400,
                {
                    "message": "requestId and action are required."
                }
            )

        action = action.upper()

        if action not in ["APPROVE", "REJECT"]:
            return response(
                400,
                {
                    "message": "Action must be APPROVE or REJECT."
                }
            )

        # -----------------------------
        # Get Leave Request
        # -----------------------------
        result = REQUEST_TABLE.get_item(
            Key={
                "requestId": request_id
            }
        )

        if "Item" not in result:
            return response(
                404,
                {
                    "message": "Leave request not found."
                }
            )

        leave_request = result["Item"]

        # -----------------------------
        # Check if already processed
        # -----------------------------
        if leave_request["status"] != "PENDING":
            return response(
                409,
                {
                    "message": "Leave request has already been processed."
                }
            )

        employee_id = leave_request["employeeId"]
        leave_type = leave_request["leaveType"]
        days = int(leave_request["numberOfDays"])

        # -----------------------------
        # APPROVE
        # -----------------------------
        if action == "APPROVE":

            balance = BALANCE_TABLE.get_item(
                Key={
                    "employeeId": employee_id
                }
            )

            if "Item" not in balance:
                return response(
                    404,
                    {
                        "message": "Employee leave balance not found."
                    }
                )

            balance = balance["Item"]

            leave_column = {
                "CASUAL": "casualLeave",
                "SICK": "sickLeave",
                "EARNED": "earnedLeave"
            }.get(leave_type.upper())

            if leave_column is None:
                return response(
                    400,
                    {
                        "message": "Invalid leave type."
                    }
                )

            available = int(balance.get(leave_column, 0))

            if available < days:
                return response(
                    400,
                    {
                        "message": "Insufficient leave balance."
                    }
                )

            # Deduct leave balance
            BALANCE_TABLE.update_item(
                Key={
                    "employeeId": employee_id
                },
                UpdateExpression=f"SET {leave_column} = :newvalue",
                ExpressionAttributeValues={
                    ":newvalue": available - days
                }
            )

        # -----------------------------
        # Update Request Status
        # -----------------------------
        REQUEST_TABLE.update_item(
            Key={
                "requestId": request_id
            },
            UpdateExpression="SET #st = :status",
            ExpressionAttributeNames={
                "#st": "status"
            },
            ExpressionAttributeValues={
                ":status": action
            }
        )

        return response(
            200,
            {
                "message": f"Leave request {action.lower()}d successfully."
            }
        )

    except ClientError as e:
        return response(
            500,
            {
                "message": "DynamoDB Error",
                "error": str(e)
            }
        )

    except Exception as e:
        return response(
            500,
            {
                "message": "Internal Server Error",
                "error": str(e)
            }
        )