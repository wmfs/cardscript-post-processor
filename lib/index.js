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
          const ast = parse(showWhen).body[0]
          const res = evaluate(ast, { data })

          if (!isValuePopulated(res) || res === false) {
            remove.push(element.id)
          }
        }
      }
    }
  } // parseElement

  if (cardscript.body) {
    cardscript.body.forEach(el => parseElement(el, []))
  }

  console.log(`Removing ${remove.length} hidden values ${remove.join(', ')}`)

  for (const key of remove) { data[key] = null }

  return data
}
