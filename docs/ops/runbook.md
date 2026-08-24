# LMS — On-Call Runbook (`submit_leave` Lambda)

**Status:** Written ahead of alarm creation — alarms not yet created (needs
AWS Console/CLI access not available from this machine; see handoff steps).

## Alarm 1: `LMS-SubmitLeave-ErrorRate-High` (error rate > 5%)

**What it means:** More than 5% of `submit_leave` invocations returned
`statusCode` 400 or 500 over the evaluation window.

**Likely causes, most to least common (grounded in the actual code):**
1. **Not a real incident**: a burst of legitimate validation rejections —
   overlapping leave, insufficient balance, bad date format (all raise
   `ValueError` → 400 in `lambda_functions.py`). Distinguish this from real
   errors using Logs Insights query #1 (400 vs 500 split) before paging
   anyone.
2. **Real incident**: `lms-leave-balances` or `lms-leave-config` missing a
   record for a valid employee/leave-type combo — `dynamodb_service.py`
   returns `None` in that case, and `leave_service.py` raises "Leave
   balance record not found" / "Invalid leave type." — a 400, but caused by
   a data/config gap, not user error. Check whether it's isolated to one
   employee (data gap) or many (broader config issue).
3. **Real incident**: DynamoDB throttling or a genuine exception → 500 via
   the `except Exception` catch-all in `lambda_functions.py`, which also
   returns `"details": str(e)` in the body — check that this isn't leaking
   internal detail to the frontend if the frontend surfaces it directly.

**First-response steps:**
1. Run Logs Insights query #1 — split 400 vs 500 first, every time.
2. If mostly 400s, run query #2 (overlap/balance rejection counts) — if
   that explains the volume, this is not an incident, downgrade.
3. If 500s are present, check DynamoDB console for `ThrottledRequests` on
   the 3 tables during the window.

## Alarm 2: `LMS-SubmitLeave-Latency-P95-High` (P95 duration > 3s)

**What it means:** P95 Lambda duration exceeded 3s. Note this function does
up to 4 sequential DynamoDB calls per invocation (`get_leave_type` →
`get_leave_balance` → `get_approved_leave_requests` → `create_leave_request`
→ `update_leave_balance`) — it is not parallelized, so latency is additive
across all of them.

**Likely causes:**
1. Cold starts — check query #3's `coldStarts` count against total
   invocations for the window.
2. `get_approved_leave_requests` does a `Query` (not `GetItem`) and then
   **filters in Python** for `status == "APPROVED"** — as an employee
   accumulates leave history, this table scan-per-employee grows linearly.
   This is the most likely long-term latency driver, not infrastructure.
3. DynamoDB on-demand mode scaling delay under a sudden spike (rare).

**First-response steps:**
1. Run query #3, check cold-start ratio first (cheap to rule out).
2. If not cold starts, check whether latency correlates with specific
   `employee_id`s with long leave histories — if so, this is the known
   architectural limitation in point 2 above, not a new regression; the
   real fix (not in scope for this sprint) is a GSI or a status-based query
   instead of a full per-employee scan-and-filter.

## Escalation
No paging tool confirmed configured. Alarms → SNS topic → team email is the
minimum viable path for this sprint (see handoff steps).
