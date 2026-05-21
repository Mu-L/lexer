/**
 * 测试入口文件
 *
 * 本文件是整个测试体系的统一入口，支持三种测试类型：
 *
 *   类型 1 - 单元测试（Unit Testing）
 *     加载 package/{lang}/{lang}-define.min.js，验证词法定义（如 tool 工具函数、常量枚举等）是否正确。
 *     测试用例位于 test/unit/ 目录。
 *
 *   类型 2 - 自动化测试（Automated Testing）
 *     加载 package/{lang}/{lang}-lexer.min.js，对大量输入字符串做词法分析，验证输出 token 是否符合预期。
 *     测试用例位于 test/auto/ 目录。
 *
 *   类型 3 - Npm 测试（Npm Testing）
 *     通过 require('index.js') 模拟 npm 包使用方式，验证对外导出的 cLexer / sqlLexer 是否正常工作。
 *     测试用例同 test/auto/ 目录。
 *
 * 为什么使用动态加载，而非在顶部静态 require：
 *   1. 路径由运行时参数决定（lang、testFile），在模块加载阶段还不知道要加载哪个文件。
 *   2. 所有测试文件（unit/ 和 auto/）都定义了同名函数，如 returnCaseList()、runUnitTesting()。
 *      如果全部在顶部 require，后加载的会覆盖前面的，导致测试混乱。
 *   3. 所有 min.js 都将词法分析器写入同一个 global.lexer 变量。
 *      动态加载可确保 global.lexer 始终是当前测试所需的那个语言的实例。
 *
 * 命令格式：
 *   node test/main.js <lang> <type> <testFile> <showProcess>
 *
 *   参数说明：
 *     lang        语言，支持：c | sql | goal
 *     type        测试类型：1=单元测试  2=自动化测试  3=Npm测试
 *     testFile    测试文件路径（相对于 test/ 目录），如 unit/c-define_test.js
 *     showProcess 是否打印详细过程：1=打印  0=只打印失败项
 *
 * 命令示例：
 *   # C 语言单元测试（打印详细）
 *   node test/main.js c 1 unit/c-define_test.js 1
 *
 *   # SQL 单元测试（静默，只输出失败）
 *   node test/main.js sql 1 unit/sql-define_test.js 0
 *
 *   # C 语言自动化测试
 *   node test/main.js c 2 auto/c-lexer_test.js 1
 *
 *   # SQL 自动化测试
 *   node test/main.js sql 2 auto/sql-lexer_test.js 1
 *
 *   # C 语言 Npm 测试
 *   node test/main.js c 3 auto/c-lexer_test.js 1
 *
 *   # 一键运行全部测试（推荐）
 *   bash test/test.sh
 *
 * ─────────────────────────────────────────────────────────────
 *
 * Test entry file
 *
 * This file is the unified entry point for the entire test suite, supporting three test types:
 *
 *   Type 1 - Unit Testing
 *     Loads package/{lang}/{lang}-define.min.js and verifies lexical definitions
 *     (e.g., tool utility functions, constant enums). Test cases are in test/unit/.
 *
 *   Type 2 - Automated Testing
 *     Loads package/{lang}/{lang}-lexer.min.js, performs lexical analysis on a large set
 *     of input strings, and verifies the output tokens match expectations.
 *     Test cases are in test/auto/.
 *
 *   Type 3 - Npm Testing
 *     Simulates npm package usage via require('index.js') to verify that the exported
 *     cLexer / sqlLexer work correctly. Test cases are also in test/auto/.
 *
 * Why dynamic loading instead of static requires at the top:
 *   1. The file paths depend on runtime arguments (lang, testFile) and are not
 *      known at module load time.
 *   2. All test files (unit/ and auto/) define functions with the same names, such as
 *      returnCaseList() and runUnitTesting(). Static requires at the top would cause
 *      later files to overwrite earlier ones, mixing up test cases.
 *   3. All min.js files write their lexer instance to the same global.lexer variable.
 *      Dynamic loading ensures global.lexer always holds the instance for the language
 *      being tested.
 *
 * Command format:
 *   node test/main.js <lang> <type> <testFile> <showProcess>
 *
 *   Arguments:
 *     lang        Language to test: c | sql | goal
 *     type        Test type: 1=Unit  2=Automated  3=Npm
 *     testFile    Path to test file (relative to test/), e.g. unit/c-define_test.js
 *     showProcess Whether to print details: 1=yes  0=only print failures
 *
 * Examples:
 *   # C unit test (verbose)
 *   node test/main.js c 1 unit/c-define_test.js 1
 *
 *   # SQL unit test (silent, only failures)
 *   node test/main.js sql 1 unit/sql-define_test.js 0
 *
 *   # C automated test
 *   node test/main.js c 2 auto/c-lexer_test.js 1
 *
 *   # SQL automated test
 *   node test/main.js sql 2 auto/sql-lexer_test.js 1
 *
 *   # C npm test
 *   node test/main.js c 3 auto/c-lexer_test.js 1
 *
 *   # Run all tests at once (recommended)
 *   bash test/test.sh
 */

