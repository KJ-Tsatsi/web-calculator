// document.addEventListener('DOMContentLoaded', () => {
//     const equationDisplay = document.getElementById('equation');
//     const resultDisplay = document.getElementById('result');
//     let equation = ''; // To store the equation string

//     // Function to update the display
//     const updateDisplay = () => {
//         equationDisplay.textContent = equation || '';
//     };

//     // Function to handle button clicks
//     const handleButtonClick = (button) => {
//         const value = button.textContent;

//         if (value === 'AC') {
//             // Clear everything
//             equation = '';
//             resultDisplay.textContent = '';
//         } else if (value === 'Del') {
//             // Delete the last character
//             equation = equation.slice(0, -1);
//         } else if (value === '=') {
//             // Calculate the result without eval
//             try {
//                 const result = calculateResult(equation);
//                 resultDisplay.textContent = result;
//             } catch (error) {
//                 resultDisplay.textContent = 'Error';
//             }
//         } else {
//             // Append numbers or operators
//             equation += value;
//         }

//         updateDisplay();
//     };

//     // Function to calculate result safely
//     const calculateResult = (eq) => {
//         const operators = /[+\-*/]/;
//         const tokens = eq.split(/([+\-*/])/); // Split into numbers and operators
//         if (tokens.length < 3) throw new Error('Invalid equation');

//         let result = parseFloat(tokens[0]); // Start with the first number

//         for (let i = 1; i < tokens.length; i += 2) {
//             const operator = tokens[i];
//             const nextNum = parseFloat(tokens[i + 1]);

//             if (isNaN(nextNum)) throw new Error('Invalid number');

//             switch (operator) {
//                 case '+':
//                     result += nextNum;
//                     break;
//                 case '-':
//                     result -= nextNum;
//                     break;
//                 case '*':
//                     result *= nextNum;
//                     break;
//                 case '/':
//                     if (nextNum === 0) throw new Error('Division by zero');
//                     result /= nextNum;
//                     break;
//                 default:
//                     throw new Error('Unknown operator');
//             }
//         }

//         return result;
//     };

//     // Attach event listeners to buttons
//     const buttons = document.querySelectorAll('.button');
//     buttons.forEach((button) => {
//         button.addEventListener('click', () => handleButtonClick(button));
//     });

//     // Initialize the display
//     updateDisplay();
// });


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
        if (value === '.' && this.equation.includes('.')) return;
        this.equation += value;
    } 

    calculate(expression) {
        const splitExpression = expression.split(/([+\-*/])/);
        if (splitExpression.length < 3) throw new Error('Invalid equation');

        let result = parseFloat(splitExpression[0]);

        for (let i = 1; i < splitExpression.length; i +=2 ) {
            const operator = splitExpression[i];
            const nextNum = parseFloat(splitExpression[i + 1]);

            if (isNaN(nextNum)) throw new Error('Invalid number');

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
                    result /= nextNum;
                    break;
                default:
                    throw new Error('Unknown operator');
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




