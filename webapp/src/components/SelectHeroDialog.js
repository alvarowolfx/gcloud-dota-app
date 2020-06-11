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
    <Dialog onClose={onDialogClose} open={isOpen} fullWidth>
      <DialogTitle id="simple-dialog-title">Select Hero</DialogTitle>
      <TextField
        label="Search"
        variant="outlined"
        value={search}
        autoFocus
        style={{ margin : 16 }}
        onChange={(evt) => setSearch(evt.target.value)} />
      <div style={{paddingLeft : 16, paddingRight : 16}}>
        <HeroGrid style={{ height : 480, overflow : 'scroll'  }}>
          {filteredHeroes.map( hero => {
            return (
              <HeroCard
                key={hero.id}
                hero={hero}
                lg={4} md={6}
                onActionClick={() => onSelected(hero.id)}/>
            )
          })}
        </HeroGrid>
      </div>
    </Dialog>
  )
}