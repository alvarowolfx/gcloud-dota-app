import * as functions from 'firebase-functions';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import * as firebaseAdmin from 'firebase-admin';

firebaseAdmin.initializeApp()

const dotaBuffBaseUrl = 'https://www.dotabuff.com'
const dotaBuffHeroesUrl = `${dotaBuffBaseUrl}/heroes`
//const dotaBuffHeroesUrlBy = (id: string) => `${dotaBuffBaseUrl}/heroes/${id}`

const toSlug = (text: string) => text.toLowerCase().split(' ').join('-')

export const fetchDotaBuffHeroes = functions.https.onRequest(async (_, res) => {
  const data = await fetch(dotaBuffHeroesUrl)
  const html = await data.text()

  const $ = cheerio.load(html)

  const heroes: Array<any> = $('.hero-grid a').map((_, el: CheerioElement) => {
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

  const db = firebaseAdmin.database()

  const heroesMap: { [key: string]: any } = {}
  heroes.forEach(hero => {
    Object.keys(hero).forEach(attr => {
      heroesMap[`${hero.id}/${attr}`] = hero[attr]
    })
  })

  console.log('Map de atualizacao', heroesMap)

  const heroesRef = db.ref('/heroes')
  await heroesRef.update(heroesMap)

  res.json({ heroes })
})
