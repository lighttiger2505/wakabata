import { defineConfig } from "orval";

const openAPIFilePath = "../backend/doc/openapi.json";
const outputDir = "./src/api/generated";

export default defineConfig({
  wakabata: {
    input: openAPIFilePath,
    output: {
      mode: "single",
      target: `${outputDir}/client.ts`,
      schemas: `${outputDir}/model`,
      client: "swr",
      mock: true,
      override: {
        mutator: {
          path: "./src/lib/custom-instance.ts",
          name: "customInstance",
        },
      },
    },
  },
  wakabataFetch: {
    input: openAPIFilePath,
    output: {
      mode: "single",
      target: `${outputDir}/fetch-client.ts`,
      schemas: `${outputDir}/model`,
      client: "fetch",
    },
  },
  wakabataZod: {
    input: {
      target: openAPIFilePath,
    },
    output: {
      client: "zod",
      mode: "tags-split",
      target: `${outputDir}/zod`,
      fileExtension: ".zod.ts",
      override: {
        zod: {
          generate: {
            param: true,
            query: true,
            header: false,
            body: true,
            response: false,
          },
          generateEachHttpStatus: false,
        },
      },
    },
  },
});
