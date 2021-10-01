import { checkSchema } from "express-validator";

export const createProjectValidator = checkSchema({
    name: {
        in: ['body'],
        isString: true
    }
})