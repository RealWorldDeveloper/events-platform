import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Admin from '@/lib/adminModel';

export async function POST(request) {
    try {
        const { email, password ,pin } = await request.json();
    
        if (!email || !password, !pin) {
        return NextResponse.json(
            { success: false, message: 'Missing email or password or pin' },
            { status: 400 }
        );
        }
    
        await connectDB();
    
        const admin = await Admin.findOne({ email });
    
        if (!admin) {
        return NextResponse.json(
            { success: false, message: 'Invalid email or password' },
            { status: 401 }
        );
        }
    
        if (admin.password !== password) {
        return NextResponse.json(
            { success: false, message: 'Invalid email or password' },
            { status: 401 }
        );
        }
        if (admin.pin !== pin) {
            return NextResponse.json(
                { success: false, message: 'Invalid email or password or pin' },
                { status: 401 }
            );
        }
        const token = jwt.sign(
        {
            name: admin.name,
            email: admin.email,
            id: admin._id,
        },
        process.env.JWT_ADMIN_SECRET,
        { expiresIn: '1h' }
        );
    
        const response = NextResponse.json({
        success: true,
        message: 'Access granted',
        user: {
            name: admin.name,
            email: admin.email,
            id: admin._id,
        },
        });
    
                response.cookies.set('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                });
        
                return response;
            } catch (error) {
                return NextResponse.json(
                    { success: false, message: 'Server error', error: error.message },
                    { status: 500 }
                );
            }
        }
    