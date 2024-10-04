import validator from 'validator'

export function validateEmail(email: string): boolean {
  return validator.isEmail(email)
}

export function validateMessage(
  name: string,
  email: string,
  message: string,
): string | null {
  if (!name.trim()) return 'Name is required'
  if (!validator.isEmail(email)) return 'Invalid email address'
  if (message.trim().length < 25 || message.length > 250)
    return 'Message must be between 25 and 250 characters long.'
  return null
}
