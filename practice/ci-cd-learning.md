# DevOps Learning - CI/CD Pipeline Guide

## 🎯 What is CI/CD?

**CI/CD** stands for **Continuous Integration** and **Continuous Deployment/Delivery**.

### Continuous Integration (CI)
- **Automatically test** code changes when developers push code
- **Validate code quality** with linting, type checking, and tests
- **Build applications** automatically
- **Catch issues early** before they reach production

### Continuous Deployment (CD)
- **Automatically deploy** code to different environments
- **Staging**: Test environment for validation
- **Production**: Live environment for users
- **Rollback capability** if issues are detected

## 🚀 Our CI/CD Pipeline Explained

### Pipeline Triggers
```yaml
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
```
**What this means:**
- Runs when code is pushed to `main` or `develop` branches
- Runs when pull requests are created to `main` branch

### Job Dependencies
```yaml
build:
  needs: [code-quality, test]
```
**What this means:**
- `build` job only runs if `code-quality` and `test` jobs succeed
- This ensures we don't build broken code

### Environment-Specific Deployments
```yaml
deploy-staging:
  if: github.ref == 'refs/heads/develop'

deploy-production:
  if: github.ref == 'refs/heads/main'
```
**What this means:**
- Staging deployment only happens from `develop` branch
- Production deployment only happens from `main` branch

## 🛠️ CI/CD Best Practices

### 1. Fast Feedback
- Run quick tests first (linting, type checking)
- Run slower tests (integration tests) after quick ones pass

### 2. Fail Fast
- Stop the pipeline if any step fails
- Don't waste time on broken code

### 3. Environment Parity
- Use same tools and versions in CI as in development
- Test in environments similar to production

### 4. Artifact Management
- Build once, deploy everywhere
- Store build artifacts for reuse

### 5. Security
- Never commit secrets to code
- Use GitHub Secrets for sensitive data
- Scan for vulnerabilities

## 🎯 Learning Exercises

### Exercise 1: Understanding the Pipeline
1. Look at `.github/workflows/ci-simple.yml`
2. Identify each job and its purpose
3. Understand the flow: code-quality → test → build → deploy

### Exercise 2: Triggering the Pipeline
1. Make a small change to any file
2. Commit and push to `develop` branch
3. Watch the pipeline run in GitHub Actions tab

### Exercise 3: Adding a New Step
1. Add a new step to run `npm run format:check`
2. Commit and push to see it in action

### Exercise 4: Understanding Artifacts
1. Check the build artifacts in GitHub Actions
2. Download and examine the built files

## 🔧 Common CI/CD Concepts

### GitHub Actions
- **Workflows**: YAML files that define CI/CD pipelines
- **Jobs**: Independent units of work that run in parallel
- **Steps**: Individual commands within a job
- **Actions**: Reusable units of code (like `actions/checkout@v4`)

### Environment Variables
```yaml
env:
  NODE_VERSION: '20'
```
- Available to all jobs in the workflow
- Can be overridden per job or step

### Secrets
```yaml
env:
  API_KEY: ${{ secrets.API_KEY }}
```
- Store sensitive data in GitHub repository settings
- Never visible in logs

### Artifacts
- Files created during the build process
- Can be downloaded and used in later jobs
- Useful for passing build outputs between jobs

## 🚨 Troubleshooting CI/CD

### Common Issues
1. **Job fails**: Check the logs in GitHub Actions
2. **Dependencies not found**: Ensure `package-lock.json` is committed
3. **Permission errors**: Check GitHub repository settings
4. **Timeout**: Increase timeout or optimize build process

### Debugging Tips
1. Add `echo` statements to see variable values
2. Use `actions/upload-artifact` to save intermediate files
3. Check the "Actions" tab in your GitHub repository

## 🎉 Next Steps

1. **Practice**: Make changes and watch the pipeline run
2. **Experiment**: Add new steps or modify existing ones
3. **Learn**: Study the full CI/CD pipeline in `ci.yml`
4. **Deploy**: Set up real deployment targets

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [CI/CD Best Practices](https://docs.github.com/en/actions/learn-github-actions)
- [Deployment Strategies](https://docs.github.com/en/actions/deployment)
