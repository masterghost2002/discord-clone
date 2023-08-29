"use client"
import { useState } from 'react';
import qs from 'query-string';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogHeader,
    DialogDescription,
} from '@/components/ui/dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuTrigger,
    DropdownMenuSubTrigger
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area';
import UserAvatar from '@/components/user-avatar';
import { ShieldAlert, ShieldCheck, MoreVertical, ShieldQuestion, Shield, Check, Gavel, Loader2 } from 'lucide-react';
import { useModal } from '@/store/use-modal-store'
import { ServerWithMembersWithProfile, MemberManagerType } from '@/types';
import { MemberRole } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
/*
    Icon map to show particular icon in front of member
    Key is member type
    value is lucide icon
*/
const roleIconMape = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className='h-4 w-4 ml-2 text-indigo-500' />,
    "ADMIN": <ShieldAlert className='h-4 w-4 text-rose-500' />
}
const MemberManager = (
    {
        member,
        loadingId,
        server,
        onRoleChange,
        onKick
    }: MemberManagerType

) => {
    return (
        <div
            className='flex items-center gap-x-2 mb-6'
        >
            <UserAvatar
                src={member.profile.imageUrl}
            />
            <div
                className='flex flex-col gap-y-1'
            >
                <div
                    className='text-xs font-semibold flex items-center gap-x-1'
                >
                    {member.profile.name}
                    {roleIconMape[member.role]}
                </div>
                <p
                    className='text-xs text-zinc-500'
                >
                    {member.profile.email}
                </p>
            </div>

            {/* rendering the dropdown model to manage the member and its permissions this rendering dosen't take place for admin as admin can only delete the server */}
            {server.profileId !== member.profileId && loadingId !== member.id && (
                <div
                    className='ml-auto'
                >
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <MoreVertical
                                className='h-4 w-4 text-zinc-500'
                            />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            side='left'
                        >
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger
                                    className='flex items-center'
                                >
                                    <ShieldQuestion
                                        className='h-4 w-4 mr-2'
                                    />
                                    <span>
                                        Role
                                    </span>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuItem
                                            onClick={()=>onRoleChange(member.id, MemberRole.GUEST)}
                                        >
                                            <Shield
                                                className='h-4 w-4 mr-2'
                                            />
                                            Guest
                                            {
                                                member.role === MemberRole.GUEST && (
                                                    <Check
                                                        className='h-4 w-4 ml-auto'
                                                    />
                                                )
                                            }

                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                         onClick={()=>onRoleChange(member.id, MemberRole.MODERATOR)}
                                        >
                                            <Shield
                                                className='h-4 w-4 mr-2'
                                            />
                                            Moderator
                                            {
                                                member.role === 
                                                MemberRole.MODERATOR && (
                                                    <Check
                                                        className='h-4 w-4 ml-auto'
                                                    />
                                                )
                                            }

                                        </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem
                                onClick={()=>onKick(member.id)}
                            >
                                <Gavel
                                    className='h-4 2-4 mr-2'
                                />
                                Kick
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
            {
                loadingId === member.id && (
                    <Loader2
                        className='animate-spin text-zinc-500 ml-auto'
                    />
                )
            }
        </div>
    )
}

/*
    This modal is for managing the members of the server

*/
export default function MemberModal() {
    const [loadingId, setIsLoadingId] = useState<string>("");
    const router = useRouter();

    // use modal comming from store a global store for all modals
    // this store in wrapped in modal provider
    const { isOpen, onClose, type, data, onOpen } = useModal();

    // taking the server data comping from data modal store useModal
    const { server } = data as { server: ServerWithMembersWithProfile };
    const isModalOpen = isOpen && type === "members";

    // async function to call api to change role of the selected user
    const onRoleChange  = async (memberId:string, role:MemberRole)=>{
        try {
            setIsLoadingId(memberId);
            const url = qs.stringifyUrl({
                url:`/api/members/${memberId}`,
                query:{
                    serverId:server?.id,
                }
            });    
            const res = await axios.patch(url, {role});
            router.refresh();
            onOpen('members', {server:res.data});
       } catch (error) {
            console.log("[Error in member-modal]:-> ", error);
            
        }finally{
            setIsLoadingId("")
        }
    }

    const onKick = async (memberId:string)=>{
        
        try {
            setIsLoadingId(memberId);
            const url = qs.stringifyUrl({
                url:`/api/members/${memberId}`,
                query:{
                    serverId:server.id
                }
            });
            const res = await axios.delete(url);            
            router.refresh();
            onOpen('members', {server:res.data});
            
        } catch (error) {
            console.log("[Error in member-modal]:-> ", error);
        }finally{
            setIsLoadingId("");
        }
    }
    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent
                className='bg-white text-black  overflow-hidden'
            >
                <DialogHeader
                    className='pt-8 px-6'
                >
                    <DialogTitle
                        className='text-center text-2xl font-bold'
                    >
                        Manage Members
                    </DialogTitle>
                    <DialogDescription
                        className='text-center text-zinc-500'
                    >
                        {server?.members?.length} Members
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea
                    className='mt-8 max-h-[420px] pr-6'
                >

                    {/* Rndering all the members present in the specific server */}
                    {server?.members?.map(member => (
                        <MemberManager
                            key={member.id}
                            member={member}
                            server={server}
                            loadingId={loadingId}
                            onRoleChange={onRoleChange}
                            onKick={onKick}
                        />
                    ))}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}