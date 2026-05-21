/**
 * npm 包入口文件
 *
 * 这个文件是 chain-lexer npm 包的入口（由 package.json 的 "main" 字段指定）。
 * 当其他 Node.js 项目通过 `npm install chain-lexer` 安装后，
 * 使用 `require('chain-lexer')` 时就会加载这个文件。
 *
 * 作用：
 *   加载 package/ 目录下已打包好的 C 和 SQL 词法分析器，并对外导出。
 *
 * 使用示例：
 *   var chainLexer = require('chain-lexer');
 *
 *   // 分析 C 代码
 *   chainLexer.cLexer.start("int a = 10;");
 *   var tokens = chainLexer.cLexer.DFA.result.tokens;
 *
 *   // 分析 SQL 代码
 *   chainLexer.sqlLexer.start("select * from test where id >= 10;");
 *   var tokens = chainLexer.sqlLexer.DFA.result.tokens;
 *
 * 注意：
 *   此文件与根目录下的 index.html（GitHub Pages 展示页）没有任何关联。
 *
 * ─────────────────────────────────────────────────────────────
 *
 * Entry file of the npm package
 *
 * This file is the entry point of the chain-lexer npm package (specified by the
 * "main" field in package.json). When another Node.js project installs it via
 * `npm install chain-lexer` and calls `require('chain-lexer')`, this file is loaded.
 *
 * Purpose:
 *   Load the pre-built C and SQL lexers from the package/ directory and export them.
 *
 * Usage example:
 *   var chainLexer = require('chain-lexer');
 *
 *   // Analyze C code
 *   chainLexer.cLexer.start("int a = 10;");
 *   var tokens = chainLexer.cLexer.DFA.result.tokens;
 *
 *   // Analyze SQL code
 *   chainLexer.sqlLexer.start("select * from test where id >= 10;");
 *   var tokens = chainLexer.sqlLexer.DFA.result.tokens;
 *
 * Note:
 *   This file has no relation to index.html in the root directory (which is the
 *   GitHub Pages demo page).
 */

let packageDirectory = __dirname + '/package/';

require(packageDirectory + 'c/c-lexer.min.js');
let cLexer = global.lexer;

require(packageDirectory + 'sql/sql-lexer.min.js');
let sqlLexer = global.lexer;

module.exports = {
    cLexer: cLexer,
    sqlLexer: sqlLexer,
};