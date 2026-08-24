# CloudWatch Logs Insights Queries — LMS (`submit_leave` Lambda)

**Status: grounded in actual code**, unlike DocuVault's (no backend code was
available there). `lambda_functions.py` returns structured JSON with
`statusCode` 201/400/500, and `dynamodb_service.py`/`leave_service.py`
contain real `print()` statements (`"Employee:"`, `"Items:"`, `"Approved:"`,
`"Approved requests received:"`) that land in CloudWatch Logs as-is. Confirm
the exact log group name in the console — expected to be
`/aws/lambda/<function-name>` for whatever the deployed function is actually
named (unknown from this repo — see IAM proposal doc for the same caveat).

## 1. What's our actual error rate, and is it validation (400) or system (500)?

```
fields @timestamp, @message
| filter @message like /"statusCode": 400/ or @message like /"statusCode": 500/
| stats count() as total, sum(@message like /"statusCode": 500/) as systemErrors, sum(@message like /"statusCode": 400/) as validationErrors by bin(5m)
```
This distinction matters here specifically: a spike in 400s means users are
submitting invalid requests (bad dates, missing balance records) — not an
incident. A spike in 500s (see the `except Exception` branch in
`lambda_functions.py`) is a real bug or a downstream DynamoDB failure.

## 2. How often are leave requests rejected for overlap or insufficient balance?

```
fields @timestamp, @message
| filter @message like /overlaps with an existing approved leave/ or @message like /Insufficient leave balance/
| stats count() by bin(1h)
```
Useful because these are expected business-rule rejections
(`leave_service.py`), not bugs — tracking their volume separately from
system errors avoids false alarms.

## 3. Duration / cold start profile

```
fields @timestamp, @duration, @billedDuration, @initDuration
| filter @type = "REPORT"
| stats avg(@duration) as avgMs, pct(@duration, 95) as p95Ms, count() as invocations, count(@initDuration) as coldStarts by bin(15m)
```
`@initDuration` only appears on cold-start invocations — isolating it tells
you whether a P95 spike is cold-start noise or genuine regression, directly
relevant to the P95 alarm's first-response steps in the runbook.
