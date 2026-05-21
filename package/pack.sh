#!/bin/bash
#
# 打包脚本
#
# 作用：
#   将 src/ 下的词法分析器源码与各语言扩展（c/sql/goal）合并打包，
#   生成 package/{lang}/{lang}-lexer.min.js 和 package/{lang}/{lang}-define.min.js。
#
# 重要：
#   生成的 min.js 文件不是样例，是项目的核心构建产物，被以下三处直接使用：
#     1. index.js     —— npm 包入口，通过 require() 加载，是发布到 npm 后的实际能力
#     2. index.html   —— GitHub Pages 展示页，通过 <script src> 引入，驱动在线演示
#     3. test/main.js —— 测试入口，加载 min.js 进行自动化验证
#
#   每次修改 src/ 下的源码后，必须重新执行本脚本，否则上述三处不会更新。
#
# 执行方式（在项目根目录下运行）：
#   bash package/pack.sh
#
# ─────────────────────────────────────────────────────────────
#
# Pack script
#
# Purpose:
#   Combines the lexer source in src/ with each language extension (c/sql/goal)
#   to produce {lang}-lexer.min.js and {lang}-define.min.js under package/{lang}/.
#
# Important:
#   The generated min.js files are the core build artifacts of this project,
#   used directly by:
#     1. index.js     — npm package entry; loaded via require(), these files are
#                       the actual capability delivered by `npm install chain-lexer`
#     2. index.html   — GitHub Pages demo; included via <script src> to power the
#                       online lexical analysis demo
#     3. test/main.js — test entry; loads min.js files to run automated verification
#
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
