"use client"
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogHeader
} from '@/components/ui/dialog'
import { useModal } from '@/store/use-modal-store'
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy, RefreshCcw } from 'lucide-react';
import useOrigin from '@/hooks/useOrigin';
export default function InviteModal() {
    const { isOpen, onClose, type, data } = useModal();
    const origin = useOrigin();
    const {server} = data;
    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;
    const isModalOpen = isOpen && type === "invite";
    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent
                className='bg-white text-black p-0 overflow-hidden'
            >
                <DialogHeader
                    className='pt-8 px-6'
                >
                    <DialogTitle
                        className='text-center text-2xl font-bold'
                    >
                        Invite Friends
                    </DialogTitle>
                </DialogHeader>
               <div
                className='p-6'
               >
                   <Label
                   className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'
                   >
                    Server Invite Link
                   </Label>
                   <div
                    className='flex items-center mt-2 gap-x-2'
                   >
                    <Input
                        className='bg-zinc-300 border-0 font-semibold focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                        value={inviteUrl}
                    />
                    <Button
                        size="icon"
                    >
                        <Copy
                            className='w-4 h-4'
                        />
                    </Button>
                   </div>
                    <Button
                        variant='link'
                        size='sm'
                        className='text-xs text-zinc-500 mt-4'
                    >
                        Generate a new link
                        <RefreshCcw
                            className='w-4 h-4 ml-2'
                        />
                    </Button>

               </div>
            </DialogContent>
        </Dialog>
    )
}