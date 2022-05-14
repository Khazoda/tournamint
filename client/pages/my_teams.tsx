import { GetStaticProps } from 'next'
import Button from '../components/common/Button'
import { useUser } from '../context/UserContext'

const MyTeamsPage = () => {
  const { displayName, biography, ign, setUserDetails, statistics, team } =
    useUser()

  console.log(team)

  return (
    <main className="grid grid-cols-[200px,_minmax(100px,1fr)] items-center py-24 px-4">
      <div className=" flex flex-row gap-3 rounded-md bg-emerald-500 p-2 px-2 py-2 dark:bg-emerald-900 md:flex-col">
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
      <div>
        {/* Don't show team info if team defaults are set. //TODO INVERT OPERATOR FOR PRODUCTION */}
        {team.team_tag != 'ABC' ? (
          <></>
        ) : (
          <div>
            <img className="h-12 w-12" src={team.team_icon_path} alt="" />
            {team.team_tag +
              team.team_owner +
              team.team_members +
              team.team_name +
              team.team_statistics +
              team.team_join_key}
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
