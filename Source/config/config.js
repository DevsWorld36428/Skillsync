/**
 * @author      Junming
 * @published   April 9, 2024
 * @description Library to config all variables used in the server
 */

const dotenv = require('dotenv')
const Joi = require('joi')

dotenv.config()

const envVariableSchema = Joi.object() // Define a schema for validating objects
  // Specifies the keys(propertise) that are allowed in the object being validated - optional .keys()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development').required(),
    PORT: Joi.number().default(1223),
    MONGODB_URL: Joi.string().required().description('Mongo DB Url'),
    JWT_SECRET: Joi.string().required().description('Token Secret Key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(60)
      .description('minutes after which access tokens will be expired'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(1)
      .description('days after which refresh tokens will be expired'),
    OTP_EXPIRATION_TIME_MINUTE: Joi.number()
      .default(5)
      .description('Once-Time-Password Expiration Time'),
    SMTP_HOST: Joi.string().description("server that will send the emails"),
    SMTP_PORT: Joi.number().description("port to connect to the email server"),
    SMTP_USERNAME: Joi.string().description("username for email server"),
    SMTP_PASSWORD: Joi.string().description("password for email server"),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    STRIPE_SECRET_KEY: Joi.string().required().description("Stripe Secret Key"),
    STRIPE_WEBHOOK_SECRET: Joi.string().required().description("Stripe Webhook Secret"),
    FRONTEND_URL: Joi.string()
      .description("Frontend URL")
      .default("http://localhost:8080"),
  })
  .unknown() // Method allows additional keys in the object that are not explicity defined in the schems

  const { value: envVars, error } = envVariableSchema
    .prefs({ errors: { label: 'key' } })
    .validate(process.env)

  if (error) throw new Error(`Config Validation Error: ${error.message}`)

  module.exports = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongoose: {
      url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    },
    jwt: {
      secret: envVars.JWT_SECRET,
      accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
      refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    },
    email: {
      smtp: {
        host: envVars.SMTP_HOST,
        port: envVars.SMTP_PORT,
        auth: {
          user: envVars.SMTP_USERNAME,
          pass: envVars.SMTP_PASSWORD,
        }
      },
      from: envVars.EMAIL_FROM
    },
    otp: {
      expirationTime: envVars.OTP_EXPIRATION_TIME_MINUTE,
    },
    stripe: {
      secretKey: envVars.STRIPE_SECRET_KEY,
      webhookSecret: envVars.STRIPE_WEBHOOK_SECRET,
    },
    frontend_url: envVars.FRONTEND_URL
  }