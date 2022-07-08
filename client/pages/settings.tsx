import React from 'react'

type Props = {}

function Settings({}: Props) {
  return (
    <div
      id="wrapper"
      className="container mx-auto h-full min-h-screen overflow-y-auto px-4 pt-24 pb-4"
    >
      <article className="prose mx-auto">
        <h1>Settings</h1>
        <div className="align-center flex flex-row items-center justify-between">
          <label>Setting 1</label>
          <input type="checkbox" className="toggle" />
        </div>
        <div className="align-center flex flex-row items-center justify-between">
          <label>Setting 2</label>
          <input type="checkbox" className="toggle" />
        </div>
      </article>
    </div>
  )
}

export default Settings
