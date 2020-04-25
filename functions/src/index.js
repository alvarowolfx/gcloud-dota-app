const functions = require('firebase-functions');
const fetch =  require('node-fetch');
const cheerio = require('cheerio');
const firebaseAdmin = require('firebase-admin');
const { PubSub } = require('@google-cloud/pubsub')

firebaseAdmin.initializeApp()

const db = firebaseAdmin.database()

const dotaBuffBaseUrl = 'https://www.dotabuff.com'
const dotaBuffHeroesUrl = `${dotaBuffBaseUrl}/heroes`
const dotaBuffHeroesUrlBy = (id) => `${dotaBuffBaseUrl}/heroes/${id}`

const toSlug = (text) => text.toLowerCase().split(' ').join('-')

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
