import React from 'react'

import { Link } from 'react-router-dom'

export default function Header(){
  return (
    <nav>
      <ul>
        <li>
          <Link to="/heroes">Heroes</Link>
        </li>
        <li>
          <Link to="/builder">Team Builder</Link>
        </li>
      </ul>
    </nav>
  )
}