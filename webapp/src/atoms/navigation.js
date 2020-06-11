/* eslint-disable react/react-in-jsx-scope */
import React, { useEffect } from 'react'
import { atom, selector, useRecoilState } from 'recoil'
import { Router } from "react-router"
import { createBrowserHistory } from "history"

const navigationState = atom({
  key: 'navigationState',
  default: ['/builder'],
});

export const navigationStateSelector = selector({
  key: 'navigationStateSelector',
  get: ({get}) => {
    return get(navigationState)
  }
});

const history = createBrowserHistory()

export function NavigationRouter({ children }) {
  const [navigation, setNavigation] = useRecoilState(navigationState)

  useEffect( () => {
    history.listen( (location, action) => {
      switch (action) {
        case "PUSH":
          // first location when app loads and when pushing onto history
          setNavigation([...navigation,location])
          break;
        case "REPLACE":
          // only when using history.replace
          setNavigation([location])
          break;
        case "POP": {
          // happens when using the back button, or forward button
          const nNavigation = [...navigation]
          nNavigation.pop()
          setNavigation(nNavigation)
          break;
        }
        default: {}
      }
    })
  })

  return (
    <Router history={history}>
      {children}
    </Router>
  )
}
