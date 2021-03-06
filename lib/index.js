const { collections } = require('@wmfs/cardscript-schema')
const parse = require('esprima').parse
const evaluate = require('static-eval')
const ignoreList = ['Input.ApiLookup', 'CardList']

module.exports = function (cardscript = {}, data = {}, defaults = {}) {
  const toRemove = []
  const removed = {}

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
      // Need to acknowledge ignoreList, but need to introduce data path/dottie usage as values can be nested
      if (element.id && (element.showWhen || inheritedShowWhens.length) && !ignoreList.includes(element.type)) {
        const showWhen = [element.showWhen, ...inheritedShowWhens]
          .filter(s => s)
          .map(s => `(${s})`)
          .join(' && ')

        // Ignore default (element.value)
        if (isValuePopulated(data[element.id]) && !isValuePopulated(element.value)) {
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
            toRemove.push(element.id)
          }
        }
      }
    }
  } // parseElement

  if (cardscript.body) {
    cardscript.body.forEach(el => parseElement(el, []))
  }

  for (const key of toRemove) {
    const defaultValue = defaults.rootView ? defaults.rootView[key] : null
    data[key] = isValuePopulated(defaultValue) ? defaultValue : null
    removed[key] = isValuePopulated(defaultValue) ? defaultValue : null
  }

  return [data, removed]
}
