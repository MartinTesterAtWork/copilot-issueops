# MartinTesterAtWork Test Environment

## Repositories Created

1. **MartinTesterAtWork/src-issueops**
   - https://github.com/MartinTesterAtWork/src-issueops
   - Contains the reusable GitHub Actions for IssueOps
   - Actions: authenticate, comment, error, validate, fulfill (onboardCopilot, createRepo, createTeam)

2. **MartinTesterAtWork/copilot-issueops**
   - https://github.com/MartinTesterAtWork/copilot-issueops
   - Contains workflows that use the actions from src-issueops
   - Onboarding workflow: triggers when issues with 'onboarding' label are created
   - Deboarding workflow: monthly cleanup of inactive users (90+ days)

## What's Configured

### Updated References
All action references have been updated to use `MartinTesterAtWork` org:
- ✅ `.github/workflows/onboarding.yml` → uses `MartinTesterAtWork/src-issueops/fulfill/onboardCopilot@main`
- ✅ `.github/workflows/deboarding.yml` → uses `MartinTesterAtWork/copilot-issueops/.github/deboardCopilot@main`
- ✅ `.github/deboardCopilot/action.yml` → uses `MartinTesterAtWork/src-issueops/authenticate@main`

### Issue Templates
- `onboarding.yml` - Request Copilot license
- `content-exclude.yaml` - Request content exclusion configuration

## Required Setup (Before Testing)

### 1. Create GitHub App
You need to create a GitHub App for authentication:

1. Go to https://github.com/organizations/MartinTesterAtWork/settings/apps/new
2. Configure:
   - **Name**: MartinTesterAtWork Copilot Onboarder
   - **Homepage URL**: https://github.com/MartinTesterAtWork
   - **Webhook**:
     - **Active**: Uncheck this box (webhook not needed for this app)
     - If you must provide a URL: use `https://github.com/MartinTesterAtWork` or any placeholder
     - **Webhook secret**: Leave empty or use any random string (not used)
   - **Permissions**:
     - Repository: Issues (Read & Write)
     - Organization: Members (Read & Write)
     - Organization: Copilot Business Management (Read & Write)
   - **Where can this GitHub App be installed?**: Only on this account
3. Create the app and note the **App ID**
4. Generate a **Private Key** (download the .pem file)

### 2. Install the GitHub App
1. Go to app settings → Install App
2. Install on MartinTesterAtWork organization
3. Grant access to the copilot-issueops repository

### 3. Configure Secrets
Add these secrets to the copilot-issueops repository:
1. Go to https://github.com/MartinTesterAtWork/copilot-issueops/settings/secrets/actions
2. Add:
   - `ONBOARDER_APP_ID` = Your GitHub App ID
   - `ONBOARDER_APP_PK` = Contents of the private key .pem file

## Testing the Onboarding Workflow

1. Go to https://github.com/MartinTesterAtWork/copilot-issueops/issues/new/choose
2. Select "Requesting Copilot license"
3. Check the required boxes
4. Submit the issue
5. The workflow should automatically:
   - Authenticate using the GitHub App
   - Validate the issue
   - Assign a Copilot seat to the issue creator
   - Comment with success/error message
   - Close the issue

## Testing the Deboarding Workflow

Since the deboarding runs on a schedule (28th of each month), you can test manually:

1. Go to https://github.com/MartinTesterAtWork/copilot-issueops/actions/workflows/deboarding.yml
2. Click "Run workflow" → "Run workflow"
3. It will check all Copilot seats and remove licenses from users inactive for 90+ days

## Important Notes

⚠️ **Copilot Business Requirement**: Your MartinTesterAtWork organization needs to have GitHub Copilot Business enabled to test seat assignment. Without it, the API calls will fail.

⚠️ **Authentication**: The workflows require the GitHub App to be properly configured and installed with the correct permissions.

⚠️ **Rate Limits**: Be aware of GitHub API rate limits when testing.

## File Locations

```
MartinTesterAtWork/copilot-issueops/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── onboarding.yml
│   │   └── content-exclude.yaml
│   ├── workflows/
│   │   ├── onboarding.yml
│   │   └── deboarding.yml
│   └── deboardCopilot/
│       ├── action.yml
│       └── deboard.js
├── README.md
└── TESTING.md (this file)
```

## Troubleshooting

- **Workflow not triggering**: Ensure the issue has the 'onboarding' label
- **Authentication errors**: Verify GitHub App is installed and secrets are correct
- **API errors**: Check that Copilot Business is enabled for the org
- **Deboarding issues**: Manually trigger the workflow to test

## Next Steps

1. Set up the GitHub App
2. Configure the secrets
3. Enable Copilot Business (if available)
4. Test by creating an onboarding issue
