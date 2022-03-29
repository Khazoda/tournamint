import Link from 'next/link'
import React from 'react'

type Props = {}

export default function Navbar({}: Props) {
  return (
    <div className="fixed mx-4 flex h-20 w-[calc(100%-2rem)] flex-row items-center justify-center gap-3 border-b-[1px] border-b-white-500 pb-2 dark:border-b-black-500">
      <Link href="/">
        <a href="" className="border-b-2 border-b-green-500">
          Lorem
        </a>
      </Link>
      <Link href="/">
        <a href="" className="border-b-2 border-b-green-500">
          Ipsum
        </a>
      </Link>
      <Link href="/">
        <a href="" className="border-b-2 border-b-green-500">
          Sit
        </a>
      </Link>
      <Link href="/">
        <a href="" className="border-b-2 border-b-green-500">
          Dolor
        </a>
      </Link>
    </div>
  )
}
