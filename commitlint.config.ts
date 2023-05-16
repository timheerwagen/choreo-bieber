const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "subject-case": [2, "always", ["sentence-case", "pascal-case"]],
  },
};

export default config;
