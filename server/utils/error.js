export const errorThrower = (code, message) => {
    const error = new Error(message);
    error.statusCode = code;
    throw error;
}

export const errorSetter = (code, message) => {
    const error = new Error(message);
    error.statusCode = code;
    return error;
}