# Music DiskOver

A React, TypeScript, and Vite web client for discovering music. The UI uses [MUI](https://mui.com/) components and the app theme defined in `src/theme/index.ts`.

## Development

Install dependencies and start the development server:

```sh
npm install
npm run dev
```

Other useful commands:

```sh
npm run build
npm run lint
```

## UI implementation guidelines

- **Prefer MUI over CSS files.** Build layouts and component styling with MUI components and the `sx` prop instead of adding or extending component-specific CSS files.
- Use the closest MUI component for the job, such as `Box`, `Stack`, `Typography`, `Button`, `TextField`, `List`, `Alert`, and `Chip`. Use semantic elements through props like `component="main"` or `component="section"`.
- Use `sx` for one-off or component-local styling. Use MUI `styled()` when a styled component needs to be reused in multiple places.
- Put app-wide colors, typography, and reusable component defaults or overrides in `src/theme/index.ts`. Read colors from the theme palette (for example, `bgcolor: 'background.paper'` or `color: 'text.secondary'`) instead of hard-coding color values in components.
- Keep CSS files for cases MUI does not cover well, such as global browser defaults, third-party library styling, or specialized effects. Avoid duplicating MUI styles in CSS.
- Preserve accessible names, semantic HTML, keyboard interaction, and responsive behavior when replacing existing UI with MUI.

The app applies `appTheme` and MUI `CssBaseline` at the root in `src/main.tsx`.
