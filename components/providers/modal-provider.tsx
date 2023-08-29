"use client"
import CreateServerModal from "@/components/modals/create-server-modal";
import InviteModal from "@/components/modals/invite-modal";
import EditServerModal from "@/components/modals/edit-server-modal";
import MemberModal from "@/components/modals/members-modal";
import useMounted from "@/hooks/useMounted";
import CreateChannelModal from "@/components/modals/create-channel-modal";
import LeaveServerModal from "@/components/modals/leave-server-modal";
import DeleteServerModal from "../modals/delete-server-modal";
export const ModalProvider = ()=>{
    const [isMounted, ] = useMounted();
    if(!isMounted) return null;
    return (
        <>
            <CreateServerModal/>
            <InviteModal/>
            <EditServerModal/>
            <MemberModal/>
            <CreateChannelModal/>
            <LeaveServerModal/>
            <DeleteServerModal/>
        </>
    )
}