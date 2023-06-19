
//Main functions
function getRowNumber() {
  return document.getElementById("rowNumber").value;
}

function generateTable() {
  //Optional: Make full table only appear after Button Press
  //Optional: Expand table if rowNumber>rows.length

  var table = document.getElementById("inputTable");

  //Makes sure table wont stack per button press
  if (table.rows.length > getRowNumber()) {
    for (let j = table.rows.length; j > 1; j--) {
      table.deleteRow(j - 1);
    }
  }

  for (let i = 0; i < getRowNumber(); i++) {
    var row = table.insertRow(i + 1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);

    var classDiv = document.createElement("DIV");
    classDiv.setAttribute("class", "row");
    var freqDiv = document.createElement("DIV");

    var lowerBound = document.createElement("INPUT");
    lowerBound.setAttribute("type", "number");
    lowerBound.setAttribute("name", "lowerInput");
    lowerBound.setAttribute("class", "col-4 mx-auto form-control w-25");
    classDiv.appendChild(lowerBound);

    const hyphen = document.createElement("P");
    hyphen.setAttribute("class", "col-4 mx-auto text-center");
    hyphen.innerHTML = "-";
    classDiv.appendChild(hyphen);

    var upperBound = document.createElement("INPUT");
    upperBound.setAttribute("type", "number");
    upperBound.setAttribute("name", "upperInput");
    upperBound.setAttribute("class", "col-4 form-control w-25 mx-auto");
    classDiv.appendChild(upperBound);

    cell1.appendChild(classDiv);

    var freqInput = document.createElement("INPUT");
    freqInput.setAttribute("type", "number");
    freqInput.setAttribute("name", "freqInput");
    freqInput.setAttribute("class", "form-control");
    freqDiv.appendChild(freqInput);

    cell2.appendChild(freqInput);
  }

  //Apply autocomplete events
  var lowerNums = document.getElementsByName("lowerInput");
  var upperNums = document.getElementsByName("upperInput");

  //calling methods with () doesn't work somehow idk why
  lowerNums[0].addEventListener("change", autoCompleteClass);
  upperNums[0].addEventListener("change", autoCompleteClass);
}

function resetTable() {
  var table = document.getElementById("inputTable");
  var outputTable = document.getElementById("outputTable");

  for (let i = table.rows.length; i > 1; i--) {
    table.deleteRow(i - 1);
  }

  for (let i = outputTable.rows.length; i > 1; i--) {
    outputTable.deleteRow(i - 1);
  }

  var outputExists = document.getElementById("outputID");

  if (typeof outputExists != "undefined" && outputExists != null) {
    document
      .getElementById("outputSide")
      .removeChild(document.getElementById("outputID"));
  }
}

