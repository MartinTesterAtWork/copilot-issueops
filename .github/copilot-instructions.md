# GitHub Copilot IssueOps Repository

This repository manages GitHub Copilot license automation through IssueOps
workflows for the TelenorInternal organization.

Always reference these instructions first and fallback to search or bash
commands only when you encounter unexpected information that does not match
the info here.

## Working Effectively

### Repository Overview

- **Purpose**: Automated GitHub Copilot license management system
- **Technology**: GitHub Actions workflows + Node.js JavaScript action
- **Architecture**: IssueOps - users create GitHub issues to request licenses
- **Not a traditional application**: No build/run cycle, operates entirely
  within GitHub Actions

### Development Environment Setup

- Ensure Node.js is available: `node --version` (expect v20.19.4+)
- Ensure npm is available: `npm --version` (expect v10.8.2+)
- No package.json or dependencies - uses GitHub Actions runtime environment
- Validate JavaScript syntax: `node -c .github/deboardCopilot/deboard.js`

### Validation and Testing

- **NEVER CANCEL**: Workflow runs may take 5-10 minutes. Set timeouts to
  15+ minutes.
- **JavaScript validation**: Always run
  `node -c .github/deboardCopilot/deboard.js` before committing changes to
  the JavaScript action
- **YAML validation**: Run
  `yamllint .github/workflows/onboarding.yml .github/workflows/deboarding.yml .github/deboardCopilot/action.yml`
  before committing
- **Manual workflow testing**: Cannot be done locally - requires GitHub
  secrets and API access
- **Always test in GitHub**: Push changes to a branch and test workflows
  manually in the GitHub Actions UI

### Build and Lint Process

- No formal build process - this is not a compiled application
- Validate YAML files: `yamllint .github/workflows/ .github/deboardCopilot/action.yml`
- Validate JavaScript: `node -c .github/deboardCopilot/deboard.js`
- Expected yamllint warnings are acceptable (document-start, truthy,
  comments) - these are style preferences
- Line-length and indentation errors should be reviewed but may be acceptable
  for workflow readability
- Ensure all JavaScript syntax is valid before committing

## Repository Structure

### Key Components

- **.github/workflows/onboarding.yml**: Triggered when issues with
  'onboarding' label are created
- **.github/workflows/deboarding.yml**: Monthly cron job (28th of each month)
  to remove inactive users  
- **.github/deboardCopilot/**: Custom GitHub Action containing the deboarding logic
  - `action.yml`: Action definition and workflow steps
  - `deboard.js`: Core JavaScript logic for license management
- **.github/ISSUE_TEMPLATE/**: Templates for license requests and content
  exclusions

### Core Files You'll Work With

- `deboard.js`: Main business logic - handles Copilot seat management, user
  activity tracking, and license removal
- `action.yml`: Defines the deboarding action interface and steps
- Workflow files: Define when and how the automation runs

## Common Tasks

### Adding New Features to Deboarding Logic

1. Edit `.github/deboardCopilot/deboard.js`
2. Validate syntax: `node -c .github/deboardCopilot/deboard.js`
3. Test by triggering deboarding workflow manually in GitHub Actions
4. **NEVER CANCEL**: Wait for complete workflow execution (5-10 minutes)

### Modifying Workflows

1. Edit workflow YAML files in `.github/workflows/`
2. Validate YAML: `yamllint .github/workflows/onboarding.yml .github/workflows/deboarding.yml`
3. Commit and test in GitHub Actions UI
4. Check workflow logs for any runtime errors

### Updating Issue Templates

1. Edit files in `.github/ISSUE_TEMPLATE/`
2. Test by creating new issues in GitHub using the templates
3. Verify that workflows trigger correctly with new template format

### Repository Listing (for reference)

```text
.
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── content-exclude.yaml     # Content exclusion template
│   │   └── onboarding.yml           # License request template
│   ├── copilot-instructions.md      # GitHub Copilot coding instructions
│   ├── deboardCopilot/
│   │   ├── action.yml               # Action definition
│   │   └── deboard.js               # Core deboarding logic
│   ├── secret_scanning.yml          # Security configuration
│   └── workflows/
│       ├── deboarding.yml           # Monthly automated license removal
│       └── onboarding.yml           # Issue-triggered license assignment
├── .gitignore                       # Git ignore rules
├── .telenor/
│   └── security.yml                 # Telenor security settings
├── CODEOWNERS                       # Code ownership rules
├── README.md                        # Basic repository info
└── SECURITY.md                      # Security policies
```

## Operational Knowledge

### How the System Works

1. **Onboarding**: Users create GitHub issues using the onboarding template
2. **License Assignment**: Onboarding workflow calls external action to assign
   Copilot license
3. **Automatic Cleanup**: Monthly deboarding workflow removes licenses from
   inactive users (90+ days)
4. **Issue Creation**: System creates issues to document deboarding actions
   and errors

### Dependencies and External Systems

- **GitHub API**: All functionality depends on GitHub REST API access
- **External Actions**: Uses `TelenorInternal/s07496-src-issueops` for
  authentication and onboarding
- **Secrets Required**: `ONBOARDER_APP_ID` and `ONBOARDER_APP_PK` for GitHub
  App authentication
- **Organization Access**: Requires GitHub organization admin permissions

### Troubleshooting

- **"HttpError: One or more users do not exist"**: Known issue when trying
  to deboard users who left the organization
- **Workflow failures**: Check GitHub Actions logs - usually related to API
  rate limits or authentication
- **Syntax errors**: Always validate JavaScript and YAML locally before
  committing
- **Timeout issues**: Workflows may take 5-10 minutes - NEVER CANCEL early

### Timing Expectations

- **JavaScript validation**: Instant
- **YAML validation**: Instant
- **Workflow execution**: 5-10 minutes - NEVER CANCEL. Set timeouts to
  15+ minutes.
- **Issue template testing**: 1-2 minutes to create and verify issue

## Security and Compliance

- All security-related files require approval from
  `@TelenorInternal/s07496-ghas-dev-sec`
- Secret scanning is enabled - never commit credentials
- Repository follows Telenor security policies defined in
  `.telenor/security.yml`
