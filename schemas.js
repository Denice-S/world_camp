const BaseJoi=require('joi');
const sanitizeHtml=require('sanitize-html');

//this is an extension to joi written to strip out any html entered.
const extension=(joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean=sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean!==value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi=BaseJoi.extend(extension)
//define a schema for joi to use, we will only get to see the reaulting message from this if we make it past the client side validation we have in place.
module.exports.campsiteSchema=Joi.object({
    campsite: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML(),
        // image: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
})

module.exports.reviewSchema=Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML(),
    }).required()
})