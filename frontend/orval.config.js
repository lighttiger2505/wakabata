module.exports = {
  "wakabata-file": {
    input: "../backend/doc/openapi.json",
    output: {
      mode: "single",
      target: "./src/api/generated/client.ts",
      schemas: "./src/api/generated/model",
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
};
