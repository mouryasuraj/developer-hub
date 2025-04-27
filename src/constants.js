//User Schema
export const allowedUserFieldUpdate = ["firstName","lastName","gender","photoUrl","about"]
export const allowedSignUpFields = ["firstName","lastName","email","password","age","gender","about","photoUrl"]
export const allowedLoginFields = ["email","password"]
export const allowedGenders = ["Male","Female","Others"];
export const allowedResetPasswordFields = ["currentPassword", "newPassword", "confirmPassword"]
export const allowedStatus = ["ignored", "intereseted","accept", 'reject']
