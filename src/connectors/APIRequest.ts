// import BACKEND_URL from "@config/Backend";

import { BACKEND_URL } from '../constants/Constants'

export interface OAPIResponse<T = {}> {
  /**
   * Interface representating a serialized API response
   */
  statusCode: number
  data: T
  message: string
}

export class APIResponse<T = {}> implements OAPIResponse<T> {
  statusCode: number
  success: boolean
  data: T
  message: string

  constructor(statusCode: number, success: boolean, data: T, message: string) {
    this.statusCode = statusCode
    this.success = success
    this.data = data
    this.message = message
  }

  ok() {
    if (this.statusCode >= 200 && this.statusCode <= 300) {
      return true
    } else {
      return false
    }
  }
}

export class APIRequest {
  endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
  }

  async get<T>(): Promise<APIResponse<T>> {
    const fixedUrl = BACKEND_URL + this.endpoint
    return new Promise((resolve, reject) => {
      let headers = {
        'Content-Type': 'application/json',
      }

      /*if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        headers["Authorization"] = `Token ${token}`;
      }*/

      fetch(fixedUrl, {
        method: 'GET',
        credentials: 'include',
        headers,
      })
        .then((response) => response.json())
        .then((responseData) => {
          const apiResponse = new APIResponse<T>(
            responseData.status,
            responseData.success,
            responseData.data,
            responseData.message
          )

          resolve(apiResponse)
        })
        .catch((err) => {
          console.error('There was an error making the request to the backend')
          console.error(err)

          reject()
        })
        .catch((err) => {
          console.error('There was an error serializing the request')
          console.error(err)
        })
    })
  }

  async post<T>(postData: any): Promise<APIResponse<T>> {
    const fixedUrl = BACKEND_URL + this.endpoint
    return new Promise((resolve, reject) => {
      const headers = {
        'Content-Type': 'application/json',
      }

      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token')
        headers['Authorization'] = `Token ${token}`
      }

      fetch(fixedUrl, {
        method: 'POST',
        body: JSON.stringify(postData),
        headers,
        credentials: 'include',
      })
        .then((response) => response.json())
        .then((responseData) => {
          const apiResponse = new APIResponse<T>(
            responseData.status,
            responseData.success,
            responseData.data,
            responseData.message
          )
          resolve(apiResponse)
        })
        .catch((err) => {
          console.error('There was an error making the request to the backend')
          console.error(err)

          reject()
        })
        .catch((err) => {
          console.error('There was an error serializing the request')
          console.error(err)
        })
    })
  }

  async upload<T>(file: File, postData: {}): Promise<APIResponse<T>> {
    const formData = new FormData()
    formData.append('file', file)
    // Iterate through postData fields
    for (const key in postData) {
      formData.append(key, postData[key])
    }

    const fixedUrl = BACKEND_URL + this.endpoint
    return new Promise((resolve, reject) => {
      const headers = {}

      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token')
        headers['Authorization'] = `Token ${token}`
      }

      headers['Content-Disposition'] = `attachment; filename="${file.name}"`

      fetch(fixedUrl, {
        method: 'PUT',
        // Create form body with file
        body: formData,
        headers,
        credentials: 'include',
      })
        .then((response) => response.json())
        .then((responseData) => {
          const apiResponse = new APIResponse<T>(
            responseData.status,
            responseData.success,
            responseData.data,
            responseData.message
          )
          resolve(apiResponse)
        })
        .catch((err) => {
          console.error('There was an error making the request to the backend')
          console.error(err)

          reject()
        })
        .catch((err) => {
          console.error('There was an error serializing the request')
          console.error(err)
        })
    })
  }
}

export function createAPIRequest(endpoint: string) {
  return new APIRequest(endpoint)
}
