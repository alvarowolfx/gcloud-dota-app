import React from 'react'

import { useRecoilValue  } from 'recoil'
import { heroesState } from '../atoms/heroes'
import {
  useTeamBuilderActions,
  useRecommendedHeroes,
  availableHeroesIdsSelector,
  enemyHeroesSelector,
  teamHeroesSelector,
} from '../atoms/builder'

export default function TeamBuilder(){
  const {
    addEnemyHero,
    removeEnemyHero,
    addTeamHero,
    removeTeamHero
  } = useTeamBuilderActions()

  const heroesList = useRecoilValue(heroesState)
  const availableHeroesIds = useRecoilValue(availableHeroesIdsSelector)
  const enemies = useRecoilValue(enemyHeroesSelector)
  const team = useRecoilValue(teamHeroesSelector)

  const [isRecommendedHeroesLoading, recommendedHeroes] = useRecommendedHeroes()
  const hasRecommendedHeroes = recommendedHeroes.length > 0

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
      <h3>Recommended Heroes </h3>
      {isRecommendedHeroesLoading && <h5>Loading Recommendations</h5>}
      {!isRecommendedHeroesLoading && !hasRecommendedHeroes && <h5>No Recommendations</h5>}
      {recommendedHeroes.map( heroId => {
        const hero = heroesList[heroId]
        return (
          <button key={hero.id} onClick={() => addTeamHero(hero.id)}>
            Add {hero.name} From My Team
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