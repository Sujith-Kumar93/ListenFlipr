const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.podcastSchema = Joi.object({
  podcast: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    //image:Joi.string().required(),
    speaker: Joi.string().required(),
    type: Joi.string().required(),
    category: Joi.string().required(),
  }).required(),
});
