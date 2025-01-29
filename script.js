class Calculator {

    constructor(equationDisplay, resultDisplay) {
        this.equationDisplayElement = equationDisplay;
        this.resultDisplayElement = resultDisplay;
        this.equation = '';
    }

    clear() {
        this.equation = '';
        this.resultDisplayElement.textContent = '';
        this.updateDisplay()
    }

    delete() {
        this.equation = this.equation.slice(0, -1);
        this.updateDisplay();
    }

    appendValue(value) {
        if (this.equation === '' && ['+', '*', '/'].includes(value)) {
            return;
        }
    
        const lastChar = this.equation.slice(-1);
    
        if (['+', '-', '*', '/'].includes(value)) {
            if (['+', '-', '*', '/'].includes(lastChar)) {
                return;
            }
        }
    
        if (value === '.') {
            const parts = this.equation.split(/[\+\-\*\/]/);
            const lastNumber = parts[parts.length - 1];
    
            if (lastNumber.includes('.')) {
                return;
            }
        }
    
        this.equation += value;
        this.updateDisplay();
    }
    

    calculate(expression) {

        let formattedExpression = expression;
        let isNegativeStart = false;
    
        if (formattedExpression[0] === '-') {
            isNegativeStart = true;
            formattedExpression = formattedExpression.slice(1);
        }
    
        const splitExpression = formattedExpression.split(/([+\-*/])/);
    
        if (isNegativeStart) {
            splitExpression[0] = '-' + splitExpression[0];
        }
    
        if (splitExpression.length < 3) {
            this.resultDisplayElement.textContent = 'Syntax Error';
            return;
        }
    
        let result = parseFloat(splitExpression[0]);
    
        for (let i = 1; i < splitExpression.length; i += 2) {
            const operator = splitExpression[i];
            const nextNum = parseFloat(splitExpression[i + 1]);
    
            if (isNaN(nextNum)) {
                this.resultDisplayElement.textContent = 'Syntax Error';
                return;
            }
    
            switch (operator) {
                case '+':
                    result += nextNum;
                    break;
                case '-':
                    result -= nextNum;
                    break;
                case '*':
                    result *= nextNum;
                    break;
                case '/':
                    if (nextNum === 0) {
                        this.resultDisplayElement.textContent = 'Error (Div by 0)';
                        return;
                    }
                    result /= nextNum;
                    break;
                default:
                    this.resultDisplayElement.textContent = 'Syntax Error';
                    return;
            }
        }
    
        this.resultDisplayElement.textContent = result;
    }    

    updateDisplay() {
        this.equationDisplayElement.textContent = this.equation || '';
    }
}


const numberButtons = document.querySelectorAll('.button.number');
const operationButtons = document.querySelectorAll('.button.operator');
const equalsButton = document.getElementById('equals');
const deleteButton = document.getElementById('delete');
const clearButton = document.getElementById('clear');
const equationDisplay = document.getElementById('equation');
const resultDisplay = document.getElementById('result');


const calculator = new Calculator(equationDisplay, resultDisplay);


numberButtons.forEach((button) => {
    button.addEventListener('click', () => {
        calculator.appendValue(button.innerText);
        calculator.updateDisplay();
    });
});

operationButtons.forEach((button) => {
    button.addEventListener('click', () => {
        calculator.appendValue(button.innerText);
        calculator.updateDisplay();
    });
});

clearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});

equalsButton.addEventListener('click', () => {
    calculator.calculate(calculator.equation);
    calculator.updateDisplay();
})