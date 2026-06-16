const { sendError } = require('../utils/apiResponse');

const validate = (schema) => async (req, res, next) => {
  try {
    const validated = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    
    req.body = validated.body || req.body;
    req.query = validated.query || req.query;
    req.params = validated.params || req.params;

    return next();
  } catch (error) {
    if (error.name === 'ZodError') {
      const issues = error.issues || error.errors || [];
      const errors = issues.map(e => `${e.path.join('.').replace('body.', '')}: ${e.message}`);
      return sendError(res, 'Validation failed', 400, errors);
    }
    return next(error);
  }
};

module.exports = validate;
