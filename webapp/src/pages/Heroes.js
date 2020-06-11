import React, { useState } from 'react'

import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'

import HeroCard from '../components/HeroCard'
import HeroGrid from '../components/HeroGrid'

import { useRecoilValue } from 'recoil'
import { heroesSelector, isHeroesLoadingState } from '../atoms/heroes'

export default function Heroes(){
  const heroesList = useRecoilValue(heroesSelector)
  const isLoading = useRecoilValue(isHeroesLoadingState)

  const [search, setSearch] = useState("")
  const filteredHeroes = Object.values(heroesList).filter( hero => {
    return hero.name.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <div>
      <TextField
        label="Search"
        variant="outlined"
        value={search}
        autoFocus
        fullWidth
        style={{ marginBottom : 16 }}
        onChange={(evt) => setSearch(evt.target.value)} />
      {isLoading && <h4>Loading...</h4>}
      {!isLoading && (
        <HeroGrid>
          {filteredHeroes.map( hero => {
            return (
            <HeroCard
              key={hero.id}
              hero={hero}/>
          )
        })}
        </HeroGrid>
      )}
    </div>
  )
}