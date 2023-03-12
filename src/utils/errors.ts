export const createError = (status, message) => {

    const error: any = new Error(message)

    error.status = status

    return error
}
