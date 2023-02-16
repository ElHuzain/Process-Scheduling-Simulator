let question = document.getElementById('title');
let textBox = document.getElementById('processAmount');
let stage = 0;
let done = 0;
let type = 'SJF';
let quantum = 5;
let quantumCounter = quantum;
let preemitive = true;
class Process {
    constructor(number, brust, priority, arrivalTime, endTime, turnAroundTime, waitingTime){
        this.number = number;
        this.brustTime = brust;
        this.brust = brust;
        this.priority = priority;
        this.arrivalTime = arrivalTime;
        this.endTime = endTime;
        this.turnAroundTime = turnAroundTime;
        this.waitingTime = waitingTime;
        this.completed = false;
    }
}

let time;
if(type == 'RR') time = 0;
else time = -1;

let p1 = new Process(1, 50, 4, 0);
let p2 = new Process(2, 25, 2, 10);
let p3 = new Process(3, 30, 1, 15);
let p4 = new Process(4, 35, 3, 20);
let p5 = new Process(5, 30, 2, 25);
//let pArr = [p1, p2];
let pArr = [p1, p2, p3, p4, p5];
let tArr = [];
let activeProcesses = [];
let completed = 0;
let runningProcess;

function init(){
    if(type == 'FCFS' || type == 'RR') preemitive = false;
    setTimeout(function () {
        time++;
        if(activeProcesses.length < pArr.length) activeProcess();
        handleProcesses();
        let remaining = 0;
        pArr.forEach(process => {
            if(process.brust == 0) {
                remaining++;
            }
        })
        
        if(isDone() == true){
            console.log("DONE!");
            let avgWaiting = 0;
            pArr.forEach(process => {
                process.turnAroundTime = process.endTime - process.arrivalTime;
                process.waitingTime = process.turnAroundTime - process.brustTime;
                avgWaiting+=process.waitingTime;
                console.log(`P${process.number}\nEnd time: ${process.endTime}\nTurn around time: ${process.turnAroundTime}\nWaiting time: ${process.waitingTime}`)
            })
            console.log(`Average waiting time = ${avgWaiting}/${pArr.length} = ${avgWaiting/pArr.length}`)
            return;
        }
        init();
    }, 50);
}


function handleProcesses(){
    if(runningProcess != undefined && runningProcess.brust == 0) {
        console.log(`P${runningProcess.number} has been completed at ${time}.`)
        runningProcess.completed = true;
        activeProcesses.splice(activeProcesses.indexOf(runningProcess), 1);
        completed++;
        runningProcess.endTime = time;
        runningProcess = undefined;
    }
    if(runningProcess == undefined){
        chooseProcess();
        if(runningProcess != undefined) console.log(`P${runningProcess.number} is now operating at ${time}`)
    }
    if(runningProcess != undefined && runningProcess.completed == false && runningProcess.brust > 0) {
        if(type == 'RR'){ 
            quantumCounter--;
            runningProcess.brust--;
            if(runningProcess.brust == 0){
                console.log(`P${runningProcess.number} has been COMPLETED at ${time}`)
                runningProcess.completed = true;
                runningProcess.endTime = time;
                activeProcesses.splice(activeProcesses.indexOf(runningProcess), 1);
                quantumCounter = quantum;
                chooseProcess();
            }
            else if(time % 5 == 0){
                console.log(`P${runningProcess.number} has finished a run at ${time} (${runningProcess.brust} remaining)`)
                quantumCounter = quantum;
                chooseProcess();
            }
        }
        else runningProcess.brust--;
    }
}

function activeProcess(){
    for(i = 0; i < pArr.length; i++){
        if(pArr[i].completed == false){
            if(pArr[i].arrivalTime <= time && !activeProcesses.includes(pArr[i])) {
                activeProcesses.push(pArr[i]);
                if(preemitive == true) {
                    if(runningProcess != undefined){
                        let oldProcess = runningProcess;
                        chooseProcess();
                        if(oldProcess != runningProcess && runningProcess == pArr[i]) {
                            if(oldProcess.brustTime == time){
                                console.log(`P${oldProcess.number} has been completed at ${time}.`)
                                oldProcess.completed = true;
                                activeProcesses.splice(activeProcesses.indexOf(oldProcess), 1);
                                completed++;
                                oldProcess.endTime = time;
                            } else if(oldProcess.brustTime == oldProcess.time){
                                console.log(`P${runningProcess.number} is now operating at ${time}`)
                            }
                            else console.log(`P${oldProcess.number} has been interrupted by P${runningProcess.number} at ${time}`)
                        }
                    }
                }
            }
        }
        else if(pArr[i].completed == true){
            activeProcesses.splice(activeProcesses.indexOf(pArr[i]), 0);
        }
    }
    return (activeProcesses.length > 0)
}

function chooseProcess(){
    if(runningProcess == undefined || preemitive == true || type == 'RR'){
        if(type == 'FCFS'){
            for(i = 0; i < activeProcesses.length; i++){
                if(activeProcesses[i].completed == false) return runningProcess = activeProcesses[i];
            }
        }
        else if(type == 'SJF'){
            return runningProcess = shortestRunning();
        }
        else if(type == 'PRI'){
            return runningProcess = bestPRI();
        }
        else if(type == 'RR'){
            if(runningProcess == undefined) runningProcess = activeProcesses[0];
            else {
                runningProcess = activeProcesses[activeProcesses.indexOf(runningProcess)+1];
            }
        }
    }
}

function isDone(){
    let result = true;
    pArr.forEach(process => {
        if(process.completed == false) {
            result = false;
        }
    })
    return result;
}

function bestPRI(){
    let PRI = undefined;
    if(activeProcesses.length == 1){
        PRI = activeProcesses[0];
        return PRI;
    }
    activeProcesses.forEach(process => {
        if(process.completed == false){
            if(PRI == undefined){
                PRI = process;
            }
            else {
                if(PRI.priority > process.priority) PRI = process;
            }
        }
    })
    return PRI;
}

function shortestRunning(){
    let shortest = undefined;
    if(activeProcesses.length == 1){
        shortest = activeProcesses[0];
        return shortest;
    }
    activeProcesses.forEach(process => {
        if(process.completed == false){
            if(shortest == undefined){
                shortest = process;
            }
            else {
                if(shortest.brust > process.brustTime) shortest = process;
            }
        }
    })
    return shortest;
}

function getShortest(){
    let shortest;
    pArr.forEach(process => {
        if(process.completed == false && process.brust > 0){
            if(shortest == undefined){
                shortest = process;
            }
            else {
                if(shortest.brust > process.brust){
                    shortest = process;
                }
            }
        }
    })
    return shortest;
}

