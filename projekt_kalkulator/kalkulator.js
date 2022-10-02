const operatorElements = document.querySelectorAll('[data-operator]');
const numberElements = document.querySelectorAll('[data-number]');
const deleteEl = document.querySelector('[data-del]')
const equalsEl = document.querySelector('[data-equals]')
const acEl = document.querySelector('[data-all-clear]')
const upperEl = document.querySelector('.upper-screen')
const lowerEl = document.querySelector('.lower-screen')

class Calculator{
  constructor(upper, lower){
    this.upper = upper;
    this.lower = lower;
    this.operation = undefined;
    lower.innerText = "0"
    this.previous = undefined;
    this.parts = 0;
    this.compute = false
  }

  clear(){
      this.upper.innerText = ''
      this.lower.innerText = '0'
      this.operator = undefined
      this.previous = undefined
      this.compute = false
  }

  delete(){

  }

  appendNumber(number){
    if(number == '.' && this.lower.innerText.includes('.')){
      return
    }

    // jesli poprzednią akcją było '=', to wycziscic ekran
    if(this.previous == '='){
      this.clear()
    }

    // jezeli poprzednim dzialaniem byl operator, to na krotko przed zastąpieniem
    // dolnej liczby usunac dolną linijkę
    if(!parseFloat(this.previous) && this.previous != '.'){
      console.log("czyszczenie buffora lower");
      this.lower.innerText = ''
    }

    // dopiswanie 0 jezeli dany ciag to liczba
    if(parseFloat(this.lower.innerText) && number == '0'){
      this.lower.innerText += number
      return
    }

    this.previous = number;

    if(this.lower.innerText.length == 1 && this.lower.innerText == '0' && number != '.'){
      this.lower.innerText = number
    }
    else if (number == '.') {
      if(!parseFloat(this.lower.innerText)){
          this.lower.innerText = '0.'
          return
      }
      this.lower.innerText += number;
    }
    else {
      this.lower.innerText += number
    }
  }

  appendOperator(operatorArg){
    console.log("wejscie do appendOperator z arg: " + operatorArg);
    // jezeli obliczenie ma juz w sobie operator, to najpierw wykonaj dzialaniem
    // a potem doloz kolejny operator
    if(this.operator){this.compute = true}

    // jesli na gornym pasku jeszcze nic nie ma, a na dolnym jest '0', return
    if(!this.upper.innerText && !parseFloat(this.lower.innerText)){
      if(operatorArg != '-'){
        return
      }
      else {
        this.operator = operatorArg
        this.upper.innerText = this.lower.innerText + operatorArg
        this.previous = operatorArg
      }
    }

    // jezeli poprzednią acją był przecinek, a teraz operator, to usuń przecinek,
    // wrzuć liczbę z operatorem na górę, a na dole zostaw bez przecinka
    else if(!this.operator && this.previous == '.'){
      console.log("blok 1");
      this.operator = operatorArg
      this.previous = operatorArg
      this.upper.innerText = parseFloat(this.lower.innerText) + operatorArg
      this.lower.innerText = parseFloat(this.lower.innerText)
    }

    // jesli na gornym pasku jeszcze nic nie ma, to dodaj calosc na gore
    // lub jesli poprzednia akcją było '='
    else if(!this.operator || this.previous == '=' || this.operator == '='){

      console.log("blok 2");
      this.operator = operatorArg
      this.upper.innerText = this.lower.innerText + operatorArg
      this.previous = operatorArg
    }

    //jesli poprzednią operacją był operator, to zamień operator
    else if(!this.compute && (!parseFloat(this.previous) || this.previous == '.')){
      console.log("blok 3");
      this.operator = operatorArg
      if(this.previous == '.'){
        console.log("previous was '.'");
        this.upper.innerText = parseFloat(this.upper.innerText) + operatorArg
        return
      }
      this.previous = operatorArg
      this.upper.innerText = parseFloat(this.upper.innerText) + operatorArg
    }

    // w przypadku normalnego flow, wywołaj funkcje updateDisplay
    else {
      console.log("blok 4 - normalne flow");
      this.updateDisplay(operatorArg)
    }
  }

  // funckja obsługuje przypadki gdzie pojawia się drugi operator
  // i trzeba wykonac najpierw poprzednie dzialanie
  // jezeli parametr equals = true, to outcome zostaje przekazany do funkcji equals()
  updateDisplay(operatorArg, equals = false){
    console.log("updateDisplay sie odpala");
    // outcome - przechowuje obliczone dzialanie
    let outcome
    switch (this.upper.innerText.slice(-1)) {
      case '+':
        outcome = parseFloat(this.upper.innerText) + parseFloat(this.lower.innerText)
        break;
      case '-':
        outcome = parseFloat(this.upper.innerText) - parseFloat(this.lower.innerText)
        break;
      case '*':
        outcome = parseFloat(this.upper.innerText) * parseFloat(this.lower.innerText)
        break;
      case '/':
        outcome = parseFloat(this.upper.innerText) / parseFloat(this.lower.innerText)
        break;
      default:
        break;
    }
    if(equals){return outcome}

    console.log(outcome);
    this.upper.innerText = outcome + operatorArg
    this.previous = operatorArg;
    this.operator = operatorArg
  }

  equals(){
    // jezeli '=' zostanie uzyty bezzasadnie, to wyczysc okran
    if(this.upper.innerText.includes('=') || !this.upper.innerText){
      this.clear()
      return
    }
    let outcome = this.updateDisplay(null, true)
    this.upper.innerText += this.lower.innerText + " ="
    this.lower.innerText = outcome;
    this.previous = '='
    this.operator = '='
    this.compute = false
  }

  delete() {
    let strVal = this.lower.innerText
    if(Math.abs(parseFloat(strVal)).toString().length >=2){
      this.lower.innerText = strVal.slice(0,-1)
      if(this.lower.innerText.slice(-1) == '.'){
        this.lower.innerText = this.lower.innerText.slice(0,-1)
      }
    }
    // else if(Math.abs(parseFloat(this.lower.innerText.length)) == 1){
    else {
      this.lower.innerText = 0;
    }
    this.previous = this.lower.innerText.slice(-1);
  }
}

const calculator = new Calculator(upperEl, lowerEl);

numberElements.forEach(button  => {
  button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText)
  })
});

operatorElements.forEach(button => {
  button.addEventListener('click', ()=> {
    calculator.appendOperator(button.innerText)
  })
})

acEl.addEventListener('click', () => {
  calculator.clear()
})

equalsEl.addEventListener('click', () => {
  calculator.equals()
})

deleteEl.addEventListener('click', () => {
  calculator.delete()
})
