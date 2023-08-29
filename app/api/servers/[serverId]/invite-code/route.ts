import { currentProfile } from "@/util/current-profile";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {v4 as uuidv4} from 'uuid'
export async function PATCH(
    req:Request,
    {params}:{params:{serverId:string}}
){

    try {
        const profile = await currentProfile();
        if(!profile) return new NextResponse("Unauthorized", {status:401});
        if(!params.serverId)
            return new NextResponse("Server ID missing", {status:401});

        // checking of profileId make sure that the admin is updating the server invite-link
        const server = await db.server.update({
            where:{
                id:params.serverId,
                profileId:profile.id
            },
            data:{
                inviteCode:uuidv4()
            }
        })
        return  NextResponse.json(server)
    
    } catch (error) {
        console.log("Error from invite code", error);
        return new NextResponse("Interal Server Error", {status:500});
    }
}
