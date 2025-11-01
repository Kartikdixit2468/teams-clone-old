# Contributing to TeamsClone-RL

Thank you for contributing to TeamsClone-RL! This is a hackathon project, so we're moving fast but trying to stay organized.

## Team Structure

- **Backend Team**: Node.js backend, RL API, Socket.IO
- **Frontend Team**: React UI, TailwindCSS, UX
- **ML Team**: RL agents, reward design, training
- **Research Team**: Documentation, evaluation metrics

## Getting Started

1. **Clone the repo**
```bash
git clone https://github.com/Muneer320/teams-clone.git
cd teams-clone
```

2. **Install dependencies**
```bash
npm run install:all
```

3. **Create a branch**
```bash
git checkout -b feature/your-feature-name
```

4. **Make changes and test**

5. **Commit with clear messages**
```bash
git add .
git commit -m "feat: add message reactions feature"
```

6. **Push and create PR**
```bash
git push origin feature/your-feature-name
```

## Code Style

### JavaScript/React
- Use ES6+ features
- Functional components with hooks
- Descriptive variable names
- Add comments for complex logic

### Python
- Follow PEP 8
- Type hints where possible
- Docstrings for functions
- Clear variable names

## Commit Messages

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

## Pull Request Guidelines

- Keep PRs focused and small
- Update documentation if needed
- Test your changes locally
- Describe what and why in PR description

## Testing

Before pushing:
- Backend: Test API endpoints work
- Frontend: Check UI renders correctly
- Python: Run agents to verify they work

## Questions?

Ask in the team chat or create an issue!
