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
  value_key: string
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
    value_key: 'tournaments_won',
    type: 'tournaments won',
  },
  {
    icon: <FiStar className="h-full w-full" color="#ce7832"></FiStar>,
    title: 'Victor',
    value_key: 'matches_won',
    type: 'matches won',
  },
  {
    icon: <FiHeart className="h-full w-full" color="#32ce3a"></FiHeart>,
    title: 'Explorer',
    value_key: 'people_met',
    type: 'unique people met',
  },
  {
    icon: <FiGrid className="h-full w-full" color="#ce326e"></FiGrid>,
    title: 'Participant',
    value_key: 'log_ins',
    type: "Number of log-ins",
  },
]
