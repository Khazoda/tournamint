import { useState } from 'react'
import MatchTidbit from '../MatchTidbit'
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi'
import { ITeam, ITournament } from '../../../globals/types'
import logos from '../../../globals/team_logos'

const typeColours = {
  default: '#444444',
  positive: '#008044',
  negative: '#BC203F',
  neutral: '#3F67AB',
}

interface ITournamentBracket {
  type: 4 | 8 | 16
}
const defaults: ITournamentBracket = {
  type: 16,
}
const TournamentDisplay = (props: {
  team?: ITeam | null
  tournament: ITournament | null
}) => {
  // Default prop values
  const { team = null, tournament = null, ...restProps } = props

  var output = <></>
  if (tournament != null) {
    if (tournament.type == 4) {
      output = (
        <div>
          <div className="grid grid-cols-3 p-5">
            <div className="mr-4 flex flex-col justify-between">
              <div className="relative mb-2 after:absolute after:-right-6 after:top-1/2 after:h-full after:w-6 after:rounded-tr-[9.6px] after:border-r-[2px] after:border-t-[2px] after:border-black-600 dark:before:border-white-300 dark:after:border-white-300">
                {team != null && (
                  <MatchTidbit
                    team_1_tag={team?.team_tag}
                    team_1_icon_path={
                      logos[team?.team_icon_path].src ||
                      'images/team_icons/logo_0.svg'
                    }
                  ></MatchTidbit>
                )}
              </div>
              <div className="relative mt-2 after:absolute after:-right-6 after:bottom-1/2 after:h-full after:w-6 after:rounded-br-[9.6px] after:border-r-[2px] after:border-b-[2px] after:border-black-600 dark:before:border-white-300 dark:after:border-white-300">
                {team != null && (
                  <MatchTidbit
                    team_1_tag={team?.team_tag}
                    team_1_icon_path={
                      logos[team?.team_icon_path].src ||
                      'images/team_icons/logo_0.svg'
                    }
                  ></MatchTidbit>
                )}
              </div>
              <span className="bg-white-200"></span>
            </div>
            <div className="mx-4 flex flex-col justify-center">
              <div className="relative before:absolute before:-left-2 before:top-1/2 before:h-0 before:w-2 before:border-b-[2px] before:border-black-600  dark:before:border-white-300 dark:after:border-white-300 ">
                {team != null && (
                  <MatchTidbit
                    team_1_tag={team?.team_tag}
                    team_1_icon_path={
                      logos[team?.team_icon_path].src ||
                      'images/team_icons/logo_0.svg'
                    }
                  ></MatchTidbit>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    }
    if (tournament.type == 8) {
      output = (
        <div>
          <div className=" mt-auto grid grid-cols-[_minmax(300px,1fr),_minmax(300px,1fr),_minmax(300px,1fr)] gap-5 overflow-x-scroll overscroll-x-contain scroll-smooth p-2 scrollbar-none">
            {/* Left 1 */}
            <div
              id="left_side"
              className="mr-4 flex flex-col justify-between pl-2"
            >
              <div className="relative mb-2 after:absolute after:-right-6 after:top-1/2 after:h-full after:w-6 after:rounded-tr-[9.6px] after:border-r-[2px] after:border-t-[2px] after:border-black-600 dark:before:border-white-300 dark:after:border-white-300">
                {team != null && (
                  <MatchTidbit
                    team_1_tag={team?.team_tag}
                    team_1_icon_path={
                      logos[team?.team_icon_path].src ||
                      'images/team_icons/logo_0.svg'
                    }
                  ></MatchTidbit>
                )}
              </div>
              <div className="relative mb-4 after:absolute after:-right-6 after:bottom-1/2 after:h-full after:w-6 after:rounded-br-[9.6px] after:border-r-[2px] after:border-b-[2px] after:border-black-600 dark:before:border-white-300 dark:after:border-white-300">
                {team != null && (
                  <MatchTidbit
                    team_1_tag={team?.team_tag}
                    team_1_icon_path={
                      logos[team?.team_icon_path].src ||
                      'images/team_icons/logo_0.svg'
                    }
                  ></MatchTidbit>
                )}
              </div>
              <div className="relative mt-4 after:absolute after:-right-6 after:top-1/2 after:h-full after:w-6 after:rounded-tr-[9.6px] after:border-r-[2px] after:border-t-[2px] after:border-black-600 dark:before:border-white-300 dark:after:border-white-300">
                {team != null && (
                  <MatchTidbit
                    team_1_tag={team?.team_tag}
                    team_1_icon_path={
                      logos[team?.team_icon_path].src ||
                      'images/team_icons/logo_0.svg'
                    }
                  ></MatchTidbit>
                )}
              </div>
              <div className="relative mt-2 after:absolute after:-right-6 after:bottom-1/2 after:h-full after:w-6 after:rounded-br-[9.6px] after:border-r-[2px] after:border-b-[2px] after:border-black-600 dark:before:border-white-300 dark:after:border-white-300">
                {team != null && (
                  <MatchTidbit
                    team_1_tag={team?.team_tag}
                    team_1_icon_path={
                      logos[team?.team_icon_path].src ||
                      'images/team_icons/logo_0.svg'
                    }
                  ></MatchTidbit>
                )}
              </div>
            </div>
            {/* Left 2 */}
            <div className="mr-4 flex flex-col justify-around">
              <div className="relative mb-4 before:absolute before:-left-3 before:top-1/2 before:h-0 before:w-3 before:border-b-[2px] before:border-black-600 after:absolute after:-right-6 after:top-1/2 after:h-[150%] after:w-6 after:rounded-tr-[9.6px]  after:border-r-[2px] after:border-t-[2px] after:border-black-600 dark:before:border-white-300 dark:after:border-white-300 ">
                {team != null && (
                  <MatchTidbit
                    team_1_tag={team?.team_tag}
                    team_1_icon_path={
                      logos[team?.team_icon_path].src ||
                      'images/team_icons/logo_0.svg'
                    }
                  ></MatchTidbit>
                )}
              </div>
              <div className="relative mt-4 before:absolute before:-left-3 before:top-1/2 before:h-0 before:w-3 before:border-b-[2px] before:border-black-600 after:absolute after:-right-6 after:bottom-1/2 after:h-[150%] after:w-6 after:rounded-br-[9.6px] after:border-r-[2px] after:border-b-[2px] after:border-black-600 dark:before:border-white-300 dark:after:border-white-300">
                {team != null && (
                  <MatchTidbit
                    team_1_tag={team?.team_tag}
                    team_1_icon_path={
                      logos[team?.team_icon_path].src ||
                      'images/team_icons/logo_0.svg'
                    }
                  ></MatchTidbit>
                )}
              </div>
            </div>
            {/* Center */}
            <div className="mx-4 flex flex-col justify-around  ">
              <div className="relative before:absolute before:-left-7 before:top-1/2 before:h-0 before:w-7 before:border-b-[2px] before:border-black-600 dark:before:border-white-300 dark:after:border-white-300 ">
                {team != null && (
                  <MatchTidbit
                    team_1_tag={team?.team_tag}
                    team_1_icon_path={
                      logos[team?.team_icon_path].src ||
                      'images/team_icons/logo_0.svg'
                    }
                  ></MatchTidbit>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    }
    if (tournament.type == 16) {
      output = (
        <div className="flex h-full flex-col justify-center">
          <div className=" mt-auto grid grid-cols-[_minmax(300px,1fr),_minmax(300px,1fr),_minmax(300px,1fr),_minmax(300px,1fr),_minmax(300px,1fr)] gap-5 overflow-x-scroll overscroll-x-contain scroll-smooth p-5 scrollbar-none">
            {/* Left 1 */}
            <div
              id="left_side"
              className="mr-4 flex flex-col justify-between pl-2"
            >
              <div className="relative mb-2 after:absolute after:-right-6 after:top-1/2 after:h-full after:w-6 after:rounded-tr-[9.6px] after:border-r-[2px] after:border-t-[2px] after:border-black-600 dark:before:border-white-300 dark:after:border-white-300">
                {team != null && (
                  <MatchTidbit
                    team_1_tag={team?.team_tag}
                    team_1_icon_path={
                      logos[team?.team_icon_path].src ||
                      'images/team_icons/logo_0.svg'
                    }
                  ></MatchTidbit>
                )}
              </div>
              <div className="relative mb-4 after:absolute after:-right-6 after:bottom-1/2 after:h-full after:w-6 after:rounded-br-[9.6px] after:border-r-[2px] after:border-b-[2px] after:border-black-600 dark:before:border-white-300 dark:after:border-white-300">
                {team != null && (
                  <MatchTidbit
                    team_1_tag={team?.team_tag}
                    team_1_icon_path={
                      logos[team?.team_icon_path].src ||
                      'images/team_icons/logo_0.svg'
                    }
                  ></MatchTidbit>
                )}
              </div>
              <div className="relative mt-4 after:absolute after:-right-6 after:top-1/2 after:h-full after:w-6 after:rounded-tr-[9.6px] after:border-r-[2px] after:border-t-[2px] after:border-black-600 dark:before:border-white-300 dark:after:border-white-300">
                {team != null && (
                  <MatchTidbit
                    team_1_tag={team?.team_tag}
                    team_1_icon_path={
                      logos[team?.team_icon_path].src ||
                      'images/team_icons/logo_0.svg'
                    }
                  ></MatchTidbit>
                )}
              </div>
              <div className="relative mt-2 after:absolute after:-right-6 after:bottom-1/2 after:h-full after:w-6 after:rounded-br-[9.6px] after:border-r-[2px] after:border-b-[2px] after:border-black-600 dark:before:border-white-300 dark:after:border-white-300">
                {team != null && (
                  <MatchTidbit
                    team_1_tag={team?.team_tag}
                    team_1_icon_path={
                      logos[team?.team_icon_path].src ||
                      'images/team_icons/logo_0.svg'
                    }
                  ></MatchTidbit>
                )}
              </div>
            </div>
            {/* Left 2 */}
            <div className="mr-4 flex flex-col justify-around">
              <div className="relative mb-4 before:absolute before:-left-3 before:top-1/2 before:h-0 before:w-3 before:border-t-[2px]  before:border-black-600 dark:before:border-white-300 ">
                {team != null && (
                  <MatchTidbit
                    team_1_tag={team?.team_tag}
                    team_1_icon_path={
                      logos[team?.team_icon_path].src ||
                      'images/team_icons/logo_0.svg'
                    }
                  ></MatchTidbit>
                )}
              </div>
              <div className="relative mt-4 before:absolute before:-left-3 before:top-1/2 before:h-0 before:w-3 before:border-t-[2px]  before:border-black-600  dark:before:border-white-300 dark:after:border-white-300">
                {team != null && (
                  <MatchTidbit
                    team_1_tag={team?.team_tag}
                    team_1_icon_path={
                      logos[team?.team_icon_path].src ||
                      'images/team_icons/logo_0.svg'
                    }
                  ></MatchTidbit>
                )}
              </div>
            </div>
            {/* Center */}
            <div className="mx-4 flex flex-col justify-around  ">
              <div className="relative before:absolute before:-left-[52px] before:top-1/2 before:h-0 before:w-[52px] before:border-b-[2px] before:border-black-600 after:absolute after:-right-[52px] after:top-1/2 after:h-0 after:w-[52px] after:border-b-[2px] after:border-black-600 dark:before:border-white-300 dark:after:border-white-300 ">
                {team != null && (
                  <MatchTidbit
                    team_1_tag={team?.team_tag}
                    team_1_icon_path={
                      logos[team?.team_icon_path].src ||
                      'images/team_icons/logo_0.svg'
                    }
                  ></MatchTidbit>
                )}
              </div>
              <div className="relative  dark:before:border-white-300 dark:after:border-white-300 ">
                {team != null && (
                  <MatchTidbit
                    team_1_tag={team?.team_tag}
                    team_1_icon_path={
                      logos[team?.team_icon_path].src ||
                      'images/team_icons/logo_0.svg'
                    }
                  ></MatchTidbit>
                )}
              </div>
              <div className="relative before:absolute before:-left-[52px] before:top-1/2 before:h-0 before:w-[52px] before:border-b-[2px] before:border-black-600 after:absolute after:-right-[52px] after:top-1/2 after:h-0 after:w-[52px] after:border-b-[2px] after:border-black-600 dark:before:border-white-300 dark:after:border-white-300 ">
                {team != null && (
                  <MatchTidbit
                    team_1_tag={team?.team_tag}
                    team_1_icon_path={
                      logos[team?.team_icon_path].src ||
                      'images/team_icons/logo_0.svg'
                    }
                  ></MatchTidbit>
                )}
              </div>
            </div>
            {/* Right 2 */}
            <div className="ml-4 flex flex-col justify-around">
              <div className="relative mb-4 after:absolute after:-right-3 after:top-1/2 after:h-0 after:w-3 after:border-t-[2px]  after:border-black-600 dark:before:border-white-300 dark:after:border-white-300 ">
                {team != null && (
                  <MatchTidbit
                    team_1_tag={team?.team_tag}
                    team_1_icon_path={
                      logos[team?.team_icon_path].src ||
                      'images/team_icons/logo_0.svg'
                    }
                  ></MatchTidbit>
                )}
              </div>
              <div className="relative mt-4 after:absolute after:-right-3 after:top-1/2 after:h-0 after:w-3 after:border-t-[2px]  after:border-black-600  dark:before:border-white-300 dark:after:border-white-300">
                {team != null && (
                  <MatchTidbit
                    team_1_tag={team?.team_tag}
                    team_1_icon_path={
                      logos[team?.team_icon_path].src ||
                      'images/team_icons/logo_0.svg'
                    }
                  ></MatchTidbit>
                )}
              </div>
            </div>
            {/* Right 1 */}
            <div
              id="right_side"
              className="ml-4 flex flex-col justify-between pr-2"
            >
              <div className="relative mb-2 before:absolute before:-left-6 before:top-1/2 before:h-full before:w-6 before:rounded-tl-[9.6px] before:border-l-[2px] before:border-t-[2px] before:border-black-600 dark:before:border-white-300 dark:after:border-white-300">
                {team != null && (
                  <MatchTidbit
                    team_1_tag={team?.team_tag}
                    team_1_icon_path={
                      logos[team?.team_icon_path].src ||
                      'images/team_icons/logo_0.svg'
                    }
                  ></MatchTidbit>
                )}
              </div>
              <div className="relative mb-4 before:absolute before:-left-6 before:bottom-1/2 before:h-full before:w-6 before:rounded-bl-[9.6px] before:border-l-[2px] before:border-b-[2px] before:border-black-600 dark:before:border-white-300 dark:after:border-white-300">
                {team != null && (
                  <MatchTidbit
                    team_1_tag={team?.team_tag}
                    team_1_icon_path={
                      logos[team?.team_icon_path].src ||
                      'images/team_icons/logo_0.svg'
                    }
                  ></MatchTidbit>
                )}
              </div>
              <div className="relative mt-4 before:absolute before:-left-6 before:top-1/2 before:h-full before:w-6 before:rounded-tl-[9.6px] before:border-l-[2px] before:border-t-[2px] before:border-black-600 dark:before:border-white-300 dark:after:border-white-300">
                {team != null && (
                  <MatchTidbit
                    team_1_tag={team?.team_tag}
                    team_1_icon_path={
                      logos[team?.team_icon_path].src ||
                      'images/team_icons/logo_0.svg'
                    }
                  ></MatchTidbit>
                )}
              </div>
              <div className="relative mt-2 before:absolute before:-left-6 before:bottom-1/2 before:h-full before:w-6 before:rounded-bl-[9.6px] before:border-l-[2px] before:border-b-[2px] before:border-black-600 dark:before:border-white-300 dark:after:border-white-300">
                {team != null && (
                  <MatchTidbit
                    team_1_tag={team?.team_tag}
                    team_1_icon_path={
                      logos[team?.team_icon_path].src ||
                      'images/team_icons/logo_0.svg'
                    }
                  ></MatchTidbit>
                )}
              </div>
            </div>
          </div>
          <div className="mt-auto mb-8 flex h-4 w-8 flex-row self-center">
            <a
              href="#left_side"
              className="h-9 transition-transform hover:-translate-x-1"
            >
              <FiChevronLeft size={36}></FiChevronLeft>
            </a>
            <a
              href="#right_side"
              className="h-9 transition-transform hover:translate-x-1"
            >
              <FiChevronRight size={36}></FiChevronRight>
            </a>
          </div>
        </div>
      )
    }
  }
  return output
}

export default TournamentDisplay
