
class CPUScheduler {
    
    
    
    static fcfs(processes) {
    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    const ganttChart = [];
    const results = [];
    let currentTime = 0;

    for (const process of sortedProcesses) {
        // Add idle time if there is a gap
        if (currentTime < process.arrivalTime) {
            ganttChart.push({
                processId: "IDLE",
                startTime: currentTime,
                endTime: process.arrivalTime
            });
            currentTime = process.arrivalTime;
        }

        const startTime = currentTime;
        const endTime = currentTime + process.burstTime;

        ganttChart.push({
            processId: process.id,
            startTime: startTime,
            endTime: endTime
        });

        results.push({
            ...process,
            startTime: startTime,
            endTime: endTime,
            turnaroundTime: endTime - process.arrivalTime,
            waitingTime: startTime - process.arrivalTime
        });

        currentTime = endTime;
    }

    return { ganttChart, results };
}

    
    static sjf(processes) {
    const processQueue = [...processes];
    const ganttChart = [];
    const results = [];
    let currentTime = 0;
    let completed = 0;

    while (completed < processes.length) {
        const availableProcesses = processQueue.filter(p => 
            p.arrivalTime <= currentTime && !p.completed
        );

        if (availableProcesses.length === 0) {
            
            const nextArrival = Math.min(...processQueue
                .filter(p => !p.completed)
                .map(p => p.arrivalTime)
            );
            ganttChart.push({
                processId: "IDLE",
                startTime: currentTime,
                endTime: nextArrival
            });
            currentTime = nextArrival;
            continue;
        }

        const selectedProcess = availableProcesses.reduce((shortest, current) => 
            current.burstTime < shortest.burstTime ? current : shortest
        );

        const startTime = currentTime;
        const endTime = currentTime + selectedProcess.burstTime;

        ganttChart.push({
            processId: selectedProcess.id,
            startTime,
            endTime
        });

        results.push({
            ...selectedProcess,
            startTime,
            endTime,
            turnaroundTime: endTime - selectedProcess.arrivalTime,
            waitingTime: startTime - selectedProcess.arrivalTime
        });

        selectedProcess.completed = true;
        currentTime = endTime;
        completed++;
    }

    return { ganttChart, results };
}


    // Shortest Remaining Time First (SRTF) Preemptive Algorithm
    static srtfPreemptive(processes) {
    const processQueue = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
    const ganttChart = [];
    const results = [];
    let currentTime = 0;
    let lastProcess = null;
    let segmentStart = 0;

    while (processQueue.some(p => p.remainingTime > 0)) {
        const availableProcesses = processQueue.filter(p => 
            p.arrivalTime <= currentTime && p.remainingTime > 0
        );

        if (availableProcesses.length === 0) {
            const nextArrival = Math.min(...processQueue
                .filter(p => p.remainingTime > 0)
                .map(p => p.arrivalTime)
            );
            // Log IDLE time
            ganttChart.push({
                processId: "IDLE",
                startTime: currentTime,
                endTime: nextArrival
            });
            currentTime = nextArrival;
            lastProcess = null; // reset segment
            continue;
        }

        const selectedProcess = availableProcesses.reduce((shortest, current) => 
            current.remainingTime < shortest.remainingTime ? current : shortest
        );

        if (lastProcess && lastProcess.id !== selectedProcess.id) {
            ganttChart.push({
                processId: lastProcess.id,
                startTime: segmentStart,
                endTime: currentTime
            });
        }

        if (!lastProcess || lastProcess.id !== selectedProcess.id) {
            segmentStart = currentTime;
        }

        selectedProcess.remainingTime--;
        currentTime++;
        lastProcess = selectedProcess;

        if (selectedProcess.remainingTime === 0) {
            ganttChart.push({
                processId: selectedProcess.id,
                startTime: segmentStart,
                endTime: currentTime
            });

            results.push({
                ...selectedProcess,
                endTime: currentTime,
                turnaroundTime: currentTime - selectedProcess.arrivalTime,
                waitingTime: currentTime - selectedProcess.arrivalTime - selectedProcess.burstTime
            });
            lastProcess = null;
        }
    }

    return { ganttChart, results };
}

    // Priority Scheduling Non-Preemptive Algorithm
    static priority(processes) {
    const processQueue = [...processes];
    const ganttChart = [];
    const results = [];
    let currentTime = 0;
    let completed = 0;

    while (completed < processes.length) {
        const availableProcesses = processQueue.filter(p => 
            p.arrivalTime <= currentTime && !p.completed
        );

        if (availableProcesses.length === 0) {
            // CPU is idle until next process arrives
            const nextArrival = Math.min(...processQueue
                .filter(p => !p.completed)
                .map(p => p.arrivalTime)
            );
            ganttChart.push({
                processId: "IDLE",
                startTime: currentTime,
                endTime: nextArrival
            });
            currentTime = nextArrival;
            continue;
        }

        // Select process with highest priority (lower number = higher priority)
        const selectedProcess = availableProcesses.reduce((highest, current) => {
            const currentPriority = current.priority ?? 999;
            const highestPriority = highest.priority ?? 999;
            return currentPriority < highestPriority ? current : highest;
        });

        const startTime = currentTime;
        const endTime = currentTime + selectedProcess.burstTime;

        ganttChart.push({
            processId: selectedProcess.id,
            startTime,
            endTime
        });

        results.push({
            ...selectedProcess,
            startTime,
            endTime,
            turnaroundTime: endTime - selectedProcess.arrivalTime,
            waitingTime: startTime - selectedProcess.arrivalTime
        });

        selectedProcess.completed = true;
        currentTime = endTime;
        completed++;
    }

    return { ganttChart, results };
}

