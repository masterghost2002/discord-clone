import {Server, Member, Profile, MemberRole, ChannelType, Channel} from '@prisma/client';
import {Server as NetServer, Socket} from 'net';
import { NextApiResponse } from 'next';
import {Server as SockerIOServer} from 'socket.io';
export type MemberType  = Member & {profile:Profile}
export type ServerWithMembersWithProfile = Server & {
    members:MemberType[]
};
export type ServerSideBarHeaderProps = {
    server:ServerWithMembersWithProfile;
    role?:MemberRole
};
export type InviteCodePageProps = {
    params:{
        inviteCode:string
    }
};
export type UserAvatarPageProps = {
    src?:string,
    className?:string
};

// member manager is a child component for members-modal
export type MemberManagerType = {
    member:MemberType,
    server:ServerWithMembersWithProfile,
    loadingId:string,
    onRoleChange: (memberId:string, role:MemberRole)=>void,
    onKick: (memberId:string)=>void
};

// searchbar for searching the server child component of server-sidebar
// present in @/components/sidebars
export type ServerSearchProps = {
    data:{
        label:string,
        type:"channel" | "member";
        data:{
            icon:React.ReactNode;
            name:string;
            id:string;
        }[] | undefined
    }[]
};

/*

ChannelAndMemberListHeaderProps will show the header to create or mamange channels and members respectively
*/
export type ChannelAndMemberListHeaderProps = {
    label:string;
    role?:MemberRole;
    sectionType:"channels" | "members";
    channelType?:ChannelType;
    server?: ServerWithMembersWithProfile;
};

/*

Channel list is the child component of server-sidebar,
this component displays all the available channels of
selected server
*/
export type ChannelListProps = {
    channel:Channel;
    server:Server;
    role?:MemberRole
};

export type MemberListProps = {
    member:Member & {profile:Profile};
    server:Server
};


// channel converstaion page props
export type ChannelIdPageProps = {
    params:{
        serverId:string,
        channelId:string,
    }
}

// chat header props
export type ChatHeaderProps = {
    serverId:string;
    name:string;
    type:"channel" | "conversation";
    imageUrl?:string;
}

export type MemberIdPageProps = {
    params:{
        serverId:string;
        memberId:string;
    }
}

export type NextApiResponseServerIO = NextApiResponse & {
    socket:Socket&{
        server:NetServer & {
            io:SockerIOServer
        }
    }
};

export type SocketContextType = {
    socket: any | null;
    isConnected: boolean;
}