var booleanFunction = document.getElementById("boolean-function");
var booleanTable = document.getElementById("boolean-table");
var generator = document.getElementById("generator");
var headers = [];
var varValues = [];
var updatedFunction = [];
var results = [];
var varValuesString;
var binaryBooleanFunction;
var cols;
var rows;

function distinctLetters() {
	var result = [];
	booleanFunctionArr = booleanFunction.value.split("");
	for (let i = 0; i < booleanFunctionArr.length; i++) {
		let el = booleanFunctionArr[i];
		if (result.indexOf(el) === -1 && booleanFunction.value[i] != "\u0305"
			&& booleanFunction.value[i] != "·" && booleanFunction.value[i] != "+"
			&& booleanFunction.value[i] != "(" && booleanFunction.value[i] != ")")
			result.push(el);
	}
	return result;
}

function binaryConvert(x) {
	var binary = x.toString(2);
	if (binary.length < cols)
		return binary.padStart(cols, "0");
	else
		return binary;
}

function intitializeTableHeader() {
	headers = [];
	for (let i = 0; i <= distinctLetters().length + 1; i++) {
		var booleanVar = document.createElement("TH");
		if (i < distinctLetters().length) {
			booleanVar.innerHTML = distinctLetters()[i];
			headers.push(distinctLetters()[i]);
			booleanTable.appendChild(booleanVar);
		} else if (i == distinctLetters().length)
			splitBySumOperatorHeaders();
		else {
			booleanVar.innerHTML = booleanFunction.value;
			booleanTable.appendChild(booleanVar);
		}
	}
}

function splitBySumOperatorHeaders() {
	headers = headers.concat(booleanFunction.value.split("+"));
	const uniqueFunctions = new Set(headers);
	var intermediateFunctions = Array.from(uniqueFunctions);
	console.log(intermediateFunctions);
	for (let i = distinctLetters().length; i < intermediateFunctions.length; i++) {
		if (intermediateFunctions[i] != booleanFunction.value) {
			var intermediateFunctionHeader = document.createElement("TH");
			intermediateFunctionHeader.innerHTML = intermediateFunctions[i];
			booleanTable.append(intermediateFunctionHeader);
		}
	}
}

function initializeTable() {
	for (let i = 0; i < rows; i++) {
		var row = booleanTable.insertRow(i);
		for (let j = 0; j < cols; j++) {
			var newCell = row.insertCell(-1);
			if (j % cols == 0)
				newCell.innerHTML = varValuesString[i * cols];
			else
				newCell.innerHTML = varValuesString[(i * cols) + j];
		}
	}
}

function generateTable() {
	varValues = [];
	while (booleanTable.hasChildNodes()) {
		booleanTable.removeChild(booleanTable.firstChild);
	}

	cols = distinctLetters().length;
	rows = Math.pow(2, cols);

	for (let i = rows - 1; i >= 0; i--)
		varValues.push((binaryConvert(i)));
	varValuesString = varValues.join("");
	console.log(varValuesString);

	replace();
	intitializeTableHeader();
	initializeTable();
	insertResults();
}

function replace() {
	for (let i = 0; i < rows; i++) {
		binaryBooleanFunction = "";
		for (let j = 0; j < booleanFunction.value.length; j++) {
			if (booleanFunction.value[j] == "\u0305") {
				binaryBooleanFunction += "\u0305";
			} else if (booleanFunction.value[j] == "·")
				continue;
			else if (booleanFunction.value[j] == "+")
				binaryBooleanFunction += booleanFunction.value[j];
			else
				//	First finds index of the current Boolean variable inside array of distinctLetters, then
				//	adds (i * col) to get the appropriate index for the appropriate value in varValuesString, then
				//	pushes the value to binaryBooleanFunction
				binaryBooleanFunction += (varValuesString[[distinctLetters().indexOf(booleanFunction.value[j]) + (i * cols)]]);
		}
		calculate(binaryBooleanFunction);
	}
	return results;
}

