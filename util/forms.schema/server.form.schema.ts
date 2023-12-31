import * as z from 'zod';
import {zodResolver} from '@hookform/resolvers/zod'
const serverFormSchema  = z.object({
    name:z.string().min(1, {
        message:"Server name is required"
    }),
    imageUrl:z.string().min(1, {
        message:"Server image is required"
    })
});
export type serverFormType = z.infer<typeof serverFormSchema>
export default zodResolver(serverFormSchema);