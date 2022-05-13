import React from 'react'
import {
  FiAward,
  FiCompass,
  FiGrid,
  FiHeart,
  FiHexagon,
  FiStar,
  FiZap,
} from 'react-icons/fi'

interface ICardStatistics {
  icon: React.ReactElement
  title: string
  type: string
  value: number
}
export const default_card_statistics: Array<ICardStatistics> = [
  {
    icon: (
      <FiAward
        className="h-full w-full stroke-blue-300"
        color="#ceb132"
      ></FiAward>
    ),
    title: 'Triumphant',
    value: Math.round(Math.random() * 54),
    type: 'tournaments won',
  },
  {
    icon: <FiStar className="h-full w-full" color="#ce7832"></FiStar>,
    title: 'Victor',
    value: Math.round(Math.random() * 54),
    type: 'matches won',
  },
  {
    icon: <FiHexagon className="h-full w-full" color="#ce4932"></FiHexagon>,
    title: 'Underdog',
    value: Math.round(Math.random() * 54),
    type: 'loss bracket wins',
  },
  {
    icon: <FiHeart className="h-full w-full" color="#32ce3a"></FiHeart>,
    title: 'Explorer',
    value: Math.round(Math.random() * 54),
    type: 'unique people met',
  },
  {
    icon: <FiGrid className="h-full w-full" color="#ce326e"></FiGrid>,
    title: 'Organizer',
    value: Math.round(Math.random() * 54),
    type: 'tournaments made',
  },
]
