export class Validator {
    static email(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static password(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password) && password.length >= 8;
    }
    // Validates phone numbers (Example format: (123) 456-7890)
    static phoneNumber(phoneNumber) {
        const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
        return phoneRegex.test(phoneNumber);
    }

    // Validates dates (Format: YYYY-MM-DD)
    static date(date) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        return dateRegex.test(date) && date.length <= 10;
    }

    // Validates names (Allowing international characters)
    static name(name) {
        const nameRegex = /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF' ]+(([',. -][a-zA-Z\u00C0-\u024F\u1E00-\u1EFF ])?[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF' ]*)*$/;
        return nameRegex.test(name);
    }
}
