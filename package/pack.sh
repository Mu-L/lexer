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
