import Head from 'next/head'
import React from 'react'
import Button from '../../components/common/Button'
import Datetime from 'react-datetime'
import 'react-datetime/css/react-datetime.css'

type Props = {}

export default function create_tournament({}: Props) {
  return (
    <div
      id="wrapper"
      className=" grid h-full  min-h-screen overflow-y-auto px-4 pt-24 pb-4"
    >
      <Head>
        <title>Tournamint — Create Tournament</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto w-full sm:w-[300px]">
        <form action="" className="flex flex-col gap-5 text-lg">
          <div className="flex flex-col rounded-md bg-gray-200 p-2 dark:bg-black-500">
            <label tabIndex={0} className="mb-2">
              Tournament Name
            </label>
            <input
              type="text"
              placeholder="Worlds Group Cup 2022"
              className=" w-full rounded-md border-2 border-black-400 bg-transparent px-1  text-black-900 first-letter:capitalize dark:text-white-100"
            />
          </div>
          <div className="flex flex-col rounded-md bg-gray-200 p-2 dark:bg-black-500">
            <label tabIndex={0} className="mb-2">
              Number of Teams
            </label>
            <input
              type="range"
              min="1"
              max="3"
              defaultValue={2}
              className="range range-secondary range-xs"
              step={1}
            />
            <div className="flex w-full justify-between px-2 text-sm">
              <div className="flex flex-col items-start">
                <span>▢</span> <span> 4</span>
              </div>
              <div className="flex flex-col items-center">
                <span>▢</span> <span> 8</span>
              </div>
              <div className="flex flex-col items-end">
                <span>▢</span> <span> 16</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col rounded-md bg-gray-200 p-2 dark:bg-black-500">
            <label htmlFor="meeting-time">
              Choose a time for your appointment:
            </label>

            <input
              type="datetime-local"
              id="meeting-time"
              name="meeting-time"
              value="2018-06-12T19:30"
              min="2018-06-07T00:00"
              max="2018-06-14T00:00"
              className="bg-white-200 font-semibold text-black-900 invalid:text-black-900 dark:bg-white-500 dark:text-black-900 dark:invert dark:invalid:text-white-200"
            ></input>
            <Datetime />
          </div>
          <div className="flex flex-col rounded-md bg-gray-200 p-2 dark:bg-black-500">
            <Button text="Create" type="positive" className="w-auto"></Button>
          </div>
        </form>
      </main>
    </div>
  )
}
