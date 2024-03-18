export class Formatter {
    // Formats date from YYYY-MM-DD to a more readable format like "March 17, 2024"
    static formatDateWithFullMonth(dateString) {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
        const monthName = months[month - 1];
        return `${monthName} ${day}, ${year}`;
    }


    static formatPhoneNumber(phoneNumber) {
        // if (phoneNumber <= 10) return phoneNumber;
        // Remove all non-digits, explicitly disallowing letters

        const cleaned = ('' + phoneNumber).replace(/\D/g, '');

        // // Enforce a limit of 10 digits
        const trimmed = cleaned.substring(0, 10);

        // Initialize formatted as an empty string for numbers less than 3 digits
        let formatted = '';

        // Apply formatting based on the length of the input
        if (trimmed.length >= 3) {
            formatted += `(${trimmed.substring(0, 3)})`;
            if (trimmed.length >= 6) {
                // Include a space after the area code and a dash after the first 3 digits of the subscriber number
                formatted += ` ${trimmed.substring(3, 6)}-${trimmed.substring(6)}`;
            } else if (trimmed.length > 3) {
                // Include a space after the area code if the length is between 4 and 5
                formatted += ` ${trimmed.substring(3)}`;
            }
        } else {
            // If the input is less than 3 digits, just return them as is
            formatted = trimmed;
        }

        return formatted;
    }


    static formatDateNumbers(dateString) {
        // Remove all non-digits, explicitly disallowing letters and spaces
        const cleaned = ('' + dateString).replace(/\D/g, '');

        // Enforce a limit to 8 digits (MMDDYYYY)
        const trimmed = cleaned.substring(0, 8);

        // Array to store the formatted date parts
        const dateParts = [];

        // Extract month, day, and year from the trimmed string
        const month = trimmed.substring(0, 2);
        const day = trimmed.substring(2, 4);
        const year = trimmed.substring(4);

        // Add non-empty date parts to the array
        if (month) dateParts.push(month);
        if (day) dateParts.push(day);
        if (year) dateParts.push(year);

        // Join the date parts with '/'
        const formatted = dateParts.join('/');

        console.log(formatted);

        return formatted;
    }

}
