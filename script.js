let container = document.querySelector('table');
let msg = document.getElementById('msg')

let colorBox = {
    1: '#effcd8',
    2: 'rgb(216 247 252 / 53%)',
    3: '#fcd8f99c',
    4: '#fcd8d887',
    5: '#efefff',
    6: '#f7ffdb',
    7: '#f6f6f6',
    8: '#fff8e1',
    9: '#e2ffe1'
}

const fixedLayout = {
    hard: [
        [0, 7, 9, 0, 0, 0, 0, 6, 2],
        [0, 0, 0, 0, 3, 0, 8, 0, 0],
        [6, 8, 0, 0, 0, 9, 0, 0, 0],
        [5, 0, 0, 0, 9, 0, 0, 8, 3],
        [0, 0, 0, 0, 5, 2, 6, 0, 1],
        [0, 0, 0, 7, 0, 6, 0, 0, 0],
        [0, 0, 2, 1, 0, 3, 0, 0, 0],
        [1, 6, 0, 9, 0, 5, 2, 3, 4],
        [7, 5, 3, 8, 0, 4, 9, 0, 6],
    ],
    medium: [
        [0, 0, 0, 2, 6, 0, 7, 0, 1],
        [6, 8, 0, 0, 7, 0, 0, 9, 0],
        [1, 9, 0, 0, 0, 4, 5, 0, 0],
        [8, 2, 0, 1, 0, 0, 0, 4, 0],
        [0, 0, 4, 6, 0, 2, 9, 0, 0],
        [0, 5, 0, 0, 0, 3, 0, 2, 8],
        [0, 0, 9, 3, 0, 0, 0, 7, 4],
        [0, 4, 0, 0, 5, 0, 0, 3, 6],
        [7, 0, 3, 0, 1, 8, 0, 0, 0],
    ],
    easy: [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9],
       ]
}

let difficulty = 'hard', layout = JSON.parse(JSON.stringify(fixedLayout[difficulty])), boxLength = Math.sqrt(layout.length)


//initialized
generateLayout()

function generateLayout(){
    container.innerHTML=''
    layout.forEach((rows, colIndex) => {
        let tr = document.createElement('tr')
        rows.forEach((value, rowIndex) => {
            let td = document.createElement('td')
            let input = document.createElement('input')
            input.type='number'
    
            //drawing line
            if((rowIndex+1) % boxLength == 0 && rowIndex != layout.length-1){
                //vertical line
                td.style.borderRight = '1.5px solid rgb(158, 158, 158)'
            }
            if((colIndex+1) % boxLength == 0 && colIndex != layout.length-1){
                //horizontal line
                td.style.borderBottom = '1.5px solid rgb(158, 158, 158)'
            }
    
            //setting fixed values
            if(value) {
                input.value = value
                input.disabled = true
            }
    
            //unique id
            let uniqueId = `c${colIndex}-r${rowIndex}`
            td.id = uniqueId
    
            //inserting
            td.appendChild(input)
            tr.appendChild(td)
    
            //event listener 
            input.addEventListener('keydown', (e) => _inputHandler(colIndex, rowIndex, e))
        })
        container.appendChild(tr)
    })
}

function changeDifficulty(dif){
    if(dif == difficulty) return
    let prevBtn = document.getElementById(difficulty)
    let curBtn = document.getElementById(dif)
    curBtn.style.backgroundColor = prevBtn.style.backgroundColor
    prevBtn.style.backgroundColor = null
    
    msg.textContent = ''
    layout = JSON.parse(JSON.stringify(fixedLayout[dif]))
    boxLength = Math.sqrt(layout.length)
    difficulty = dif.toLowerCase()
    generateLayout()
}

function hasDublicate(arr){
    return arr.some((value, index, array) => array.indexOf(value) != index && value != 0)
}

function _inputHandler(colIndex, rowIndex, event){
  event.preventDefault()
  let inputValue = event.target.value

  if(event.key == 'Backspace'){
    event.target.value = ''
    document.getElementById(`c${colIndex}-r${rowIndex}`).style.backgroundColor = null
  }
  //validating value key type
  if(inputValue > 9 || (parseInt(event.key) || 0) < 1 || inputValue == event.key) return;
  
  layout[colIndex][rowIndex] = parseInt(event.key)

  //implementing logic
  let startingRowIndex = (rowIndex) - ((rowIndex) % boxLength)
  let startingColIndex = (colIndex) - ((colIndex) % boxLength)
  
  let box = []
  layout.forEach((row, index) => {
   if(index >= startingColIndex && index <= startingColIndex+(boxLength-1))
   box.push(...row.map((val, i) => i >= startingRowIndex && i <= startingRowIndex+(boxLength-1) && val).filter(val => val !== false))
  })
  
  let rowHasDublicateValue = hasDublicate(layout[colIndex])
  let colHasDublicateValue = hasDublicate(layout.map(row => row[rowIndex]))
  let boxHasDublicateValue = hasDublicate(box)
 

  if(rowHasDublicateValue || colHasDublicateValue || boxHasDublicateValue) {
    layout[colIndex][rowIndex] = 0
    let text = rowHasDublicateValue ? 'Row':'';
    text += colHasDublicateValue ? text ? ', Col':'Col':''
    text += boxHasDublicateValue ? text ? ', Box':'Box':''
    text += ' has dublicate value!'
    msg.textContent = text
    return 
  }

  //color implementation
  if(colorBox[parseInt(event.key)]) document.getElementById(`c${colIndex}-r${rowIndex}`).style.backgroundColor = colorBox[parseInt(event.key)]

  msg.textContent = ''
  event.target.value = event.key
}

function getResult(){
    let result = 'You won the game!'
    for(let i = 0; i < layout.length; i++){
        let row = layout[i];
        for(let j = 0; j < row.length; j++){
           if(row[j] == 0){
               result = "You lose the game!";
               break
           }
        }
    }
    //reseting to default
    layout = JSON.parse(JSON.stringify(fixedLayout[difficulty]))
    generateLayout()

    alert(result)
}