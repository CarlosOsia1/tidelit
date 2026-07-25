import Constants from 'expo-constants'

const DEV_SERVER_PORT = 8000

const debuggerHost = Constants.expoConfig?.hostUri?.split(':')[0]

export const API_URL = debuggerHost
  ? `http://${debuggerHost}:${DEV_SERVER_PORT}`
  : 'http://127.0.0.1:8000'
