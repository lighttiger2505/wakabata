module.exports = {
  "wakabata-file": {
    input: "../backend/doc/openapi.json",
    output: {
      mode: "single",
      target: "./src/clients/client.ts",
      schemas: "./src/clients/model",
      mock: true,
    },
  },
};
