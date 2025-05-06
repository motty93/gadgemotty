import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import React from 'react'

type AlertType = 'info' | 'success' | 'warning' | 'error'

interface CustomAlertProps {
  type?: AlertType
  title?: string
  children: React.ReactNode
}

export function CustomAlert({ type = 'info', title, children }: CustomAlertProps) {
  // Alert styling based on type
  const styles = {
    info: {
      container: 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-900',
      icon: <Info className="h-5 w-5 text-blue-500 dark:text-blue-400" />,
      title: 'text-blue-800 dark:text-blue-300',
      body: 'text-blue-700 dark:text-blue-300',
    },
    success: {
      container: 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-900',
      icon: <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />,
      title: 'text-green-800 dark:text-green-300',
      body: 'text-green-700 dark:text-green-300',
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-900',
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />,
      title: 'text-yellow-800 dark:text-yellow-300',
      body: 'text-yellow-700 dark:text-yellow-300',
    },
    error: {
      container: 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-900',
      icon: <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />,
      title: 'text-red-800 dark:text-red-300',
      body: 'text-red-700 dark:text-red-300',
    },
  }

  const style = styles[type]

  return (
    <div className={`p-4 my-4 rounded-md border ${style.container}`}>
      <div className="flex">
        <div className="flex-shrink-0 mr-3">{style.icon}</div>
        <div>
          {title && <h4 className={`text-sm font-medium mb-1 ${style.title}`}>{title}</h4>}
          <div className={`text-sm ${style.body}`}>{children}</div>
        </div>
      </div>
    </div>
  )
}
