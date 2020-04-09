const fs = require('fs')
const path = require('path')
const jsdom = require('jsdom')
const { JSDOM } = jsdom
const parseToFloat = require('./parseFieldToFloat')

const finalJSON = {}

const pathToFiles = 'C:/Users/sashe/Downloads/Telegram Desktop/'

fs.readdir(pathToFiles, (err, files) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  const validFiles = files.filter(el => el.endsWith('.html'))

  validFiles.forEach(el => {
    fs.readFile(`${pathToFiles}${el}`, 'utf-8', (err, data) => {
      const fileName = path.basename(`${pathToFiles}${el}`, '.html')

      if (err) {
        console.error(err)
        process.exit(1)
      }

      const dom = new JSDOM(data)
      const { window: { document } } = dom

      const allW10 = document.querySelectorAll('.w10')
      const finalSumDiv = allW10[allW10.length - 1]
      const finalSumText = getText(finalSumDiv)
      const finalPrice = parseToFloat(finalSumText)

      const allW7 = [...document.querySelectorAll('.w7')]
      const allWc = [...document.querySelectorAll('.wc')]

      allW7.shift()
      allW7.shift()
      allWc.shift()

      const arrayOfSums = getAllSums(allWc)

      checkAllSumsToEquality(arrayOfSums, finalPrice)

      const arrayOfNames = getAllNames(allW7)

      arrayOfNames.forEach((el, index) => {
        const name = `${index + 1} ${el}`
        const persentages = (arrayOfSums[index] / finalPrice * 100).toFixed(2)

        finalJSON[name] = persentages
      })

      fs.writeFile(`${pathToFiles}${fileName}.json`, JSON.stringify(finalJSON), (err) => {
        if (err) {
          console.error(err)
          process.exit(1)
        }
      })
    })
  })
})

function checkAllSumsToEquality (array, sum) {
  let copiedSum = sum

  array.forEach(el => {
    copiedSum -= el
  })

  if (copiedSum) {
    console.error('Итоговая сумма не равна сумме всех товаров')
    process.exit(1)
  }
}

function getAllNames (divs) {
  const finalArray = []

  divs.forEach((el) => {
    const text = getText(el)
    finalArray.push(text)
  })

  return finalArray
}

function getAllSums (divs) {
  const finalArray = []

  divs.forEach((el) => {
    const text = getText(el)
    finalArray.push(parseToFloat(text))
  })

  return finalArray
}

function getText (div) {
  let finalString = ''

  div.childNodes.forEach((el) => {
    finalString += el.textContent
  })

  return finalString
}
