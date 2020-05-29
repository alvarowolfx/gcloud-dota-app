import React from 'react'

import { useRecoilValue, useSetRecoilState } from 'recoil'
import { heroesState } from '../atoms/heroes'
import {
  addEnemyHeroSelector,
  removeEnemyHeroSelector,
  addTeamHeroSelector,
  removeTeamHeroSelector,
  availableHeroesIdsSelector,
  enemyHeroesSelector,
  teamHeroesSelector,
} from '../atoms/builder'

export default function TeamBuilder(){
  const addEnemyHero = useSetRecoilState(addEnemyHeroSelector)
  const removeEnemyHero = useSetRecoilState(removeEnemyHeroSelector)
  const addTeamHero = useSetRecoilState(addTeamHeroSelector)
  const removeTeamHero = useSetRecoilState(removeTeamHeroSelector)
  const heroesList = useRecoilValue(heroesState)
  const availableHeroesIds = useRecoilValue(availableHeroesIdsSelector)
  const enemies = useRecoilValue(enemyHeroesSelector)
  const team = useRecoilValue(teamHeroesSelector)

  /*const enemyReducer = useSetRecoilState(enemyHeroesSelector)
  const addEnemyHero = (id) => {
    console.log('Add enemy', addEnemyHeroAction, id, enemyReducer)
    enemyReducer({ action : addEnemyHeroAction, payload : id })
  }*/

  return (
    <div>
      <h2>Team Builder</h2>
      <h3>Enemies </h3> {enemies.map( enemyId => {
        const hero = heroesList[enemyId]
        return (
          <button key={hero.id} onClick={() => removeEnemyHero(hero.id)}>
            Remove {hero.name} From Enemy Team
          </button>
        )
      })}
      <br/>
      <h3>My Team </h3> {team.map( teamId => {
        const hero = heroesList[teamId]
        return (
          <button key={hero.id} onClick={() => removeTeamHero(hero.id)}>
            Remove {hero.name} From My Team
          </button>
        )
      })}
      <br/>
      <h3> Heroes Available to pick </h3>
      {availableHeroesIds.map( heroId => {
        const hero = heroesList[heroId]
        return (
          <div key={hero.id}>
            <button  onClick={() => addEnemyHero(hero.id)}>
              Add {hero.name} to enemy team
            </button>
            <button onClick={() => addTeamHero(hero.id)}>
              Add {hero.name} to my team
            </button>
            <br/>
          </div>
        )
      })}
    </div>
  )
}