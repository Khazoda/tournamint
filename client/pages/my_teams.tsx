import { GetStaticProps } from 'next'

const MyTeamsPage = () => {
  return <main className="py-24 px-4">Create New Team</main>
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  return {
    props: {
      data: null,
    },
  }
}

export default MyTeamsPage
