class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement
        this.currentOperandTextElement = currentOperandTextElement
        // Needed to add this bool to clear result when entering new input
        this.readyToReset = false
        // Call clear() here to clear the calculator at run
        this.clear()
    }
    
    clear() {
        this.currentOperand = ''
        this.previousOperand = ''
        this.operation = undefined
    }

    delete() {
        // With slice() we go from index #0 to 1 from the end
        // then we save it to this.currentOperand
        this.currentOperand = this.currentOperand.toString().slice(0, -1)
    }

    appendNumber(number) {
        // === equal value and equal type
        // This prevents the user from continuously entering a period. 
        if (number === '.' && this.currentOperand.includes('.')) return
        // This takes the numbers clicked by the user and converts them into a single string displayed to the user
        this.currentOperand = this.currentOperand.toString() + number.toString()
    }
 
    chooseOperation(operation){
        // Some error handling if no input is entered
        if (this.currentOperand === '') return
        // Since I want to compute as I go this will force compute of latest input.
        if (this.previousOperand !== '') {
            this.compute()
        }
        // This allows us to pass the first number to the top half of the div element.
        // See updateDisplay() for how it is displayed to top half of div element.
        this.operation = operation
        this.previousOperand = this.currentOperand
        this.currentOperand = ''
    }

    compute() {
        let computation 

        const previousNumber = parseFloat(this.previousOperand)
        const currentNumber = parseFloat(this.currentOperand)
        // Check to make sure there is valid input of a number
        if (isNaN(previousNumber) || isNaN(currentNumber)) return
        
        switch (this.operation) {
            case '+':
                computation = previousNumber + currentNumber
                break
            case '-':
                computation = previousNumber - currentNumber
                break
            case '*':
                computation = previousNumber * currentNumber
                break
            case '÷':
                computation = previousNumber / currentNumber
                break
            default:
                return
        }
        this.readyToReset = true
        this.currentOperand = computation
        this.operation = undefined
        this.previousOperand = ''
    }

    getDisplayNumber(number) {
        /*
        // This causes errors with decimals and zeros
        const floatNumber = parseFloat(number)
        if (isNaN(floatNumber)) return ''
        return floatNumber.toLocaleString('en')
        */
       // Step 1. Convert number to string
       const stringNumber = number.toString()

       // Split the number on the decimal.
       // Step 2. Get digits before the decimal into an array
       const integerDigits = parseFloat(stringNumber.split('.')[0])
        
       // Step 3. Get digits after the decimal into an array
       const decimalDigits = stringNumber.split('.')[1]

       let integerDisplay
       if (isNaN(integerDigits)) {
           integerDisplay = ''
       } else {
           integerDisplay = integerDigits.toLocaleString('en', {
               maximumFractionDigits: 0
           })
       }

       if (decimalDigits != null) {
           return `${integerDisplay}.${decimalDigits}`
       } else {
           return integerDisplay
       }
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand)
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
        } else {
            this.previousOperandTextElement.innerText = ''
        }
    }
}

// This will point to the data attribute in the HTML file
const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')

// Use querySelector because it accept a single element instead of multiple.
const equalsButton = document.querySelector('[data-equals]')
const deleteButton = document.querySelector('[data-delete]')
const clearButton = document.querySelector('[data-clear]')

// These are text elements
const previousOperandTextElement = document.querySelector('[data-previous-operand]')
const currentOperandTextElement = document.querySelector('[data-current-operand]')

// Create an instance of our calculator class
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

// Now that a calculator instance has been initiated we can now use the calculator class.
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (calculator.previousOperand === '' && calculator.currentOperand !== '' && calculator.readyToReset) {
            calculator.currentOperand = ''
            calculator.readyToReset = false
        }
        calculator.appendNumber(button.innerText)
        calculator.updateDisplay()
    })
})

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText)
        calculator.updateDisplay()
    })
})

equalsButton.addEventListener('click', button => {
    calculator.compute()
    calculator.updateDisplay()
})

clearButton.addEventListener('click', button => {
    calculator.clear()
    calculator.updateDisplay()
})

deleteButton.addEventListener('click', button => {
    calculator.delete()
    calculator.updateDisplay()
})