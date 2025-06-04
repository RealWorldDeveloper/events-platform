SE - Events Platform

Project Summary
The JV - Events Platform is a community-driven application designed to help small businesses create, manage, and share events with their community members. The platform allows users to browse events, sign up for them, and add events to their Google Calendar. Staff members have additional privileges to create and manage events.

This project was built using:

Frontend: Next.js (React framework)

Backend: Next.js API routes

Database: MongoDB Atlas (cloud-based NoSQL database)

Authentication: OAuth (Google Sign-In) and username/password

Calendar Integration: Google Calendar API

Key Features:

User authentication (OAuth and email/password)

Event listing and filtering

Event sign-up functionality

Google Calendar integration

Staff-only event management dashboard

Responsive design for all device sizes

Video Walkthrough : https://www.loom.com/share/f8b0e6a307d840debdde0ca9b0757cac?sid=1f38f8e4-aec3-443c-b0c7-800962ea9255

Live on Vercel : https://events-platform-brown.vercel.app/


step:
git clone https://github.com/yourusername/jv-events-platform.git

cd jv-events-platform
npm install --force

Environment Variables Setup

Create a .env.local file in the root directory and add the following variables:

MONGODB_URI=your_mongodb_atlas_connection_string
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
JWT_SECRET=your_nextauth_secret_key
JWT_ADMIN_SECRET=your_nextauth_admin_secret_key
NEXTAUTH_URL=http://localhost:3000

Database Setup
Atlas:
Log in to your MongoDB Atlas account
Create a new cluster (free tier)
Create a database named jv_events
Whitelist your IP address in Network Access
Create a database user and get the connection string

Local: Compass
need to insrall mongodb compass
use the connection string to the project

Google API Setup

Go to Google Cloud Console
Create a new project
Enable Google Calendar API
Create OAuth 2.0 credentials (Web application type)
Add http://localhost:3000 to authorized JavaScript origins and redirect URIs

Run the Application
npm run dev

Admin:
- as a Admin need to create account directly into database for the first time. then after login anybody can cretae admin account.
example data:

{
  "_id": {
    "$oid": "682e6f81312a0c793c3dffc4"
  },
  "name": "jhone doe",
  "email": "jhon@example.com",
  "password": "admin",
  "pin": "0000",
  "__v": 0
}

if any troubleshoot presist please follow the terminal log to resolve if any dependancy need to istall
please note: while login with google account its need to be trust the apps for security purpose. after pop up the small google window please click advanced and allow the apps for secure login.
