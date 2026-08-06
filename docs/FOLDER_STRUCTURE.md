# Folder Structure

```text
.
├── apps
│   ├── api
│   │   ├── prisma
│   │   │   ├── schema.prisma
│   │   │   └── seed.ts
│   │   └── src
│   │       ├── auth
│   │       ├── common
│   │       ├── games
│   │       ├── homework
│   │       ├── rbac
│   │       ├── reports
│   │       └── users
│   └── web
│       └── src
│           ├── app
│           ├── components
│           └── lib
├── docs
├── packages
│   └── config
├── docker-compose.yml
└── pnpm-workspace.yaml
```

The monorepo keeps deployment units separate while sharing base TypeScript configuration.
