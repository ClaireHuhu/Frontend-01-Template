const EOF = Symbol('EOF');

function data(c) {

}

module.exports.parseHTML = function(string) {
    console.log('--------res---------');
    console.log(res);

    let state = data;
    for (let c of string) {
        state = state(c);
    }

    state = state(EOF); //用Symbol标示结束，将状态机置为结束状态，避免状态机还处于等待状态

}