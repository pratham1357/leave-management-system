"""
Unit tests for validators.py — pure business-rule validation, no AWS
dependency, safe to run in CI without credentials.
"""
import os
import sys
from datetime import date, timedelta

import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from validators import validate_leave_request, validate_dates  # noqa: E402


TOMORROW = (date.today() + timedelta(days=1)).isoformat()
NEXT_WEEK = (date.today() + timedelta(days=7)).isoformat()
YESTERDAY = (date.today() - timedelta(days=1)).isoformat()


def make_request(**overrides):
    request = {
        "employee_id": "EMP001",
        "leave_type": "CASUAL",
        "start_date": TOMORROW,
        "end_date": NEXT_WEEK,
        "reason": "Personal",
    }
    request.update(overrides)
    return request


def test_valid_request_passes():
    validate_leave_request(make_request())


@pytest.mark.parametrize(
    "field", ["employee_id", "leave_type", "start_date", "end_date", "reason"]
)
def test_missing_required_field_raises(field):
    request = make_request()
    del request[field]
    with pytest.raises(ValueError, match="Missing required field"):
        validate_leave_request(request)


def test_empty_required_field_raises():
    with pytest.raises(ValueError, match="Missing required field"):
        validate_leave_request(make_request(reason=""))


def test_end_before_start_raises():
    with pytest.raises(ValueError, match="End date cannot be before start date"):
        validate_dates(NEXT_WEEK, TOMORROW)


def test_start_in_past_raises():
    with pytest.raises(ValueError, match="cannot start in the past"):
        validate_dates(YESTERDAY, NEXT_WEEK)


def test_bad_date_format_raises():
    with pytest.raises(ValueError, match="YYYY-MM-DD"):
        validate_dates("01-01-2026", NEXT_WEEK)
