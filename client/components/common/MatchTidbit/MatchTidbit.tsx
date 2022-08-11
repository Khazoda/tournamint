import { useState } from 'react'
import TeamTidbit from '../TeamTidbit'
import styles from './teamtidbit.module.scss'

const typeColours = {
  default: '#444444',
  positive: '#008044',
  negative: '#BC203F',
  neutral: '#3F67AB',
}
const MatchTidbit = (props: {
  team_1_tag: string
  team_1_icon_path: string
  team_2_tag: string
  team_2_icon_path: string
}) => {
  // Default prop values
  const { team_1_tag = 'ABC', team_1_icon_path = '', team_2_tag = 'ABC', team_2_icon_path = '', ...restProps } = props

  return (
    <>
      <div className="flex h-11 flex-row gap-1">
        <TeamTidbit
          side="left"
          team_tag={team_1_tag}
          team_icon_path={team_1_icon_path}
        ></TeamTidbit>
        <div className="relative h-full w-0.5 bg-transparent">
          <span className="absolute -left-3 top-1/2 -translate-y-1/2 animate-pulse text-xl font-semibold ">
            VS
          </span>
        </div>
        <TeamTidbit
          side="right"
          team_tag={team_2_tag}
          team_icon_path={team_2_icon_path}
        ></TeamTidbit>
      </div>
    </>
  )
}

export default MatchTidbit
