import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  console.log('errorHandler err:', err);
  if (err instanceof HttpError) {
    return res.status(err.status).send({
      message: err.message,
      status: err.status,
    });
  }

  res.status(500).send({
    message: 'Server error',
    status: 500,
  });
};
