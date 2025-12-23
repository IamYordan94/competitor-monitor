import { randomBytes, createHmac } from "crypto";

const SECRET = process.env.SESSION_SECRET || "super-secret-key-change-this";

export function generateLoginToken(userId: number, email: string): string {
    // Simple signed token: userId.email.expiration.signature
    const expires = Date.now() + 15 * 60 * 1000; // 15 mins
    const data = `${userId}.${email}.${expires}`;
    const signature = createHmac("sha256", SECRET).update(data).digest("hex");
    return `${data}.${signature}`;
}

export function verifyLoginToken(token: string): { userId: number; email: string } | null {
    const parts = token.split(".");
    if (parts.length !== 4) return null;

    const [userIdStr, email, expiresStr, signature] = parts;
    const data = `${userIdStr}.${email}.${expiresStr}`;
    const expectedSignature = createHmac("sha256", SECRET).update(data).digest("hex");

    if (signature !== expectedSignature) return null;
    if (Date.now() > parseInt(expiresStr)) return null;

    return { userId: parseInt(userIdStr), email };
}
