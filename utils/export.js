
const heroes = require('../dota-export.json')
const exampleOutput = [
  {
      "value": "drow-ranger",
      "synonyms": [
          "Drow Ranger",
          "Drow"
      ]
  },
  {
      "value": "abaddon",
      "synonyms": [
          "Abaddon"
      ]
  }
]

const words = new Set()

const output = Object.keys(heroes).map( id => {
  const { name } = heroes[id]
  const synonyms = new Set()
  synonyms.add(name)
  const parts = name.split(' ')
  parts.forEach( p => {
    if(!words.has(p)){
      synonyms.add(p)
      words.add(p)
    }
  })
  return {
    value : id,
    synonyms : Array.from(synonyms.values())
  }
})

console.log(JSON.stringify(output, null, 2))