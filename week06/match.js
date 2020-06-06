// ---------------- KMP 处理未知pattern -------------------
function getCommonLen(string) {
    var prefix = [];
    var suffix = [];
    var res = '';

    for (let i = 0; i < string.length - 1; i++) {
        let char = string[i];
        prefix.push((prefix[prefix.length - 1] || '') + char);
    }

    for (let i = string.length - 1; i > 0; i--) {
        let char = string[i];
        suffix.push(char + (suffix[suffix.length - 1] || ''));
    }

    prefix.forEach(function(item) {
        if (suffix.indexOf(item) != -1) {
            res = item;
        }
    })
    return res.length;
}

function PartialMatchTable(string) {
    var table = [];
    for (let i = 0; i < string.length; i++) {
        table.push(getCommonLen(string.substr(0, i + 1)))
    }
    return table;
    console.log(table);
}

// PartialMatchTable('ABCDABD');

function match(string, pattern) {
    let table = PartialMatchTable(pattern);
    let state = loop;
    let index = 0;
    let move = 0;

    while (move < string.length) {
        state = state(string[move]);
        move++;
    }

    return state === end;

    function loop(c) {
        if (c === pattern[index]) {
            index++;
            if (index == pattern.length) {
                console.log('match start at ' + (move - pattern.length));
                return end;
            } else {
                return loop;
            }
        } else {
            if (index != 0) {
                move = move - table[index - 1] - 1;
                index = 0;
            }
            return loop;
        }
    }

    function end(c) {
        return end;
    }
}

match('BBC ABCDAB ABCDABCDABDE', 'ABCDABD');


// ---------------- 使用有限状态机（FSM）完成 'abababx'  的处理 -------------------
// function match(string) {
//     let state = start;
//     for (let c of string) {
//         state = state(c);
//     }
//     return state === end;
// }

// function start(c) {
//     if (c === 'a') {
//         return foundA;
//     } else {
//         return start;
//     }
// }

// function foundA(c) {
//     if (c === 'b') {
//         return foundB;
//     } else {
//         return start(c);
//     }
// }

// function foundB(c) {
//     if (c === 'a') {
//         return found2A;
//     } else {
//         return start(c);
//     }
// }

// function found2A(c) {
//     if (c === 'b') {
//         return found2B;
//     } else {
//         return start(c);
//     }
// }

// function found2B(c) {
//     if (c === 'a') {
//         return found3A;
//     } else {
//         return start(c);
//     }
// }

// function found3A(c) {
//     if (c === 'b') {
//         return found3B;
//     } else {
//         return start(c);
//     }
// }

// function found3B(c) {
//     if (c === 'x') {
//         return end;
//     } else {
//         return found2B(c);
//     }
// }


// function end(c) {
//     return end;
// }

// match('abababx'); // abababx
// match('ababababx'); // abababx
// match('abababababx'); // abababx

// ----------------------- v2.0 ---------------------
// function match(string) {
//     let state = start;
//     for (let c of string) {
//         state = state(c);
//     }
//     return state === end;
// }

// function start(c) {
//     if (c === 'a') {
//         return foundA;
//     } else {
//         return start;
//     }
// }

// function foundA(c) {
//     if (c === 'b') {
//         return foundB;
//     } else {
//         return start(c);
//     }
// }

// function foundB(c) {
//     if (c === 'c') {
//         return foundC;
//     } else {
//         return start(c);
//     }
// }

// function foundC(c) {
//     if (c === 'a') {
//         return found2A;
//     } else {
//         return start(c);
//     }
// }

// function found2A(c) {
//     if (c === 'b') {
//         return found2B;
//     } else {
//         return start(c);
//     }
// }

// function found2B(c) {
//     if (c === 'x') {
//         return end;
//     } else {
//         return foundB(c);   // 回退到foundB处理当前字符
//     }
// }


// function end(c) {
//     return end;
// }

// match('abcabcabx'); // abcabx



// ------------------ v1.0 ------------------
// function match(string) {
//     for(let c of string) {
//         let foundA = false;
//         let foundB = false;

//         if (c === 'a') {
//             foundA = true;
//         } else if (foundA && c === 'b') {
//             foundB = true;
//         } else if (foundB && c === 'c') {
//             return true;
//         } else {
//             foundA = false;
//             foundB = false;
//         }
//     }
// }

// match('abc');