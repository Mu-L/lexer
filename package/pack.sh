#!/bin/bash
#
# 打包脚本
#
# 作用：
#   将 src/ 目录下的词法分析器源码和各语言扩展定义，打包合并为 package/ 下的 min.js 文件。
#
# 重要：
#   package/ 下生成的 min.js 文件并非样例或临时产物，而是整个项目的核心构建输出，
#   被以下三个地方直接使用：
#     1. index.js      —— npm 包入口，通过 require() 加载，是 `npm install chain-lexer` 后对外提供的实际能力
#     2. index.html    —— GitHub Pages 展示页，通过 <script src> 引入，驱动在线词法分析演示
#     3. test/main.js  —— 测试入口，加载 min.js 对词法分析结果进行自动化验证
#
# 因此，每次修改 src/ 下的源码后，必须重新执行本脚本，否则上述三处的行为不会更新。
#
# 执行方式（在项目根目录下运行）：
#   bash package/pack.sh
#
# ─────────────────────────────────────────────────────────────
#
# Pack script
#
# Purpose:
#   Combines the lexer source code in src/ with each language extension definition
#   to produce the min.js build artifacts under package/.
#
# Important:
#   The generated min.js files are NOT samples or temporary outputs — they are the
#   core build artifacts of the entire project, used directly by:
#     1. index.js     — npm package entry point; loaded via require(), these files
#                       are the actual capability delivered when users run
#                       `npm install chain-lexer`
#     2. index.html   — GitHub Pages demo page; included via <script src>, they
#                       power the online lexical analysis demo
#     3. test/main.js — test entry point; loads min.js files to run automated
#                       verification of lexical analysis results
#
# Therefore, any changes to source files under src/ MUST be followed by re-running
# this script, or the three consumers above will not reflect the updates.
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
