"""
Business logic for Leave Management System.
"""

from datetime import datetime

from validators import validate_leave_request

from utils import (
    generate_leave_id,
    calculate_leave_days,
    current_timestamp
)

from dynamodb_service import (
    get_leave_type,
    get_leave_balance,
    get_approved_leave_requests,
    create_leave_request,
    update_leave_balance
)


def submit_leave(request):

    validate_leave_request(request)

    leave_config = get_leave_type(
        request["leave_type"]
    )

    if leave_config is None:
        raise ValueError("Invalid leave type.")

    balance = get_leave_balance(
        request["employee_id"],
        request["leave_type"]
    )

    if balance is None:
        raise ValueError(
            "Leave balance record not found."
        )

    days = calculate_leave_days(
        request["start_date"],
        request["end_date"]
    )

    # --------------------------------
    # Check for overlapping leaves
    # --------------------------------
    approved_requests = (
        get_approved_leave_requests(
            request["employee_id"]
        )
    )

    print("Approved requests received:",
      approved_requests)

    new_start = datetime.strptime(
        request["start_date"],
        "%Y-%m-%d"
    )

    new_end = datetime.strptime(
        request["end_date"],
        "%Y-%m-%d"
    )

    for leave in approved_requests:

        existing_start = datetime.strptime(
            leave["start_date"],
            "%Y-%m-%d"
        )

        existing_end = datetime.strptime(
            leave["end_date"],
            "%Y-%m-%d"
        )

        if (
            new_start <= existing_end
            and new_end >= existing_start
        ):
            raise ValueError(
                "Leave request overlaps with an existing approved leave."
            )

    # --------------------------------
    # Quota checks
    # --------------------------------
    if (
        request["leave_type"] != "UNPAID"
        and days > balance["remaining_days"]
    ):
        raise ValueError(
            "Insufficient leave balance."
    )

    if (
        days >
        leave_config["max_consecutive_days"]
    ):
        raise ValueError(
            "Maximum consecutive leave exceeded."
        )

    if leave_config["requires_document"]:
        if not request.get("document_url"):
            raise ValueError(
                "Supporting document is required."
            )

    request_id = generate_leave_id()

    leave_request = {
        "employee_id":
            request["employee_id"],
        "request_id":
            request_id,
        "leave_type":
            request["leave_type"],
        "start_date":
            request["start_date"],
        "end_date":
            request["end_date"],
        "days":
            days,
        "reason":
            request["reason"],
        "status":
            "PENDING",
        "submitted_at":
            current_timestamp()
    }

    if days > 5:
        leave_request["hr_status"] = (
            "PENDING"
        )

    create_leave_request(
        leave_request
    )

    return {
        "status":
            "SUCCESS",
        "request_id":
            request_id,
        "days":
            days,
        "message":
            "Leave request submitted successfully."
    }