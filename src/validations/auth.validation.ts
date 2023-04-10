import Joi from "joi"

const loginSchema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().required(),
    deviceToken: Joi.string().trim(),
});

const createUserSchema = Joi.object({
    name: Joi.string().trim().required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().required(),
    gender: Joi.string().trim().required(),
    phoneNumber: Joi.string().trim().required().pattern(/^(\+84|84|0){1}([3|5|7|8|9]){1}([0-9]{8})$/),
    baseSalary: Joi.number(),
});

const updateUserSchema = Joi.object({
    name: Joi.string().trim().required(),
    email: Joi.string().trim().email().required(),
    phoneNumber: Joi.string().trim().required().pattern(/^(\+84|84|0){1}([3|5|7|8|9]){1}([0-9]{8})$/),
});

export  {
    loginSchema,
    createUserSchema,
    updateUserSchema
};