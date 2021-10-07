const { collections } = require('@wmfs/cardscript-schema')
const parse = require('esprima').parse
const evaluate = require('static-eval')

module.exports = function (cardscript = {}, data = {}) {
  function extractCollection (element) {
    if (collections[element.type]) {
      const collection = element[collections[element.type]]
      if (collection && Array.isArray(collection)) {
        return collection
      }
    }
  } // extractCollection

  function parseElement (element, inheritedShowWhens) {
    const collection = extractCollection(element)
    if (collection) {
      if (element.showWhen) inheritedShowWhens.push(element.showWhen)
      collection.forEach(el => parseElement(el, inheritedShowWhens))
    } else {
      if (element.id && (element.showWhen || inheritedShowWhens.length)) {
        const showWhen = [element.showWhen, ...inheritedShowWhens]
          .filter(s => s)
          .map(s => `(${s})`)
          .join(' && ')

        const ast = parse(showWhen).body[0]
        const res = evaluate(ast, { data })
        if (res === false || res === null || res === undefined) {
          delete data[element.id]
        }
      }
    }
  } // parseElement

  if (cardscript.body) {
    cardscript.body.forEach(el => parseElement(el, []))
  }

  return data
}
