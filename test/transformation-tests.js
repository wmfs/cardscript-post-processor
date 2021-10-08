/* eslint-env mocha */

'use strict'

const processor = require('./../lib/')
const chai = require('chai')
const expect = chai.expect

const tests = [
  {
    cardscript: require('./fixtures/example-1.json'),
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
      dietaryReqOther: null,
      size: 'S',
      savouryOrSweet: 'SAVOURY',
      base: 'BBQ',
      hot: false,
      howHot: null,
      toppings: ['JALAPENOS', 'PINEAPPLE'],
      primaryFlavour: null,
      secondaryFlavour: null,
      sprinkles: null,
      deliveryOrCollection: 'COLLECT'
    }
  },
  {
    cardscript: require('./fixtures/example-1.json'),
    input: {
      name: 'Homer Simspon',
      phoneNumber: '07123456789',
      dietaryReq: ['GLUTEN_FREE', 'OTHER'],
      dietaryReqOther: 'Other...',
      size: 'M',
      savouryOrSweet: 'SWEET',
      base: 'TOMATO',
      hot: true,
      howHot: 3,
      toppings: ['JALAPENOS', 'PINEAPPLE'],
      primaryFlavour: 'WHITE_CHOC',
      secondaryFlavour: 'DARK_CHOC',
      sprinkles: false,
      deliveryOrCollection: 'DELIVER'
    },
    output: {
      name: 'Homer Simspon',
      phoneNumber: '07123456789',
      dietaryReq: ['GLUTEN_FREE', 'OTHER'],
      dietaryReqOther: 'Other...',
      size: 'M',
      savouryOrSweet: 'SWEET',
      base: null,
      hot: null,
      howHot: null,
      toppings: null,
      primaryFlavour: 'WHITE_CHOC',
      secondaryFlavour: 'DARK_CHOC',
      sprinkles: false,
      deliveryOrCollection: 'DELIVER'
    }
  },
  {
    cardscript: require('./fixtures/example-2.json'),
    input: {
      component1: 'RED',
      component3: 'PINK',
      component4: 'ORANGE',
      component5: 'BROWN'
    },
    output: {
      component1: 'RED',
      component3: null,
      component4: 'ORANGE',
      component5: null
    }
  },
  {
    cardscript: require('./fixtures/example-3.json'),
    input: {
      telNum: '07123456789',
      name: 'Marge Simpson',
      usesChipPanOrDeepFatFryer: 'NO',
      electricBlanketsUsed: 'YES',
      hearingImpairmentInHousehold: 'NO',
      hearingImpairmentEquipmentRequired: 'YES',
      numberOfSmokeAlarms: 3,
      numberOfFloors: 2,
      smokeAlarmsOnEachStorey: 'YES',
      numberOfFloorsWithoutSmokeAlarms: 1,
      ableToTestNow: 'YES_WORKING',
      numberOfAlarmsFailedTesting: 1
    },
    output: {
      telNum: '07123456789',
      name: 'Marge Simpson',
      usesChipPanOrDeepFatFryer: 'NO',
      electricBlanketsUsed: 'YES',
      hearingImpairmentInHousehold: 'NO',
      hearingImpairmentEquipmentRequired: null,
      numberOfSmokeAlarms: 3,
      numberOfFloors: null,
      smokeAlarmsOnEachStorey: 'YES',
      numberOfFloorsWithoutSmokeAlarms: null,
      ableToTestNow: 'YES_WORKING',
      numberOfAlarmsFailedTesting: 1
    }
  },
  {
    cardscript: require('./fixtures/example-3.json'),
    input: {
      telNum: '07123456789',
      name: 'Marge Simpson',
      usesChipPanOrDeepFatFryer: 'NO',
      electricBlanketsUsed: 'YES',
      hearingImpairmentInHousehold: 'YES',
      hearingImpairmentEquipmentRequired: 'NO',
      numberOfSmokeAlarms: 0,
      numberOfFloors: 2,
      smokeAlarmsOnEachStorey: 'YES',
      numberOfFloorsWithoutSmokeAlarms: 1,
      ableToTestNow: 'YES_WORKING',
      numberOfAlarmsFailedTesting: 1
    },
    output: {
      telNum: '07123456789',
      name: 'Marge Simpson',
      usesChipPanOrDeepFatFryer: 'NO',
      electricBlanketsUsed: 'YES',
      hearingImpairmentInHousehold: 'YES',
      hearingImpairmentEquipmentRequired: 'NO',
      numberOfSmokeAlarms: 0,
      numberOfFloors: 2,
      smokeAlarmsOnEachStorey: null,
      numberOfFloorsWithoutSmokeAlarms: null,
      ableToTestNow: null,
      numberOfAlarmsFailedTesting: null
    }
  }
]

describe('Run some Cardscript-post-processor conversions', function () {
  for (const [idx, { cardscript, input, output }] of tests.entries()) {
    it(`Test ${idx}`, function () {
      const [transformedData, removed] = processor(cardscript, input)
      expect(transformedData).to.eql(output)
      const nullValues = Object.entries(output).filter(([key, value]) => value === null).map(([key]) => key)
      expect(nullValues.sort()).to.eql(removed.sort())
    })
  }
})
