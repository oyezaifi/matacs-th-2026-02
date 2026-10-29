### 1. AI vs. Rules

- AI: Extracts proposal information from PDF documents into structured JSON.
- Rules/code: Validates the extracted data, checks mandatory requirements, calculates weighted scores, flags suspicious proposals, and assigns ranks.
- I used AI for document understanding and fixed code for scoring to keep results consistent and predictable.

### 2. Consistency and Explainability

- The same proposal data and scoring rules produce the same scores and rankings.
- Each proposal has a score and a reason. The scoring formula uses fixed weights: experience (30%), price (25%), timeline (15%), warranty (15%), and team (15%).

### 3. Human in the Loop

- Suspicious proposals are flagged for human review and are not ranked automatically.
- A reviewer can verify extracted information, correct errors, and approve or override the result.

### 4. Changing Criteria

- If an admin changes criteria or weights, the system should save a new version of the scoring configuration.
- Previously scored proposals should retain their original results and configuration for auditing.

### 5. Risks

- Wrong data: Validate extracted information against the PDF.
- Made-up information: Ask a human to verify uncertain details.
- Bias: Use clear and fair scoring criteria.
- Manipulation: Validate input values and flag suspicious proposals.
- Incorrect scores: Use fixed rules to ensure consistent results.
- High costs: Use AI only for extracting information from documents.