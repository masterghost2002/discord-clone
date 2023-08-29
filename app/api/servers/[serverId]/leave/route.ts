import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { currentProfile } from "@/util/current-profile";
export async function PATCH(
    req:Request, {params}:{params:{serverId:string}}
){
    
    try {
        const profile = await currentProfile();
        if(!profile)
            return new NextResponse("Unauthorized", {status:401});
        const server = await db.server.update({
            where:{
                id:params.serverId,
                profileId:{
                    not:profile.id
                },
                members:{
                    some:{
                        profileId:profile.id
                    }
                }
            },
            data:{
                members:{
                    deleteMany:{
                        profileId:profile.id
                    }
                }
            }
        });
        return NextResponse.json(server);
    } catch (error) {
        console.log("Server Update error", error);
        return new NextResponse("Internal Server Error", {status:500});
        
    }
}