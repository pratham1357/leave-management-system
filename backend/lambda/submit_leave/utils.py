from datetime import datetime
import uuid


def generate_leave_id():
    """
    Generates a unique Leave ID.
    """
    return f"LV-{uuid.uuid4().hex[:8].upper()}"


def current_timestamp():
    """
    Returns current UTC timestamp.
    """
    return datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ")


def calculate_leave_days(start_date, end_date):

    start = datetime.strptime(start_date, "%Y-%m-%d")
    end = datetime.strptime(end_date, "%Y-%m-%d")

    return (end - start).days + 1
