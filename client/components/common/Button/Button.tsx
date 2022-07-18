import { useState } from 'react'
import styles from './button.module.scss'

const typeColours = {
  default: '#444444',
  positive: '#008044',
  negative: '#BC203F',
  neutral: '#3F67AB',
}
const Button = (props: {
  [x: string]: any
  text?: string
  className?: string
  type?: keyof typeof typeColours
  disabled?: boolean
  noMargin?: boolean
  fixedWidth?: boolean
  fixedHeight?: boolean
  iconOnly?: boolean
}) => {
  // Default prop values
  const {
    icon = '',
    text = '',
    type = 'default',
    disabled = false,
    className = '',
    bg_colour = '#4FDC7C',
    onClick = null,
    noMargin = false,
    fixedWidth = false,
    fixedHeight = false,
    iconOnly = false,
    ...restProps
  } = props

  return (
    <button
      disabled={disabled}
      style={{
        backgroundColor: typeColours[type],
        color: 'white',
      }}
      className={`${
        (noMargin ? ' m-0 ' : ' m-1 ') +
        (fixedWidth ? ' w-28 ' : ' w-[100%] ') +
        (fixedHeight ? ' h-[2rem] ' : ' h-[100%] ') +
        (iconOnly ? ' w-8 ' : ' ') +
        className +
        ' ' +
        styles.btn +
        ' text-white min-h-[2rem] px-2 py-0 font-body font-medium shadow-md hover:scale-95 hover:shadow-none '
      }`}
      onClick={onClick}
    >
      {/* Button Icon */}
      {icon}
      {/* Button Text  */}
      {text}
    </button>
  )
}

export default Button
