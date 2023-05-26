export const createError = (status: any, message: any) => {

    const error: any = new Error(message)

    error.status = status

    return error
}
