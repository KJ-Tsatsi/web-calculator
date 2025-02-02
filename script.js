class Calculator {
    constructor(equationDisplay, resultDisplay) {
        this.equationDisplayElement = equationDisplay;
        this.resultDisplayElement = resultDisplay;
        this.equation = "";
    }

    clear() {
        this.equation = "";
        this.resultDisplayElement.textContent = "";
        this.updateDisplay();
    }

    delete() {
        this.equation = this.equation.slice(0, -1);
        this.updateDisplay();
    }

    appendValue(value) {
        const lastChar = this.equation.slice(-1);
        const isOperator = ["+", "-", "x", "÷", "^"].includes(lastChar);
        const isFunction = ["sin", "cos", "tan", "log", "√", "π", "%"].some(fn => this.equation.endsWith(fn));

        // Prevent adding factorial if last character is not a number
        if (value === "!" && (isNaN(lastChar) || lastChar === "")) return;

        // Prevent adding multiple consecutive operators
        if (isOperator && ["+", "-", "x", "÷", "^"].includes(value)) return;

        // Prevent adding a second decimal point in the same number
        if (value === ".") {
            const parts = this.equation.split(/[\+\-\x\÷\^]/);
            if (parts[parts.length - 1].includes(".")) return;
        }

        // Prevent adding another function if the last part is already a function
        if (isFunction && ["sin", "cos", "tan", "log", "√", "π", "%"].includes(value)) return;

        if (this.needsImplicitMultiplication(value, lastChar)) {
            this.equation += "x";
        }

        this.equation += value;
        this.updateDisplay();
    }

    calculate() {
        try {
            if (!this.equation) throw new Error("Empty expression");
    
            // If the equation consists of only these functions, it's invalid.
            if (/^(sin|cos|tan|log|√|%)$/.test(this.equation)) {
                throw new Error("Syntax Error");
            }
    
            // If any function appears at the end and is not followed by a number, it's invalid.
            if (/(sin|cos|tan|log|√)([+\-x÷^%]*)$/.test(this.equation)) {
                throw new Error("Syntax Error");
            }
    
            let evaluatedExpression = this.processScientificFunctions(this.equation);
    
            if (this.isStandaloneExpression(evaluatedExpression)) {
                this.displayResult(evaluatedExpression);
                return;
            }
    
            let formattedExpression = this.normalizeExpression(evaluatedExpression);
            let result = this.evaluateArithmetic(formattedExpression);
    
            this.displayResult(result);
        } catch (error) {
            this.displayError(error.message);
        }
    }
    

    processScientificFunctions(expression) {
        expression = expression.replace(/π/g, Math.PI);

        // Evaluate trigonometric functions (sin, cos, tan), square root (√), and logarithm (log)
        // Only works if they are followed by a valid number
        expression = expression.replace(/([\+\-])?(sin|cos|tan|√|log)(-?\d+(\.\d+)?)/g, (_, operator, func, num) => {
            num = parseFloat(num);
            if (isNaN(num)) throw new Error("Invalid input");

            let result;
            switch (func) {
                case "sin": result = Math.sin(this.toRadians(num)); break;
                case "cos": result = Math.cos(this.toRadians(num)); break;
                case "tan": result = Math.tan(this.toRadians(num)); break;
                case "√": result = num < 0 ? "Error" : Math.sqrt(num); break;
                case "log": result = num <= 0 ? "Error" : Math.log10(num); break;
                default: throw new Error("Unknown function");
            }

            return (operator || "") + result;
        });

        expression = expression.replace(/(\d+)!/g, (_, num) => this.factorial(parseInt(num)));

        expression = expression.replace(/(\d+)%/g, (_, num) => parseFloat(num) / 100);

        return expression;
    }

    normalizeExpression(expression) {
        return expression.startsWith("-") ? "0" + expression : expression;
    }

    evaluateArithmetic(expression) {
        let splitExpression = expression.split(/([+\-x÷^])/);
        if (splitExpression.length < 3) throw new Error("Syntax Error");

        let result = parseFloat(splitExpression[0]);

        for (let i = 1; i < splitExpression.length; i += 2) {
            const operator = splitExpression[i];
            const nextNum = parseFloat(splitExpression[i + 1]);

            if (isNaN(nextNum)) throw new Error("Syntax Error");

            result = this.performOperation(result, nextNum, operator);
        }

        return result;
    }

    performOperation(a, b, operator) {
        switch (operator) {
            case "+": return a + b;
            case "-": return a - b;
            case "x": return a * b;
            case "÷":
                if (b === 0) throw new Error("Error: Division by 0");
                return a / b;
            case "^": return a ** b;
            default: throw new Error("Syntax Error");
        }
    }

    factorial(n) {
        if (n < 0) throw new Error("Error: Negative Factorial");
        return n === 0 ? 1 : n * this.factorial(n - 1);
    }

    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    isStandaloneExpression(expression) {
        return !/[\+\-\x\÷\^]/.test(expression);
    }

    needsImplicitMultiplication(currentValue, lastChar) {
        const isNumber = !isNaN(lastChar) && lastChar !== "";
        const isOperator = ["+", "-", "x", "÷", "^"].includes(lastChar);
        const isStart = lastChar === "";

        if (isStart || isOperator) return false;

        // Implicit multiplication is needed if a number is followed by a function or π
        return isNumber && ["sin", "cos", "tan", "√", "log", "π"].some(op => currentValue.startsWith(op));
    }

    displayResult(result) {
        this.resultDisplayElement.textContent = result;
    }

    displayError(message) {
        this.resultDisplayElement.textContent = message;
    }

    updateDisplay() {
        this.equationDisplayElement.textContent = this.equation || "";
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