function solve() {
  var inputTable = document.getElementById("inputTable");
  var outputTable = document.getElementById("outputTable");

  var lowerNums = document.getElementsByName("lowerInput");
  var upperNums = document.getElementsByName("upperInput");
  var freqInput = document.getElementsByName("freqInput");

  var range = upperNums[0].value - lowerNums[0].value + 1;

  if (checkValues() == false) {
    window.alert("Missing Values");
  } else {
    //Table Variables
    var midPoint = calculateMidPoint();
    var cumFreq = calculateCumFreq();
    var midPointFreq = calculateMidPointFreq(midPoint);
    var freqMidSqrd = calculateFreqMidSqrd(midPoint, midPointFreq);

    //Summation Variables
    var sumOfFreq = cumFreq[cumFreq.length - 1];
    var sumOfMidpointFreq = calculateSumOfMidPointFreq(midPointFreq);
    var sumOfFreqMidSqrd = calculateSumOfFreqMidSqrd(freqMidSqrd);

    //Stat Treatment Variables
    var mean = calculateMean(sumOfFreq, sumOfMidpointFreq);
    var quartile = calculateQuartile(
      sumOfFreq,
      lowerNums,
      range,
      cumFreq,
      freqInput
    );
    var median = quartile[1];
    var mode = calculateMode(mean, median, range, lowerNums);
    var variance = calculateVariance(sumOfFreq, sumOfFreqMidSqrd, mean);
    var sd = calculateSD(variance);
    var iqr = quartile[2] - quartile[0];
    iqr = Math.round(iqr * 100) / 100;
    console.log(iqr);

    //Makes sure table wont stack per button press
    if (outputTable.rows.length > 0) {
      for (let j = outputTable.rows.length; j > 1; j--) {
        outputTable.deleteRow(j - 1);
      }
    }

    //print values in table
    for (let i = 0; i < inputTable.rows.length - 1; i++) {
      var row = outputTable.insertRow(i + 1);
      var classIntervalCell = row.insertCell(0);
      var frequencyCell = row.insertCell(1);
      var midPointCell = row.insertCell(2);
      var cumFreqCell = row.insertCell(3);
      var freqMidCell = row.insertCell(4);
      var freqMidSqrdCell = row.insertCell(5);

      classIntervalCell.innerHTML =
        lowerNums[i].value + "-" + upperNums[i].value;
      frequencyCell.innerHTML = freqInput[i].value;
      midPointCell.innerHTML = midPoint[i];
      cumFreqCell.innerHTML = cumFreq[i];
      freqMidCell.innerHTML = midPointFreq[i];
      freqMidSqrdCell.innerHTML = freqMidSqrd[i];

      //console.log(midPoint[i]+midPoint[i]);
    }

    //Print summation row
    var row = outputTable.insertRow(outputTable.rows.length);
    var classIntervalCell = row.insertCell(0);
    var frequencyCell = row.insertCell(1);
    var midPointCell = row.insertCell(2);
    var cumFreqCell = row.insertCell(3);
    var freqMidCell = row.insertCell(4);
    var freqMidSqrdCell = row.insertCell(5);

    frequencyCell.innerHTML = "∑f= " + sumOfFreq;
    cumFreqCell.innerHTML = "∑cf= " + sumOfFreq;
    freqMidCell.innerHTML = "∑fx= " + sumOfMidpointFreq;
    freqMidSqrdCell.innerHTML = "∑fx^2= " + sumOfFreqMidSqrd;

    createOutputArea(mean, median, quartile, variance, sd, iqr, mode);
  }
}

//Table Calculations
function calculateMidPoint() {
  var table = document.getElementById("inputTable");
  var lowerNums = document.getElementsByName("lowerInput");
  var upperNums = document.getElementsByName("upperInput");

  var midPoint = [];

  for (let i = 0; i < table.rows.length - 1; i++) {
    //midPoint[i] = ((lowerNums[i].value + upperNums[i].value)/2);
    midPoint[i] =
      Math.round(
        ((parseInt(lowerNums[i].value) + parseInt(upperNums[i].value)) / 2) *
          100
      ) / 100;
  }
  //console.log(midPoint.toString());
  return midPoint;
}

function calculateCumFreq() {
  var table = document.getElementById("inputTable");
  var freqNum = document.getElementsByName("freqInput");

  var cumFreq = [];
  cumFreq[0] = freqNum[0].value;
  var sums = cumFreq[0];
  //console.log(cumFreq[0]);

  for (let i = 1; i < table.rows.length - 1; i++) {
    sums = parseInt(sums) + parseInt(freqNum[i].value);
    cumFreq[i] = parseInt(sums);
    //console.log(cumFreq[i]);
  }
  //console.log(cumFreq.toString());
  return cumFreq;
}

function calculateMidPointFreq(midPoint) {
  var freqNum = document.getElementsByName("freqInput");

  var midPointFreq = [];

  for (let i = 0; i < freqNum.length; i++) {
    midPointFreq[i] =
      Math.round(parseFloat(midPoint[i]) * parseFloat(freqNum[i].value) * 100) /
      100;
  }

  return midPointFreq;
}

function calculateFreqMidSqrd(midPoint, midPointFreq) {
  var midPointFreqSqrd = [];

  for (let i = 0; i < midPoint.length; i++) {
    midPointFreqSqrd[i] =
      Math.round(parseFloat(midPoint[i]) * parseFloat(midPointFreq[i]) * 100) /
      100;
  }

  return midPointFreqSqrd;
}

function calculateSumOfMidPointFreq(midPointFreq) {
  var sumOfMidpointFreq = 0;

  for (let i = 0; i < midPointFreq.length; i++) {
    sumOfMidpointFreq += midPointFreq[i];
  }

  return sumOfMidpointFreq;
}

