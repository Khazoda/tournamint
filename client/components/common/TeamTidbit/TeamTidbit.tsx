import { useState } from 'react'
import styles from './teamtidbit.module.scss'

const typeColours = {
  default: '#444444',
  positive: '#008044',
  negative: '#BC203F',
  neutral: '#3F67AB',
}
const TeamTidbit = (props: { side: string; team_tag: string }) => {
  // Default prop values
  const { side = 'left', team_tag = 'ABC' } = props

  return side == 'left' ? (
    <div className="flex h-full w-full flex-row bg-blue-600 py-1 pl-1 pr-6">
      <div className="h-full w-1/4 bg-blue-500"></div>
      <h2 className="w-3/4 self-center text-right text-2xl font-bold text-white-100">
        {team_tag}
      </h2>
    </div>
  ) : (
    <div className="flex h-full w-full flex-row bg-emerald-600 py-1 pr-1 pl-6">
      <h2 className="w-3/4 self-center text-left text-2xl font-bold text-white-100">
        {team_tag}
      </h2>
      <div className="h-full w-1/4 bg-emerald-500"></div>
    </div>
  )
}

export default TeamTidbit
