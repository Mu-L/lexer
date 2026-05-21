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
 * 加载方式说明：
 *   使用 require() 而非 eval() 加载 min.js，原因如下：
 *     1. eval() 存在安全风险，会执行任意字符串代码，且无法被 JS 引擎优化，调试时错误堆栈也不友好。
 *     2. 每个 min.js 内部是一个 IIFE，执行完后会主动将词法分析器实例挂载到全局：
 *        Node 环境下挂到 global.lexer，浏览器环境下挂到 window.lexer。
 *        因此 require() 加载执行后，直接读取 global.lexer 即可拿到对应的实例。
 *
 *   注意加载顺序：require() 有缓存机制，同一文件只执行一次，但 c 和 sql 是不同文件，
 *   不存在缓存问题。每次 require 后 global.lexer 会被新加载的实例覆盖，
 *   因此必须在加载下一个之前立即赋值，顺序不能颠倒。
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
 * Why require() instead of eval():
 *   1. eval() is a security risk — it executes arbitrary string code, cannot be
 *      optimized by the JS engine, and produces unhelpful stack traces when debugging.
 *   2. Each min.js is an IIFE that, upon execution, mounts the lexer instance to the
 *      global scope: global.lexer in Node.js, window.lexer in the browser.
 *      So after require() loads and runs the file, global.lexer already holds the
 *      instance for that language — no need for eval at all.
 *
 *   Note on load order: require() caches modules, but c and sql are different files
 *   so there is no caching conflict. However, each require() overwrites global.lexer,
 *   so cLexer must be assigned immediately after loading c, before sql is loaded.
 *   The order must not be swapped.
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