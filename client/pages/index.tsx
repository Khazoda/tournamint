import { NextPage } from 'next'
import { AppProps } from 'next/app'
import { Props, useEffect, useState } from 'react'

const populateUserData = (name_input: string) => {
  alert('save' + name_input + "'s default data to locel storage")
}
const Home: NextPage = (props) => {
  const [name_input, setName_input] = useState()

  return (
    <div className="hero absolute z-50 h-full min-h-screen w-full bg-base-200 bg-gradient-to-br from-[#009c53] to-[#005d92] font-heading">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img
          src="images/logo_detailed.png"
          className="max-w-sm rounded-lg drop-shadow-lg"
        />
        <div className="rounded-lg border-2 border-white-500 bg-[rgba(255,255,255,0.2)] p-5 drop-shadow-md">
          <h1 className="text-2xl font-bold">Welcome to </h1>
          <h1 className="text-5xl font-bold">Tournamint</h1>
          <br />
          <p className="min-w-max py-6 text-lg">
            Please enter your in-game League of Legends® name to get started
          </p>
          <form
            action="/main"
            className="flex w-full flex-row justify-between gap-4"
          >
            <input
              type="text"
              placeholder="Start typing..."
              className="input input-bordered input-primary w-full max-w-md text-black-600"
              onChange={(e: any) => setName_input(e.target.value)}
            />
            <button
              onClick={() => populateUserData(name_input)}
              className="btn btn-primary"
            >
              Get Started
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Home
