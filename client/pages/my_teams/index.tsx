import axios from 'axios'
import { GetStaticProps } from 'next'
import { useEffect, useState } from 'react'
import Button from '../../components/common/Button'
import { useUser } from '../../context/UserContext'
import Image from 'next/image'
import CreateTeamModal from './create_team_modal'
import JoinTeamModal from './join_team_modal'

export interface Props {
  userData: any
  refreshUserInfo: Function
}
interface ITeamMemberData {
  ign: string
  icon_id: string
  level: string
}

const MyTeamsPage = (props: Props) => {
  const { userData = {}, refreshUserInfo = null, ...restProps } = props
  const { displayName, biography, ign, setUserDetails, statistics, team } =
    useUser()

  const [teamMembersData, setTeamMembersData] = useState<
    Array<ITeamMemberData>
  >([])

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false)
  const [showJoinModal, setShowJoinModal] = useState<boolean>(false)

  useEffect(() => {
    refreshTeamInfo()
    getUserTeam()
  }, [])

  useEffect(() => {
    console.log('res', teamMembersData)
  }, [teamMembersData])

  const getUserTeam = async () => {
    const url = '/api/teamData?' + new URLSearchParams({ team_tag: 'ABC' })
    const result = await fetch(url)
      .then((res) => res.json())
      .catch((res) => console.log(res.error))

    console.log('getUserTeam(): ', result)
  }

  const refreshTeamInfo = () => {
    var tempTeamMembersData: Array<ITeamMemberData> = [
      { ign: 'Default', icon_id: '505', level: '120' },
    ]

    if (team.team_members[0 && 1 && 2 && 3 && 4] != undefined) {
      axios
        .all([
          axios.get('/api/teamDisplayData', {
            params: { ign: team.team_members[0] },
          }),
          axios.get('/api/teamDisplayData', {
            params: { ign: team.team_members[1] },
          }),
          axios.get('/api/teamDisplayData', {
            params: { ign: team.team_members[2] },
          }),
          axios.get('/api/teamDisplayData', {
            params: { ign: team.team_members[3] },
          }),
          axios.get('/api/teamDisplayData', {
            params: { ign: team.team_members[4] },
          }),
        ])
        .then(
          axios.spread((m1, m2, m3, m4, m5) => {
            tempTeamMembersData = [
              {
                ign: team.team_members[0],
                level: m1.data.summonerLevel,
                icon_id: m1.data.profileIconId,
              },
              {
                ign: team.team_members[1],
                level: m2.data.summonerLevel,
                icon_id: m2.data.profileIconId,
              },
              {
                ign: team.team_members[2],
                level: m3.data.summonerLevel,
                icon_id: m3.data.profileIconId,
              },
              {
                ign: team.team_members[3],
                level: m4.data.summonerLevel,
                icon_id: m4.data.profileIconId,
              },
              {
                ign: team.team_members[4],
                level: m5.data.summonerLevel,
                icon_id: m5.data.profileIconId,
              },
            ]
            setTeamMembersData(tempTeamMembersData)
          })
        )
    }
  }

  return (
    <main className="flex flex-col items-center justify-center gap-5 py-24 px-4 md:flex-row">
      {showCreateModal && (
        <CreateTeamModal
          onClick={() => setShowCreateModal(false)}
        ></CreateTeamModal>
      )}
      {showJoinModal && (
        <JoinTeamModal onClick={() => setShowJoinModal(false)}></JoinTeamModal>
      )}
      <div className="w-full md:w-[650px]">
        {/* Don't show team info if team defaults are set. //TODO INVERT OPERATOR FOR PRODUCTION */}
        {team.team_tag == 'ABC' ? (
          <div className=" my-[25vh] mx-12 flex flex-col gap-3 rounded-md bg-emerald-500 p-2 px-2 py-2 dark:bg-emerald-900 sm:mx-36">
            <Button
              text="Create Team"
              noMargin
              type="positive"
              onClick={() => setShowCreateModal(true)}
              className="text-white-500 drop-shadow-sm"
            ></Button>
            <Button
              text="Join Team"
              noMargin
              type="neutral"
              onClick={() => setShowJoinModal(true)}
              className="text-white-500"
            ></Button>
          </div>
        ) : (
          <div className="flex flex-col rounded-md bg-green-300 p-4  dark:bg-black-500">
            <div className="flex flex-col border-b-2 md:flex-row  ">
              <img className="h-full w-16" src={team.team_icon_path} alt="" />
              <div className="mb-2 ml-4 flex w-full flex-row rounded-sm ">
                <div className="flex flex-row">
                  <div
                    className={
                      `${
                        team.team_colour_hex != null
                          ? 'text-[' + team.team_colour_hex + ']'
                          : ''
                      }` +
                      ' font-big text-6xl uppercase text-blue-700 dark:text-blue-400'
                    }
                  >
                    {team.team_tag}
                  </div>
                  <div className="mx-4 min-h-full w-0.5 bg-white-100"></div>
                </div>
                <div className="text-lg">
                  <span
                    className={
                      `${
                        team.team_colour_hex != null
                          ? 'text-[' + team.team_colour_hex + ']'
                          : ''
                      }` +
                      ' text-2xl uppercase text-blue-700 dark:text-blue-400'
                    }
                  >
                    {team.team_name}
                  </span>
                  <div>
                    <span className="mr-2">
                      {'Tournaments won: ' +
                        team.team_statistics.tournaments_won}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Team Members */}
            <div className="mt-2">
              {teamMembersData[0] != undefined && (
                <div className=" mb-2 flex h-24 w-full flex-row rounded-md bg-green-500 dark:bg-black-800">
                  <div className="relative flex h-24 w-24 items-center justify-center">
                    <div
                      title="View Profile"
                      className="group relative my-auto h-20 w-20 border-[1px] border-green-500 transition-[border] hover:cursor-pointer hover:border-green-800 md:h-20 md:w-20 "
                    >
                      <Image
                        src={
                          teamMembersData[0] === undefined
                            ? '/images/spinner.svg'
                            : 'http://ddragon.leagueoflegends.com/cdn/12.6.1/img/profileicon/' +
                              teamMembersData[0].icon_id +
                              '.png'
                        }
                        alt="Profile picture"
                        layout="fill"
                        objectFit="cover"
                        className=""
                      ></Image>
                      <span className="absolute -bottom-3 left-1/2 w-3/4 -translate-x-1/2 rounded-md border-[1px] border-green-500 bg-gray-800 px-2 text-center text-sm text-white-200 transition-[border] group-hover:border-green-800">
                        {teamMembersData[0].level === undefined
                          ? '666'
                          : teamMembersData[0].level}
                      </span>
                    </div>
                  </div>
                  <div className="ml-8 flex items-center text-2xl font-semibold">
                    Team Leader {teamMembersData[0].ign}
                  </div>
                </div>
              )}
              {teamMembersData[1] != undefined && (
                <div className="mb-2 flex h-20 w-full flex-row rounded-md bg-green-400 dark:bg-black-700">
                  <div className="relative flex h-20 w-20 items-center justify-center">
                    <div
                      title="View Profile"
                      className="group relative my-auto h-[68px] w-[68px] border-[1px] border-green-500 transition-[border] hover:cursor-pointer hover:border-green-800 md:h-[60px] md:w-[60px] "
                    >
                      <Image
                        src={
                          teamMembersData[1] === undefined
                            ? '/images/spinner.svg'
                            : 'http://ddragon.leagueoflegends.com/cdn/12.6.1/img/profileicon/' +
                              teamMembersData[1].icon_id +
                              '.png'
                        }
                        alt="Profile picture"
                        layout="fill"
                        objectFit="cover"
                        className=""
                      ></Image>
                      <span className="absolute -bottom-3 left-1/2 w-3/4 -translate-x-1/2 rounded-md border-[1px] border-green-500 bg-gray-800 px-2 text-center text-sm text-white-200 transition-[border] group-hover:border-green-800">
                        {teamMembersData[1].level === undefined
                          ? '666'
                          : teamMembersData[1].level}
                      </span>
                    </div>
                  </div>
                  <div className="ml-8 flex items-center text-xl">
                    {teamMembersData[1].ign}
                  </div>
                </div>
              )}
              {teamMembersData[2] != undefined && (
                <div className="mb-2 flex h-20 w-full flex-row rounded-md bg-green-400 dark:bg-black-700">
                  <div className="relative flex h-20 w-20 items-center justify-center">
                    <div
                      title="View Profile"
                      className="group relative my-auto h-[68px] w-[68px] border-[1px] border-green-500 transition-[border] hover:cursor-pointer hover:border-green-800 md:h-[60px] md:w-[60px] "
                    >
                      <Image
                        src={
                          teamMembersData[2] === undefined
                            ? '/images/spinner.svg'
                            : 'http://ddragon.leagueoflegends.com/cdn/12.6.1/img/profileicon/' +
                              teamMembersData[2].icon_id +
                              '.png'
                        }
                        alt="Profile picture"
                        layout="fill"
                        objectFit="cover"
                        className=""
                      ></Image>
                      <span className="absolute -bottom-3 left-1/2 w-3/4 -translate-x-1/2 rounded-md border-[1px] border-green-500 bg-gray-800 px-2 text-center text-sm text-white-200 transition-[border] group-hover:border-green-800">
                        {teamMembersData[2].level === undefined
                          ? '666'
                          : teamMembersData[2].level}
                      </span>
                    </div>
                  </div>
                  <div className="ml-8 flex items-center text-xl">
                    {teamMembersData[2].ign}
                  </div>
                </div>
              )}
              {teamMembersData[3] != undefined && (
                <div className="mb-2 flex h-20 w-full flex-row rounded-md bg-green-400 dark:bg-black-700">
                  <div className="relative flex h-20 w-20 items-center justify-center">
                    <div
                      title="View Profile"
                      className="group relative my-auto h-[68px] w-[68px] border-[1px] border-green-500 transition-[border] hover:cursor-pointer hover:border-green-800 md:h-[60px] md:w-[60px] "
                    >
                      <Image
                        src={
                          teamMembersData[3] === undefined
                            ? '/images/spinner.svg'
                            : 'http://ddragon.leagueoflegends.com/cdn/12.6.1/img/profileicon/' +
                              teamMembersData[3].icon_id +
                              '.png'
                        }
                        alt="Profile picture"
                        layout="fill"
                        objectFit="cover"
                        className=""
                      ></Image>
                      <span className="absolute -bottom-3 left-1/2 w-3/4 -translate-x-1/2 rounded-md border-[1px] border-green-500 bg-gray-800 px-2 text-center text-sm text-white-200 transition-[border] group-hover:border-green-800">
                        {teamMembersData[3].level === undefined
                          ? '666'
                          : teamMembersData[3].level}
                      </span>
                    </div>
                  </div>
                  <div className="ml-8 flex items-center text-xl">
                    {teamMembersData[3].ign}
                  </div>
                </div>
              )}
              {teamMembersData[4] != undefined && (
                <div className="mb-2 flex h-20 w-full flex-row rounded-md bg-green-400 dark:bg-black-700">
                  <div className="relative flex h-20 w-20 items-center justify-center">
                    <div
                      title="View Profile"
                      className="group relative my-auto h-[68px] w-[68px] border-[1px] border-green-500 transition-[border] hover:cursor-pointer hover:border-green-800 md:h-[60px] md:w-[60px] "
                    >
                      <Image
                        src={
                          teamMembersData[4] === undefined
                            ? '/images/spinner.svg'
                            : 'http://ddragon.leagueoflegends.com/cdn/12.6.1/img/profileicon/' +
                              teamMembersData[4].icon_id +
                              '.png'
                        }
                        alt="Profile picture"
                        layout="fill"
                        objectFit="cover"
                        className=""
                      ></Image>
                      <span className="absolute -bottom-3 left-1/2 w-3/4 -translate-x-1/2 rounded-md border-[1px] border-green-500 bg-gray-800 px-2 text-center text-sm text-white-200 transition-[border] group-hover:border-green-800">
                        {teamMembersData[4].level === undefined
                          ? '666'
                          : teamMembersData[4].level}
                      </span>
                    </div>
                  </div>
                  <div className="ml-8 flex items-center text-xl">
                    {teamMembersData[4].ign}
                  </div>
                </div>
              )}
              <span className="block h-0.5 w-full bg-white-200"></span>
              <div className="mt-2 flex flex-row justify-between">
                <span>
                  {'Total number of people met: ' +
                    team.team_statistics.people_met}
                </span>
                <div className="flex flex-row gap-2">
                  <span>Reveal join code:</span>
                  <div
                    className="group relative rounded-sm bg-black-700 px-1 py-0.5 hover:cursor-pointer"
                    onClick={() => alert('Todo: Implement code copy on click')}
                  >
                    <span className="opacity-0 transition-opacity group-hover:opacity-100 ">
                      {+team.team_join_key}
                    </span>
                    <span className="absolute top-0 left-0 w-full bg-white-100 group-hover:hidden"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  return {
    props: {
      data: null,
    },
  }
}

export default MyTeamsPage
