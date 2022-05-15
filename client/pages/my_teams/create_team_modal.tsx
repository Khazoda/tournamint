import { useState } from 'react'
import { FiX } from 'react-icons/fi'
import Image from 'next/image'
import Button from '../../components/common/Button'
import logos from '../../globals/team_logos'
import { ITeamColour, TEAM_COLOURS } from '../../globals/types'
interface Props {
  onClick: any
}

const colours: Array<string> = [
  TEAM_COLOURS.BLUE,
  TEAM_COLOURS.GREEN,
  TEAM_COLOURS.LIME,
  TEAM_COLOURS.YELLOW,
  TEAM_COLOURS.ORANGE,
  TEAM_COLOURS.RED,
]

const CreateTeamModal = (props: Props) => {
  const { onClick = null, ...restProps } = props

  const [selectedColour, setSelectedColour] = useState('')

  return (
    <div className="absolute top-0 left-0  z-50 h-screen w-screen bg-transparent backdrop-blur-sm">
      <div className="absolute top-1/2 left-1/2 flex h-[500px] w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 rounded-md border-2 border-green-400 bg-green-400 drop-shadow-lg dark:border-black-800 dark:bg-black-600 sm:w-[350px]">
        <button
          className="ml-auto mt-2 mr-2 hover:cursor-pointer"
          onClick={onClick}
        >
          <FiX size={24}></FiX>
        </button>
        <h1 className=" text-2xl">Create Team</h1>
        <div className="mt-2 flex w-full flex-col gap-2 px-4 text-lg">
          <div className="flex flex-row gap-2 sm:justify-between">
            <input
              id="tag_input"
              type="text"
              placeholder="TAG"
              maxLength={3}
              className="w-20 rounded-md border-2 border-green-500 bg-green-600 px-1 text-center uppercase placeholder:text-black-400 dark:border-black-400 dark:bg-black-400 dark:placeholder:text-gray-400"
            />
            <input
              id="tag_input"
              placeholder="Team Name"
              maxLength={20}
              type="text"
              className="rounded-md border-2 border-green-500 bg-green-600 px-1 placeholder:text-black-400 dark:border-black-400 dark:bg-black-400 dark:placeholder:text-gray-400"
            />
          </div>
          <div className="flex h-64 w-full flex-row flex-wrap items-center justify-center gap-4 overflow-y-auto border-2 border-blue-300 bg-blue-100 py-1 px-4 shadow-inner dark:border-black-700 dark:bg-black-500">
            {logos.map((logo) => (
              <div className="relative h-20 w-20 overflow-hidden rounded-md border-2 border-black-500 hover:scale-105 hover:cursor-pointer hover:bg-blue-300 dark:hover:bg-black-400">
                <Image
                  style={{ backgroundColor: selectedColour }}
                  key={logo}
                  className=""
                  src={logo.src}
                  alt=""
                  layout="fill"
                  objectFit="contain"
                ></Image>
              </div>
            ))}
          </div>
          <div className="flex h-10 w-full flex-row justify-between gap-3 sm:justify-start">
            {colours.map((colour) => (
              <div
                style={{ backgroundColor: colour }}
                className="h-10 w-10 border-2 border-black-800 hover:scale-105 hover:cursor-pointer dark:border-black-800"
                onClick={(e) => {
                  setSelectedColour(colour)
                }}
              ></div>
            ))}
          </div>
        </div>
        <Button text="Create" type="positive" fixedWidth></Button>
      </div>
    </div>
  )
}

export default CreateTeamModal
