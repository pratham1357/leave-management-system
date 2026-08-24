# Cost Estimate — LMS (ESTIMATE, not billing data)

**Status: ESTIMATE.** Public AWS list pricing + stated assumptions, no Cost
Explorer/Pricing API access from this machine. Directional only.

## Assumptions
- Region: ap-south-1
- ~3 API calls/user/day (check balance, check calendar, occasional
  leave submission) — this is a lower-frequency internal tool
- Lambda: 256 MB, ~200ms avg duration (simple validation + 3–4 DynamoDB
  calls per `submit_leave` invocation)
- API Gateway: URL includes an explicit `/dev` stage
  (`lid57kwx8g.execute-api.ap-south-1.amazonaws.com/dev`) — REST API pricing
  assumed unless confirmed otherwise
- DynamoDB: on-demand, 3 tables, ~4 read/write operations per submission
- Cognito: within free tier at all three scales

**Important open question, UNVERIFIED:** `infrastructure/stepfunctions/` and
`infrastructure/iam/` exist as folders in this repo but are **empty**. This
suggests a Step Functions-based approval workflow may be planned or already
deployed outside this repo's checked-in code. If Step Functions is actually
in production, it changes this estimate materially (Step Functions Standard
workflows are billed per state transition) — confirm before trusting the
table below.

| Users/day | API calls/day | Lambda | API Gateway | DynamoDB | Cognito | **Total/mo (est.)** |
|---|---|---|---|---|---|---|
| 10 | ~30 | <$0.01 | <$0.01 | <$0.01 | $0 | **~$1** (platform minimums) |
| 500 | ~1,500 | ~$0.01 | ~$0.16 | ~$0.06 | $0 | **~$2–3** |
| 5,000 | ~15,000 | ~$0.10 | ~$1.60 | ~$0.60 | $0 (near free-tier edge) | **~$8–12** |

Same conclusion as DocuVault: absolute dollars are small at this traffic
profile. Optimization value here is about correctness/hygiene, not bill size.

## Most expensive component
**API Gateway**, same reasoning as DocuVault — if this is a REST API rather
than HTTP API, that's the highest per-request cost multiplier of the
components in scope.

## Proposed optimization (not implemented — needs AWS Console access)
Same as DocuVault: confirm whether this is a REST or HTTP API in the API
Gateway console; if REST, migrating to HTTP API is the single highest-value,
lowest-risk cost change available, since the Lambda proxy integration model
is unchanged and no frontend code needs to change.

**Before/after (5,000 users/day tier):** ~$1.60/mo (REST) → ~$0.45/mo
(HTTP API).

Not implemented for the same reason as DocuVault — requires AWS
Console/CLI access this machine doesn't have, and recreating an API Gateway
resource is not a "smallest safe change."
