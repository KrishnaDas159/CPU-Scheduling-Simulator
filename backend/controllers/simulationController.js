const CPUScheduler = require('../utils/scheduler');

// Available algorithms
const algorithms = [
    { id: 'fcfs', name: 'First Come First Serve (FCFS)', preemptive: false },
    { id: 'sjf', name: 'Shortest Job First (SJF)', preemptive: false },
    { id: 'sjf_preemptive', name: 'Shortest Remaining Time First (SRTF)', preemptive: true },
    { id: 'priority', name: 'Priority Scheduling', preemptive: false },
    { id: 'priority_preemptive', name: 'Priority Scheduling (Preemptive)', preemptive: true },
    { id: 'round_robin', name: 'Round Robin', preemptive: true }
];

exports.getAlgorithms = (req, res) => {
    try {
        res.json({ success: true, algorithms });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching algorithms', error: error.message });
    }
};

exports.runSimulation = (req, res) => {
    try {
        const { processes, algorithm, timeQuantum = 2 } = req.body;

        // Validate algorithm exists
        const algorithmExists = algorithms.find(alg => alg.id === algorithm);
        if (!algorithmExists) {
            return res.status(400).json({ success: false, message: 'Invalid algorithm specified' });
        }

        // Run simulation
        const result = CPUScheduler.simulate(processes, algorithm, timeQuantum);

        res.json({ success: true, result });
    } catch (error) {
        console.error('Simulation error:', error);
        res.status(500).json({ success: false, message: 'Error running simulation', error: error.message });
    }
};
