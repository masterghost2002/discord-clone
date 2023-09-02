import { ChannelType, MemberRole } from "@prisma/client";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react'
const channelIconMap = {
    [ChannelType.TEXT]: <Hash className='mr-2 h-4 w-4' />,
    [ChannelType.AUDIO]: <Mic className='mr-2 h-4 w-4' />,
    [ChannelType.VIDEO]: <Video className='mr-2 h-4 w-4' />,
};

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className='h-4 w-4  ml-2 mr-2 text-indigo-500' />,
    [MemberRole.ADMIN]: <ShieldAlert className='h-4 w-4 ml-2 mr-2 text-rose-500' />
}
export {channelIconMap, roleIconMap};