export const FIXONCE_CATEGORIES = [
  { id: 'all', label: 'All Topics', icon: 'Sparkles' },
  { id: 'overview', label: 'About FixOnce QA', icon: 'ShieldCheck' },
  { id: 'verification', label: 'Fix Verification', icon: 'CheckCircle' },
  { id: 'regression', label: 'Regression Defense', icon: 'Layers' },
  { id: 'integrations', label: 'CI/CD & Runners', icon: 'Cpu' },
  { id: 'troubleshooting', label: 'Triage & Diagnostics', icon: 'Terminal' }
];

export const FIXONCE_SUGGESTED_CHIPS = [
  "What is FixOnce QA?",
  "How to verify a bug fix?",
  "Generate regression test case",
  "Supported CI/CD runners",
  "How to eliminate flaky tests?",
  "Submit bug report for QA triage"
];

export const FIXONCE_KB_ARTICLES = [
  {
    id: 'kb-1',
    category: 'overview',
    title: 'What is FixOnce QA and how does it work?',
    summary: 'Understanding the "Fix Once, Test Forever" paradigm that eliminates repeated regressions.',
    tags: ['overview', 'philosophy', 'regression', 'automation'],
    content: `**FixOnce QA** is an automated regression-proofing platform and quality assurance engine designed to ensure that once a bug is fixed in your codebase, it can never reoccur.

### Core Philosophy: "Fix Once, Test Forever"
Traditional QA teams often spend 40-60% of their test cycle re-testing previously fixed defects. FixOnce QA transforms every resolved bug into a permanent automated regression barrier:

1. **Bug Ingestion**: Takes your bug report, crash stacktrace, or issue description.
2. **Negative Proof Synthesis**: Creates an automated test reproducing the exact failure on the pre-fix commit.
3. **Fix Verification**: Runs the synthesized test against your fix commit to verify green status.
4. **Boundary Expansion**: Generates mutated edge-case variants around the fixed code path.
5. **CI Lock-In**: Commits the verified test into your permanent regression suite (Playwright, Jest, Cypress, PyTest, etc.).`
  },
  {
    id: 'kb-2',
    category: 'verification',
    title: 'How does FixOnce QA verify a code fix?',
    summary: 'The step-by-step verification pipeline from PR creation to test suite merge.',
    tags: ['verification', 'pipeline', 'workflow', 'pr'],
    content: `When a developer marks a bug as fixed or opens a Pull Request with \`fixonce:qa-verify\`, the following 4-step pipeline executes automatically:

1. **Root Cause Analysis (RCA)**: The fix diff is parsed against AST nodes and call graphs.
2. **Failing Baseline Check**: FixOnce runs the generated test on the code state *before* the fix. The test MUST fail with the documented issue.
3. **Passing Fix Check**: The test runs against the proposed fix commit. It MUST pass cleanly.
4. **Regression Blast Radius**: Adjacent services, APIs, and dependent UI components are subjected to a targeted regression run to confirm zero side effects.`
  },
  {
    id: 'kb-3',
    category: 'regression',
    title: 'How does FixOnce prevent regression test flakiness?',
    summary: 'Deterministic execution, smart retry heuristics, and API virtualization.',
    tags: ['flakiness', 'reliability', 'heuristics', 'mocking'],
    content: `Flaky tests destroy team confidence. FixOnce QA employs proprietary anti-flakiness mechanisms:

- **10x Parallel Stability Burn-In**: Every newly generated test is executed across 10 randomized worker nodes before being admitted to the main test suite.
- **Smart DOM Polling & Auto-Waiting**: Playwright/Cypress locators are synthesized with strict state assertions rather than arbitrary time delays.
- **Hermetic API Virtualization**: Unstable 3rd-party network endpoints are automatically recorded and mocked with dynamic schemas during regression runs.
- **Deterministic Seed Injection**: Timers, UUIDs, and random number generators are locked to repeatable seeds.`
  },
  {
    id: 'kb-4',
    category: 'integrations',
    title: 'Supported CI/CD pipelines & test runners',
    summary: 'Native connectors for GitHub Actions, GitLab CI, CircleCI, Playwright, Jest, and Cypress.',
    tags: ['cicd', 'github', 'gitlab', 'playwright', 'jest', 'cypress'],
    content: `FixOnce QA integrates directly into your existing developer ecosystem:

### Supported CI/CD Platforms
- **GitHub Actions** (Official Action: \`fixonce/qa-verify-action@v2\`)
- **GitLab CI/CD** (Pre-built Docker runner template)
- **CircleCI**, **Jenkins**, **Azure DevOps**, **Bitbucket Pipelines**

### Supported Test Frameworks
- **Web & E2E**: Playwright (TS/JS), Cypress, Selenium WebDriver, Puppeteer
- **Unit & Integration**: Jest, Vitest, PyTest, JUnit 5, Go Test, Mocha
- **API QA**: Postman / Newman CLI, Supertest, REST Assured, k6 for smoke load testing`
  },
  {
    id: 'kb-5',
    category: 'troubleshooting',
    title: 'How to write an ideal bug report for FixOnce QA',
    summary: 'Best practices for providing reproducible steps, environment metadata, and logs.',
    tags: ['bug-report', 'triage', 'reproduction', 'stacktrace'],
    content: `To allow FixOnce QA to generate high-precision regression tests, include these 4 elements:

1. **Exact Reproduction Steps**: Step-by-step user or API actions (e.g. "1. Open cart -> 2. Apply promo SAVE20 -> 3. Change currency to EUR").
2. **Expected vs Actual**: "Expected total: €80; Actual total: NaN or 500 error".
3. **Browser / Environment Context**: OS, browser engine, app version, auth state.
4. **Console Log / Network Payload**: HAR file export or server stack trace.`
  },
  {
    id: 'kb-6',
    category: 'overview',
    title: 'FixOnce QA SLAs, Speed & Security Compliance',
    summary: 'Enterprise SLA guarantees, 60-second turnaround, and SOC2 Type II compliance.',
    tags: ['sla', 'security', 'compliance', 'enterprise'],
    content: `### Performance Metrics
- **Instant AI QA Triage**: Average 1.2s response time for questions and diagnostics.
- **Regression Suite Synthesis**: Full automated test case generated within 45-90 seconds of PR commit.
- **Zero-False-Positive Target**: < 0.05% false alarm rate with burn-in qualification.

### Security & Privacy
- **Zero Code Retention**: Your proprietary source code is processed in volatile memory and never retained for foundation model training.
- **SOC2 Type II & ISO 27001** certified cloud infrastructure with on-premise VPC runner deployment options.`
  }
];

