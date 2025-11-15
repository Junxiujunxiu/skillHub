import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  moduleNameMapper: {
     "^lucide-react$": "<rootDir>/tests/__mocks__/lucide-react.tsx",
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },

  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.jest.json"
      },
    ],
  },
  

  transformIgnorePatterns: ["/node_modules/(?!(@clerk|uuid|lucide-react)/)"],
};

export default config;
