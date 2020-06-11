import React, { useState } from 'react'

import Dialog from '@material-ui/core/Dialog'
import TextField from '@material-ui/core/TextField'
import DialogTitle from '@material-ui/core/DialogTitle'

import HeroCard from '../components/HeroCard'
import HeroGrid from '../components/HeroGrid'

export default function SelectHeroDialog({ heroes, isOpen, onHeroSelected, onClose }){
  const [search, setSearch] = useState("")
  const filteredHeroes = heroes.filter( hero => {
    return hero.name.toLowerCase().includes(search.toLowerCase())
  })

  const onDialogClose = () => {
    setSearch("")
    onClose()
  }

  const onSelected = (id) => {
    setSearch("")
    onHeroSelected(id)
  }

  return (
    <Dialog onClose={onDialogClose} open={isOpen}>
      <DialogTitle id="simple-dialog-title">Select Hero</DialogTitle>
      <TextField
        label="Search"
        variant="outlined"
        value={search}
        autoFocus
        style={{ width : '95%', margin : 16}}
        onChange={(evt) => setSearch(evt.target.value)} />
      <HeroGrid style={{ width : 480, height : 480, padding : 16 }}>
        {filteredHeroes.map( hero => {
          return (
            <HeroCard
              key={hero.id}
              hero={hero}
              onActionClick={() => onSelected(hero.id)}/>
          )
        })}
      </HeroGrid>
    </Dialog>
  )
}