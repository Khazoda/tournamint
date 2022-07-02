import { useState } from 'react'
import { FiX } from 'react-icons/fi'
import Button from '../../components/common/Button'
import { useUser } from '../../context/UserContext'
import { Capitalize } from '../../globals/global_functions'

interface Props {
  onClick: any
}

const JoinTeamModal = (props: Props) => {
  const { onClick = null, ...restProps } = props
  const [tag_out, setTag_out] = useState<string>('')
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

  const TEST = async (tag: string) => {
    tag = tag.toUpperCase()
    const url = '/api/teamData?' + new URLSearchParams({ team_tag: tag })
    const result = await fetch(url)
      .then((res) => res.json())
      .catch((res) => console.log(res.error))

    console.log('getUserTeam(): ', result)
  }

  const joinTeam = async (tag: string) => {
    tag = tag.toUpperCase()
    console.log('TAG:', tag)

    const url = '/api/teamData?' + new URLSearchParams({ team_tag: tag })
    const result = await fetch(url)
      .then((res) => res.json())
      .catch((res) => console.log(res.error))

    let team_temp = result.response
    if (team != null) {
      alert('You are already in a team.')
    } else {
      if (result.response == null) {
        alert('Invalid Team Tag.')
      } else {
        if (team_temp.team_owner == ign) {
          alert('you are the team owner, how did you even access this page? 🤔')
        } else {
          if (!team_temp.team_members.includes(ign)) {
            team_temp.team_members.push(ign)
            const response = await fetch('/api/teamData', {
              body: JSON.stringify({ data: team_temp }),
              headers: { 'Content-Type': 'application/json' },
              method: 'PATCH',
            })
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
                  tournaments_played: statistics.tournaments_played,
                  tournaments_won: statistics.tournaments_won,
                  matches_won: statistics.matches_won,
                  people_met: statistics.people_met,
                },
                tournamentsMade: tournamentsMade,
                tournaments: tournaments,
                team: team_temp,
              })
            )
            console.log('Team Join Status:', response.status)
          }
        }
      }
    }
  }

  return (
    <div className="absolute top-0 left-0  z-50 h-screen w-screen bg-transparent backdrop-blur-sm">
      <div className="absolute top-1/2 left-1/2 flex h-[500px] w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-5 rounded-md border-2 border-green-400 bg-green-400 drop-shadow-lg dark:border-black-800 dark:bg-black-600 md:w-[350px]">
        <button
          className="ml-auto mt-2 mr-2 hover:cursor-pointer"
          onClick={onClick}
        >
          <FiX size={24}></FiX>
        </button>
        <h1 className="mt-5 text-2xl">Join Team</h1>
        <div className="mt-12 flex flex-col text-lg">
          <span className="mb-2">Enter Team Code:</span>
          <input
            id="username_input"
            type="text"
            className="rounded-md border-2 border-green-500 bg-green-600 px-1 dark:border-black-400 dark:bg-black-400"
            onChange={(e) => setTag_out(e.target.value)}
          />
        </div>
        <Button
          text="TEST Get Team Data"
          noMargin
          type="neutral"
          onClick={() => TEST(tag_out)}
          className="text-white-500"
        ></Button>
        <Button
          text="Join"
          type="positive"
          fixedWidth
          onClick={() => joinTeam(tag_out)}
        ></Button>
      </div>
    </div>
  )
}

export default JoinTeamModal
