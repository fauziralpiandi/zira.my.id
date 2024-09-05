import validator from 'validator'

export function validateEmail(email: string): boolean {
  return validator.isEmail(email)
}

export function validateFeedback(
  name: string,
  email: string,
  message: string,
): string | null {
  if (!name.trim()) return 'Name is required.'
  if (!validator.isEmail(email)) return 'Invalid email address.'
  if (message.trim().length < 50 || message.length > 500)
    return 'Message must be between 50 and 500 characters long.'
  return null
}