    // Priority Scheduling Preemptive Algorithm
    static priorityPreemptive(processes) {
    const processQueue = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
    const ganttChart = [];
    const results = [];
    let currentTime = 0;
    let lastProcess = null;
    let segmentStart = 0;

    while (processQueue.some(p => p.remainingTime > 0)) {
        const availableProcesses = processQueue.filter(p => 
            p.arrivalTime <= currentTime && p.remainingTime > 0
        );

        if (availableProcesses.length === 0) {
            // CPU is idle until next process arrives
            const nextArrival = Math.min(...processQueue
                .filter(p => p.remainingTime > 0)
                .map(p => p.arrivalTime)
            );
            ganttChart.push({
                processId: "IDLE",
                startTime: currentTime,
                endTime: nextArrival
            });
            currentTime = nextArrival;
            lastProcess = null; // reset active process tracking
            continue;
        }

        // Select process with highest priority (lower number = higher priority)
        const selectedProcess = availableProcesses.reduce((highest, current) => {
            const currentPriority = current.priority ?? 999;
            const highestPriority = highest.priority ?? 999;
            return currentPriority < highestPriority ? current : highest;
        });

        if (lastProcess && lastProcess.id !== selectedProcess.id) {
            ganttChart.push({
                processId: lastProcess.id,
                startTime: segmentStart,
                endTime: currentTime
            });
        }

        if (!lastProcess || lastProcess.id !== selectedProcess.id) {
            segmentStart = currentTime;
        }

        selectedProcess.remainingTime--;
        currentTime++;
        lastProcess = selectedProcess;

        if (selectedProcess.remainingTime === 0) {
            ganttChart.push({
                processId: selectedProcess.id,
                startTime: segmentStart,
                endTime: currentTime
            });

            results.push({
                ...selectedProcess,
                endTime: currentTime,
                turnaroundTime: currentTime - selectedProcess.arrivalTime,
                waitingTime: currentTime - selectedProcess.arrivalTime - selectedProcess.burstTime
            });

            lastProcess = null;
        }
    }

    return { ganttChart, results };
}


    // Round Robin Algorithm
    static roundRobin(processes, timeQuantum = 2) {
        const processQueue = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
        const readyQueue = [];
        const ganttChart = [];
        const results = [];
        let currentTime = 0;

        // Add initial processes to ready queue
        processQueue.forEach(p => {
            if (p.arrivalTime <= currentTime) {
                readyQueue.push(p);
            }
        });

        while (readyQueue.length > 0 || processQueue.some(p => p.remainingTime > 0 && p.arrivalTime > currentTime)) {
            // Add newly arrived processes to ready queue
            processQueue.forEach(p => {
                if (p.arrivalTime <= currentTime && p.remainingTime > 0 && !readyQueue.includes(p)) {
                    readyQueue.push(p);
                }
            });

            if (readyQueue.length === 0) {
    const nextArrival = Math.min(...processQueue
        .filter(p => p.remainingTime > 0 && p.arrivalTime > currentTime)
        .map(p => p.arrivalTime)
    );
    ganttChart.push({
        processId: "IDLE",
        startTime: currentTime,
        endTime: nextArrival
    });
    currentTime = nextArrival;
    continue;
}


            const currentProcess = readyQueue.shift();
            const startTime = currentTime;
            const executionTime = Math.min(timeQuantum, currentProcess.remainingTime);
            const endTime = startTime + executionTime;

            ganttChart.push({
                processId: currentProcess.id,
                startTime: startTime,
                endTime: endTime
            });

            currentProcess.remainingTime -= executionTime;
            currentTime = endTime;

            // Add newly arrived processes during execution
            processQueue.forEach(p => {
                if (p.arrivalTime <= currentTime && p.remainingTime > 0 && 
                    !readyQueue.includes(p) && p.id !== currentProcess.id) {
                    readyQueue.push(p);
                }
            });

            if (currentProcess.remainingTime === 0) {
                // Process completed
                results.push({
                    ...currentProcess,
                    endTime: currentTime,
                    turnaroundTime: currentTime - currentProcess.arrivalTime,
                    waitingTime: currentTime - currentProcess.arrivalTime - currentProcess.burstTime
                });
            } else {
                // Process not completed, add back to ready queue
                readyQueue.push(currentProcess);
            }
        }

        return { ganttChart, results };
    }

    // Calculate average metrics
    static calculateAverageMetrics(results) {
        const totalTurnaroundTime = results.reduce((sum, p) => sum + p.turnaroundTime, 0);
        const totalWaitingTime = results.reduce((sum, p) => sum + p.waitingTime, 0);
        
        return {
            averageTurnaroundTime: totalTurnaroundTime / results.length,
            averageWaitingTime: totalWaitingTime / results.length
        };
    }

    // Main simulation function
    static simulate(processes, algorithm, timeQuantum = 2) {
        let simulation;
        
        switch (algorithm) {
            case 'fcfs':
                simulation = this.fcfs(processes);
                break;
            case 'sjf':
                simulation = this.sjf(processes);
                break;
            case 'sjf_preemptive':
                simulation = this.srtfPreemptive(processes);
                break;
            case 'priority':
                simulation = this.priority(processes);
                break;
            case 'priority_preemptive':
                simulation = this.priorityPreemptive(processes);
                break;
            case 'round_robin':
                simulation = this.roundRobin(processes, timeQuantum);
                break;
            default:
                throw new Error(`Unknown algorithm: ${algorithm}`);
        }

        const averageMetrics = this.calculateAverageMetrics(simulation.results);

        return {
            algorithm: algorithm,
            ganttChart: simulation.ganttChart,
            processes: simulation.results,
            metrics: averageMetrics
        };
    }
}

module.exports = CPUScheduler;

