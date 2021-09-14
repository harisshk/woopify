export const isValidOtp = (otp) => {
    const charactersCount = 6;
    return otp.length !== charactersCount;
}