"use client"
import CreateServerModal from "@/components/modals/create-server-modal";
import InviteModal from "@/components/modals/invite-modal";
import useMounted from "@/hooks/useMounted";
export const ModalProvider = ()=>{
    const [isMounted, ] = useMounted();
    if(!isMounted) return null;
    return (
        <>
            <CreateServerModal/>
            <InviteModal/>
        </>
    )
}