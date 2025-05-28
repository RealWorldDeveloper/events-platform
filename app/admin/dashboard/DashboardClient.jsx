// app/admin/dashboard/DashboardClient.jsx
"use client";
import React, { useState } from "react";
import UpdateEventModal from '@/app/admin/dashboard/editEvent/UpdateEventModal'
import Link from "next/link";
import { useAuth } from "@/context/authContext";
import {SquarePen,Trash ,LogOut  } from "lucide-react"
const stats = [
  { label: "Total Users", value: 1245 },
  { label: "Active Events", value: 32 },
  { label: "Revenue", value: "0.00" },
  { label: "Admin id", value: 7 },
];


export default function DashboardClient({ user }) {
  const {event} = useAuth();
 const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

const deleteEvent = async (id) => {
  try {
    const response = await fetch('/api/events', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) {
      throw new Error('Failed to delete event');
    }
    const data = await response.json();
    alert(data.message || 'Event deleted successfully');

    window.location.reload(); 
  } catch (error) {
    console.error('Error deleting event:', error);
  }
};

const handleLogout = async () => {
  try {
    const response = await fetch('/api/auth/admin/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to log out');
    }
    const data = await response.json();
    alert(data.message || 'Logged out successfully');
    window.location.href = '/'; // Redirect to home page
  } catch (error) {
    console.error('Error logging out:', error);
  }
}
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 p-6">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        {user?.name && <h1 className="text-2xl">Welcome {user.name.toUpperCase()}</h1>}
        <div className="flex items-center space-x-4">
          <Link href="/admin/dashboard/create-event">
            <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Add Event
            </button>
          </Link>
          <Link href="/admin/dashboard/create-admin">
            <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 ml-2">
              Create Admin
            </button>
          </Link>
          <LogOut onClick={handleLogout}/>
        </div>
      </header>

      <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg bg-white p-6 shadow hover:shadow-lg transition"
          >
            <div className="text-sm text-gray-500">{stat.label}</div>
            <div className="mt-2 text-2xl font-semibold text-red-500">
              {stat.value}
            </div>
          </div>
        ))}
      </section>

      <section className="mb-8 rounded-lg bg-white p-6 shadow">
       
        <table className="mt-4 w-full table-auto">
          <thead>
            <tr className="bg-gray-200" style={{ color: "black" }}>
              <th className="px-4 py-2 text-left">Event Name</th>
              <th className="px-4 py-2 text-left">Event Date</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Edit</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(event) ? event : []).map((event, id) => (
              <tr key={id} className="border-b " style={{ color: "black"}}>
                <td className="px-4 py-2 text-gray-500">{event.title}</td>
                <td className="px-4 py-2">
                  {event.date
                    ? new Date(event.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : ""}
                </td>
                <td className="px-4 py-2">status</td>
                <td className="px-4 py-2"><SquarePen  className="cursor-pointer"
                    onClick={() => {
                      setSelectedEvent(event);
                      setEditModalOpen(true);
                    }} /></td>
                <td className="px-4 py-2 text-red-500"><Trash onClick={()=> deleteEvent(event._id)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
       <UpdateEventModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        event={selectedEvent}
        onUpdated={() => window.location.reload()}
      />
    </div>
  );
}
