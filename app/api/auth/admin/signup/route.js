import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Admin from '@/lib/adminModel';

export async function POST(request) {
const { name,email,password} = await request.json();
console.log('Received data:', { name, email, password});

    try {
        await connectDB();
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return NextResponse.json({ message: 'Admin already exists' }, { status: 409 });
        }
        const newAdmin = new Admin({ name, email, password});
        await newAdmin.save();
        return NextResponse.json({ message: 'Admin created successfully'}, { status: 201 });
}
    catch (error) {
        console.error('Error creating admin:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

