/* eslint-env mocha */

'use strict'

const extractDefaults = require('@wmfs/cardscript-extract-defaults')
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
      dietaryReqOther: 'oops',
      size: 'S',
      savouryOrSweet: 'SAVOURY',
      base: 'BBQ',
      hot: false,
      howHot: 3,
      toppings: ['JALAPENOS', 'PINEAPPLE'],
      primaryFlavour: 'WHITE_CHOC',
      secondaryFlavour: 'DARK_CHOC',
      sprinkles: false,
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
      sprinkles: false,
      deliveryOrCollection: 'COLLECT'
    },
    expectedRemoved: {
      dietaryReqOther: null,
      howHot: null,
      primaryFlavour: null,
      secondaryFlavour: null
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
      base: 'TOMATO',
      hot: true,
      howHot: null,
      toppings: [],
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
      component3: 'PINK', // the static-eval result returns undefined :-(
      component4: 'ORANGE',
      component5: 'BROWN' // the static-eval result returns undefined :-(
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
  },
  {
    cardscript: require('./fixtures/example-array-find.json'),
    input: {
      colours: ['red', 'blue'],
      number: 4
    },
    output: {
      colours: ['red', 'blue'],
      number: 4
    }
  },
  {
    cardscript: require('./fixtures/example-array-find.json'),
    input: {
      colours: ['red'],
      number: 3
    },
    output: {
      colours: ['red'],
      number: 3 // the static-eval result returns undefined :-(
    }
  },
  {
    cardscript: require('./fixtures/example-api-lookup.json'),
    input: {
      allowLookup: true,
      lookup: {
        loading: false,
        pagination: {
          limit: 10,
          offset: 0,
          page: 1,
          totalPages: 0
        },
        params: {
          filter: 'Homer',
          lookupList: [{ name: 'Homer' }]
        },
        results: [],
        summary: { totalHits: 0 }
      }
    },
    output: {
      allowLookup: true,
      lookup: {
        loading: false,
        pagination: {
          limit: 10,
          offset: 0,
          page: 1,
          totalPages: 0
        },
        params: {
          filter: 'Homer',
          lookupList: [{ name: 'Homer' }]
        },
        results: [],
        summary: { totalHits: 0 }
      }
    }
  },
  {
    cardscript: require('./fixtures/example-api-lookup.json'),
    input: {
      allowLookup: false,
      lookup: {
        loading: false,
        pagination: {
          limit: 10,
          offset: 0,
          page: 1,
          totalPages: 0
        },
        params: {
          filter: 'Homer',
          lookupList: [{ name: 'Homer' }]
        },
        results: [],
        summary: { totalHits: 0 }
      }
    },
    output: {
      allowLookup: false,
      lookup: {
        loading: false,
        pagination: {
          limit: 10,
          offset: 0,
          page: 1,
          totalPages: 0
        },
        params: {
          filter: 'Homer',
          lookupList: [{ name: 'Homer' }]
        },
        results: [],
        summary: { totalHits: 0 }
      }
    }
  },
  {
    cardscript: require('./fixtures/example-empty-array.json'),
    input: {
      optionsCheck: null,
      options: []
    },
    output: {
      optionsCheck: null,
      options: []
    }
  },
  {
    cardscript: require('./fixtures/example-empty-array.json'),
    input: {
      optionsCheck: true,
      options: []
    },
    output: {
      optionsCheck: true,
      options: []
    }
  },
  {
    cardscript: require('./fixtures/example-empty-array.json'),
    input: {
      optionsCheck: false,
      options: []
    },
    output: {
      optionsCheck: false,
      options: []
    }
  },
  {
    cardscript: require('./fixtures/example-empty-array.json'),
    input: {
      optionsCheck: false,
      options: ['A']
    },
    output: {
      optionsCheck: false,
      options: []
    }
  },
  {
    cardscript: require('./fixtures/example-empty-array.json'),
    input: {
      optionsCheck: true,
      options: ['A']
    },
    output: {
      optionsCheck: true,
      options: ['A']
    }
  }
]

describe('Run some Cardscript-post-processor conversions', function () {
  for (const [idx, { cardscript, input, output }] of tests.entries()) {
    it(`Test ${idx + 1}`, async function () {
      const defaults = await extractDefaults(cardscript)
      const [transformedData] = processor(cardscript, input, defaults)
      expect(transformedData).to.eql(output)
      // const nullValues = Object.entries(output).filter(([key, value]) => value === null).map(([key]) => key)
      // expect(nullValues.sort()).to.eql(removed.sort())
    })
  }
})
