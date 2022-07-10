import { useState } from 'react'
import styles from './teamtidbit.module.scss'

const typeColours = {
  default: '#444444',
  positive: '#008044',
  negative: '#BC203F',
  neutral: '#3F67AB',
}
const TeamTidbit = (props: {
  side: string
  team_tag: string
  team_icon_path: string
}) => {
  // Default prop values
  const { side = 'left', team_tag = 'ABC', team_icon_path = '' } = props

  return side == 'left' ? (
    <div className="flex h-full w-full flex-row bg-blue-600 ">
      <div className="h-full w-1/2 ">
        <img src={team_icon_path}></img>
      </div>
      <h2 className="w-3/4 self-center pr-6 text-right text-2xl font-bold text-white-100">
        {team_tag}
      </h2>
    </div>
  ) : (
    <div className="flex h-full w-full flex-row bg-emerald-600 ">
      <h2 className="w-3/4 self-center pl-6 text-left text-2xl font-bold text-white-100">
        {team_tag}
      </h2>
      <div className="h-full w-1/2">
        <img src={team_icon_path}></img>
      </div>
    </div>
  )
}

export default TeamTidbit
