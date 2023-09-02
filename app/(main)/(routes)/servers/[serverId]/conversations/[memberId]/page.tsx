
import ChatHeader from "@/components/chat/chat-header";
import { getOrCreateConversation } from "@/lib/conversation";
import { db } from "@/lib/db";
import type { MemberIdPageProps } from "@/types"
import { currentProfile } from "@/util/current-profile"
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
export default async function MemberIdPage({
  params
}:MemberIdPageProps) {

  const profile = await currentProfile();

  // if not a authorizes user
  if(!profile) return redirectToSignIn();

  const currentMember = await db.member.findFirst({
    where:{
      serverId:params.serverId,
      profileId:profile.id
    },
    include:{
      profile:true
    }
  });

  // if not the member of the server
  if(!currentMember)
    return redirect('/');


  /*
    Try to find is there any conversation between you and the selected user.

    if not the function will create a new convesation for you,
    you as a conversation iniciator

  */
  const conversation = await getOrCreateConversation(currentMember.id, params.memberId);

  /*
    if by any chance the server unable the find or create conversation for you and the selected user it,
    will redirect you the server page,
    whihc again redirect you to general channel
  */
  if(!conversation)
    return redirect(`/server/${params.serverId}`);

  const {memberOne, memberTwo} = conversation;

  // simple condition to filter out our self from memberOne or memberTwo
  const otherMember = memberOne.profileId === profile.id ? memberTwo:memberOne;
  return (
    <div
      className="bg-white dark:bg-[#313338] flex flex-col h-full"
    >
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        serverId={params.serverId}
        type="conversation"
      />
    </div>
  )
}
