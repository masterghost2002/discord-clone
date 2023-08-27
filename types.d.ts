import {Server, Member, Profile, MemberRole} from '@prisma/client';
export type ServerWithMembersWithProfile = Server & {
    members:(Member & {profile:Profile})[]
};
export type ServerSideBarHeaderProps = {
    server:ServerWithMembersWithProfile;
    role?:MemberRole
}