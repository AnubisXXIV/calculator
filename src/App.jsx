import './App.css';
import { useState } from 'react';
import { evaluate } from 'mathjs';
import stringMath from 'string-math';

let countFurther = false;
let result = 0;
let equalPressed = false;

function App() {

  const [upperDisplay, setUpperDisplay] = useState('');
  const [lowerDisplay, setLowerDisplay] = useState('0');


  const handleArithmetic = (e) => {
    equalPressed = false;
    const expression = e.target.value;
    const lastCharacterInUpperDisplay = upperDisplay.at(upperDisplay.length - 1)

    // dont allow two arithemetic expressions back to back
    if ((lastCharacterInUpperDisplay === '/' || lastCharacterInUpperDisplay === '+' || lastCharacterInUpperDisplay === 'x') && expression !== '-') {
      setUpperDisplay(upperDisplay.slice(0, -1) + e.target.value);
      return;
    }

    if (!countFurther) {
      setLowerDisplay(expression);
      setUpperDisplay(upperDisplay + expression);
    }
    else {
      setUpperDisplay(result + expression);
      setLowerDisplay(expression);
    }
  };

  const handleNumberInput = (e) => {

    equalPressed = false;

    // check if . is already given and return if it is
    if (e.target.value === '.' && lowerDisplay.includes('.')) {
      return;
    }

    if (countFurther) {
      countFurther = false;
      setUpperDisplay(upperDisplay + e.target.value);
      setLowerDisplay(e.target.value);
      return;
    }

    // basic number input
    if (lowerDisplay === '0') {
      setLowerDisplay(e.target.value);
      setUpperDisplay(e.target.value);
    } else {
      setLowerDisplay(lowerDisplay + e.target.value);
      setUpperDisplay(upperDisplay + e.target.value);
    }

    // if the lower display is set to an expression it should be replaced with the new number and not append
    if (lowerDisplay === 'x' || lowerDisplay === '/' || lowerDisplay === '+' || lowerDisplay === '-') {
      setLowerDisplay(e.target.value);
    }
  };

  const handleEquals = () => {

    if (equalPressed) {
      return;
    }

    equalPressed = true;

    const regex = /[+-/*]{3,}/g;
    const userInput = upperDisplay.replaceAll('x', '*');
    const regexMatch = userInput.match(regex);
    let cleanedExpression;
    if (regexMatch) {
      cleanedExpression = userInput.replace(regexMatch[0], regexMatch[0][regexMatch[0].length - 1])
    } else {
      cleanedExpression = userInput;
    }

    result = parseFloat(evaluate(cleanedExpression).toFixed(6));
    countFurther = true;
    setUpperDisplay(upperDisplay + "=" + result);
    setLowerDisplay(result);
  };

  const handleClear = () => {
    setUpperDisplay('');
    setLowerDisplay('0');
    result = 0;
    countFurther = false;
  };

  return (
    <div className="App">
      <h1>Calculator</h1>
      <div className="calculator-wrapper">
        <div id='display-wrapper'>
          <p id='upper-display'>{upperDisplay}</p>
          <p id='display'>{lowerDisplay}</p>
        </div>
        <button id='clear' className='calc-btn' onClick={handleClear}>AC</button>
        <button className="calc-btn" id='divide' value='/' onClick={handleArithmetic}>/</button>
        <button className="calc-btn" id='multiply' value='x' onClick={handleArithmetic}>x</button>
        <button className="calc-btn" id='seven' value={7} onClick={handleNumberInput}>7</button>
        <button className="calc-btn" id='eight' value={8} onClick={handleNumberInput}>8</button>
        <button className="calc-btn" id='nine' value={9} onClick={handleNumberInput}>9</button>
        <button className="calc-btn" id='subtract' value='-' onClick={handleArithmetic}>-</button>
        <button className="calc-btn" id='four' value={4} onClick={handleNumberInput}>4</button>
        <button className="calc-btn" id='five' value={5} onClick={handleNumberInput}>5</button>
        <button className="calc-btn" id='six' value={6} onClick={handleNumberInput} >6</button>
        <button className="calc-btn" id='add' value='+' onClick={handleArithmetic}>+</button>
        <button className="calc-btn" id='one' value={1} onClick={handleNumberInput}>1</button>
        <button className="calc-btn" id='two' value={2} onClick={handleNumberInput}>2</button>
        <button className="calc-btn" id='three' value={3} onClick={handleNumberInput}>3</button>
        <button className="calc-btn" id='equals' onClick={handleEquals}>=</button>
        <button className="calc-btn" id='zero' value={0} onClick={handleNumberInput}>0</button>
        <button className="calc-btn" id='decimal' value={'.'} onClick={handleNumberInput}>.</button>
      </div>
    </div>
  );
}

export default App;
