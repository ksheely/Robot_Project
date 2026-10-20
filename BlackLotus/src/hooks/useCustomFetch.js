import { useState, useEffect, useRef } from 'react'

const errorSeverity = {
  MAJOR: 'major',
  MINOR: 'minor',
}

/** Primary fetch not using graphQL
 * @param {String} url the full url string of the fetch
 */
export const useCustomFetch = url => {
  const abortControllerRef = useRef(null)

  const [response, setResponse] = useState(null)
  const [error, setError] = useState(null)
  const [databack, setDataback] = useState(null)
  const [isPending, setIsPending] = useState(false)

  // Hook effects
  useEffect(() => {
    if (response || error) {
      setIsPending(false)
    }
  }, [response, error])

  /** Private Methods */
  const defaultOptions = options => {
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    const headers = {
    //   'Accept': "application/json",
      'Content-Type': options.headers && options.headers['Content-Type'] ? options.headers['Content-Type'] : 'application/json',
    //   'x-referrer-url': document.location.origin,
      "Access-Control-Allow-Origin": "*",
      ...options.headers
    }

    const newOptions = {
      ...options,
      body: options.data ? JSON.stringify(options.data) : null,
    //   credentials: options.credentials ?? 'include', 
      cache: options.cache ?? 'no-cache',
      headers,
      signal,
    }
    
    return newOptions
  }

  const urlWithQueryString = params => {
    const paramsArray = Object.entries(params)
    const paramString = paramsArray.reduce((accum, current, index, array) => {
      const isLast = array.length - 1 === index;
      const endChar = isLast ? `` : `&`
      const encodedQueryValue = encodeURIComponent(current[1])
      return accum + `${current[0]}=${encodedQueryValue}` + endChar
    }, '?')

    return `${url}${paramString}`
  }

  // TODO I'd like to clean this up later
  const throwError = async ({ httpFetchResponse, json }) => {
    let errorObj

    // try to get any error info from the response body.
    // if that fails, the use the response itself
    if (!json) {
      try {
        const body = await httpFetchResponse.json()

        errorObj = {
          accessDenied: body.status === 'unauthorized' || body.status === 'unauthorizedStore',
          message: body.message ? body.message : "The server couldn't handle the request",
          severity: body.status === 'unauthorized' || body.status === 'unauthorizedStore' ? errorSeverity.MAJOR : errorSeverity.MINOR,
          type: body.status,
        }
      } catch (error) {
        errorObj = {
          accessDenied: false,
          message: httpFetchResponse.message ? httpFetchResponse.message : "The server couldn't handle the request",
          severity: errorSeverity.MINOR,
          type: 'fetch',
        }
      }
    } else {
      // this is just in case we get a non-error code, but the status is actually an error (ph27)
      errorObj = {
        accessDenied: json.status === 'unauthorized' || json.status === 'unauthorizedStore',
        message: json.message ? json.message : "The server couldn't handle the request",
        severity: json.status === 'unauthorized' || json.status === 'unauthorizedStore' ? errorSeverity.MAJOR : errorSeverity.MINOR,
        type: json.status,
      }
    }

    throw {
      ...errorObj,
      status: httpFetchResponse.status,
    }
  }

  const makeCall = async (fullUrl, method, options, databack) => {
    abort()
    setResponse(null)
    setError(null)
    setIsPending(true)

    const request = {
      method,
      ...defaultOptions(options),
    }

    try {
      const httpFetchResponse = await fetch(fullUrl, {
        ...request,
      })

      // if we get anything other than success codes, throw error immediately
      if (httpFetchResponse.status < 200 || httpFetchResponse.status >= 300) await throwError({ httpFetchResponse })

      // If there's a response but it's an error throw an error, otherwise get the data
      const json = await httpFetchResponse.json()
    //   const data = await json.status !== 'success'
    //     ? throwError({ httpFetchResponse, json })
    //     : json.data

      setResponse(json)
      setDataback({
        // message: json.message,
        // status: json.status,
        timestamp: Date(),
        ...databack,
      })
    } catch (error) {
      if (error.name !== 'AbortError' || error.statusCode !== 500) {
        setError(error)
        setDataback({
          accessDenied: error.accessDenied,
          message: error.message ? error.message : "The server couldn't handle the request",
          status: error.status ? error.status : 'error',
          timestamp: Date(),
          ...databack,
        })
      }
    }
  }

  /** Public Methods */
  // TODO: update this to object params rather than this
  const get = (params, options = {}, databack = {}, dynamicUrl) => {
    const fullUrl = !!dynamicUrl 
      ? dynamicUrl 
      : params 
      ? urlWithQueryString(params) 
      : url
    makeCall(fullUrl, 'GET', options, databack)
  }

  const post = (options = {}, databack) => {
    makeCall(url, 'POST', options, databack = {})
  }

  const abort = () => {
    if (isPending) abortControllerRef.current.abort()
  }

  const request = {
    get,
    post,
    abort,
  }

  return {request, response, error, databack}
}
 