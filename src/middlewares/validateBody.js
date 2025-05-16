export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    res.status(400).json({
      message: 'Validation error',
      status: 400,
      errors: error.details.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      })),
    });
  }
};
