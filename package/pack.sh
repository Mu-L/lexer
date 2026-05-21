#!/bin/bash
#
# 打包脚本
#
# 作用：
#   将 src/ 下的词法分析器源码与各语言扩展（c/sql/goal）合并打包，
#   每种语言生成两个产物：
#
#   {lang}-lexer.min.js
#     面向"执行词法分析并获得结果"的场景。包含完整词法分析器，暴露 lexer 和 flowModel。
#     调用 lexer.start(code) 即可对输入代码进行词法分析，通过 lexer.DFA.result.tokens 获取 token 列表，
#     通过 flowModel.result.paths 获取 DFA 状态流转的详细日志。
#     供 index.js（npm包）、index.html（网页演示）、自动化测试使用。
#
#   {lang}-define.min.js
#     面向"了解词法分析内部细节"的场景。暴露各语言内部定义的常量和工具对象
#     （ENUM_CONST / CHARSET_CONST / DFA_STATE_CONST / tool / flowModel），不暴露 lexer。
#     主要用于内部单元测试，保证词法定义的稳定性；同时也可对外开放，
#     让使用者查阅某语言具体定义了哪些 Token 类型、字符集、DFA 状态流转等词法分析细节。
#
# 重要：
#   每次修改 src/ 下的源码后，必须重新执行本脚本，否则上述产物不会更新。
#
# 执行方式（在项目根目录下运行）：
#   bash package/pack.sh
#
# ─────────────────────────────────────────────────────────────
#
# Pack script
#
# Purpose:
#   Combines the lexer source in src/ with each language extension (c/sql/goal).
#   Two output files are produced per language:
#
#   {lang}-lexer.min.js
#     For the "run lexical analysis and get results" use case. Contains the full lexer
#     and exposes lexer and flowModel. Call lexer.start(code) to analyze input, then
#     read lexer.DFA.result.tokens for the token list, or flowModel.result.paths for
#     the detailed DFA state transition log.
#     Used by: index.js (npm package), index.html (web demo), and automated tests.
#
#   {lang}-define.min.js
#     For the "inspect lexical analysis internals" use case. Exposes the constants and
#     utilities defined inside each language extension
#     (ENUM_CONST / CHARSET_CONST / DFA_STATE_CONST / tool / flowModel) — not lexer.
#     Primarily used for internal unit tests to ensure lexical definitions stay stable.
#     Can also be used externally by anyone who wants to inspect what token types,
#     charsets, DFA states, and other lexical details a language defines.
#
# Important:
#   Any changes to src/ MUST be followed by re-running this script.
#
# Usage (run from project root):
#   bash package/pack.sh
#
# Usage (run from project root):
#   bash package/pack.sh
#

# check and install uglify-js
if ! command -v uglifyjs &> /dev/null; then
    echo "uglifyjs not found, installing..."
    npm install uglify-js -g
fi


# remove previously generated files
rm -f package/sql/sql-lexer.min.js
rm -f package/goal/goal-lexer.min.js

rm -f package/c/c-define.min.js
rm -f package/sql/sql-define.min.js
rm -f package/goal/goal-define.min.js

# run pack
node package/main.js

# compress files to one line file
# please install: npm install uglify-js -g
uglifyjs package/c/c-lexer.min.js -o package/c/c-lexer.min.js
uglifyjs package/sql/sql-lexer.min.js -o package/sql/sql-lexer.min.js
uglifyjs package/goal/goal-lexer.min.js -o package/goal/goal-lexer.min.js

uglifyjs package/c/c-define.min.js -o package/c/c-define.min.js
uglifyjs package/sql/sql-define.min.js -o package/sql/sql-define.min.js
uglifyjs package/goal/goal-define.min.js -o package/goal/goal-define.min.js


echo "Congratulations! Pack Success!"
echo -e
