const functions = require('firebase-functions');
const fetch =  require('node-fetch');
const cheerio = require('cheerio');
const firebaseAdmin = require('firebase-admin');
const { PubSub } = require('@google-cloud/pubsub')
const { WebhookClient } = require('dialogflow-fulfillment')

firebaseAdmin.initializeApp()

const db = firebaseAdmin.database()

const dotaBuffBaseUrl = 'https://www.dotabuff.com'
const dotaBuffHeroesUrl = `${dotaBuffBaseUrl}/heroes`
const dotaBuffHeroesUrlBy = (id) => `${dotaBuffBaseUrl}/heroes/${id}`

const toSlug = (text) => {
  const lower = text.toLowerCase()
  const cleanText = lower.replace("'", '')
  return cleanText.split(' ').join('-')
}

async function fetchHeroById(id) {
  const data = await fetch(dotaBuffHeroesUrlBy(id))
  if (!data.ok) {
    throw new Error('Hero not found')
  }

  const html = await data.text()
  const $ = cheerio.load(html)

  const hero = {
    id
  }

  hero.winRate = parseFloat($('.header-content-secondary span').first().text().trim())
  hero.rank = parseFloat($('.header-content-secondary dd').first().text().trim())

  $('section').each((index, el) => {
    const sectionName = $(el).find('header').text().trim()
    if (sectionName.includes('Best Versus')) {
      hero.bestHeroes = hero.bestHeroes || {}
      $(el).find('tbody tr').each((j, trEl) => {
        const arr = $(trEl).children('td').map((i, td) => $(td).text().trim()).toArray()
        const name = arr[1]
        const id = toSlug(name)
        hero.bestHeroes[id] = {
          id,
          name,
          advantage: parseFloat(arr[2]),
          winRate: parseFloat(arr[3]),
          matches: parseInt(arr[4].replace(',',''),10)
        }
      })
    }

    if (sectionName.includes('Worst Versus')) {
      hero.worstHeroes = hero.worstHeroes || {}
      $(el).find('tbody tr').each((j, trEl) => {
        const arr = $(trEl).children('td').map((i, td) => $(td).text().trim()).toArray()
        const name = arr[1]
        const id = toSlug(name)
        hero.worstHeroes[id] = {
          id,
          name,
          advantage: parseFloat(arr[2]),
          winRate: parseFloat(arr[3]),
          matches: parseInt(arr[4].replace(',',''),10)
        }
      })
    }
  })

  return hero
}

const fetchDotaHeroTopic = 'fetch-dota-hero-topic'
exports.fetchDotaBuffHeroById = functions.pubsub.topic(fetchDotaHeroTopic)
  .onPublish(async (msg) => {
    try {
      const { id } = msg.json
      const hero = await fetchHeroById(id)
      const heroRef = db.ref('/heroes').child(id)
      await heroRef.update(hero)
    } catch (err) {
      console.error(err)
    }
  })

exports.scheduledFetchDotaBuffHeroes = functions.pubsub.schedule('0 3 * * *').onRun( async (context) => {

  const data = await fetch(dotaBuffHeroesUrl)
  const html = await data.text()

  const $ = cheerio.load(html)

  const heroes = $('.hero-grid a').map((_, el) => {
    const name = $(el).text().trim()
    const id = toSlug(name)
    let imageUrl = $(el).find('.hero').css('background')
    imageUrl = imageUrl.replace('url(', '')
    imageUrl = imageUrl.replace(')', '')
    imageUrl = dotaBuffBaseUrl + imageUrl
    return {
      id,
      name,
      imageUrl
    }
  }).toArray()

  const heroesMap = {}
  heroes.forEach(hero => {
    Object.keys(hero).forEach(attr => {
      heroesMap[`${hero.id}/${attr}`] = hero[attr]
    })
  })

  const pubSub = new PubSub({
    projectId : process.env.GCLOUD_PROJECT
  })

  // console.log('Map de atualizacao', heroesMap)

  const publishPromises =heroes.map(hero => {
    return pubSub.topic(fetchDotaHeroTopic).publishJSON({ id : hero.id });
  })

  const heroesRef = db.ref('/heroes')
  await heroesRef.update(heroesMap)
  await Promise.all(publishPromises)
})

function joinOr(names, joiner= 'ou'){
  if(names.length === 0){
    return 0
  }

  if(names.length === 1){
    return names[0]
  }

  if(names.length === 2){
    return names.join(` ${joiner} `)
  }

  if(names.length > 2){
    const firstNames = names.slice(0,-1)
    const lastName = names[names.length - 1]
    return firstNames.join(', ') + ` ${joiner} ` + lastName
  }
}