export const FIXONCE_QA_FALLBACK_ANSWERS = [
  {
    triggers: ['what is fixonce', 'about fixonce', 'overview', 'who are you', 'what do you do', 'introduction'],
    response: `**FixOnce QA** is an automated quality assurance engine built on the principle of **"Fix Once, Test Forever"**.

When developers fix a bug, FixOnce QA automatically:
1. Generates an automated regression test reproducing the exact defect.
2. Verifies that the test failed on the pre-fix commit and succeeds on the fix commit.
3. Locks the test into your permanent CI/CD regression suite so the issue never resurfaces.

Would you like to see how to integrate it with your repo, or try our interactive **QA Diagnostics** tool?`,
    quickReplies: ["How to verify a bug fix?", "Supported CI/CD runners", "Try QA Diagnostics wizard"]
  },
  {
    triggers: ['verify', 'bug fix', 'how to verify', 'validation', 'check fix', 'once qa', 'fix once qa'],
    response: `To verify a bug fix with FixOnce QA:

1. **Push your fix branch** with the commit message or PR title containing \`fix: [issue description]\`.
2. **Add the label** \`fixonce:qa-verify\` to your PR (or run \`npx fixonce verify\`).
3. **FixOnce Bot checks**:
   - Executes pre-fix snapshot (confirms failure reproduction).
   - Executes post-fix snapshot (confirms clean pass).
  - Generates boundary test cases in your repo's test directory (e.g. \`tests/regression/fix-#124.spec.ts\`).
4. **Green Badge**: Once validated, the PR receives a signed QA verification approval.`,
    quickReplies: ["Generate regression test case", "Supported CI/CD runners", "What about flaky tests?"]
  },
  {
    triggers: ['flaky', 'flake', 'flakiness', 'unstable', 'false positive'],
    response: `FixOnce QA eradicates flaky tests through 4 automated safeguards:

- **10-Run Parallel Burn-in**: New tests run 10x in isolated parallel containers before acceptance.
- **Smart Locators**: Prefers accessible ARIA roles and deterministic data-testid attributes with auto-waiting.
- **Hermetic Mocking**: Automatically stubs external volatile network calls with recorded responses.
- **Deterministic Clocks**: Replaces real-time system clocks with controlled test ticks.`,
    quickReplies: ["What is FixOnce QA?", "Supported CI/CD runners", "How to write good bug report"]
  },
  {
    triggers: ['runner', 'ci', 'cd', 'pipeline', 'github', 'gitlab', 'playwright', 'cypress', 'jest'],
    response: `FixOnce QA works natively with your existing tooling:

- **CI/CD**: GitHub Actions, GitLab CI, Jenkins, CircleCI, Bitbucket, Azure DevOps.
- **E2E Engines**: Playwright (TypeScript/JavaScript), Cypress, Selenium.
- **Unit/API**: Jest, Vitest, PyTest, Supertest, Postman Newman.

Here is a quick GitHub Actions snippet:
\`\`\`yaml
name: FixOnce QA Verification
on: [pull_request]
jobs:
  qa-verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: fixonce-qa/verify-action@v2
        with:
          api-key: \${{ secrets.FIXONCE_API_KEY }}
\`\`\``,
    quickReplies: ["How to verify a bug fix?", "Try QA Diagnostics wizard", "Pricing and free tier"]
  },
  {
    triggers: ['price', 'pricing', 'free', 'cost', 'plan', 'tier', 'sla'],
    response: `**FixOnce QA Plans & Tiers:**

- 🟢 **Developer / Community Tier (Free)**: Up to 20 verified fixes per month, standard GitHub Actions integration, Community Discord support.
- 🔵 **Pro Team ($49/mo)**: Unlimited fix verifications, 5 parallel test runners, Playwright & Cypress auto-generation, Slack alerts.
- 🟣 **Enterprise (Custom)**: On-premise VPC runners, custom test frameworks, Jira bi-directional synchronization, dedicated QA engineer support with 15-minute SLA.`,
    quickReplies: ["What is FixOnce QA?", "How to verify a bug fix?", "Embed widget on my site"]
  },
  {
    triggers: ['generate', 'test case', 'generate test', 'regression test'],
    response: `FixOnce QA can generate automated regression tests in seconds!

Switch over to the **Diagnostics tab (🧪 icon)** at the bottom of this widget, or tell me:
1. Which test framework you use (Playwright, Cypress, Jest, etc.)
2. The bug description & expected behavior.

I'll generate the test template for you right now!`,
    quickReplies: ["Open QA Diagnostics", "How does FixOnce verify fixes?", "Supported test frameworks"]
  }
];
