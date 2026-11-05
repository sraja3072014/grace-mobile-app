# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## GraceOS authentication and roles

The mobile app signs users in through the paired Supabase project's email/password Auth. Configure Supabase Auth before signing in. New registrations are assigned `MEMBER` access; a trusted administrator must set the user's `app_metadata.role` to `SUPER_ADMIN`, `PASTOR`, `LEADER`, or `MEMBER` using a server-side/admin workflow. Do not assign privileged roles through user-editable metadata or embed shared credentials in the client.

The client uses `app_metadata.role` for interface-level access control and stores only a minimal user profile locally. This is not a substitute for database authorization: enable Row Level Security and appropriate policies on `members`, `visitors`, and finance tables before production deployment. To receive live updates, enable Supabase Realtime for `public.members` and `public.visitors`.
