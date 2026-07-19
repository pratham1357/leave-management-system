import boto3
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key
dynamodb = boto3.resource("dynamodb")

LEAVE_BALANCE_TABLE = dynamodb.Table("lms-leave-balances")
LEAVE_CONFIG_TABLE = dynamodb.Table("lms-leave-config")
LEAVE_REQUEST_TABLE = dynamodb.Table("lms-leave-requests")


def get_leave_type(leave_type):
    """
    Fetch leave configuration from lms-leave-config.
    """

    try:
        response = LEAVE_CONFIG_TABLE.get_item(
            Key={
                "leave_type": leave_type
            }
        )

        return response.get("Item")

    except ClientError as e:
        raise Exception(
            f"Error fetching leave configuration: {e}"
        )


def get_leave_balance(employee_id, leave_type):
    """
    Fetch leave balance for an employee.
    """

    try:
        response = LEAVE_BALANCE_TABLE.get_item(
            Key={
                "employee_id": employee_id,
                "balance_key": leave_type
            }
        )

        return response.get("Item")

    except ClientError as e:
        raise Exception(
            f"Error fetching leave balance: {e}"
        )


def get_approved_leave_requests(employee_id):
    try:
        response = LEAVE_REQUEST_TABLE.query(
            KeyConditionExpression=
                Key("employee_id").eq(employee_id)
        )

        items = response.get("Items", [])

        print("Employee:", employee_id)
        print("Items:", items)

        approved_requests = [
            item
            for item in items
            if item.get("status") == "APPROVED"
        ]

        print("Approved:", approved_requests)

        return approved_requests

    except ClientError as e:
        raise Exception(
            f"Error fetching leave requests: {e}"
        )


def create_leave_request(item):
    """
    Insert a new leave request.
    """

    try:
        LEAVE_REQUEST_TABLE.put_item(
            Item=item
        )

    except ClientError as e:
        raise Exception(
            f"Error creating leave request: {e}"
        )


def update_leave_balance(employee_id,
                         leave_type,
                         days):
    """
    Update used and remaining leave balance.
    """

    try:
        LEAVE_BALANCE_TABLE.update_item(
            Key={
                "employee_id": employee_id,
                "balance_key": leave_type
            },

            UpdateExpression="""
                SET
                    used_days = used_days + :d,
                    remaining_days = remaining_days - :d
            """,

            ExpressionAttributeValues={
                ":d": days
            }
        )

    except ClientError as e:
        raise Exception(
            f"Error updating leave balance: {e}"
        )