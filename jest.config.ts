import type { Config } from "jest";

const config: Config = {
  clearMocks: true, // Automatically clear mock calls and instances between every test
  collectCoverage: true, // Indicates whether the coverage information should be collected while executing the test
  coverageDirectory: "coverage", // The directory where Jest should output its coverage files
  coverageProvider: "v8", // Which provider should be used to instrument code for coverage
  preset: "ts-jest", // Use ts-jest for TypeScript files
  testEnvironment: "node", // Use Node.js environment for testing
  roots: ["./src/tests"], // The root directory that Jest should scan for tests and modules within
  transform: {
    "^.+\\.ts?$": "ts-jest", // Transform TypeScript files using ts-jest
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts$", // The regex pattern Jest uses to detect test files
  moduleFileExtensions: ["ts", "js", "json", "node"], // An array of file extensions your modules use
  collectCoverageFrom: [
    "src/**/*.ts", // Incluye todos los archivos TypeScript en src/
    "!src/**/*.d.ts", // Excluye archivos de declaración
    "!src/index.ts", // Excluye el archivo de entrada principal
    "!src/interfaces/**/*.ts", // Excluye interfaces
    "!src/middlewares/**/*.ts", // Excluye middlewares
    "!src/config/**/*.ts", // Excluye archivos de configuración
    "!src/models/**/*.ts", // Excluye models
    "!src/routes/**/*.ts", // Excluye routes
    "!src/**/index.ts", // Excluye archivos index de exportación
    "!src/validators/**/*.ts", // Excluye schemas de validación
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coverageReporters: ["text", "lcov", "text-summary"],
};



export default config;
