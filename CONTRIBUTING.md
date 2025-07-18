# Contributing to LiczyDeszcz

Thank you for your interest in contributing to LiczyDeszcz! This document provides guidelines and instructions for contributing to the project.

## Development Process

### 1. Setting Up

Before starting work on a new feature or fix:

1. Create a new branch from `main`:

   ```bash
   git checkout main
   git pull origin main
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```

2. Make your changes following our coding standards and guidelines.

### 2. Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages. This leads to more readable messages and automatic versioning.

Format: `type(scope): description`

Types:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that don't affect the meaning of the code (formatting)
- `refactor`: Code changes that neither fix a bug nor add a feature
- `perf`: Performance improvements
- `test`: Adding or correcting tests
- `chore`: Changes to build process or auxiliary tools

Examples:

```bash
feat(calculator): add rainfall intensity calculation
fix(map): correct marker position calculation
docs(readme): update installation instructions
style(lint): apply prettier formatting
```

### 3. Pull Requests

All changes must be submitted through Pull Requests (PRs):

1. Push your branch to GitHub:

   ```bash
   git push origin feat/your-feature-name
   ```

2. Create a Pull Request on GitHub against the `main` branch.

3. PR Requirements:
   - Clear title following conventional commits format
   - Description explaining the changes and why they're needed
   - All tests passing
   - No linting errors
   - Up-to-date with main branch
   - Screenshots for UI changes (if applicable)

4. Review Process:
   - At least one approval is required
   - All conversations must be resolved
   - CI checks must pass
   - No merge conflicts

### 4. Code Review Guidelines

When reviewing code:

- Check for potential bugs or edge cases
- Verify code follows project conventions
- Ensure proper test coverage
- Look for clear naming and good documentation
- Verify accessibility standards are met (for UI changes)

When receiving reviews:

- Respond to all comments
- Explain your decisions
- Make requested changes promptly
- Ask for clarification if needed

## Development Guidelines

### Code Style

- Follow TypeScript best practices
- Use ESLint and Prettier configurations
- Keep components focused and composable
- Write meaningful comments for complex logic
- Include JSDoc comments for public APIs

## Questions?

If you have questions about contributing:

1. Check existing issues and PRs
2. Ask in the project chat
3. Contact the maintainers

Thank you for contributing to LiczyDeszcz! 🌧️
