import * as prettierPluginSqlCst from "prettier-plugin-sql-cst";

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  plugins: [prettierPluginSqlCst],
};

export default config;
