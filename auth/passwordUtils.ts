import bcrypt from 'bcryptjs';

export async function validatePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
}

export async function generatePassword(password: string) {
    return await bcrypt.hash(password, 10);
}