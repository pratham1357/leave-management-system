"""
Business logic for Leave Management System.
"""

from validators import validate_leave_request

from utils import (
    generate_leave_id,
    calculate_leave_days,
    current_timestamp
)

from dynamodb_service import (
    get_leave_type,
    get_leave_balance,
    create_leave_request,
    update_leave_balance
)

def submit_leave(request):

    validate_leave_request(request)

    leave_config = get_leave_type(request["leave_type"])

    if leave_config is None:
        raise ValueError("Invalid leave type.")

    balance = get_leave_balance(
        request["employee_id"],
        request["leave_type"]
    )

    if balance is None:
        raise ValueError("Leave balance record not found.")

    days = calculate_leave_days(
        request["start_date"],
        request["end_date"]
    )

    if days > balance["remaining_days"]:
        raise ValueError("Insufficient leave balance.")

    if leave_config["requires_document"]:
        if not request.get("document_url"):
            raise ValueError("Supporting document is required.")

    request_id = generate_leave_id()

    leave_request = {
        "employee_id": request["employee_id"],
        "request_id": request_id,
        "leave_type": request["leave_type"],
        "start_date": request["start_date"],
        "end_date": request["end_date"],
        "days": days,
        "reason": request["reason"],
        "status": "PENDING",
        "submitted_at": current_timestamp()
    }

    create_leave_request(leave_request)

    return {
        "status": "SUCCESS",
        "request_id": request_id,
        "message": "Leave request submitted successfully."
    }