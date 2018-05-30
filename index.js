const prettyjson = require('prettyjson')

function createElement(type, props = {}, ...children) {
  return { type, props, children }
}

function render(vdom, parent = null) {
  if (parent) parent.textContent = ''
  const mount = parent ? (el => parent.appendChild(el)) : (el => el)
  
  if (typeof vdom === 'string' || typeof vdom === 'number') {
    return mount(document.createTextNode(vdom))
  } else if (typeof vdom === 'boolean' || typeof vdom === 'null') {
    return mount(document.createTextNode(''))
  } else if (typeof vdom === 'object' && typeof vdom.type === 'function') {
    return mount(Component.render(vdom))
  } else if (typeof vdom === 'object' && typeof vdom.type === 'string') {
    const dom = document.createElement(vdom.type)
    for (const child of [].concat(...vdom.children)) dom.appendChild(render(child))
    for (const prop in vdom.props) setAttribute(dom, prop, vdom.props[prop])
    return mount(dom)
  } else {
    throw new Error(`Invalid VDOM: ${vdom}.`)
  }
}

function setAttribute(dom, key, value) {
  if (typeof value === 'function' && key.startsWith('on')) {
    const eventType = key.slice(2).toLowerCase()
    dom.__recatHandlers = dom.__recatHandlers || {}
    dom.removeEventListener(eventType, dom.__recatHandlers[eventType])
    dom.__recatHandlers[eventType] = value
    dom.addEventListener(eventType, dom.__recatHandlers[eventType])
  } else if (key === 'checked' || key === 'value' || key === 'id') {
    dom[key] = value
  } else if (key === 'key') {
    dom.__recatKey = value
  } else if (typeof value !== 'object' && typeof value !== 'function') {
    dom.setAttribute(key, value)
  }
}





// Run
const checkbox = createElement('input', { type: 'checkbox', checked: 1 })

const sublist = createElement('ol', { className: 'sublist' },
  createElement('li', { className: 'sublist-item' }, checkbox),
  createElement('li', { className: 'sublist-item', onClick: () => alert('sub two') }, 'Sub Two')
)

const list = createElement('ul', { className: 'list' },
  createElement('li', { className: 'list-item', onClick: () => alert('one') }, 'One'),
  createElement('li', { className: 'list-item' }, 'Two'),
  createElement('li', { className: 'list-item' }, sublist)
)


// console.log(prettyjson.render(list))
document.querySelector('body').appendChild(render(list))
