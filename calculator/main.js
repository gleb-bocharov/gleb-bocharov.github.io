var STATE = {
	START: 0,
	FILLING_REG_1: 1,
	FILLING_REG_2: 2,
	OPERATION_ENTERED: 3
};

var OPERATION = {
	ADDITION: 'addition',
	SUBSTRUCTION: 'substruction',
	DIVISION:'division',
	MULTIPLE:'multiple'
};

var ACTION = {
	CLEAR: 'clear',
	EQUAL: 'equal'
};

var OPERATION_TYPE = {
	NOP: 0,
	ADD: 1,
	SUB: 2,
	DIV: 3,
	MULT: 4
};

var state = STATE.START;
var operation = OPERATION_TYPE.NOP;

var reg1 = {
	figures : '0',
	value: 0,
	sign: 1
};

var reg2 = {
	figures : '0',
	value: 0,
	sign: 1
}

var firstRow;
var secondRow;
var thirdRow;


function init(){
	var buttons = document.querySelectorAll("div.keysPanel > div.keysRow > div");
	buttons.forEach(function(button){
		button.addEventListener("click", onButtonClick);
	})
	var clearButton = document.querySelector("div.topRow > div.clearButton");
	clearButton.addEventListener("click", onButtonClick);
	firstRow = document.querySelector("div.screen > div.firstRow");
	secondRow = document.querySelector("div.screen > div.secondRow");
	thirdRow = document.querySelector("div.screen > div.thirdRow");
	firstRow.innerHTML = '0';
} 

function onButtonClick(e){
	var type = e.target.attributes["button-type"].value;
	var value = e.target.attributes["button-value"].value;

	switch(type){
		case 'figure':
			processFigure(value);
			break;
		case 'action':
			processAction(value);
			break;
		case 'operation':
			processOperation(value);
			break;
		default:
			console.error('Undefined button-type');
	}
}

function processFigure(value){
	if (state === STATE.START){
		state = STATE.FILLING_REG_1;	
	} else if(state === STATE.OPERATION_ENTERED){
		state = STATE.FILLING_REG_2;
	}
		
	if (state === STATE.FILLING_REG_1){
		fillRegister1(value);
	} else if (state === STATE.FILLING_REG_2){
		fillRegister2(value);
	}
}


function processAction(value){
	if (value === ACTION.CLEAR){
		clearAction();
	} else if(value === ACTION.EQUAL){
		equalAction();
	}
}


function processOperation(value){
	var operationSign;
	
	if (state === STATE.FILLING_REG_2){
		equalAction();
	}
	
	if (state === STATE.START || state === STATE.FILLING_REG_1){
		state = STATE.OPERATION_ENTERED;
	}
		
	switch(value){
		case OPERATION.ADDITION:
				operation = OPERATION_TYPE.ADD;
				break;
			case OPERATION.SUBSTRUCTION:
				operation = OPERATION_TYPE.SUB;
				break;
			case OPERATION.DIVISION:
				operation = OPERATION_TYPE.DIV;
				break;
			case OPERATION.MULTIPLE:
				operation = OPERATION_TYPE.MULT;
				break;
			default:
				operation = OPERATION_TYPE.NOP;
				console.error('Undefined operation type');
		}
	
	if (operation !== OPERATION_TYPE.NOP){
		
		switch(operation){
			case OPERATION_TYPE.ADD:
				operationSign = '+';
				break;
			case OPERATION_TYPE.SUB:
				operationSign = '-';
				break;
			case OPERATION_TYPE.DIV:
				operationSign = '/';
				break;
			case OPERATION_TYPE.MULT:
				operationSign = '*';
				break;
		}
		
		secondRow.innerHTML = operationSign;
	}
}


function fillRegister1(value){
	if (value === '.' && reg1.figures.indexOf('.') >= 0){
		return;
	}
	
	if (value === "-"){
		reg1.sign *= -1;
	} else{
		reg1.figures = reg1.figures + value;
	}
	var num = Number(reg1.figures) * reg1.sign;
	reg1.value = num;
	firstRow.innerHTML = num;
}

function fillRegister2(value){
	if (value === '.' && reg2.figures.indexOf('.') >= 0){
		return;
	}
	
	if (value === "-"){
		reg2.sign *= -1;
	} else{
		reg2.figures = reg2.figures + value;
	}
	var num = Number(reg2.figures) * reg2.sign;
	reg2.value = num;
	thirdRow.innerHTML = num;
}

function clearAction(){
	reg1.figures = '0';
	reg2.figures = '0';
	reg1.value = 0;
	reg2.value = 0;
	reg1.sign = 1;
	reg2.sign = 1;
	firstRow.innerHTML = '0';
	secondRow.innerHTML = '';
	thirdRow.innerHTML = '';
	state = STATE.START;
}

function equalAction(){
	if (state === STATE.FILLING_REG_2){
		var result;
		switch(operation){
			case OPERATION_TYPE.ADD:
				result = reg1.value + reg2.value;
				break;
			case OPERATION_TYPE.SUB:
				result = reg1.value - reg2.value;
				break;
			case OPERATION_TYPE.DIV:
				result = reg1.value / reg2.value;
				break;
			case OPERATION_TYPE.MULT:
				result = reg1.value * reg2.value;
				break;
		}

		reg1.value = result;
		reg2.value = 0;
		reg1.figures = result.toString();
		reg2.figures = '0';
		reg1.sign = result < 0 ? -1 : 1;
		reg2.sign = 1;
		firstRow.innerHTML = reg1.value;
		secondRow.innerHTML = '';
		thirdRow.innerHTML = '';
		operation = OPERATION_TYPE.NOP;
		state = STATE.FILLING_REG_1;
	}
}