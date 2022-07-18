import React from 'react'
import Button from '../components/common/Button'

type Props = {}

function Settings({}: Props) {
  return (
    <div
      id="wrapper"
      className="container mx-auto h-full min-h-screen overflow-y-auto px-4 pt-24 pb-4"
    >
      <article className="prose prose-slate mx-auto flex h-full flex-col justify-between text-black-700 dark:text-white-200">
        {/* Settings */}
        <div>
          <h1 className="text-black-700 dark:text-white-200">Settings</h1>
          <div className="align-center flex flex-row items-center justify-between">
            <label>Setting 1</label>
            <input type="checkbox" className="toggle" />
          </div>
        </div>

        {/* Footer */}
        <div className="">
          <div className="divider dark:before:bg-white-800 dark:after:bg-white-800"></div>
          <div className="align-center flex flex-row items-center justify-between ">
            <label>Delete Account</label>
            <Button
              text="DELETE"
              type="negative"
              fixedWidth
              onClick={() => alert('TODO: Implement account deletion')}
            ></Button>
          </div>
          <ul>
            <li className="text-gray-500 dark:text-gray-400">
              Deleting your account removes all identifiable user data
              associated with you from this Tournamint distribution.
            </li>
          </ul>
        </div>
      </article>
    </div>
  )
}

export default Settings
