
function resetInput() {
    document.querySelector("input").value = "";
    //document.getElementById("output").innerHTML = "";

    var outputExists = document.getElementById("output");

  if (typeof outputExists != "undefined" && outputExists != null) {
    document
      .getElementById("outputSide")
      .removeChild(document.getElementById("output"));
  }
}

function ugSolve() {
    var ugInput = document.querySelector("input").value;
    const ugArray = ugInput.split(" ");  
    ugArray.sort();


    console.log(ugArray);

    var outputDiv = document.createElement("DIV");
    outputDiv.setAttribute("class", "output bg-light text-dark p-3 rounded-3");
    outputDiv.setAttribute("id", "output");
    document.getElementById("outputSide").appendChild(outputDiv);

    ugMean(ugArray);
    ugMedian(ugArray);
    ugMode(ugArray);
    ugQuartiles(ugArray);
    ugSD(ugArray);
}

function ugMean(ugArray) {
    let mean = 0;
    let cumFreq = 0;
    for (let i = 0; i<ugArray.length; i++){
        cumFreq = cumFreq + parseInt(ugArray[i]);
    }
    mean = cumFreq/ugArray.length;

    mean = Math.round(mean*100)/100;

    document.getElementById("output").innerHTML = "Mean: " + mean;
}

function ugMedian(ugArray) {
    let median = 0;
    let p1 = 0;
    let p2 = 0;
    
    if (ugArray.length %2 != 0){ //odd
        median = parseFloat(ugArray[(ugArray.length+1)/2-1]);
        console.log(median);
    }
    else { //even
        p1 = parseFloat(ugArray[(ugArray.length)/2-1]);
        p2 = parseFloat((ugArray[(ugArray.length)/2]));
        console.log(p1);
        console.log(p2);
        median = (p1+p2)/2;
    }

    median = Math.round(median*100)/100;

    document.getElementById("output").innerHTML += "<br />Median: " + median;
}

function ugMode(ugArray){

    const frequencyMap = {};
    let mode = ugArray[0];
    let maxCount = 1;

    for (let i = 0; i<ugArray.length; i++){
        const element = ugArray[i];
        if(frequencyMap[element]){
            frequencyMap[element]++;
        }else{
            frequencyMap[element] = 1;
        }
        if(frequencyMap[element]>maxCount){
            mode = element;
            maxCount = frequencyMap[element];
        }
    }

    document.getElementById("output").innerHTML += "<br />Mode: " + mode;

}

function ugQuartiles(ugArray) {
    let tq1 = 0;
    let tq2 = 0;
    let tq3 = 0;
    let iqr = 0;

    tq1 = (ugArray.length+1)/4;
    let o1 = Math.floor(tq1);
    let q1 = parseFloat(ugArray[o1-1])+parseFloat(((tq1-o1)*(ugArray[o1]-ugArray[o1-1])));

    tq2 = (2*(ugArray.length+1))/4;
    let o2 = Math.floor(tq2);
    let q2 = parseFloat(ugArray[o2-1])+parseFloat(((tq2-o2)*(ugArray[o2]-ugArray[o2-1])));

    tq3 = (3*(ugArray.length+1))/4;
    let o3 = Math.floor(tq3);
    let q3 = parseFloat(ugArray[o3-1])+parseFloat(((tq3-o3)*(ugArray[o3]-ugArray[o3-1])));

    iqr = q3 - q1;

    q1 = Math.round(q1*100)/100;
    q2 = Math.round(q2*100)/100;
    q3 = Math.round(q3*100)/100;
    iqr = Math.round(iqr*100)/100;

    document.getElementById("output").innerHTML += 
    "<br />Q1: " + q1 +
    "<br />Q2: " + q2 +
    "<br />Q3: " + q3 +
    "<br />IQR: " + iqr;
}

function ugSD(ugArray) {
    let mean = 0;
    let cumFreq = 0;

    for (let i = 0; i<ugArray.length; i++){
        cumFreq = cumFreq + parseInt(ugArray[i]);
    }
    mean = cumFreq/ugArray.length;

    let sumMn = 0;   
    let sumSq = 0;
    for (let i = 0; i<ugArray.length; i++){     
        sumSq += parseFloat((ugArray[i])**2);
    }
    sumMn += parseFloat((cumFreq)**2)/ugArray.length;
    let vance = (sumSq-sumMn)/ugArray.length;
    let sd = parseFloat(Math.sqrt(vance));

    vance = Math.round(vance*100)/100;
    sd = Math.round(sd*100)/100;

    document.getElementById("output").innerHTML += 
    "<br />Variance: " + vance +
    "<br />Standard Deviation: " + sd.toFixed(2);
}

//25 20 39 18 25 36 11 16 20 32 22 14 17 31 21 21 21 21