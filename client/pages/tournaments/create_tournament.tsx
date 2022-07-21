import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import Button from '../../components/common/Button'
import Datetime from 'react-datetime'
import 'react-datetime/css/react-datetime.css'
import { Moment } from 'moment'
import { Toggle } from 'react-daisyui'

type Props = {}

export default function create_tournament({}: Props) {
  const [startDate, setStartDate] = useState<string | Moment>()
  const [is_private, setPrivate] = useState<boolean>(true)

  useEffect(() => {
    console.log(startDate)
  }, [startDate])

  return (
    <div
      id="wrapper"
      className=" grid h-full min-h-screen overflow-y-auto px-4 pt-24 pb-4"
    >
      <Head>
        <title>Tournamint — Create Tournament</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto w-full sm:w-[300px]">
        <form
          action=""
          className="flex flex-col rounded-md bg-gray-300 p-4 text-lg transition-all dark:bg-black-600"
        >
          <div className="mb-2 flex flex-col rounded-md bg-gray-200 p-2 dark:bg-black-500">
            <label tabIndex={0} className="mb-2">
              Tournament Name
            </label>
            <input
              type="text"
              placeholder="Worlds Group Cup 2022"
              className=" w-full rounded-md border-2 border-black-400 bg-transparent px-1  text-black-900 first-letter:capitalize dark:text-white-100"
            />
          </div>
          <div className="my-2 flex flex-col rounded-md bg-gray-200 p-2 dark:bg-black-500">
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
          <div className="my-2 flex flex-col rounded-md bg-gray-200 p-2 dark:bg-black-500">
            <label>Start Date & Time</label>
            <div className=" w-min rounded-md border-2 border-black-400 bg-white-100 p-2 dark:bg-black-900">
              <Datetime
                onChange={(e) => setStartDate(e)}
                initialValue={new Date()}
                className=" dark:text-black-500 dark:invert "
              />
            </div>
          </div>
          <div
            className={`${
              is_private ? 'mb-2 ' : 'mb-0 '
            } mt-2 flex flex-col rounded-md bg-gray-200 p-2  dark:bg-black-500`}
          >
            <div className="flex w-full flex-row items-center justify-between ">
              <span>Private</span>
              <Toggle
                color="secondary"
                size="md"
                onChange={(e) => setPrivate(!e.target.checked)}
              ></Toggle>
              <span>Public</span>
            </div>
          </div>
          <div
            className={`${
              is_private
                ? 'my-2 max-h-full opacity-100 '
                : 'my-0 max-h-0 opacity-0 '
            } h-full rounded-md bg-gray-200 p-2 dark:bg-black-500`}
          >
            <div className="flex w-full flex-col justify-between ">
              <label tabIndex={0} className="mb-2">
                Lobby Code
              </label>
              <input
                type="text"
                placeholder="ABC123"
                className=" w-full rounded-md border-2 border-black-400 bg-transparent px-1  text-black-900 first-letter:capitalize dark:text-white-100"
              />
            </div>
          </div>
          <div
            className={`${
              is_private ? 'mt-2 ' : 'mt-0 '
            } flex flex-col rounded-md bg-gray-200 p-2 pr-4 transition-all dark:bg-black-500`}
          >
            <Button text="Create" type="positive" className=""></Button>
          </div>
        </form>
      </main>
    </div>
  )
}
