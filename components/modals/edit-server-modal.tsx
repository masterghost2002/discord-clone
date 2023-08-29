"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import serverFormSchema from '@/util/forms.schema/server.form.schema'
import { serverFormType } from '@/util/forms.schema/server.form.schema'
import { FileUpload } from '../customs/file-upload'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useModal } from '@/store/use-modal-store'
import { useEffect } from 'react'
export default function EditServerModal() {
    const {isOpen, onClose, type, data} = useModal();
    const isModalOpen = isOpen && type === "editServer";
    const router = useRouter();
    const {server} = data;
    const form = useForm({
        resolver: serverFormSchema,
        defaultValues: {
            name: "",
            imageUrl: "",
        }
    });
    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: serverFormType) => {
        try {
            await axios.patch(`/api/servers/${server?.id}`, values);
            form.reset();
            router.refresh();
            onClose();
        } catch (error) {
            console.log(error);
            
        }

    }
    const handleClose = ()=>{
        form.reset();
        onClose();
    }
    useEffect(()=>{
        if(server){
            form.setValue("name", server.name);
            form.setValue("imageUrl", server.imageUrl);
        }
    }, [server, form])
    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent
                className='bg-white text-black p-0 overflow-hidden'
            >
                <DialogHeader
                    className='pt-8 px-6'
                >
                    <DialogTitle
                        className='text-center text-2xl font-bold'
                    >
                        Customize your server
                    </DialogTitle>
                    <DialogDescription
                        className='text-center text-zinc-500'
                    >
                        Give your server a personality with a name and an image.
                        You can always change it later
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-8'
                    >
                        <div className="space-y-8 px-6">
                            <div
                                className="flex items-center justify-center text-center"
                            >
                                <FormField
                                    control={form.control}
                                    name='imageUrl'
                                    render = {({field})=>(
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload
                                                    endpoint = "serverImage"
                                                    value={field.value}
                                                    onChange = {field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'
                                        >
                                            Server Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className='bg-zinc-300/50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black'
                                                placeholder='Enter server name'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter
                            className='bg-gray-100 px-6 py-4'
                        >
                            <Button
                                variant={'primary'}
                                disabled={isLoading}
                            >
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}