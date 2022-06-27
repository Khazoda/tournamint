import React from 'react'

type Props = {}

function Settings({}: Props) {
  return (
    <div
      id="wrapper"
      className="container mx-auto h-full min-h-screen overflow-y-auto px-4 pt-24 pb-4"
    >
      <article className="prose">
        <h1>Settings</h1>
        <p>This is the settings page.</p>
      </article>
    </div>
  )
}

export default Settings
