class ApiError extends Error {
    constructor(statusCode,
         message="Something went Wrong",
         data,      
        ) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = StatusCode < 400;

        if (stack) {
            this.stack = stack
        }
        else {
            Error.captureStackTrace(this, this.constructor) 
        }
    }
}