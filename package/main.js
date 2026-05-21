/**
 *
 * 打包入口文件
 *
 * 作用：
 *   将 src/ 目录下的词法分析器源码和各语言扩展定义，打包合并为 package/ 下的 min.js 文件。
 *
 * 重要：
 *   package/ 下生成的 min.js 文件并非样例或临时产物，而是整个项目的核心构建输出，
 *   被以下三个地方直接使用：
 *     1. index.js      —— npm 包入口，通过 require() 加载，是 `npm install chain-lexer` 后对外提供的实际能力
 *     2. index.html    —— GitHub Pages 展示页，通过 <script src> 引入，驱动在线词法分析演示
 *     3. test/main.js  —— 测试入口，加载 min.js 对词法分析结果进行自动化验证
 *
 * 因此，每次修改 src/ 下的源码后，必须重新打包，否则上述三处的行为不会更新。
 *
 * ─────────────────────────────────────────────────────────────
 *
 * Pack entry file
 *
 * Purpose:
 *   Combines the lexer source code in src/ with each language extension definition
 *   to produce the min.js build artifacts under package/.
 *
 * Important:
 *   The generated min.js files are NOT samples or temporary outputs — they are the
 *   core build artifacts of the entire project, used directly by:
 *     1. index.js     — npm package entry point; loaded via require(), these files
 *                       are the actual capability delivered when users run
 *                       `npm install chain-lexer`
 *     2. index.html   — GitHub Pages demo page; included via <script src>, they
 *                       power the online lexical analysis demo
 *     3. test/main.js — test entry point; loads min.js files to run automated
 *                       verification of lexical analysis results
 *
 * Therefore, any changes to source files under src/ MUST be followed by re-packing,
 * or the three consumers above will not reflect the updates.
 *
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
        "(function(){\n",
        extensionFileCode,
        "\n",
        lexerFileCode,
        "\n\nif(typeof lexer !== 'undefined'){if(!tool.isNodeEnvironment()){window.lexer=lexer;}else{global.lexer=lexer;}}\n\n",
        "\n\nif(typeof flowModel !== 'undefined'){if(!tool.isNodeEnvironment()){window.flowModel=flowModel;}else{global.flowModel=flowModel;}}\n\n",
        "})();",
    ];
    let code = arr.join("");
    fs.writeFile(extension.lexer_min_file, code, function (err) {
        if (err) console.error(err);
    });

    // create {lang}-define.min.js file
    arr = [
        "(function(){\n",
        extensionFileCode,
        "\n",
        lexerFileCode,
        "\n\nif(typeof ENUM_CONST !== 'undefined'){if(!tool.isNodeEnvironment()){window.ENUM_CONST=ENUM_CONST;}else{global.ENUM_CONST=ENUM_CONST;}}\n",
        "\nif(typeof CHARSET_CONST !== 'undefined'){if(!tool.isNodeEnvironment()){window.CHARSET_CONST=CHARSET_CONST;}else{global.CHARSET_CONST=CHARSET_CONST;}}\n",
        "\nif(typeof DFA_STATE_CONST !== 'undefined'){if(!tool.isNodeEnvironment()){window.DFA_STATE_CONST=DFA_STATE_CONST;}else{global.DFA_STATE_CONST=DFA_STATE_CONST;}}\n",
        "\nif(typeof tool !== 'undefined'){if(!tool.isNodeEnvironment()){window.tool=tool;}else{global.tool=tool;}}\n",
        "\nif(typeof flowModel !== 'undefined'){if(!tool.isNodeEnvironment()){window.flowModel=flowModel;}else{global.flowModel=flowModel;}}\n",
        "})();",
    ];
    code = arr.join("");
    fs.writeFile(extension.define_min_file, code, function (err) {
        if (err) console.error(err);
    });
}
