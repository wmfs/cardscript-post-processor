const { collections } = require('@wmfs/cardscript-schema')
const parse = require('esprima').parse
const evaluate = require('static-eval')

module.exports = function (cardscript = {}, data = {}) {
  const remove = []

  function extractCollection (element) {
    if (collections[element.type]) {
      const collection = element[collections[element.type]]
      if (collection && Array.isArray(collection)) {
        return collection
      }
    }
  } // extractCollection

  function isValuePopulated (value) {
    return value !== null && value !== undefined
  } // isValuePopulated

  function parseElement (element, inheritedShowWhens) {
    const collection = extractCollection(element)
    if (collection) {
      if (element.showWhen) inheritedShowWhens.push(element.showWhen)
      collection.forEach(el => parseElement(el, inheritedShowWhens))
      if (element.showWhen) inheritedShowWhens.pop()
    } else {
      if (element.id && (element.showWhen || inheritedShowWhens.length)) {
        const showWhen = [element.showWhen, ...inheritedShowWhens]
          .filter(s => s)
          .map(s => `(${s})`)
          .join(' && ')

        if (isValuePopulated(data[element.id])) {
          const ast = parse(showWhen).body[0].expression
          const res = evaluate(ast, { data })

          // if (res === undefined) {
          //   console.log('------')
          //   console.log(`ID: ${element.id}`)
          //   console.log(`Data: ${data[element.id]}`)
          //   console.log(`Show when: ${showWhen}`)
          // }

          // static-eval - If the expression contained in ast can't be statically resolved, evaluate() returns undefined
          // So cannot use undefined to decide to remove value from data
          if (res === null || res === false) {
            remove.push(element.id)
          }
        }
      }
    }
  } // parseElement

  if (cardscript.body) {
    cardscript.body.forEach(el => parseElement(el, []))
  }

  for (const key of remove) { data[key] = null }

  return [data, remove]
}
