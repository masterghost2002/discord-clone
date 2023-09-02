import { currentProfile } from "@/util/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";
export async function DELETE(req: Request, { params }: { params: { channelId: string } }) {
    try {
        const profile = await currentProfile();
        if (!profile)
            return new NextResponse("Unauthorized", { status: 401 });
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");
        if (!serverId)
            return new NextResponse("Server ID missing", { status: 400 });
        if (!params.channelId)
            return new NextResponse("ChannelId ID missing", { status: 400 });
        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        // only admin and moderator can delete a channel
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels: {
                    delete: {
                        id: params.channelId,
                        // we can't delete a general channel
                        name:{
                            not:'general'
                        }
                    }
                }
            }
        });
        return NextResponse.json(server);

    } catch (error) {
        console.log('[Server sider error on /api/channels', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
};

export async function PATCH(req: Request, { params }: { params: { channelId: string } }) {
    try {
        const profile = await currentProfile();
        const {name, type} = await req.json();
        if (!profile)
            return new NextResponse("Unauthorized", { status: 401 });
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");
        if (!serverId)
            return new NextResponse("Server ID missing", { status: 400 });
        if (!params.channelId)
            return new NextResponse("ChannelId ID missing", { status: 400 });
        if(name === 'general')
        return new NextResponse("Name cannot be 'general'", { status: 400 });
        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels: {
                    update:{
                        where:{
                            id:params.channelId,
                            NOT:{
                                name:'general'
                            }
    
                        },
                        data:{
                            name,
                            type
                        }
                    }
                }
            }
        });
        return NextResponse.json(server);

    } catch (error) {
        console.log('[Server sider error on /api/channels', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
};