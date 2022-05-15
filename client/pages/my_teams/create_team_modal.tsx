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
      <div className="absolute top-1/2 left-1/2 flex h-[500px] w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-5 rounded-md border-2 border-green-800 bg-green-700 dark:border-black-800 dark:bg-green-900 md:w-[350px]">
        <button
          className="ml-auto mt-2 mr-2 hover:cursor-pointer"
          onClick={onClick}
        >
          <FiX size={24}></FiX>
        </button>
        <h1 className="mt-5 text-2xl">Create Team</h1>
        <div className="mt-12 flex flex-col ">
          <span className="mb-2">Team Tag (3 letters):</span>
          <input
            id="tag_input"
            type="text"
            className="rounded-md border-2 border-black-400 bg-black-400 px-1"
          />
        </div>
        <Button text="Create" type="positive" fixedWidth></Button>
      </div>
    </div>
  )
}

export default CreateTeamModal
