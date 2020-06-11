
import { useEffect } from 'react';
import { atom, selector, useRecoilState } from 'recoil'

const navigationState = atom({
  key: 'navigationState',
  default: [],
});

export const navigationStateSelector = selector({
  key: 'navigationStateSelector',
  get: ({get}) => {
    return get(navigationState)
  }
});

export function useNavigation(history) {
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
}
