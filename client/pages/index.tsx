import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Navbar from '../components/common/Navbar'

let body: HTMLBodyElement | null = null
let localStorage: Storage

const toggleTheme = () => {
  alert('hm')
}

export interface Props {
  is_dark: boolean
  setDark: Function
}
const Home: NextPage<Props> = (props) => {
  const { is_dark = false, setDark = null, ...restProps } = props

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2 dark:bg-black-700 dark:text-white-100">
      <Head>
        <title>Tournamint</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center "></main>
    </div>
  )
}

export default Home
