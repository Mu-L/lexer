/**
 * 打包入口文件，由 package/pack.sh 调用执行。
 *
 * 打包过程：
 *   遍历每种语言扩展（c / sql / goal），将以下两个文件的内容拼接，包裹在 IIFE 中：
 *     - src/lang/{lang}-define.js  语言扩展定义（Token 类型、字符集、DFA 状态等）
 *     - src/lexer.js               词法分析器核心
 *
 *   每种语言输出两个产物：
 *     - {lang}-lexer.min.js   包含完整词法分析器，对外暴露 global.lexer / window.lexer
 *     - {lang}-define.min.js  仅暴露常量和工具（ENUM_CONST / CHARSET_CONST / tool 等），供单元测试使用
 *
 *   IIFE（Immediately Invoked Function Expression）就是定义后立即执行的函数：(function(){ ... })()，作用是创建独立作用域，避免内部变量污染全局。
 *
 * ─────────────────────────────────────────────────────────────
 *
 * Pack entry file, invoked by package/pack.sh.
 *
 * Pack process:
 *   Iterates over each language extension (c / sql / goal), concatenates the following
 *   two files and wraps them in an IIFE:
 *     - src/lang/{lang}-define.js  language extension (token types, charset, DFA states, etc.)
 *     - src/lexer.js               core lexer engine
 *
 *   Two output files are produced per language:
 *     - {lang}-lexer.min.js   full lexer, exposes global.lexer / window.lexer
 *     - {lang}-define.min.js  exposes constants and utilities only (ENUM_CONST / CHARSET_CONST / tool, etc.),
 *                             used by unit tests
 */

let fs = require("fs")
let rootDirectory = __dirname + "/../";
let srcDirectory = rootDirectory + "src/";
let packageDirectory = rootDirectory + "package/";

// pack extension files and lexer file to min.js
let lexerFileCode = fs.readFileSync(srcDirectory + 'lexer.js').toString();
let extensions = [
    {
        file: srcDirectory + 'lang/c-define.js',
        define_min_file: packageDirectory + 'c/c-define.min.js',
        lexer_min_file: packageDirectory + 'c/c-lexer.min.js'
    },
    {
        file: srcDirectory + 'lang/sql-define.js',
        define_min_file: packageDirectory + 'sql/sql-define.min.js',
        lexer_min_file: packageDirectory + 'sql/sql-lexer.min.js'
    },
    {
        file: srcDirectory + 'lang/goal-define.js',
        define_min_file: packageDirectory + 'goal/goal-define.min.js',
        lexer_min_file: packageDirectory + 'goal/goal-lexer.min.js'
    },
];
for (let extension of extensions) {
    let extensionFileCode = fs.readFileSync(extension.file).toString();

    // create {lang}-lexer.min.js file
    let arr = [
        "(function(){\n",      // IIFE start: creates isolated scope, prevents variable leakage
        extensionFileCode,     // language extension definition (token types, charset, DFA states, etc.)
        "\n",
        lexerFileCode,         // core lexer engine
        // before IIFE ends, mount the lexer instance to global scope: window in browser, global in Node
        "\n\nif(typeof lexer !== 'undefined'){if(!tool.isNodeEnvironment()){window.lexer=lexer;}else{global.lexer=lexer;}}\n\n",
        // mount flowModel (DFA state flow log object) the same way
        "\n\nif(typeof flowModel !== 'undefined'){if(!tool.isNodeEnvironment()){window.flowModel=flowModel;}else{global.flowModel=flowModel;}}\n\n",
        "})();",               // IIFE end: immediately invoked
    ];
    let code = arr.join("");
    fs.writeFile(extension.lexer_min_file, code, function (err) {
        if (err) console.error(err);
    });

    // create {lang}-define.min.js file
    arr = [
        "(function(){\n",      // IIFE start
        extensionFileCode,     // language extension definition
        "\n",
        lexerFileCode,         // core lexer engine
        // mount each constant and utility object to global scope for direct access in unit tests
        "\n\nif(typeof ENUM_CONST !== 'undefined'){if(!tool.isNodeEnvironment()){window.ENUM_CONST=ENUM_CONST;}else{global.ENUM_CONST=ENUM_CONST;}}\n",
        "\nif(typeof CHARSET_CONST !== 'undefined'){if(!tool.isNodeEnvironment()){window.CHARSET_CONST=CHARSET_CONST;}else{global.CHARSET_CONST=CHARSET_CONST;}}\n",
        "\nif(typeof DFA_STATE_CONST !== 'undefined'){if(!tool.isNodeEnvironment()){window.DFA_STATE_CONST=DFA_STATE_CONST;}else{global.DFA_STATE_CONST=DFA_STATE_CONST;}}\n",
        "\nif(typeof tool !== 'undefined'){if(!tool.isNodeEnvironment()){window.tool=tool;}else{global.tool=tool;}}\n",
        "\nif(typeof flowModel !== 'undefined'){if(!tool.isNodeEnvironment()){window.flowModel=flowModel;}else{global.flowModel=flowModel;}}\n",
        "})();",               // IIFE end: immediately invoked
    ];
    code = arr.join("");
    fs.writeFile(extension.define_min_file, code, function (err) {
        if (err) console.error(err);
    });
}
