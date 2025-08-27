class ApiError extends Error {
    constructor(statusCode,
         message="Something went Wrong",
         errors = [],
         statck = ""        
        ) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.data = null;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = statck
        }
        else {
            Error.captureStackTrace(this, this.constructor) 
        }
    }
}