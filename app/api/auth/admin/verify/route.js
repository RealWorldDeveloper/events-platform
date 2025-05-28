import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {
    // Get token from cookies
    const token = request.cookies.get("token")?.value;
    console.log("Token:", token);
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authorized to login" },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);

    return NextResponse.json({ success: true, user: decoded }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
}