import React from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import {
  FaInfo,
  FaCheck,
  FaExclamationTriangle,
  FaBug,
  FaExclamationCircle,
} from "react-icons/fa"

// Define string literal types for toast types
type ToastType = 'success' | 'info' | 'error' | 'warning'

interface ToastMessageProps {
  type: ToastType
  message: string
}

export const diplayIcon = (type: ToastType) => {
  switch (type) {
    case "success":
      return <FaCheck />
    case "info":
      return <FaInfo />
    case "error":
      return <FaExclamationCircle />
    case "warning":
      return <FaExclamationTriangle />
    default:
      return <FaBug />
  }
}

const ToastMessage: React.FC<ToastMessageProps> = ({ type, message }: ToastMessageProps) =>
  toast[type](
    <div style={{ display: "flex" }}>
      <div style={{ flexGrow: 1, fontSize: 15, padding: "8px 12px" }}>
        {message}
      </div>
    </div>
  )

ToastMessage.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'info', 'error', 'warning']).isRequired,
}

ToastMessage.dismiss = toast.dismiss

export default ToastMessage