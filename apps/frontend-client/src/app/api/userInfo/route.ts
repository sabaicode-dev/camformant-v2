// src/app/api/getUserInfo/route.ts

import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        // Call the external `auth/users/me` endpoint
        const response = await fetch("http://localhost:4000/v1/users/me", {
            method: "GET",
            credentials: "include", // Ensures cookies are sent with the request
            headers: {
                Cookie: req.headers.get("cookie") || "", // Pass client cookies to the auth service
            },
        });

        if (!response.ok) {
            return NextResponse.json({ message: "Failed to fetch user info" }, { status: response.status });
        }

        const data = await response.json();
        console.log("========================================")
        console.log("route :::::::::::::::::::::", data);
        return NextResponse.json(data, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { message: "Error fetching user info", error: error.message },
            { status: 500 }
        );
    }
}
