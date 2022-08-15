import { useState } from 'react'
import Image from 'next/image'
import styles from './teamtidbit.module.scss'
import { useUser } from '../../../context/UserContext'
import { ITeam } from '../../../globals/types'

const typeColours = {
  default: '#444444',
  positive: '#008044',
  negative: '#BC203F',
  neutral: '#3F67AB',
}
const TeamTidbit = (props: {
  winner: ITeam | null
  side: string
  team_tag: string
  team_icon_path: string
}) => {

  // Default prop values
  const { winner = null, side = 'left', team_tag = 'ABC', team_icon_path = '' } = props
  const {
    team,
  } = useUser()
  return side == 'left' ? (
    <div style={winner?.team_tag == team_tag ? { borderTop: 'lime solid 2px' } : winner?.team_tag == null ? {} : { background: 'gray', color: 'darkgray', borderTop: 'red solid 2px' }} className={`${team?.team_tag == team_tag ? 'text-white-100 bg-sky-600  ' : 'bg-orange-500 dark:bg-orange-700 text-white-200'} flex h-full w-full flex-row `}>
      <div style={winner?.team_tag == null ? { filter: 'none' } : {}} className={`${winner?.team_tag == team_tag ? '' : 'grayscale'} relative h-full w-1/2`}>
        <Image
          src={team_icon_path == '' ? '/images/spinner.svg' : team_icon_path}
          layout="fill"
        ></Image>
      </div>
      <h2 className="w-3/4 self-center pr-6 text-right text-2xl font-bold">
        {team_tag}
      </h2>
    </div>
  ) : (
    <div style={winner?.team_tag == team_tag ? { borderTop: 'lime solid 2px' } : winner?.team_tag == null ? {} : { background: 'gray', color: 'darkgray', borderTop: 'red solid 2px' }} className={`${team?.team_tag == team_tag ? 'text-white-100 bg-sky-600 ' : 'bg-orange-500 dark:bg-orange-700 text-white-200'} flex h-full w-full flex-row `}>
      <h2 className="w-3/4 self-center pl-6 text-left text-2xl font-bold ">
        {team_tag}
      </h2>
      <div style={winner?.team_tag == null ? { filter: 'none' } : {}} className={`${winner?.team_tag == team_tag ? '' : 'grayscale'} relative h-full w-1/2`}>
        <Image
          src={team_icon_path == '' ? '/images/spinner.svg' : team_icon_path}
          layout="fill"
        ></Image>
      </div>
    </div>
  )
}

export default TeamTidbit
