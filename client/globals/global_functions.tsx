export function createID(length: number) {
  var result = ''
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  result = result.toUpperCase()
  return result
}

export function updateLocalStorage(args: any) {}

export function Capitalize(i: string) {
  let result: string = ''
  try {
    if (i.length >= 2) {
      result =
        i.substring(0, 1).toUpperCase() + i.substring(1, i.length).toLowerCase()
    } else if (i.length == 1) {
      result = i.toUpperCase()
    } else {
      result = i
    }
  } catch (error) {}

  return result
}

// ***********************
// *** Time Conversion ***
// ***********************
interface ICountDownTime {
  days: number
  hours: number
  minutes: number
  seconds: number
}
export function convertToCountDown(totalSeconds: number): ICountDownTime {
  let seconds = totalSeconds % 60
  let minutes = (totalSeconds % 3600) / 60
  let hours = (totalSeconds % 86400) / 3600
  let days = (totalSeconds % (86400 * 30)) / 86400

  return { seconds, minutes, days, hours }
}
export function convertToSeconds(
  days: number,
  hours: number,
  minutes: number,
  seconds: number
): number {
  let adder = 0
  adder += days * 24 * 60 * 60
  adder += hours * 60 * 60
  adder += minutes * 60
  adder += seconds
  return adder
}
