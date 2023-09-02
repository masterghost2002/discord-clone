import * as z from 'zod';
import {zodResolver} from '@hookform/resolvers/zod'
const messageFileFormSchema  = z.object({
    fileUrl:z.string().min(1, {
        message:"Attachment is required"
    })
});
export type messageFileFormSchema = z.infer<typeof messageFileFormSchema>
export default zodResolver(messageFileFormSchema);