function pickOne(list){
  const max = list.length
  const pick = Math.floor(Math.random() * max)
  return list[pick]
}

const translation = {
  'en' : {
    'topHeroAnswer' : (names) => `The most used heroes lately are ${joinOr(names)}`,
    'bestHeroThinking' : (names) => `Ok, let me check which heroes are good against ${joinOr(names,'or')}`,
    'bestHeroAnswer' : (names) => {
      const isManyRec = names.length > 1
      return [
        `Humm, looks like ${isManyRec ? 'those heroes are good' : 'this hero is good'} for you to pick, ${joinOr(names,'or')}.`,
        `Try picking ${joinOr(names,'or')}, ${isManyRec ? 'they' : 'this hero'} seems to be a good pick.`,
        `Checking the latest matches, looks like picking ${joinOr(names,'or')} ${isManyRec ? 'are' : 'is'} a good option.`
      ]
    }
  },
  'pt-br': {
    'topHeroAnswer' : (names) => `Os herois mais usados ultimamente são ${joinOr(names)}`,
    'bestHeroThinking' : (names) => `Ok, deixe me checar aqui quais herois são bons contra ${joinOr(names)}`,
    'bestHeroAnswer' : (names) => {
      const isManyRec = names.length > 1
      return [
        `Humm, parece que ${isManyRec ? 'esses herois são bons' : 'esse heroi é bom'} para você pegar, ${joinOr(names)}.`,
        `Parece q se você pegar ${joinOr(names)} você vai ter boas chances.`,
        `Olhando as últimas partidas, parece que ${joinOr(names)} ${isManyRec ? 'são bons' : 'é bom'} neste cenário.`
      ]
    }
  }
}

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response })
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }

  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  /**
   * Best Hero Intent
   * @param {WebhookClient} agent
   */
  async function bestHeroHandler(agent){
    const { locale } = agent
    const { heroes } = agent.parameters
    //const isMany = heroes.length > 1

    async function loadHeroesList(ids){
      const heroesRef = db.ref('/heroes')
      const heroesPromises = ids.map( async (id) => {
        const heroSnap = await heroesRef.child(id).once('value')
        return heroSnap.val()
      })
      return Promise.all(heroesPromises)
    }

    const heroesData = await loadHeroesList(heroes)
    const names = heroesData.map( h => h.name )
    agent.add(translation[locale].bestHeroThinking(names))

    // 1º Strategy - Intersection
    const worstHeroesSet = heroesData.map( hero => {
      const { id, worstHeroes } = hero
      const worstHeroesIds = Object.keys(worstHeroes)
      const set = new Set([...worstHeroesIds])
      return { id, set }
    })

    const intersections = {}
    worstHeroesSet.forEach( heroA => {
      worstHeroesSet.forEach( heroB => {
        if(heroA.id === heroB.id){
          return
        }
        const setA = heroA.set
        const setB = heroB.set
        const intersection = new Set(
          [...setA].filter(x => setB.has(x)))
        const heroesList = Array.from(intersection.values())
        heroesList.forEach( heroId => {
          intersections[heroId] = intersections[heroId] || 0
          intersections[heroId] += 1
        })
      })
    })

    const hasIntersections = Object.keys(intersections).length > 0
    let heroesIds = []
    if(hasIntersections){
      heroesIds = Object.keys(intersections)
    }else{
      const allHeroes = heroesData.map( hero => Object.values(hero.worstHeroes))
        .reduce( (arr, list ) => arr.concat(list) , [])
      allHeroes.sort( (a,b) => b.advantage - a.advantage)
      const topHeroes = new Set()
      allHeroes.forEach( hero => {
        const len = topHeroes.size
        if( !topHeroes.has(hero.id) && len < 3){
          topHeroes.add(hero.id)
        }
      })
      heroesIds = Array.from(topHeroes.values())
    }

    const goodHeroes = await loadHeroesList(heroesIds)
    const goodHeroesNames = goodHeroes.map( h => h.name )
    agent.add(pickOne(translation[locale].bestHeroAnswer(goodHeroesNames)))
  }

  async function topHeroHandler(agent){

    const allHeroesSnap = await db.ref('/heroes').once('value')
    const allHeroes = allHeroesSnap.val()

    const allHeroesData = Object.values(allHeroes)
    allHeroesData.sort( (a,b) => a.rank - b.rank )

    const topHeroes = allHeroesData.slice(0,3)
    const topHeroesNames = topHeroes.map( h => h.name )
    agent.add(`Os herois mais usados ultimamente são ${joinOr(topHeroesNames)}`)
  }

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('BestHero', bestHeroHandler);
  intentMap.set('TopHero', topHeroHandler)
  agent.handleRequest(intentMap);
});
