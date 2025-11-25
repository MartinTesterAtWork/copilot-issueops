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
Add these secrets as **repository secrets** (not environment or organization secrets):

1. Go to https://github.com/MartinTesterAtWork/copilot-issueops/settings/secrets/actions
2. Click **"New repository secret"**
3. Add the following secrets:
   - **Name**: `ONBOARDER_APP_ID`  
     **Value**: Your GitHub App ID (numeric value from step 1.3)
   - **Name**: `ONBOARDER_APP_PK`  
     **Value**: Complete contents of the private key .pem file (including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----` lines)

> **Note**: These must be repository secrets for the workflows to access them. Organization or environment secrets won't work for this setup.

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

### Enabling GitHub Copilot Business

⚠️ **Copilot Business is required** to test seat assignment. Follow these steps to enable it:

1. **Go to Copilot settings**: https://github.com/organizations/MartinTesterAtWork/settings/copilot
2. **Enable Copilot Business**:
   - You'll need to set up a payment method (requires organization owner permissions)
   - GitHub Copilot Business costs $19/user/month (or $39/user/month for Copilot Enterprise)
   - You can start with a free trial if available
3. **Select access policy**:
   - Choose "Selected members" (recommended for testing)
   - Or "All members" (will auto-assign to everyone)
4. **Set content exclusions** (optional):
   - Configure which repositories should be excluded from Copilot suggestions

> **Alternative for testing without billing**: If you don't want to enable billing, you can still test the workflow logic by checking the logs. The API calls will fail with a clear error message about Copilot not being enabled, but you can verify that authentication, validation, and other steps work correctly.

### Other Requirements

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
