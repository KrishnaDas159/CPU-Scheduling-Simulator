


import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Trash2, Play, RotateCcw, Plus } from 'lucide-react'
import GanttChart from './components/GanttChart.jsx'
import ProcessMetrics from './components/ProcessMetrics.jsx'
import './App.css'

function App() {
  const [processes, setProcesses] = useState([])
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('')
  const [timeQuantum, setTimeQuantum] = useState(2)
  const [simulationResult, setSimulationResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [newProcess, setNewProcess] = useState({
    id: '',
    arrivalTime: '',
    burstTime: '',
    priority: ''
  })

  const algorithms = [
    { id: 'fcfs', name: 'First Come First Serve (FCFS)', needsPriority: false },
    { id: 'sjf', name: 'Shortest Job First (SJF)', needsPriority: false },
    { id: 'sjf_preemptive', name: 'Shortest Remaining Time First (SRTF)', needsPriority: false },
    { id: 'priority', name: 'Priority Scheduling', needsPriority: true },
    { id: 'priority_preemptive', name: 'Priority Scheduling (Preemptive)', needsPriority: true },
    { id: 'round_robin', name: 'Round Robin', needsPriority: false }
  ]

  const selectedAlgorithmInfo = algorithms.find(alg => alg.id === selectedAlgorithm)

  const addProcess = () => {
    if (!newProcess.id || !newProcess.arrivalTime || !newProcess.burstTime) {
      alert('Please fill in all required fields (ID, Arrival Time, Burst Time)')
      return
    }

    if (processes.find(p => p.id === newProcess.id)) {
      alert('Process ID must be unique')
      return
    }

    const process = {
      id: newProcess.id,
      arrivalTime: parseInt(newProcess.arrivalTime),
      burstTime: parseInt(newProcess.burstTime),
      priority: newProcess.priority ? parseInt(newProcess.priority) : undefined
    }

    setProcesses([...processes, process])
    setNewProcess({ id: '', arrivalTime: '', burstTime: '', priority: '' })
  }

  const removeProcess = (processId) => {
    setProcesses(processes.filter(p => p.id !== processId))
  }

  const clearAll = () => {
    setProcesses([])
    setSimulationResult(null)
    setNewProcess({ id: '', arrivalTime: '', burstTime: '', priority: '' })
  }

  const runSimulation = async () => {
    if (processes.length === 0) {
      alert('Please add at least one process')
      return
    }

    if (!selectedAlgorithm) {
      alert('Please select a scheduling algorithm')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:3000/api/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          processes: processes,
          algorithm: selectedAlgorithm,
          timeQuantum: timeQuantum
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setSimulationResult(data.result)
      } else {
        alert(`Simulation failed: ${data.message}`)
      }
    } catch (error) {
      alert(`Error running simulation: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            CPU Scheduling Simulator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Visualize and analyze different CPU scheduling algorithms
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Process Input Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add Process
                </CardTitle>
                <CardDescription>
                  Enter process details to add to the simulation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="processId">Process ID</Label>
                  <Input
                    id="processId"
                    placeholder="e.g., P1"
                    value={newProcess.id}
                    onChange={(e) => setNewProcess({...newProcess, id: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="arrivalTime">Arrival Time</Label>
                  <Input
                    id="arrivalTime"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={newProcess.arrivalTime}
                    onChange={(e) => setNewProcess({...newProcess, arrivalTime: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="burstTime">Burst Time</Label>
                  <Input
                    id="burstTime"
                    type="number"
                    min="1"
                    placeholder="1"
                    value={newProcess.burstTime}
                    onChange={(e) => setNewProcess({...newProcess, burstTime: e.target.value})}
                  />
                </div>
                {selectedAlgorithmInfo?.needsPriority && (
                  <div>
                    <Label htmlFor="priority">Priority (lower = higher priority)</Label>
                    <Input
                      id="priority"
                      type="number"
                      min="0"
                      placeholder="1"
                      value={newProcess.priority}
                      onChange={(e) => setNewProcess({...newProcess, priority: e.target.value})}
                    />
                  </div>
                )}
                <Button variant="default" onClick={addProcess} className="w-full">
                  Add Process
                </Button>
              </CardContent>
            </Card>

            {/* Algorithm Selection */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Algorithm Selection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="algorithm">Scheduling Algorithm</Label>
                  <Select value={selectedAlgorithm} onValueChange={setSelectedAlgorithm}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select algorithm" />
                    </SelectTrigger>
                    <SelectContent>
                      {algorithms.map((alg) => (
                        <SelectItem key={alg.id} value={alg.id}>
                          {alg.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedAlgorithm === 'round_robin' && (
                  <div>
                    <Label htmlFor="timeQuantum">Time Quantum</Label>
                    <Input
                      id="timeQuantum"
                      type="number"
                      min="1"
                      value={timeQuantum}
                      onChange={(e) => setTimeQuantum(parseInt(e.target.value))}
                    />
                  </div>
                )}
                <div className="flex gap-2">
                  <Button 
                    onClick={runSimulation} 
                    disabled={isLoading || processes.length === 0 || !selectedAlgorithm}
                    className="flex-1"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {isLoading ? 'Running...' : 'Simulate'}
                  </Button>
                  <Button onClick={clearAll} variant="outline">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Process List and Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Process List */}
            <Card>
              <CardHeader>
                <CardTitle>Process Queue ({processes.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {processes.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No processes added yet</p>
                ) : (
                  <div className="space-y-2">
                    {processes.map((process) => (
                      <div key={process.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-4">
                          <Badge variant="secondary">{process.id}</Badge>
                          <span className="text-sm">
                            Arrival: {process.arrivalTime}, Burst: {process.burstTime}
                            {process.priority !== undefined && `, Priority: ${process.priority}`}
                          </span>
                        </div>
                        <Button
                          onClick={() => removeProcess(process.id)}
                          variant="ghost"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Simulation Results */}
            {simulationResult && (
              <>
                <GanttChart 
                  ganttChart={simulationResult.ganttChart}
                  algorithm={selectedAlgorithmInfo?.name || selectedAlgorithm}
                />
                <ProcessMetrics 
                  processes={simulationResult.processes}
                  metrics={simulationResult.metrics}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

