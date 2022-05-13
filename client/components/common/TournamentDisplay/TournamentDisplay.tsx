import { useState } from 'react'
import MatchTidbit from '../MatchTidbit'

const typeColours = {
  default: '#444444',
  positive: '#008044',
  negative: '#BC203F',
  neutral: '#3F67AB',
}

interface ITournamentBracket {
  type: 4 | 8
}
const defaults: ITournamentBracket = {
  type: 4,
}
const TournamentDisplay = (props: {}) => {
  // Default prop values
  const {} = props

  var output = <></>
  if (defaults.type == 4) {
    output = (
      <>
        <div className=" grid grid-cols-3 p-5">
          <div className="mr-4 flex flex-col justify-between">
            <div className="relative mb-2 after:absolute after:-right-6 after:top-1/2 after:h-full after:w-6 after:rounded-tr-[9.6px] after:border-r-[2px] after:border-t-[2px]">
              <MatchTidbit></MatchTidbit>
            </div>
            <div className="relative mt-2 after:absolute after:-right-6 after:bottom-1/2 after:h-full after:w-6 after:rounded-br-[9.6px] after:border-r-[2px] after:border-b-[2px]">
              <MatchTidbit></MatchTidbit>
            </div>
            <span className="bg-white-200"></span>
          </div>
          <div className="mx-4 flex flex-col justify-center">
            <div className="relative before:absolute before:-left-2 before:top-1/2 before:h-0 before:w-2 before:border-b-[2px] after:absolute after:-right-2 after:top-1/2 after:h-0 after:w-2 after:border-b-[2px] ">
              <MatchTidbit></MatchTidbit>
            </div>
          </div>
          <div className="ml-4 flex flex-col justify-between ">
            <div className="relative mb-2 after:absolute after:-left-6 after:top-1/2 after:h-full after:w-6 after:rounded-tl-[9.6px] after:border-l-[2px] after:border-t-[2px]">
              <MatchTidbit></MatchTidbit>
            </div>
            <div className="relative mt-2 after:absolute after:-left-6 after:bottom-1/2 after:h-full after:w-6 after:rounded-bl-[9.6px] after:border-l-[2px] after:border-b-[2px]">
              <MatchTidbit></MatchTidbit>
            </div>
          </div>
        </div>
      </>
    )
  }
  if (defaults.type == 8) {
    output = <></>
  }
  return output
}

export default TournamentDisplay
