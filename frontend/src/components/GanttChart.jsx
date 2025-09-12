import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'

const GanttChart = ({ ganttChart, algorithm }) => {
  if (!ganttChart || ganttChart.length === 0) {
    return null
  }

  
  const totalTime = Math.max(...ganttChart.map(segment => segment.endTime))
  
 
  const processColors = {}
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500',
    'bg-pink-500', 'bg-indigo-500', 'bg-red-500', 'bg-teal-500'
  ]
  
  let colorIndex = 0
  ganttChart.forEach(segment => {
    if (!processColors[segment.processId]) {
      processColors[segment.processId] = colors[colorIndex % colors.length]
      colorIndex++
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gantt Chart - {algorithm}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Timeline */}
          <div className="relative">
            <div className="flex border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden min-h-16">
              {ganttChart.map((segment, index) => {
                const width = ((segment.endTime - segment.startTime) / totalTime) * 100
                return (
                  <div
                    key={index}
                    className={`${processColors[segment.processId]} flex items-center justify-center text-white font-semibold text-sm relative border-r border-white last:border-r-0`}
                    style={{ width: `${width}%` }}
                  >
                    <span className="truncate px-1">{segment.processId}</span>
                    
                    <div className="absolute -bottom-6 left-0 text-xs text-gray-600 dark:text-gray-400">
                      {segment.startTime}
                    </div>
                    {index === ganttChart.length - 1 && (
                      <div className="absolute -bottom-6 right-0 text-xs text-gray-600 dark:text-gray-400">
                        {segment.endTime}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="h-6"></div> 
          </div>

          
          <div className="flex flex-wrap gap-2">
            {Object.entries(processColors).map(([processId, color]) => (
              <div key={processId} className="flex items-center gap-2">
                <div className={`w-4 h-4 ${color} rounded`}></div>
                <span className="text-sm font-medium">{processId}</span>
              </div>
            ))}
          </div>

          
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Execution Timeline:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {ganttChart.map((segment, index) => (
                <div key={index} className="text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded">
                  <Badge variant="secondary" className="mb-1">{segment.processId}</Badge>
                  <div>Time: {segment.startTime} - {segment.endTime}</div>
                  <div>Duration: {segment.endTime - segment.startTime}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default GanttChart

