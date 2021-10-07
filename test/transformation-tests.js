/* eslint-env mocha */

'use strict'

const processor = require('./../lib/')
const chai = require('chai')
const expect = chai.expect
const examples = require('@wmfs/cardscript-examples')

const tests = [
  {
    cardscript: examples.complex,
    input: {
      name: 'Homer Simspon',
      phoneNumber: '07123456789',
      dietaryReq: ['GLUTEN_FREE'],
      dietaryReqOther: 'oops', // expect to be removed
      size: 'S',
      savouryOrSweet: 'SAVOURY',
      base: 'BBQ',
      hot: false, // expect to be removed
      howHot: 3,
      toppings: ['JALAPENOS', 'PINEAPPLE'],
      primaryFlavour: 'WHITE_CHOC', // expect to be removed
      secondaryFlavour: 'DARK_CHOC', // expect to be removed
      sprinkles: false, // expect to be removed
      deliveryOrCollection: 'COLLECT'
    },
    output: {
      name: 'Homer Simspon',
      phoneNumber: '07123456789',
      dietaryReq: ['GLUTEN_FREE'],
      size: 'S',
      savouryOrSweet: 'SAVOURY',
      base: 'BBQ',
      hot: false,
      toppings: ['JALAPENOS', 'PINEAPPLE'],
      deliveryOrCollection: 'COLLECT'
    }
  },
  {
    cardscript: {
      body: [
        {
          id: 'component1',
          type: 'Input.Text'
        },
        {
          showWhen: 'component1 === \'RED\'',
          type: 'Container',
          items: [
            {
              id: 'component2',
              type: 'Input.Text'
            },
            {
              showWhen: 'component2 === \'BLUE\'',
              id: 'component3',
              type: 'Input.Text'
            }
          ]
        },
        {
          type: 'Container',
          items: [
            {
              id: 'component4',
              type: 'Input.Text'
            },
            {
              showWhen: 'component4 === \'YELLOW\'',
              id: 'component5',
              type: 'Input.Text'
            }
          ]
        }
      ]
    },
    input: {
      component1: 'RED',
      component3: 'PINK',
      component4: 'ORANGE',
      component5: 'BROWN'
    },
    output: {
      component1: 'RED',
      component4: 'ORANGE'
    }
  }
]

describe('Run some Cardscript-post-processor conversions', function () {
  for (const [idx, { cardscript, input, output }] of tests.entries()) {
    it(`Test ${idx}`, function () {
      const transformedData = processor(cardscript, input)
      expect(transformedData).to.eql(output)
    })
  }
})
