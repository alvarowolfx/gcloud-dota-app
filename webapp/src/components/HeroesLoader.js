import React, { useEffect } from 'react'
import * as firebase from 'firebase/app'

import { useSetRecoilState } from 'recoil'

import { heroesState, isHeroesLoadingState } from '../atoms/heroes'

export default function HeroesLoader() {
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
  return null;
}