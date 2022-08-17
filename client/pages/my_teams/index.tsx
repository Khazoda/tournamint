import axios from 'axios'
import { GetStaticProps } from 'next'
import { useEffect, useState } from 'react'
import Button from '../../components/common/Button'
import { useUser } from '../../context/UserContext'
import Image from 'next/image'
import CreateTeamModal from './create_team_modal'
import JoinTeamModal from './join_team_modal'
import { useRouter } from 'next/router'
import { DD_PREFIX } from '../../globals/riot_consts'
import logos from '../../globals/team_logos'

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
  const {
    displayName,
    biography,
    ign,
    statistics,
    team,
    favouriteChampion,
    rankInfo,
    tournaments,
    tournamentsMade,
    setUserDetails,
  } = useUser()
  const router = useRouter()

  const [teamMembersData, setTeamMembersData] = useState<
    Array<ITeamMemberData>
  >([])
  const [team_icon_path, setTeam_Icon_Path] = useState<string>(
    'images/team_icons/logo_0.svg'
  )

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false)
  const [showJoinModal, setShowJoinModal] = useState<boolean>(false)

  useEffect(() => {
    refreshTeamInfo()
    if (team != null) {
      if (team.team_tag != undefined && team.team_tag != 'ABC') {
        getUserTeam(team.team_tag)

        var path = logos[team.team_icon_path].src
        setTeam_Icon_Path(path)
      }
    }
  }, [team])

  useEffect(() => {
    console.log('res', teamMembersData)
  }, [teamMembersData])

  const getUserTeam = async (tag: string) => {
    const url = '/api/teamData?' + new URLSearchParams({ team_tag: tag })
    const result = await fetch(url)
      .then((res) => res.json())
      .catch((res) => console.log(res.error))

    console.log('getUserTeam(): ', result)

    return result.response
  }

  const refreshTeamInfo = () => {
    var tempTeamMembersData: Array<ITeamMemberData> = [
      { ign: 'Default', icon_id: '505', level: '120' },
    ]

    if (team != null) {
      console.log(team.team_members[0 && 1 && 2 && 3 && 4])

      if (
        team.team_members[0 && 1 && 2 && 3 && 4] != undefined &&
        team.team_members[0] != 'Madlife'
      ) {
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
              console.log('team', tempTeamMembersData)

              setTeamMembersData(tempTeamMembersData)
            })
          )
      }
    }
  }

  const leaveTeam = async () => {
    if (team != null) {
      if (team.team_tag != undefined && team.team_tag != 'ABC') {
        let temp_team = await getUserTeam(team.team_tag)
        let temp_all_teams = await getUserTeam('')
        if (temp_team.team_owner == ign) {
          // alert(
          //   'you are the team owner, are you sure you want to delete your team?'
          // )
          console.log(team.team_tag, temp_team.team_owner);
          const response = await fetch('/api/teamData', {
            body: JSON.stringify({ team_tag: team.team_tag }),
            headers: { 'Content-Type': 'application/json' },
            method: 'DELETE',
          })
          const { error } = await response.json()
          console.log('error:', error)

          if (error) {
            // console.log(error)
          } else if (response.status == 200) {
          }

        } else {
          if (temp_team.team_members.includes(ign)) {
            temp_team.team_members[temp_team.team_members.indexOf(ign)] = null
            const response = await fetch('/api/teamData', {
              body: JSON.stringify({ data: temp_team }),
              headers: { 'Content-Type': 'application/json' },
              method: 'PATCH',
            })
            const { error } = await response.json()
            console.log('error:', error)

            if (error) {
              // console.log(error)
            } else if (response.status == 200) {
            }
          }
        }
      }
      localStorage.setItem(
        'userDetails',
        JSON.stringify({
          displayName: displayName,
          biography: biography,
          ign: ign,
          favouriteChampion: favouriteChampion,
          rankInfo: {
            tier: rankInfo.tier,
            rank: rankInfo.rank,
            wins: rankInfo.wins,
            losses: rankInfo.losses,
          },
          statistics: {
            log_ins: statistics.log_ins,
            tournaments_won: statistics.tournaments_won,
            matches_won: statistics.matches_won,
            people_met: statistics.people_met,
          },
          tournamentsMade: tournamentsMade,
          tournaments: tournaments,
          team: null,
        })
      )
    }
    router.reload()
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
        {/* Don't show team info if user isn't in a team //TODO INVERT OPERATOR FOR PRODUCTION */}
        {team == null ? (
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
          <div className="flex flex-col  rounded-md bg-green-300  p-4  dark:bg-black-500 ">
            <div
              style={{ borderColor: team.team_colour_hex }}
              className="flex flex-col justify-between border-b-2 md:flex-row "
            >
              <div className="flex flex-row">
                <img className="h-full w-16" src={team_icon_path} alt="" />
                <div className="mb-2 ml-4 flex flex-row rounded-sm ">
                  <div className="flex flex-row">
                    <div
                      className={
                        `${team.team_colour_hex != null
                          ? 'text-[' + team.team_colour_hex + ']'
                          : ''
                        }` +
                        ' font-big text-6xl uppercase text-blue-700 dark:text-blue-400'
                      }
                    >
                      {team.team_tag}
                    </div>
                    <div
                      style={{ background: team.team_colour_hex }}
                      className="mx-4 min-h-full w-0.5 bg-white-100"
                    ></div>
                  </div>
                  <div className="text-xl">
                    <span
                      className={
                        `${team.team_colour_hex != null
                          ? 'text-[' + team.team_colour_hex + ']'
                          : ''
                        }` +
                        ' text-2xl uppercase text-blue-700 dark:text-blue-400'
                      }
                    >
                      {team.team_name}
                    </span>

                  </div>
                </div>
              </div>

              <Button
                className="h-4 max-h-4 w-full text-white-500 drop-shadow-sm"
                type="negative"
                text="Leave Team"
                fixedWidth
                onClick={() => leaveTeam()}
              ></Button>
            </div>
            {/* Team Members */}
            <div className="mt-2">
              {teamMembersData.map((e) => {
                if (e.ign == undefined) return false
                if (e.level == '76') return false
                if (e.icon_id == '548') return false

                return (
                  <div
                    key={e.ign}
                    className={`${teamMembersData[0].ign == e.ign
                      ? 'h-24 bg-green-500 dark:bg-black-800'
                      : 'h-20 bg-green-400 dark:bg-black-700'
                      } mb-2 flex w-full flex-row rounded-md `}
                  >
                    <div
                      className={`${teamMembersData[0].ign == e.ign
                        ? 'h-24 w-24'
                        : 'h-20 w-20'
                        } relative flex  items-center justify-center`}
                    >
                      <div
                        title="View Profile"
                        style={{ borderColor: team.team_colour_hex }}
                        className={`${teamMembersData[0].ign == e.ign
                          ? 'h-[68px] w-[68px] md:h-20 md:w-20'
                          : 'h-20 w-20  md:h-[60px] md:w-[60px]'
                          } group relative my-auto border-[1px] border-green-500 transition-[border] hover:cursor-pointer hover:border-green-800  `}
                      >
                        <Image
                          src={
                            userData.profileIconId === undefined
                              ? '/images/spinner.svg'
                              : DD_PREFIX +
                              'img/profileicon/' +
                              e.icon_id +
                              '.png'
                          }
                          alt="Profile picture"
                          layout="fill"
                          objectFit="cover"
                          className=""
                        ></Image>
                        <span
                          style={{ borderColor: team.team_colour_hex }}
                          className="absolute -bottom-3 left-1/2 w-3/4 -translate-x-1/2 rounded-md border-[1px] border-green-500 bg-gray-800 px-2 text-center text-sm text-white-200 transition-[border] group-hover:border-green-800"
                        >
                          {e.level}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`${teamMembersData[0].ign == e.ign
                        ? 'text-2xl font-semibold'
                        : 'text-xl font-normal'
                        } ml-8 flex items-center `}
                    >
                      {teamMembersData[0].ign == e.ign
                        ? 'Team Leader ' + e.ign
                        : e.ign}
                    </div>
                  </div>
                )
              })}

              <span
                style={{ background: team.team_colour_hex }}
                className="block h-0.5 w-full bg-white-200"
              ></span>
              <div className="mt-2 flex flex-row justify-between">
                <span>
                  {'Total number of people the team has fought: ' +
                    team.team_statistics.people_met}
                </span>
                <div className="flex flex-row gap-2">
                  <span>Reveal join code:</span>
                  <div className=" group relative rounded-sm bg-black-700 px-1 py-0.5 shadow-md transition-all duration-75 hover:cursor-pointer active:bg-gray-600 active:duration-[0]">
                    <span
                      className="opacity-0 transition-opacity  group-hover:opacity-100"
                      onClick={() =>
                        navigator.clipboard.writeText(team.team_join_key)
                      }
                      title="Click to copy"
                    >
                      {team.team_join_key}
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
