import {
    Avatar,
    AvatarImage
} from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { UserAvatarPageProps } from '@/types';

export default function UserAvatar(
    {
        src,
        className
    }:UserAvatarPageProps
) {

  
  return (
   <Avatar
    className={cn(
        "h-7 w-7 md:h-10 md:w-10",
        className
    )}
   >
    <AvatarImage
        src={src}
    />
   </Avatar>
  )
}
