function parseToFloat (string) {
  const replacedString = string.replace(' ', '').replace(',', '.')
  const parsedFloat = parseFloat(replacedString)

  if (!parsedFloat) {
    console.error(`${replacedString} нельзя спарсить`)
    process.exit(1)
  }

  return parsedFloat
}

module.exports = parseToFloat
