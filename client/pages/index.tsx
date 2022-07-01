import { NextPage } from 'next'
import { AppProps } from 'next/app'
import { Props } from 'react'

const Home: NextPage = (props) => {
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
          <p className="min-w-max py-6">
            Please enter your in-game League of Legends® name to get started
          </p>
          <div className="flex flex-row gap-4">
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered input-primary w-full max-w-xs text-black-600"
            />
            <button className="btn btn-primary">Get Started</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
