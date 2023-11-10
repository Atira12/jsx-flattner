module.exports = {
  // The root of the source code, `<rootDir>` is a token Jest substitutes
  roots: ["<rootDir>/tests/"],

  // The test environment that will be used for testing, jsdom for browser environment
  testEnvironment: "jsdom",

  // Jest transformations -- this adds support for TypeScript using ts-jest
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
    ".+\\.(css|scss|png|jpg|svg)$": "jest-transform-stub",
  },

  moduleFileExtensions: ["js", "json", "ts", "tsx"],
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  preset: "ts-jest/presets/default-esm",
};
