# Help Center

Detailed documentation for all aspects of this template.

---

## Quick Links

### Setup & Configuration

| Topic | Description |
|-------|-------------|
| [Environment Variables](./Environment-Variables.md) | Configure environment variables and secrets |
| [Authentication](./Authentication.md) | Set up NextAuth.js authentication and OAuth |
| [RBAC](./RBAC.md) | Configure role-based access control |

### Development

| Topic | Description |
|-------|-------------|
| [Development Scripts](./Development-Scripts.md) | All available npm scripts and commands |
| [Quality Gates](./Quality-Gates.md) | Understanding and passing quality checks |
| [Session Logging](./Session-Logging.md) | Log Claude Code sessions for PR review |

### Support

| Topic | Description |
|-------|-------------|
| [Troubleshooting](./Troubleshooting.md) | Common issues and solutions |

---

## Documentation Structure

```
.template-docs/
├── Getting-Started.md          # Step-by-step setup guide
├── Help/                       # Detailed topic guides
│   ├── README.md              # This file
│   ├── Authentication.md      # Auth setup
│   ├── RBAC.md                # Role-based access
│   ├── Environment-Variables.md
│   ├── Quality-Gates.md
│   ├── Development-Scripts.md
│   ├── Session-Logging.md     # Session logging
│   └── Troubleshooting.md
└── TEMPLATE_DEVELOPMENT.md    # For template maintainers
```

---

## By Use Case

### I want to...

**Set up authentication**
-> [Authentication Guide](./Authentication.md)

**Configure user roles**
-> [RBAC Guide](./RBAC.md)

**Add environment variables**
-> [Environment Variables Guide](./Environment-Variables.md)

**Understand quality gates**
-> [Quality Gates Guide](./Quality-Gates.md)

**Learn available commands**
-> [Development Scripts Guide](./Development-Scripts.md)

**Fix an issue**
-> [Troubleshooting Guide](./Troubleshooting.md)

**Get started from scratch**
-> [Getting Started Guide](../Getting-Started.md)

---

## Ask Claude Code

Instead of searching documentation, just ask Claude Code:

```
How do I add OAuth authentication?
What are the quality gates?
How do I configure RBAC for my app?
```

Claude has access to all documentation and can provide specific answers to your questions.

---

## External Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://authjs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/ui Documentation](https://ui.shadcn.com/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

**Can't find what you need?** Ask Claude Code - it's the fastest way to get help!
