import { currentProfile } from '@/util/current-profile'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { ChannelType, MemberRole } from '@prisma/client'
import ServerSidebarHeader from '@/components/sidebars/server-sidebar-header'
import { ScrollArea } from '@/components/ui/scroll-area'
import ServerSearch from '@/components/sidebars/server-search'
import { Separator } from '@/components/ui/separator'
import ChannelAndMemberListHeader from '@/components/sidebars/channel-member-list-header'
import ServerChannel from '@/components/sidebars/server-channel'
import { channelIconMap, roleIconMap } from '@/util/iconMap'
import ServerMember from '@/components/sidebars/server-member'
type ServerSidebarProps = {
    serverId: string
}
const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
    const profile = await currentProfile();
    if (!profile) return redirect('/');

    // this is an example of nextjs server actions to 
    // this will fetch the servers from the db without creating a api end-point
    const server = await db.server.findUnique({
        where: {
            id: serverId,
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: "asc"
                }
            },
            members: {
                include: {
                    profile: true
                },
                orderBy: {
                    role: 'asc'
                }
            }
        }
    });

    // if no server found redirect to home page
    if(!server) return redirect('/');

    // filtering out the channels acc to their type
    const textChannels = server.channels.filter(channel=>channel.type === ChannelType.TEXT);
    const audioChannels = server.channels.filter(channel=>channel.type === ChannelType.AUDIO);
    const videoChannels = server.channels.filter(channel=>channel.type === ChannelType.VIDEO);

    // filter out all the members except the logged user itself
    const members = server.members.filter(member=>member.profileId !== profile.id);

    // current logged in user role
    const role = server.members.find(member=>member.profileId === profile.id)?.role;
    return (
        <div
            className='flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]'
        >
            <ServerSidebarHeader
                server={server}
                role={role}
            />
            <ScrollArea
                className='flex-1 px-3'
            >
                <div
                    className='mt-2'
                >
                    <ServerSearch
                        data = {
                            [
                                {
                                    label:"Text Channels",
                                    type:"channel",
                                    data:textChannels?.map(channel=>(
                                        {
                                            id:channel?.id,
                                            name:channel.name,
                                            icon:channelIconMap[channel.type]
                                        }
                                    ))
                                },
                                {
                                    label:"Audio Channels",
                                    type:"channel",
                                    data:audioChannels?.map(channel=>(
                                        {
                                            id:channel?.id,
                                            name:channel.name,
                                            icon:channelIconMap[channel.type]
                                        }
                                    ))
                                },
                                {
                                    label:"Video Channels",
                                    type:"channel",
                                    data:videoChannels?.map(channel=>(
                                        {
                                            id:channel?.id,
                                            name:channel.name,
                                            icon:channelIconMap[channel.type]
                                        }
                                    ))
                                },
                                {
                                    label:"Members",
                                    type:"member",
                                    data:members?.map(member=>(
                                        {
                                            id:member?.id,
                                            name:member.profile.name,
                                            icon:roleIconMap[member.role]
                                        }
                                    ))
                                }
                            ]

                        }
                    />
                </div>
                <Separator
                    className='bg-zinc-200 dark:bg-zinc-700 rounded-md my-2'
                />
                {
                    !!textChannels?.length && (
                        <div
                            className='mb-2'
                        >
                            <ChannelAndMemberListHeader
                                sectionType='channels'
                                channelType={ChannelType.TEXT}
                                role={role}
                                label="Text Channels"
                            />
                            {
                                textChannels.map(channel=>(
                                    <ServerChannel
                                        key={channel.id}
                                        channel={channel}
                                        role={role} 
                                        server={server}
                                    />
                                ))
                            }
                        </div>
                    )
                }
                {
                    !!audioChannels?.length && (
                        <div
                            className='mb-2'
                        >
                            <ChannelAndMemberListHeader
                                sectionType='channels'
                                channelType={ChannelType.AUDIO}
                                role={role}
                                label="Audio Channels"
                            />
                            {
                                audioChannels.map(channel=>(
                                    <ServerChannel
                                        key={channel.id}
                                        channel={channel}
                                        role={role}
                                        server={server}
                                    />
                                ))
                            }
                        </div>
                    )
                }
                 {
                    !!videoChannels?.length && (
                        <div
                            className='mb-2'
                        >
                            <ChannelAndMemberListHeader
                                sectionType='channels'
                                channelType={ChannelType.VIDEO}
                                role={role}
                                label="Video Channels"
                            />
                            {
                                videoChannels.map(channel=>(
                                    <ServerChannel
                                        key={channel.id}
                                        channel={channel}
                                        role={role}
                                        server={server}
                                    />
                                ))
                            }
                        </div>
                    )
                }
                {
                    !!members?.length && (
                        <div
                            className='mb-2'
                        >
                            <ChannelAndMemberListHeader
                                sectionType='members'
                                role={role}
                                label="Members"
                                server={server}
                            />
                            {
                                members.map(member=>(
                                    <ServerMember
                                    key={member.id}
                                        server={server}
                                        member={member}
                                    />
                                ))
                            }
                        </div>
                    )
                }
            </ScrollArea>
        </div>
    )
}

export default ServerSidebar