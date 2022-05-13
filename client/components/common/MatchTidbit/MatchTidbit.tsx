import { useState } from 'react'
import TeamTidbit from '../TeamTidbit'
import styles from './teamtidbit.module.scss'

const typeColours = {
  default: '#444444',
  positive: '#008044',
  negative: '#BC203F',
  neutral: '#3F67AB',
}
const MatchTidbit = (props: {}) => {
  // Default prop values
  const { ...restProps } = props

  return (
    <>
      <div className="flex h-11 flex-row gap-1">
        <TeamTidbit side="left"></TeamTidbit>
        <div className="relative h-full w-0.5 bg-transparent">
          <span className="absolute -left-3 top-1/2 -translate-y-1/2 animate-pulse text-xl font-semibold ">
            VS
          </span>
        </div>
        <TeamTidbit side="right"></TeamTidbit>
      </div>
    </>
  )
}

export default MatchTidbit
