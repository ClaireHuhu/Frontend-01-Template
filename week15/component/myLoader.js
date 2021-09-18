var parser = require('./parser.js')

module.exports = function(source, map) {
    let tree = parser.parseHTML(source)

    let script = null;
    let template = null;

    for(let node of tree.children) {
        if (node.tagName == 'template') {
            template = node.children.filter(e => e.type != 'text')[0]
        }
        if (node.tagName == 'script') {
            script = node.children[0].content
        }
    }

    let visit = (node) => {
        if(node.type == 'text') {
            return JSON.stringify(node.content)
        }
        let attrs = {}
        for(let attribute of node.attributes) {
            attrs[attribute.name] = attribute.value
        }
        let children = node.children.map(child => visit(child))
        return `creatElement(${node.tagName},${JSON.stringify(attrs)},${children})`
    }

    console.log(visit(template))

    return `
    import {creatElement, Text, Wrapper} from './createElement'

    export class Carousel{
        render ${visit(template)}
        mountTo (parent) {
            this.render().mountTo(parent)
        }
        setAttribute(name, value) {
            this[name] = value
        }
    }
    `
}