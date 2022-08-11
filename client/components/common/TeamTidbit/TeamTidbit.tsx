import { useState } from 'react'
import Image from 'next/image'
import styles from './teamtidbit.module.scss'
import { useUser } from '../../../context/UserContext'

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
  const {
    team,
  } = useUser()
  return side == 'left' ? (
    <div className={`${team?.team_tag == team_tag ? 'text-white-100 bg-rose-600  border-rose-400 border-2' : 'bg-blue-600 text-white-200'} flex h-full w-full flex-row `}>
      <div className="relative h-full w-1/2 ">
        <Image
          src={team_icon_path == '' ? '/images/spinner.svg' : team_icon_path}
          layout="fill"
        ></Image>
      </div>
      <h2 className="w-3/4 self-center pr-6 text-right text-2xl font-bold text-white-100">
        {team_tag}
      </h2>
    </div>
  ) : (
    <div className={`${team?.team_tag == team_tag ? 'text-white-100 bg-rose-600  border-rose-400 border-2' : 'bg-emerald-600 text-white-200'} flex h-full w-full flex-row `}>
      <h2 className="w-3/4 self-center pl-6 text-left text-2xl font-bold ">
        {team_tag}
      </h2>
      <div className="relative h-full w-1/2">
        <Image
          src={team_icon_path == '' ? '/images/spinner.svg' : team_icon_path}
          layout="fill"
        ></Image>
      </div>
    </div>
  )
}

export default TeamTidbit
