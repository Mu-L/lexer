#!/bin/bash
#
# 测试脚本
#
# 作用：
#   按顺序执行全部测试用例，主要包括单元测试、自动化测试、Npm测试这三种测试类型，任意一个测试失败则立即退出并提示，全部通过后打印成功信息。
#
# 执行方式（在项目根目录下运行）：
#   bash test/test.sh
#
# ─────────────────────────────────────────────────────────────
#
# Test script
#
# Purpose:
#   Runs all test cases in order, covering three test types, Unit Testing, Auto Testing, and Npm Testing. Exits immediately on the first failure with a message; prints a success message if all pass.
#
# Usage (run from project root):
#   bash test/test.sh
#

node test/main.js c 1 unit/c-define_test.js 1
result=`node test/main.js c 1 unit/c-define_test.js 0 2>&1 | grep 'failed'`
if [ -n "$result" ]; then
    echo "==========Unfortunately, you failed the test=========="
    exit 1
fi
echo -e

node test/main.js goal 1 unit/goal-define_test.js 1
result=`node test/main.js goal 1 unit/goal-define_test.js 0 2>&1 | grep 'failed'`
if [ -n "$result" ]; then
    echo "==========Unfortunately, you failed the test=========="
    exit 1
fi
echo -e

node test/main.js sql 1 unit/sql-define_test.js 1
result=`node test/main.js sql 1 unit/sql-define_test.js 0 2>&1 | grep 'failed'`
if [ -n "$result" ]; then
    echo "==========Unfortunately, you failed the test=========="
    exit 1
fi
echo -e

node test/main.js c 2 auto/c-lexer_test.js 1
result=`node test/main.js c 2 auto/c-lexer_test.js 0 2>&1 | grep 'failed'`
if [ -n "$result" ]; then
    echo "==========Unfortunately, you failed the test=========="
    exit 1
fi
echo -e

node test/main.js goal 2 auto/goal-lexer_test.js 1
result=`node test/main.js goal 2 auto/goal-lexer_test.js 0 2>&1 | grep 'failed'`
if [ -n "$result" ]; then
    echo "==========Unfortunately, you failed the test=========="
    exit 1
fi
echo -e

node test/main.js sql 2 auto/sql-lexer_test.js 1
result=`node test/main.js sql 2 auto/sql-lexer_test.js 0 2>&1 | grep 'failed'`
if [ -n "$result" ]; then
    echo "==========Unfortunately, you failed the test=========="
    exit 1
fi
echo -e

node test/main.js c 3 auto/c-lexer_test.js 1
result=`node test/main.js c 3 auto/c-lexer_test.js 0 2>&1 | grep 'failed'`
if [ -n "$result" ]; then
    echo "==========Unfortunately, you failed the test=========="
    exit 1
fi
echo -e

node test/main.js sql 3 auto/sql-lexer_test.js 1
result=`node test/main.js sql 3 auto/sql-lexer_test.js 0 2>&1 | grep 'failed'`
if [ -n "$result" ]; then
    echo "==========Unfortunately, you failed the test=========="
    exit 1
fi
echo -e

echo "Congratulations! Test Success!"
echo -e