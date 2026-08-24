"""
Unit tests for utils.py — pure helpers, no AWS dependency.
"""
import os
import re
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from utils import generate_leave_id, calculate_leave_days  # noqa: E402


def test_generate_leave_id_format():
    leave_id = generate_leave_id()
    assert re.match(r"^LV-[0-9A-F]{8}$", leave_id)


def test_generate_leave_id_is_unique_across_calls():
    ids = {generate_leave_id() for _ in range(50)}
    assert len(ids) == 50


def test_calculate_leave_days_single_day():
    assert calculate_leave_days("2026-03-05", "2026-03-05") == 1


def test_calculate_leave_days_inclusive_range():
    assert calculate_leave_days("2026-03-05", "2026-03-07") == 3
