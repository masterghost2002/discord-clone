import {Server, Member, Profile, MemberRole} from '@prisma/client';
export type MemberType  = Member & {profile:Profile}
export type ServerWithMembersWithProfile = Server & {
    members:MemberType[]
};
export type ServerSideBarHeaderProps = {
    server:ServerWithMembersWithProfile;
    role?:MemberRole
}
export type InviteCodePageProps = {
    params:{
        inviteCode:string
    }
}
export type UserAvatarPageProps = {
    src?:string,
    className?:string
}

// member manager is a child component for members-modal
export type MemberManagerType = {
    member:MemberType,
    server:ServerWithMembersWithProfile,
    loadingId:string,
    onRoleChange: (memberId:string, role:MemberRole)=>void,
    onKick: (memberId:string)=>void
}

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
}