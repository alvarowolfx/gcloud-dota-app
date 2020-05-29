import { useEffect } from 'react'
import { atom, selector, useSetRecoilState } from 'recoil'
import * as firebase from 'firebase/app'

export const heroesState = atom({
  key: 'heroesState',
  default: {},
});

export const isHeroesLoadingState = atom({
  key : 'isHeroesLoadingState',
  default : false
})

export const asyncHeroesState = selector({
  key: 'asyncHeroesState',
  default: {},
  get: async ({get}) => {
    try {
      const heroesSnap = await firebase.database().ref('/heroes').once('value')
      const heroes = heroesSnap.val()
      return heroes
    }catch(err){}
      throw new Error('Failed to fetch heroes')
    }
  },
)

export function useHeroesList(){
  const setHeroes = useSetRecoilState(heroesState)
  const setIsHeroesLoading = useSetRecoilState(isHeroesLoadingState)
  useEffect( () => {
    async function loadHeroes(){
      try {
        const heroesSnap = await firebase.database().ref('/heroes').once('value')
        const heroes = heroesSnap.val()
        setHeroes(heroes)
      }catch(err){}
      setIsHeroesLoading(false)
    }
    loadHeroes()
    setIsHeroesLoading(true)
  }, [setHeroes, setIsHeroesLoading])
}
