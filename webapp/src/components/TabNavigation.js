import React from 'react'

import { useHistory, useLocation } from 'react-router-dom'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'

import FavoriteIcon from '@material-ui/icons/Favorite'
import DashboardIcon from '@material-ui/icons/Dashboard'

export default function TabNavigation(){
  const history = useHistory()
  const location = useLocation()

  return (
    <BottomNavigation
      value={location.pathname}
      className="tabNavigation"
      style={{ position : 'fixed', bottom : '0', left:'0', right : '0' }}
      onChange={(event, value) => {
        history.replace(value)
      }}
      showLabels
    >
      <BottomNavigationAction label="Team Builder" value="/builder" icon={<DashboardIcon />} />
      <BottomNavigationAction label="Heroes" value="/heroes" icon={<FavoriteIcon />} />
    </BottomNavigation>
  )
}