import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: process.env.GRAPHQL_SCHEMA_URL ?? 'http://localhost:4000/graphql',
  documents: ['src/**/*.{ts,tsx,graphql}'],
  ignoreNoDocuments: true,
  generates: {
    'src/gql/generated.ts': {
      plugins: ['typescript', 'typescript-operations', 'typed-document-node'],
      config: {
        useTypeImports: true,
      },
    },
  },
}

export default config
