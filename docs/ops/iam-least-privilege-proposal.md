# IAM Least-Privilege Proposal — `submit_leave` Lambda

**Status: PROPOSAL ONLY, not a before/after diff.** `infrastructure/iam/`
in this repo is empty — no IAM policy JSON is checked into source control,
and this machine has no AWS CLI to pull the actual attached policy from IAM.
So there is no "before" to show you. What follows is a policy derived
**only** from the actual `boto3` calls present in
`backend/lambda/submit_leave/*.py` — nothing more, nothing invented.

## What the code actually does (from `dynamodb_service.py`)

| Table | Operations used | Where |
|---|---|---|
| `lms-leave-config` | `GetItem` | `get_leave_type()` |
| `lms-leave-balances` | `GetItem`, `UpdateItem` | `get_leave_balance()`, `update_leave_balance()` |
| `lms-leave-requests` | `Query`, `PutItem` | `get_approved_leave_requests()`, `create_leave_request()` |

No `Scan`, `DeleteItem`, `BatchWriteItem`, `CreateTable`, or
`DescribeTable` calls exist anywhere in this Lambda's code. No S3, SNS, or
SES client is constructed in this Lambda (those are mentioned in commit
history for the wider LMS project, but that code is not present in this
repo checkout — do not grant this Lambda those permissions; whichever
Lambda actually sends notifications should get its own scoped policy).

## Proposed policy (replace `<ACCOUNT_ID>` and confirm table ARNs)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "SubmitLeaveDynamoDBAccess",
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:UpdateItem"
      ],
      "Resource": "arn:aws:dynamodb:ap-south-1:<ACCOUNT_ID>:table/lms-leave-balances"
    },
    {
      "Sid": "SubmitLeaveConfigRead",
      "Effect": "Allow",
      "Action": "dynamodb:GetItem",
      "Resource": "arn:aws:dynamodb:ap-south-1:<ACCOUNT_ID>:table/lms-leave-config"
    },
    {
      "Sid": "SubmitLeaveRequestsAccess",
      "Effect": "Allow",
      "Action": [
        "dynamodb:Query",
        "dynamodb:PutItem"
      ],
      "Resource": "arn:aws:dynamodb:ap-south-1:<ACCOUNT_ID>:table/lms-leave-requests"
    },
    {
      "Sid": "Logging",
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:ap-south-1:<ACCOUNT_ID>:log-group:/aws/lambda/<FUNCTION_NAME>:*"
    }
  ]
}
```

If you enable X-Ray (see handoff steps), also add:
```json
{
  "Sid": "XRayTracing",
  "Effect": "Allow",
  "Action": ["xray:PutTraceSegments", "xray:PutTelemetryRecords"],
  "Resource": "*"
}
```
(AWS's own managed `AWSXRayDaemonWriteAccess` policy covers this and is the
standard way to grant it — attach that managed policy rather than
hand-writing this statement.)

## What to do with this
1. Open the `submit_leave` function's execution role in IAM console.
2. Compare its current attached policy against the table above.
3. **Do not blindly replace it** — if the current policy is broader (e.g.
   `dynamodb:*` on `*`, a common over-broad default), narrow it to the
   statements above *only after* confirming no other code path (that isn't
   in this repo checkout) also uses this same role. Multiple Lambdas can
   share an execution role; if this role is shared, this proposal is wrong
   and each Lambda needs to be inventoried first.
