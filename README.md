# lexer

It is a lexical analyzer based on ```DFA``` that made by ```JS``` and supports multi-language extension. For quick understanding and experience , please check the [online website](https://wgrape.github.io/lexer/)

Document ：[中文](/README.zh-CN.md) / [English](/README.md) 

![img](https://img.shields.io/badge/JavaScript-ES5+-blue.svg) &nbsp; [![Build Status](https://app.travis-ci.com/WGrape/lexer.svg?branch=main)](https://app.travis-ci.com/github/WGrape/lexer) &nbsp; ![img](https://img.shields.io/github/v/release/wgrape/lexer) &nbsp; ![img](https://img.shields.io/badge/Document-中文/English-orange.svg) &nbsp; ![GitHub](https://img.shields.io/github/license/WGrape/lexer)

## Contents

- [1、Background](#1)
- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[(1) Situation](#11)
- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[(2) Task](#12)
- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[(3) Solution](#13)
- [2、Features](#2)
- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[(1) Complete lexical analysis](#21)
- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[(2) Support multi-language extension](#22)
- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[(3) Provide state flow log](#23)
- [3、Get project](#3)
- [4、Ussage](#4)
- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[(1) In your project](#41)
- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[(2) Web preview and testing](#42)
- [5、Contributions](#5)
- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[(1) Project Statistics](#51)
- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[(2) Source code explanation](#52)
- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[(3) Content contribution](#53)
- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[(4) Release version](#54)
- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[(5) Q&A](#55)
- [6、License](#6)

## <span id="1">1、Background</span>

### <span id="11">(1) Situation</span>

Most lexical analyzers are closely coupled with the language, the amount of code is relatively large. It's hard to pay attention to the essential principles of lexical analyzer.

### <span id="12">(2) Task</span>

In order to focus on the working principle of lexical analyzer , not to consider the small differences caused by different languages , an idea of making a ```lexer``` project that is completely decoupled from the language was born.

### <span id="13">(3) Solution</span>

```lexer``` through the following two files, realize the decoupling of lexical analyzer and language

- ```lexer.js``` is the core part of lexical analyzer within 300 lines, including ```ISR``` and ```DFA```
- ```lang/{lang}-define.js```is the language extension of lexical analyzer. Support different languages，such as ```lang/c-define.js```

## <span id="2">2、Features</span>

### <span id="21">(1) Complete lexical analysis</span>

From inputting the character sequence to generating ```token``` after the analysis, ```lexer``` has complete steps for lexical analysis, and 11 token types for most language extensions

![img](/doc/image/c-tokens.png)

### <span id="22">(2) Support multi-language extension</span>

```lexer``` supports different language extensions such as ```Python```, ```Go```, etc. How to make different language extensions, please check [Contributions](#5)

- C ：A popular programming language，[click here](https://wgrape.github.io/lexer/?lang=c) to see its lexical analysis
- SQL ：A popular database query language，[click here](https://wgrape.github.io/lexer/?lang=sql) to see its lexical analysis
- Goal ：A goal parser problem from leetCode ，[click here](https://wgrape.github.io/lexer/?lang=goal) to see its lexical analysis

### <span id="23">(3) Provide state flow log</span>

The core mechanism of lexical analyzer is based on the state flow of ```DFA```. For this reason, ```lexer``` records detailed state flow log to achieve the following requirements of you

- Debug mode
- Automatically generate ```DFA``` state flow diagram

<img width="700" src="https://user-images.githubusercontent.com/35942268/136378451-e025fffd-425d-43f1-8a58-454a1011e9c3.png" />

## <span id="3">3、Get project</span>

After ```git clone``` command, no need for any dependencies, and no extra installation steps

## <span id="4">4、Ussage</span>

### <span id="41">(1) In your project</span>

If you need use ```lexer``` in your project, such as code editor, etc. Import the following files in order

- ```/lang/{lang}-define.js```
- ```lexer.js```

then visit ```lexer``` variable to get the object of lexical analyzer，and visit ```lexer.DFA.result.tokens``` to get ```tokens```

```js
// 1. The code that needs lexical analysis
let stream = "int a = 10;";

// 2. Start lexical analysis
lexer.start(strem);

// 3. After the lexical analysis is done, get the generated tokens
let parsedTokens = lexer.DFA.result.tokens;

// 4. Do what you want to do
parsedTokens.forEach((token) => {
    // ... ...
});
```

The [Provide state flow log](#23) part in features，visit ```flowModel.result.paths``` will get the detail logs of state flow inside ```lexer```. The data format is as follows

```js
[
    {
        state: 0, // now state
        ch: "a", // read char
        nextSstate: 2, // next state
        match: true, // is match
        end: false, // is last char
    },
    // ... ...
]
```

### <span id="42">(2) Web preview and testing</span>

> The automated testing will be automatically completed before the page is opened, open your browser console to see the result of testing

In order to observe the result of ```lexer``` in real time, and to debug and test, there is a ```index.html``` file in the root directory of this project. Open it directly in your browser, and after entering the code will automatically output the ```Token``` generated after ```lexer``` analysis, as shown in the figure below

```c
int a = 10;
int b =20;
int c = 20;

float f = 928.2332;
char b = 'b';

if(a == b){
    printf("Hello, World!");
}else if(b!=c){
    printf("Hello, World! Hello, World!");
}else{
    printf("Hello!");
}
```

![img](/doc/image/show-v2.gif)

or check the [online website](wgrape.github.io/lexer/)

## <span id="5">5、Contributions</span>

### <span id="51">(1) Project Statistics</span>
As of October 1, 2021, this project has obtained about 80 clones in one month, with 100 visitors and 400 visits (data will be updated continuously). The growth process of the number of Stars is as follows

<a href="https://starchart.cc/WGrape/lexer"><img src="https://starchart.cc/WGrape/lexer.svg" width="700"></a>

### <span id="52">(2) Source code explanation</span>
Documents about source code development, project design, unit testing, automated testing, development specifications, and how to make extensions in different languages, please read [source code explanation](/doc/explain.md)

### <span id="53">(3) Content contribution</span>
- Add more new features
- Add more extensions ```/lang/{lang}-define.js```

### <span id="54">(4) Release version</span>
The project is released with the version number of ```A-B-C```，regarding release log, you can check the [CHANGELOG](./CHANGELOG.md) or the [release record](https://github.com/WGrape/lexer/releases)

- ```A```：Major upgrade
- ```B```：Minor upgrade
- ```C```：bug fix / features / ...

### <span id="55">(5) Q&A</span>
If you have any problems or questions, please [submit an issue](https://github.com/WGrape/lexer/issues/new)

## <span id="6">6、License</span>

![GitHub](https://img.shields.io/github/license/WGrape/lexer)
