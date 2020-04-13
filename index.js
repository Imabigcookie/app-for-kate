const fs = require('fs')
const path = require('path')
const xlsx = require('xlsx-populate')

const pathToFiles = 'C:/Users/sashe/Desktop/excel'

fs.readdir(pathToFiles, (err, files) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  const validFiles = files.filter(el => el.endsWith('.xlsx'))

  validFiles.forEach(el => {
    const fileName = path.basename(el, '.xlsx')
    const finalJSON = {}

    xlsx.fromFileAsync(`${pathToFiles}/${el}`)
      .then(data => {
        const sheet = data.sheet(0)
        const RawDataArray = sheet.usedRange().value()

        const dataArray = RawDataArray.filter(el => !el.every(element => typeof element === "undefined"))

        dataArray.shift()

        const finalSum = calcFinalSum(dataArray)

        dataArray.forEach((el, index) => {
          const filedName = el[2]
          const pers = (el.slice(-1).pop() / finalSum * 100).toFixed(2)

          finalJSON[`${index + 1} ${filedName}`] = pers
        })

        fs.writeFile(`${pathToFiles}/${fileName}.json`, JSON.stringify(finalJSON), (err) => {
          if (err) {
            console.log(err)
            process.exit(1)
          }
        })
      })
      .catch(err => {
        console.log(`${fileName}: ${err}`)
        process.exit(1)
      })
  })
})

function calcFinalSum (data) {
  let sum = 0

  data.forEach(el => {
    sum += el.slice(-1).pop()
  })

  return sum
}
