import { NextResponse } from 'next/server';

export async function POST(request) {
    // Clear the userToken cookie
    const response = NextResponse.json({ message: 'Logged out successfully' });
    response.cookies.set('userToken', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        expires: new Date(0), // Expire the cookie immediately
        path: '/',
    });

    return response;
}