function calculate(string) {
	var splitBySumOperator = string.split("+");
	for (var i = 0; i < splitBySumOperator.length; i++) {
		if (!splitBySumOperator[i].includes("\u0305")) {
			product(splitBySumOperator[i], splitBySumOperator.length, i);
		} else {
			var changeToComplementIndex = splitBySumOperator[i].indexOf("\u0305") - 1;
			var newFunction = spliceSplit(splitBySumOperator[i], changeToComplementIndex, 2, complement(splitBySumOperator[i][changeToComplementIndex]));
			if (newFunction.length == 1)
				results.push(newFunction);
			splitBySumOperator[i] = newFunction;
			i--;
		}
	}
}

function complement(x) {
	var complement = (x == 0) ? 1 : 0;
	return complement;
}

function product(string, length, i) {
	if (i == 0)
		updatedFunction = [];

	var product = (string.includes("0")) ? 0 : 1;
	
	if (string.length == 1)
		updatedFunction.push(parseInt(string));
	else {
		updatedFunction.push(product);
		if (!checkForDupes(i))
			results.push(product);
	}

	if (updatedFunction.length == length) {
		return regroup(updatedFunction);
	}
}

function sum(string) {
	var sum = (string.includes("1")) ? 1 : 0;
	console.log(string);
	results.push(sum);	
	return sum;
}

function regroup(array) {
	array = array.join("+");

	if (array.includes("+"))
		return sum(array);
	return;
}

function checkForDupes(j) {
	var splitBySumOperator = booleanFunction.value.split("+");

	for (let i = 0; i < splitBySumOperator.length; i++) {
		if (splitBySumOperator.indexOf(splitBySumOperator[i]) != splitBySumOperator.lastIndexOf(splitBySumOperator[i])
			&& i < j)
			return true;
	}

	return false;
}

function insertResults() {
	var count = 0;
	for (let i = 0; i < rows; i++) {
		for (let j = distinctLetters().length; j < (document.getElementsByTagName("TH").length); j++) {
			var newCell = booleanTable.rows[i].insertCell(-1);
			newCell.innerHTML = results[count];
			count++;
		}
	}
	console.log(results);
	results = [];
}

function insert(index, string) {
	booleanFunctionArr = booleanFunction.value.split("");
	booleanFunctionArr.splice(index, 0, string);
	return booleanFunctionArr.join("");
}

function spliceSplit(str, index, count, add) {
	var ar = str.split('');
	ar.splice(index, count, add);
	return ar.join('');
}

function replaceAt(index, replacement) {
	booleanFunctionArr = booleanFunction.value.split("");
	booleanFunctionArr.splice(index, 1, replacement);
	return booleanFunctionArr.join("");
}

function setOverlineToPos(index, string) {
	booleanVariable = string[index];
	booleanVariable += "\u0305";
	return replaceAt(index, booleanVariable);
}

function operatorToText(target) {
	var pos = booleanFunction.selectionStart;
	if (target.id == "complement" && booleanFunction.selectionStart == booleanFunction.selectionEnd && booleanFunction.value[pos - 1] != undefined)
		booleanFunction.value = setOverlineToPos(pos - 1, booleanFunction.value);
	if (target.id == "product")
		booleanFunction.value = insert(pos, target.innerHTML);
	if (target.id == "sum")
		booleanFunction.value = insert(pos, target.innerHTML);
}

// function checkValidity() {
//     if (booleanFunction.value != "[A-Za-z]+$") {              
// 		alert("The Boolean function cannot contain any characters other than ones from the alphabet and Boolean operators - Play It Straight!");
// 	return false;
// 	}

//     return true;
// }

function generateOnKeypress(event) {
	if (event.which === 13)
		generateTable();
}

booleanFunction.addEventListener("keypress", generateOnKeypress);
