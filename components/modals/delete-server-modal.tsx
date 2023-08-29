"use client"
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogHeader,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog'
import { useModal } from '@/store/use-modal-store'
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
export default function DeleteServerModal() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();
    const {isOpen, onClose, type, data } = useModal();
    const { server } = data;
    const isModalOpen = isOpen && type === "deleteServer";
    const onConfirm = async ()=>{
        try {
            setIsLoading(true);
            await axios.delete(`/api/servers/${server?.id}`);
            onClose();
            router.refresh();
            router.push('/');
        } catch (error) {
            console.log(error);
        }finally{
            setIsLoading(false);
        }
    }
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
                        Delete Server
                    </DialogTitle>
                    <DialogDescription
                        className='text-center text-zinc-500'
                    >
                        Are you sure want to do this?
                        <br/>
                        <span
                            className='font-semibold text-indigo-500'
                        >       
                            {server?.name} 
                        </span> 
                        {` `}will be permanently deleted.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter
                    className='bg-gray-100 px-6 py-4'
                >
                    <div 
                        className="flex items-center justify-between w-full"
                    >
                        <Button
                            disabled={isLoading}
                            variant={'ghost'}
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={isLoading}
                            variant={'primary'}
                            onClick={onConfirm}
                        >
                            Confirm
                        </Button>

                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}