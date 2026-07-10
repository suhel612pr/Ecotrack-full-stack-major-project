# Contributing to EcoTrack AI Smart City OS

Thank you for your interest in contributing to EcoTrack! This project was designed to transform municipal waste management, and we welcome contributions from developers, UX researchers, designers, and smart city enthusiasts.

---

## 🚀 How to Get Started

1. **Fork the Repository**: Clone the project to your local GitHub account.
2. **Setup Local Environment**: Run `npm install` and configure your local `.env` variables.
3. **Run Tests**: Verify baseline system mathematical models by running `npm test`.
4. **Create a Feature Branch**: Keep your modifications atomic and organized.
   ```bash
   git checkout -b feature/your-feature-name
   ```

---

## 🎨 Code Style & Quality

* **TypeScript**: Enforce strict type constraints. Do not use `any` unless absolutely necessary.
* **Tailwind CSS**: Follow mobile-first utility styling patterns. Prefer existing color variables in the system (`emerald`, `slate`, `amber`).
* **Components**: Ensure all complex modules are split into separate modular components in `src/components/` to prevent large token files.
* **Localization**: Keep user-authored messages objective, literal, and humble. Do not introduce dramatic or complex branding names.

---

## 🧪 Testing Requirements

Every contribution that modifies core analytical utilities must update the matching Vitest unit tests in `src/supabaseService.test.ts`.

Ensure all tests compile and pass before filing a PR:
```bash
npm run lint
npm run build
npm test
```

---

## 📜 Code of Conduct

By participating in this project, you agree to treat all contributors with respect, maintain high accessibility standards, and adhere strictly to professional communication standards.
