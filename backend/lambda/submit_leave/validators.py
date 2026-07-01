from datetime import datetime

def validate_leave_request(request):
    """
    Validates the incoming leave request.
    Raises ValueError if validation fails.
    """

    required_fields = [
        "employee_id",
        "leave_type",
        "start_date",
        "end_date",
        "reason"
    ]

    for field in required_fields:
        if field not in request or not request[field]:
            raise ValueError(f"Missing required field: {field}")

    validate_dates(request["start_date"], request["end_date"])


def validate_dates(start_date, end_date):
    """
    Validates leave dates.
    """

    try:
        start = datetime.strptime(start_date, "%Y-%m-%d")
        end = datetime.strptime(end_date, "%Y-%m-%d")
    except ValueError:
        raise ValueError("Dates must be in YYYY-MM-DD format.")

    if end < start:
        raise ValueError("End date cannot be before start date.")
    
    today = datetime.today().date()

    if start.date() < today:
        raise ValueError("Leave cannot start in the past.")
