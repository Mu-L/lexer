#!/bin/bash
#
# 打包脚本
#
# 作用：
#   将 src/ 下的词法分析器源码与各语言扩展（c/sql/goal）合并打包，
#   每种语言生成两个产物：
#
#   {lang}-lexer.min.js
#     包含完整词法分析器（语言扩展定义 + 核心 lexer），对外暴露 lexer 和 flowModel 对象。
#     用于：执行词法分析，供 index.js（npm包）、index.html（网页演示）、自动化测试使用。
#
#   {lang}-define.min.js
#     同样包含语言扩展定义 + 核心 lexer，但只对外暴露常量和工具对象
#     （ENUM_CONST / CHARSET_CONST / DFA_STATE_CONST / tool / flowModel），不暴露 lexer。
#     用于：单元测试，验证词法定义本身是否正确，不需要跑完整的词法分析流程。
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
#     Contains the full lexer (language extension + core lexer engine). Exposes the
#     lexer object and flowModel (DFA state flow log) globally. Used by: index.js
#     (npm package), index.html (web demo), and automated tests.
#
#   {lang}-define.min.js
#     Contains the same source but only exposes constants and utilities
#     (ENUM_CONST / CHARSET_CONST / DFA_STATE_CONST / tool / flowModel) — not lexer.
#     Used by: unit tests to verify that lexical definitions are correct, without
#     running a full lexical analysis.
#
# Important:
#   Any changes to src/ MUST be followed by re-running this script.
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
