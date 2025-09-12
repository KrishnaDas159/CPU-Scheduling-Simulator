import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'

const ProcessMetrics = ({ processes, metrics }) => {
  if (!processes || processes.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Summary Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {metrics.averageTurnaroundTime.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Average Turnaround Time
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {metrics.averageWaitingTime.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Average Waiting Time
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Process Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>Process Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Process</TableHead>
                  <TableHead className="text-center">Arrival Time</TableHead>
                  <TableHead className="text-center">Burst Time</TableHead>
                  <TableHead className="text-center">Start Time</TableHead>
                  <TableHead className="text-center">End Time</TableHead>
                  <TableHead className="text-center">Turnaround Time</TableHead>
                  <TableHead className="text-center">Waiting Time</TableHead>
                  {processes.some(p => p.priority !== undefined) && (
                    <TableHead className="text-center">Priority</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {processes.map((process) => (
                  <TableRow key={process.id}>
                    <TableCell>
                      <Badge variant="secondary">{process.id}</Badge>
                    </TableCell>
                    <TableCell className="text-center">{process.arrivalTime}</TableCell>
                    <TableCell className="text-center">{process.burstTime}</TableCell>
                    <TableCell className="text-center">{process.startTime}</TableCell>
                    <TableCell className="text-center">{process.endTime}</TableCell>
                    <TableCell className="text-center font-semibold text-blue-600 dark:text-blue-400">
                      {process.turnaroundTime}
                    </TableCell>
                    <TableCell className="text-center font-semibold text-green-600 dark:text-green-400">
                      {process.waitingTime}
                    </TableCell>
                    {processes.some(p => p.priority !== undefined) && (
                      <TableCell className="text-center">
                        {process.priority !== undefined ? process.priority : '-'}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Formulas */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-semibold mb-2">Formulas:</h4>
            <div className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
              <div><strong>Turnaround Time</strong> = End Time - Arrival Time</div>
              <div><strong>Waiting Time</strong> = Start Time - Arrival Time</div>
              <div><strong>Response Time</strong> = Start Time - Arrival Time (for non-preemptive algorithms)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProcessMetrics

