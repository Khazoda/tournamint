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
