import { atom, selector, useRecoilValueLoadable, useRecoilState } from 'recoil'

import { heroesSelector } from './heroes'

const BASE_URL = "https://dota-recommendation-api-m423ptj4pq-uc.a.run.app"

const enemyHeroesState = atom({
  key: 'enemyHeroesState',
  default: [],
});

const teamHeroesState = atom({
  key : 'teamHeroesState',
  default : []
})

export const enemyHeroesSelector = selector({
  key: 'enemyHeroesSelector',
  get: ({get}) => {
    return get(enemyHeroesState)
  }
})

export const teamHeroesSelector = selector({
  key: 'teamHeroesSelector',
  get: ({get}) => {
    return get(teamHeroesState)
  }
})

const recommendedHeroesSelector = selector({
  key : 'recommendedHeroesSelector',
  get: async({ get }) => {
    const enemies = get(enemyHeroesState)
    const team = get(teamHeroesState)

    if(enemies.length === 0){
      return []
    }

    const url = `${BASE_URL}/recommendation?enemies=${enemies.join(',')}&team=${team.join(',')}`

    const res = await fetch(url)
    if(res.ok){
      const json = await res.json()
      return Object.keys(json)
    }
    return []
  }
})

export function useRecommendedHeroes() {
  const recommendedHeroes = useRecoilValueLoadable(recommendedHeroesSelector)
  const isRecommendedHeroesLoading = recommendedHeroes.state === 'loading'
  const recommendHeroesIds = recommendedHeroes.state === 'hasValue'  ? recommendedHeroes.contents : []
  return [isRecommendedHeroesLoading, recommendHeroesIds]
}

export const useTeamBuilderActions = () => {
  const [enemies, setEnemies] = useRecoilState(enemyHeroesState)
  const [team, setTeam] = useRecoilState(teamHeroesState)

  const addEnemyHero = (id) => {
    const enemiesList = enemies
    if(enemiesList.length < 5){
      const nEnemyList = enemiesList.filter( enemyId => enemyId !== id)
      setEnemies([...nEnemyList, id])
    }
  }

  const removeEnemyHero = (id) => {
    const enemiesList = enemies.filter(enemyId => enemyId !== id)
    setEnemies([...enemiesList])
  }

  const addTeamHero = (id) => {
    const teamList = team
    if(teamList.length < 5){
      const nTeamList = teamList.filter( heroId => heroId !== id)
      setTeam([...nTeamList, id])
    }
  }

  const removeTeamHero = (id) => {
    const teamList = team.filter(heroId => heroId !== id)
    setTeam([...teamList])
  }

  const resetBuilder = () => {
    setTeam([])
    setEnemies([])
  }

  return {
    addEnemyHero,
    removeEnemyHero,
    addTeamHero,
    removeTeamHero,
    resetBuilder
  }
}

export const availableHeroesIdsSelector = selector({
  key: 'availableHeroesSelector',
  get: ({get}) => {
    const allPickedHeroes = [...get(enemyHeroesState),...get(teamHeroesState)]
    const allHeroes = get(heroesSelector)
    const heroesIds = Object.keys(allHeroes).filter( heroId => !allPickedHeroes.includes(heroId))
    return heroesIds
  },
})
