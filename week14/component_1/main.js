/************************  1.0  ******************************/
// function create() {
//     console.log(arguments);// ["div",{id:'a'}] 小写div
// }

// let component = <div id = 'a'></div>

/*************************  2.0  *****************************/

// function create() {
//     console.log(arguments);// [f Div(),{id:'a'}] 大写Div
// }

// class Div{   // class需要写在compont前面，不然出入create的是undefined
// }

// let component = <Div id = 'a'/>

// console.log(component)

/**************************m 3.0  *****************************/
// function create(Cls, attributes) {  // 根据上面的分析，得到传入的参数
//    let o = new Cls;

//    for(let name in attributes) {
//     //    o[name] = attributes[name];  // property 和 attribute 统一
//     o.setAttribute(name,attributes[name]); // property  和 attribute 分开
//    }
//    return o;
// }

// class Div{ 
//     constructor(){

//     }
//     set class(value) {
//         console.log('class value',value)
//     }
//     setAttribute(name,value) {
//         console.log(name,value);
//     }
// }

// let component = <Div id = 'a' class='test'/>

// console.log(component)

/*************************** 4.0 *************************** */

// class Child {

// }
// class Parent {

// }
// function create(Cls, attributes) { // 当有嵌套时，Child 先调用create，返回值，作为Parent调用时的第三个参数传入
//     console.log(arguments)
//     let o = new Cls();
//     return o;
// }

// let component = <Parent id='a' class='test' >
//     <Child class='b'> </Child>
//     <Child class='b'> </Child>
//     </Parent>

// console.log(component)

// // 0: ƒ Parent()
// // 1: {id: "a", class: "test"}
// // 2: Child {}
// // 3: Child {}

/*************************** 5.0 ****************************** */
class Child {
    set class(v) { // property
        console.log('Parent::class',v)
    }
    setAttribute(name,value) { // attribute
        console.log(name,value);
    }
    appendChild(child) {  // child
        console.log('Parent::appendChild',child)
    }
}
class Parent {
    set class(v) { // property
        console.log('Parent::class',v)
    }
    setAttribute(name,value) { // attribute
        console.log(name,value);
    }
    appendChild(child) {  // child
        console.log('Parent::appendChild',child)
    }
}
function create(Cls, attributes, children) { // 当有嵌套时，Child 先调用create，返回值，作为Parent调用时的第三个参数传入
    let o = new Cls();
    for(let name in attributes) {
        o.setAttribute(name, attributes[name])
    }
    for(let child in children) {
        o.appendChild(child)
    }
    return o;
}

let component = <Parent id='a' class='test' >
    <Child class='b'> </Child>
    <Child class='b'> </Child>
    </Parent>

console.log(component)