let fs = require('fs');
let rootDirectory = __dirname + "/../";
let testDirectory = rootDirectory + "test/";
let packageDirectory = rootDirectory + "package/";
const args = process.argv.slice(2);
const argLang = args[0].toLowerCase(); // 语言：c | sql | goal
const argTestType = parseInt(args[1]);  // 测试类型：1=单元测试  2=自动化测试  3=Npm测试
const argTestFile = args[2];            // 测试文件路径（相对于 test/ 目录）
const argShowProcess = parseInt(args[3]); // 是否打印详细过程（整数，0=否 1=是）

function runCaseList(lexer, caseList, showProcess) {
    if (showProcess) {
        console.info("\x1b[33m" + "Automated testing has " + caseList.length + ' cases, now is running ...' + "\x1b[33m");
    }

    for (let i = 0; i <= caseList.length - 1; ++i) {
        let outputs = caseList[i].output;
        lexer.start(caseList[i].input);

        let failed = false;
        let tokens = lexer.DFA.result.tokens;
        if (!isNaN(outputs)) {
            failed = outputs !== tokens.length;
        } else {
            for (let j = 0; j <= tokens.length - 1; ++j) {
                if (typeof outputs[j] === 'undefined' || outputs[j].type !== tokens[j].type || outputs[j].value !== tokens[j].value) {
                    failed = true;
                }
            }
        }

        if (failed) {
            console.error("\x1B[1;31m" + 'Case ' + (i + 1) + ': failed | ' + 'input = ' + caseList[i].input + "\x1B[1;31m");
        } else {
            if (showProcess) {
                console.info("\x1B[32m" + 'Case ' + (i + 1) + ': success | ' + 'input = ' + caseList[i].input + "\x1B[0m");
            }
        }
    }
}

if (argShowProcess) {
    console.log("command=\"node test/main.js " + args.join(" ") + "\"");
}

if (argTestType === 1) {
    // ==================== Unit Testing ====================
    // require package/{lang}-define.min.js file
    eval(fs.readFileSync(packageDirectory + argLang + '/' + argLang + '-define.min.js', 'utf8').toString());

    // require test/unit/{lang}-define_test.js file
    eval(fs.readFileSync(testDirectory + argTestFile, 'utf8').toString());

    // run unit testing
    runUnitTesting(argShowProcess);
} else if (argTestType === 2) {
    // ==================== Automated Testing ====================
    // require package/{lang}-lexer.min.js file
    eval(fs.readFileSync(packageDirectory + argLang + '/' + argLang + '-lexer.min.js', 'utf8').toString());

    // require test/auto/{lang}-lexer_test.js file
    eval(fs.readFileSync(testDirectory + argTestFile, 'utf8').toString());

    // create caseList
    let caseList = returnCaseList();

    // run caseList
    runCaseList(lexer, caseList, argShowProcess);
} else if (argTestType === 3) {
    // ==================== Npm Testing ====================
    // require index.js to get npm package exports (cLexer, sqlLexer)
    let npmEntry = require(rootDirectory + "index.js");

    // require testFile
    eval(fs.readFileSync(testDirectory + argTestFile, 'utf8').toString());

    // create caseList
    let caseList = returnCaseList();

    // run caseList
    if (argLang === 'c') {
        runCaseList(npmEntry.cLexer, caseList, argShowProcess);
    } else if (argLang === 'sql') {
        runCaseList(npmEntry.sqlLexer, caseList, argShowProcess);
    }
}
