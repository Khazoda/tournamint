import { useState } from 'react'
import { FiX } from 'react-icons/fi'
import Button from '../../components/common/Button'

interface Props {
  onClick: any
}
const CreateTeamModal = (props: Props) => {
  const { onClick = null, ...restProps } = props
  return (
    <div className="absolute top-0 left-0  z-50 h-screen w-screen bg-transparent backdrop-blur-sm">
      <div className="absolute top-1/2 left-1/2 flex h-[500px] w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-5 rounded-md border-2 border-green-400 bg-green-400 drop-shadow-lg dark:border-black-800 dark:bg-black-600 md:w-[350px]">
        <button
          className="ml-auto mt-2 mr-2 hover:cursor-pointer"
          onClick={onClick}
        >
          <FiX size={24}></FiX>
        </button>
        <h1 className="mt-2 text-2xl">Create Team</h1>
        <div className="mt-6 flex flex-col text-lg">
          <span className="mb-2">Team Identity:</span>
          <div className="flex flex-row gap-2">
            <input
              id="tag_input"
              type="text"
              placeholder="TAG"
              className="w-20 rounded-md border-2 border-green-500 bg-green-600 px-1 text-center dark:border-black-400 dark:bg-black-400"
            />
            <input
              id="tag_input"
              placeholder="Team Name"
              type="text"
              className="rounded-md border-2 border-green-500 bg-green-600 px-1 dark:border-black-400 dark:bg-black-400"
            />
          </div>
        </div>
        <Button text="Create" type="positive" fixedWidth></Button>
      </div>
    </div>
  )
}

export default CreateTeamModal
