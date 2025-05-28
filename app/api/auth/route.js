
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/lib/userModel';

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Missing token' },
        { status: 400 }
      );
    }

    // Verify Google token using fetch
    const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!googleRes.ok) {
      throw new Error('Invalid Google token');
    }

    const data = await googleRes.json();

    await connectDB();

    let user = await User.findOne({ email: data.email });

    if (!user) {
      user = await User.create({
        name: data.name,
        email: data.email,
        image: data.picture,
      });
    }

    const userToken = jwt.sign(
      {
        name: user.name,
        email: user.email,
        image: user.image,
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        name: user.name,
        email: user.email,
        image: user.image,
        admin: user.admin
      },
    });

    response.cookies.set('userToken', userToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error verifying Google token:', error.message);
    return NextResponse.json(
      { success: false, message: 'Invalid token or server error' },
      { status: 401 }
    );
  }
}
