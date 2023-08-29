import * as z from 'zod';
import {zodResolver} from '@hookform/resolvers/zod'
import { ChannelType } from '@prisma/client';
const channelFromSchema  = z.object({
    name:z.string().min(1, {
        message:"Channel name is required"
    }).refine(name=> name!=="general", {
        message:"Channel name cannot be 'general"
    }),
    type: z.nativeEnum(ChannelType)
});
export type channelFormType = z.infer<typeof channelFromSchema>
export default zodResolver(channelFromSchema);