function calculateSumOfFreqMidSqrd(midPointFreqSqrd) {
  var sumOfFreqMidSqrd = 0;

  for (let i = 0; i < midPointFreqSqrd.length; i++) {
    sumOfFreqMidSqrd += midPointFreqSqrd[i];
  }

  return sumOfFreqMidSqrd;
}

//Statistical Treatment Calculations

function calculateMean(sumOfFreq, sumOfMidpointFreq) {
  var mean = parseFloat(sumOfMidpointFreq) / parseFloat(sumOfFreq);

  mean = Math.round(mean * 100) / 100;

  console.log("Mean = " + mean);
  return mean;
}

function calculateMode(mean, median, range, lowerNums){

  var freqNum = document.getElementsByName("freqInput");
  

  var modeFreqs = [];

  //transfer frequency values to int array
  for(let i = 0; i<freqNum.length; i++){
    modeFreqs[i] = freqNum[i].value;
  }

  //console.log(Math.max(...modeFreqs));
  var modeClass = [];
  var modePlace = 0;
  var mode;

  //Get the places of all the highes frequencies
  for(let i=0; i<freqNum.length; i++){
    if(modeFreqs[i] == Math.max(...modeFreqs)){
      modeClass[modePlace] = i;
      modePlace++;
    }
  }

  var lowBound = parseFloat(lowerNums[modeClass[0]].value);
  var modeM = parseFloat(modeFreqs[modeClass[0]]);
  var mode1 = parseFloat(modeFreqs[modeClass[0]-1]);
  var mode2 = parseFloat(modeFreqs[modeClass[0]+1]);

  if(modeClass.length == 1){
    if(modeClass[0]==0){
      mode = (3*parseFloat(median)) - (2*parseFloat(mean));
    }else if(modeClass[0]==freqNum.length-1){
      mode = (3*parseFloat(median)) - (2*parseFloat(mean));
    }else{
      console.log(modeClass[0]);
      mode = lowBound + (range-1)*((modeM-mode1)/((modeM-mode1)+(modeM-mode2)));
    }
    
  }else{
    mode = (3*parseFloat(median)) - (2*parseFloat(mean));
  }

  mode = Math.round(mode*100)/100;

  console.log(mode);

  return mode;

}

function calculateQuartile(sumOfFreq, lowerNums, range, cumFreq, freqInput) {
  var quartile = [];

  //Get class of Q1
  var quartile1Place = (1 * parseFloat(sumOfFreq)) / 4;

  for (let i = 0; i < cumFreq.length; i++) {
    if (quartile1Place < cumFreq[i]) {
      quartile1Place = i;
      break;
    }
  }

  //Find Quartile 1, special case if the Q1 class is the very first one hence no <cf
  if (quartile1Place == 0) {
    quartile[0] =
      lowerNums[quartile1Place].value -
      0.5 +
      ((sumOfFreq / 4 - 0) / freqInput[quartile1Place].value) * range;
  } else {
    quartile[0] =
      lowerNums[quartile1Place].value -
      0.5 +
      ((sumOfFreq / 4 - parseFloat(cumFreq[quartile1Place - 1])) /
        freqInput[quartile1Place].value) *
        range;
  }

  //Get class of Q2
  var quartile2Place = (2 * parseFloat(sumOfFreq)) / 4;

  for (let i = 0; i < cumFreq.length; i++) {
    if (quartile2Place < cumFreq[i]) {
      quartile2Place = i;
      break;
    }
  }

  //Find Quartile 2
  if (quartile2Place == 0) {
    quartile[1] =
      lowerNums[quartile2Place].value -
      0.5 +
      (((2 * sumOfFreq) / 4 - 0) / freqInput[quartile2Place].value) * range;
  } else {
    quartile[1] =
      lowerNums[quartile2Place].value -
      0.5 +
      (((2 * sumOfFreq) / 4 - parseFloat(cumFreq[quartile2Place - 1])) /
        freqInput[quartile2Place].value) *
        range;
  }

  //Get class of Q3
  var quartile3Place = (3 * parseFloat(sumOfFreq)) / 4;

  for (let i = 0; i < cumFreq.length; i++) {
    if (quartile3Place < cumFreq[i]) {
      quartile3Place = i;
      break;
    }
  }

  //Find Quartile 2
  quartile[2] =
    lowerNums[quartile3Place].value -
    0.5 +
    (((3 * sumOfFreq) / 4 - parseFloat(cumFreq[quartile3Place - 1])) /
      freqInput[quartile3Place].value) *
      range;

  quartile[0] = Math.round(quartile[0] * 100) / 100;
  quartile[1] = Math.round(quartile[1] * 100) / 100;
  quartile[2] = Math.round(quartile[2] * 100) / 100;

  console.log("Q1 = " + quartile[0]);
  console.log("Q2 = " + quartile[1]);
  console.log("Q3 = " + quartile[2]);

  return quartile;
}

