import { atom, selector } from 'recoil'

import { heroesState } from './heroes'

export const enemyHeroesState = atom({
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
  },
  set : ({get, set}, { action, payload} ) => {
    const state = get(enemyHeroesState)
    const nState = action(state, payload)
    set(enemyHeroesState, nState)
  }
})

export const teamHeroesSelector = selector({
  key: 'teamHeroesSelector',
  get: ({get}) => {
    return get(teamHeroesState)
  },
  set : ({get, set}, action, payload) => {
    const state = get(teamHeroesState)
    const nState = action(state, payload)
    set(teamHeroesState,nState)
  }
})

export const addEnemyHeroSelector = selector({
  key: 'addEnemyHeroSelector',
  get: ({get}) => {
    return get(enemyHeroesState)
  },
  set: ({set, get}, id) => {
    const enemiesList = get(enemyHeroesState)
    if(enemiesList.length < 5){
      const nEnemyList = enemiesList.filter( enemyId => enemyId !== id)
      set(enemyHeroesState, [...nEnemyList, id])
    }
  }
})

export const addEnemyHeroAction = (state, payload) => {
  const enemiesList = state
  if(enemiesList.length < 5){
    const nEnemyList = enemiesList.filter( enemyId => enemyId !== payload)
    return [...nEnemyList, payload]
  }
  return state
}

export const removeEnemyHeroSelector = selector({
  key: 'removeEnemyHeroSelector',
  get: ({get}) => {
    return get(enemyHeroesState)
  },
  set: ({set, get}, id) => {
    const enemiesList = get(enemyHeroesState).filter(enemyId => enemyId !== id)
    set(enemyHeroesState, [...enemiesList])
  }
})

export const addTeamHeroSelector = selector({
  key: 'addTeamHeroSelector',
  get: ({get}) => {
    return get(teamHeroesState)
  },
  set: ({set, get}, id) => {
    const teamList = get(teamHeroesState)
    if(teamList.length < 5){
      const nTeamList = teamList.filter( heroId => heroId !== id)
      set(teamHeroesState, [...nTeamList, id])
    }
  }
})

export const removeTeamHeroSelector = selector({
  key: 'removeTeamHeroSelector',
  get: ({get}) => {
    return get(teamHeroesState)
  },
  set: ({set, get}, id) => {
    const teamList = get(teamHeroesState).filter(heroId => heroId !== id)
    set(teamHeroesState, [...teamList])
  }
})

export const availableHeroesIdsSelector = selector({
  key: 'availableHeroesSelector',
  get: ({get}) => {
    const allPickedHeroes = [...get(enemyHeroesState),...get(teamHeroesState)]
    const allHeroes = get(heroesState)
    const heroesIds = Object.keys(allHeroes).filter( heroId => !allPickedHeroes.includes(heroId))
    return heroesIds
  },
})
