export function isValidPassword(value:string): boolean {
    const containsUppercase = /[A-Z]/.test(value);
    const containsLowercase = /[a-z]/.test(value);
    const containsNumber = /[0-9]/.test(value);
    const containsSpecial = /[#?!@$%^&*-]/.test(value);
    return containsUppercase && containsLowercase && containsNumber && containsSpecial
}

export function reformatTitle(str: string) {
    return str.replace(/&#([0-9]{1,4});/gi, function(numStr) {
        const num = parseInt(numStr, 10);
        return String.fromCharCode(num);
    });
}