function calculateVariance(sumOfFreq, sumOfFreqMidSqrd, mean) {
  var table = document.getElementById("inputTable");
  //Efx^2/n-1 - n(M^2)/n-1
  var variance =
    parseFloat(sumOfFreqMidSqrd) / (sumOfFreq - 1) -
    (sumOfFreq * (parseFloat(mean) * parseFloat(mean))) / (sumOfFreq - 1);

  variance = Math.round(variance * 100) / 100;
  console.log("Variance = " + variance);

  return variance;
}

function calculateSD(variance) {
  var sd = Math.sqrt(variance);
  sd = Math.round(sd * 100) / 100;

  console.log("SD = " + sd);
  return sd;
}

function createOutputArea(mean, median, quartile, variance, sd, iqr, mode) {
  var outputDiv = document.createElement("DIV");
  outputDiv.setAttribute("class", "output bg-light text-dark p-3 rounded-3");
  outputDiv.setAttribute("id", "outputID");
  document.getElementById("outputSide").appendChild(outputDiv);

  var meanText = document.createElement("p");
  var medianText = document.createElement("p");
  var modeText = document.createElement("p");
  var q1Text = document.createElement("p");
  var q2Text = document.createElement("p");
  var q3Text = document.createElement("p");
  var varianceText = document.createElement("p");
  var sdText = document.createElement("p");
  var iqrText = document.createElement("p");

  //meanText.setAttribute("class", "bg-light text-dark");

  outputDiv.appendChild(meanText);
  outputDiv.appendChild(medianText);
  outputDiv.appendChild(modeText);
  outputDiv.appendChild(q1Text);
  outputDiv.appendChild(q2Text);
  outputDiv.appendChild(q3Text);
  outputDiv.appendChild(iqrText);
  outputDiv.appendChild(varianceText);
  outputDiv.appendChild(sdText);

  meanText.innerHTML = "Mean = " + mean;
  medianText.innerHTML = "Median = " + median;
  modeText.innerHTML = "Mode = " + mode;
  q1Text.innerHTML = "Q1 = " + quartile[0];
  q2Text.innerHTML = "Q2 = " + quartile[1];
  q3Text.innerHTML = "Q3 = " + quartile[2];
  iqrText.innerHTML = "IQR = " + iqr;
  varianceText.innerHTML = "Variance = " + variance;
  sdText.innerHTML = "SD = " + sd;
}

//Miscellaneous Functions
//Function that will give alert popup if there is missing values
function checkValues() {
  var lowerNums = document.getElementsByName("lowerInput");
  var upperNums = document.getElementsByName("upperInput");
  var freqInput = document.getElementsByName("freqInput");

  for (let i = 0; i < lowerNums.length - 1; i++) {
    if (
      lowerNums[i].value == "" ||
      upperNums[i].value == "" ||
      freqInput[i].value == ""
    ) {
      return false;
    } else {
      return true;
    }
  }

  return true;
}

//Function that will auto complete class interval based on range and starting value
function autoCompleteClass() {
  var table = document.getElementById("inputTable");
  var lowerNums = document.getElementsByName("lowerInput");
  var upperNums = document.getElementsByName("upperInput");
  var range = upperNums[0].value - lowerNums[0].value + 1;

  if (lowerNums[0].value != "" && upperNums[0].value != "") {
    //window.alert("Autocomplete");

    for (let i = 1; i < table.rows.length - 1; i++) {
      lowerNums[i].value = parseInt(lowerNums[i - 1].value) + parseInt(range);
      upperNums[i].value = parseInt(upperNums[i - 1].value) + parseInt(range);
    }
  }
}
