export const unsafe = (endpoint) => {
  endpoint.unsafe = true

  return endpoint
}

export const endpoint = (address, method, handler, requires, payloadSchema) => {
  return { method, address, handler, requires, payloadSchema }
}
