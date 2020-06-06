// 使用有限状态机（FSM）完成 'abababx'  的处理
function match(string) {
    let state = start;
    for (let c of string) {
        state = state(c);
    }
    return state === end;
}

function start(c) {
    if (c === 'a') {
        return foundA;
    } else {
        return start;
    }
}

function foundA(c) {
    if (c === 'b') {
        return foundB;
    } else {
        return start(c);
    }
}

function foundB(c) {
    if (c === 'a') {
        return found2A;
    } else {
        return start(c);
    }
}

function found2A(c) {
    if (c === 'b') {
        return found2B;
    } else {
        return start(c);
    }
}

function found2B(c) {
    if (c === 'a') {
        return found3A;
    } else {
        return start(c);
    }
}

function found3A(c) {
    if (c === 'b') {
        return found3B;
    } else {
        return start(c);
    }
}

function found3B(c) {
    if (c === 'x') {
        return end;
    } else {
        return found2B(c);
    }
}


function end(c) {
    return end;
}

match('abababx'); // abababx
match('ababababx'); // abababx
match('abababababx'); // abababx

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