# Leave Application API

## Endpoint

POST /leave/apply

## Request

{
    "employee_id": "EMP001",
    "leave_type": "CASUAL",
    "start_date": "YYYY-MM-DD",
    "end_date": "YYYY-MM-DD",
    "reason": "..."
}

## Success Response

{
    "message": "Leave request submitted successfully.",
    "request_id": "...",
    "status": "PENDING_MANAGER"
}

## Error Responses

- Insufficient Balance
- Overlapping Leave
- Invalid Leave Type