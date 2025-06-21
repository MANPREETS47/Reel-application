import { connectToDatabase } from "@/lib/db";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    try{
        const {email, password} = await request.json()
        if(!email || !password){
            return NextResponse.json(
                {error: "Email and password are required"},
                {status: 400}
            )
        }

        await connectToDatabase()

        const Existinguser = await User.findOne({email})
        if(Existinguser){
            return NextResponse.json(
                {error: "User already registered"},
                {status: 400}
            )
        }

        const Newuser = await User.create({
            email,
            password
        });
        const userTosend = {
            _id: Newuser._id,
            email: Newuser.email
        };

        return NextResponse.json(
            {message: "User registered successfully", user: userTosend},
            {status: 200}
        );
    }catch(error){
        console.error("Registration error", error);
        return NextResponse.json(
            {error: "Failed to register user"},
            {status: 400}
        )
    }
}