import { GetStaticProps } from 'next'
import Button from '../components/common/Button'

const MyTeamsPage = () => {
  return (
    <main className="flex flex-col items-center py-24 px-4">
      <div className=" flex flex-row gap-3 rounded-md bg-emerald-500 p-2 px-2 py-2 dark:bg-emerald-900 md:flex-col">
        <Button
          text="Create new Team"
          noMargin
          type="positive"
          className="text-white-500 drop-shadow-sm"
        ></Button>
        <div className="flex w-[150%] flex-col gap-2 rounded-md bg-emerald-400 p-2 drop-shadow-sm dark:bg-emerald-800 md:w-auto">
          <Button
            text="Join Tournament"
            noMargin
            type="neutral"
            className="text-white-500"
          ></Button>
          <Button
            text="Find Tournament"
            noMargin
            type="neutral"
            className="text-white-500"
          ></Button>
        </div>
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
