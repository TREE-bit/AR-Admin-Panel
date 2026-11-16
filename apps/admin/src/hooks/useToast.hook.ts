import { message } from 'ant-design-vue'
export function useToast() {
  const success = message.success
  const error = message.error
  const info = message.info
  const warning = message.warning
  const warn = message.warn
  const loading = message.loading
  return {
    success,
    error,
    warning,
    info,
    warn,
    loading,
  }
}
