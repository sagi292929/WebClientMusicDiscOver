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

## Project structure

- `src/main.tsx` — React entry point; applies the app theme and MUI `CssBaseline`.
- `src/App.tsx` — root application component.
- `src/theme/index.ts` — app-wide MUI theme.
- `src/features/` — music feature areas: `music-entrance/` (search and category selection), `search/` (search results), and `album/`, `artist/`, `band/`, `genre/`, and `song/` (domain views).
- `src/pages/` — menu and user account pages.
- `src/context/` — shared connection state and context.
- `src/gql/` — GraphQL client, operations, and generated query/types.
- `src/components/` — shared UI components, including server error handling.
- `src/assets/` — images and other static assets.

## Architecture and state conventions

- **Data and API:** Use the Apollo GraphQL client configured in `src/gql/client.ts`; set `VITE_GRAPHQL_URL` to override its default endpoint (`http://localhost:4000/graphql`). Keep GraphQL operations and operation types in `src/gql/operations.ts`; schema types are generated into `src/gql/generated.ts`. Apollo's `InMemoryCache` provides in-memory caching. There is no separate mock-data layer.
- **Search queries:** `src/features/search/SearchResults.tsx` runs the category-specific queries below. Each search operation takes the entered text as its `name` variable.

  | Category | GraphQL operation | Search result fields |
  | --- | --- | --- |
  | Band | `GetBand` | `id`, `name`, `active_years` |
  | Artist | `GetArtist` (`getArtist` only; passes `name` and `limit`) | `es_id`, `name`, `band_name`, `born_in` |
  | Album | `GetAlbum` | `es_id`, `name`, `band_name` |
  | Song | `GetSong` | `es_id`, `name`, `band_name` |
  | Genre | `GetGenre` | `main_genre`; genre `Id` and `name` |
  | All | Runs `GetBand`, `GetArtist`, `GetAlbum`, `GetSong`, and `GetGenre` concurrently | Results are grouped into separate category sections. |

- **Loading and errors:** Feature components use Apollo query/mutation hook results to render loading and error states. The connection provider in `src/context/ConnectionContext.tsx` tracks browser connectivity and server reachability and shows the shared server error view when disconnected.
- **State and routing:** Use React hooks for component and app state, and React context for shared connection state. React Router routes entity detail pages by URL path parameters (for example, `/albums/:id`); the current search query/category are held in `App` state rather than URL search parameters. No external state-store library is configured.
- **TypeScript:** Model GraphQL data with the generated types and operation-specific types in `src/gql/operations.ts` (including `SongMatch`, `AlbumMatch`, `ArtistMatch`, and `BandMatch`). The app TypeScript config checks unused locals and parameters, but does not enable `strict`; no `@/` path alias is configured, so follow the existing relative-import convention.

## Change boundaries

- Do not manually edit generated files such as `src/gql/generated.ts`, build output in `dist/`, or lockfiles such as `package-lock.json`.
- Avoid changing core theme tokens in `src/theme/index.ts` or shared layout wrappers unless the task explicitly requires it.
- Prefer existing packages and project patterns; do not add dependencies unless the task requires them.

## UI implementation guidelines

- **Prefer MUI over CSS files.** Build layouts and component styling with MUI components and the `sx` prop instead of adding or extending component-specific CSS files.
- Use the closest MUI component for the job, such as `Box`, `Stack`, `Typography`, `Button`, `TextField`, `List`, `Alert`, and `Chip`. Use semantic elements through props like `component="main"` or `component="section"`.
- Use `sx` for one-off or component-local styling. Use MUI `styled()` when a styled component needs to be reused in multiple places.
- Put app-wide colors, typography, and reusable component defaults or overrides in `src/theme/index.ts`. Read colors from the theme palette (for example, `bgcolor: 'background.paper'` or `color: 'text.secondary'`) instead of hard-coding color values in components.
- Keep CSS files for cases MUI does not cover well, such as global browser defaults, third-party library styling, or specialized effects. Avoid duplicating MUI styles in CSS.
- Preserve accessible names, semantic HTML, keyboard interaction, and responsive behavior when replacing existing UI with MUI.

The app applies `appTheme` and MUI `CssBaseline` at the root in `src/main.tsx`.
