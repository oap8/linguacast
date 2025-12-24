# Placement Quiz API

POST /placement/submit

Input:
- answers: Array<{ questionId, answer }>

Output:
- cefrLevel: A1 | A2 | B1 | B2 | C1
- confidenceScore: number

Notes:
- CEFR logic is centralized
- Frontend does not calculate level
