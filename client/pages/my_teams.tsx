import { GetStaticProps } from 'next'
import Button from '../components/common/Button'
import { useUser } from '../context/UserContext'

const MyTeamsPage = () => {
  const { displayName, biography, ign, setUserDetails, statistics, team } =
    useUser()

  console.log(team)

  return (
    <main className="flex flex-col items-center justify-center gap-5 py-24 px-4 md:flex-row">
      <div className=" flex flex-row gap-3 rounded-md bg-emerald-500 p-2 px-2 py-2 dark:bg-emerald-900 md:absolute md:top-24 md:right-4 md:flex-col">
        <Button
          text="Create Team"
          noMargin
          type="positive"
          className="text-white-500 drop-shadow-sm"
        ></Button>
        <Button
          text="Join Team"
          noMargin
          type="neutral"
          className="text-white-500"
        ></Button>
      </div>
      <div className="w-full md:w-[650px]">
        {/* Don't show team info if team defaults are set. //TODO INVERT OPERATOR FOR PRODUCTION */}
        {team.team_tag != 'ABC' ? (
          <></>
        ) : (
          <div className="flex flex-col rounded-md bg-green-300 p-4 dark:bg-black-500">
            <div className="flex flex-col border-b-2 md:flex-row ">
              <img className="h-full w-16" src={team.team_icon_path} alt="" />
              <div className="mb-2 ml-4 flex w-full flex-row rounded-sm ">
                <div className="flex flex-row">
                  <div className="font-big text-6xl uppercase text-blue-700 dark:text-blue-400">
                    {team.team_tag}
                  </div>
                  <div className="mx-4 min-h-full w-0.5 bg-white-100"></div>
                </div>
                <div className="text-lg">
                  <span className="text-2xl uppercase text-blue-700 dark:text-blue-400">
                    {team.team_name}
                  </span>
                  <div>
                    <span className="mr-2">
                      {'Tournament | Wins: ' +
                        team.team_statistics.tournaments_won}
                    </span>
                    <span>
                      {'Losses: ' +
                        (team.team_statistics.tournaments_played -
                          team.team_statistics.tournaments_won)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div>{team.team_owner}</div>
              <div>{team.team_members}</div>
              <div>
                <span>{team.team_statistics.matches_won}</span>
                <span>{team.team_statistics.people_met}</span>
              </div>
              <div>{team.team_join_key}</div>
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
