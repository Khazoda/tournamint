import { useState } from 'react'
import TeamTidbit from '../TeamTidbit'
import styles from './teamtidbit.module.scss'
import logos from '../../../globals/team_logos'
import { ITeam } from '../../../globals/types'

const typeColours = {
  default: '#444444',
  positive: '#008044',
  negative: '#BC203F',
  neutral: '#3F67AB',
}
const MatchTidbit = (props: {
  winner: ITeam | null
  team_1_tag: string
  team_1_icon_index: number
  team_2_tag: string
  team_2_icon_index: number
}) => {
  // Default prop values
  const { winner = null, team_1_tag = 'ABC', team_1_icon_index = 10, team_2_tag = 'ABC', team_2_icon_index = 10, ...restProps } = props

  return (
    <>
      <div className="flex h-11 flex-row gap-1" >
        <TeamTidbit
          winner={winner}
          side="left"
          team_tag={team_1_tag}
          team_icon_path={team_1_icon_index == 10 ? '' : logos[team_1_icon_index].src}
        ></TeamTidbit>
        <div className="relative h-full w-0.5 bg-transparent">
          <span className={`${winner != null ? 'animate-none ' : 'animate-pulse '} absolute -left-3 top-1/2 -translate-y-1/2 text-xl font-semibold `}>
            {winner == null ? 'VS' : ''}
          </span>
        </div>
        <TeamTidbit
          winner={winner}
          side="right"
          team_tag={team_2_tag}
          team_icon_path={team_2_icon_index == 10 ? '' : logos[team_2_icon_index].src}
        ></TeamTidbit>
      </div>
    </>
  )
}

export default MatchTidbit
