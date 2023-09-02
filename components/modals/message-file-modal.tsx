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
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import messageFileFormSchemaResolver from '@/util/forms.schema/message.file.form.schema'
import { messageFileFormSchema } from '@/util/forms.schema/message.file.form.schema'
import { FileUpload } from '@/components/customs/file-upload'
import axios from 'axios'
import { useModal } from '@/store/use-modal-store'
import qs from 'query-string';
export default function MessageFileModal() {
    const {isOpen, onClose, type, data} = useModal();
    const isModalOpen = isOpen && type === 'messageFile';
    const {apiUrl, query} = data;
    const form = useForm({
        resolver: messageFileFormSchemaResolver,
        defaultValues: {
            fileUrl: "",
        }
    });
    const isLoading = form.formState.isSubmitting;
    const handleClose = ()=>{
        form.reset();
        onClose();
    }
    const onSubmit = async (values: messageFileFormSchema) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query
            });
            await axios.post(url, {
                ...values,
                content:values.fileUrl,
            });
            handleClose();
        } catch (error) {
            console.log(error);
            
        }

    }
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
                        Add an attachment
                    </DialogTitle>
                    <DialogDescription
                        className='text-center text-zinc-500'
                    >
                        Send a file as message
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
                                    name='fileUrl'
                                    render = {({field})=>(
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload
                                                    endpoint = "messageFile"
                                                    value={field.value}
                                                    onChange = {field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            
                        </div>
                        <DialogFooter
                            className='bg-gray-100 px-6 py-4'
                        >
                            <Button
                                variant={'primary'}
                                disabled={isLoading}
                            >
                                Send
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}