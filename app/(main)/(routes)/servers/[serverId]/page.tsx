import { db } from '@/lib/db';
import { currentProfile } from '@/util/current-profile'
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react'


/*

  this page helps to redirect the user to general channel when ever the user click on the server.

*/
export default async function ServerIdPage({
  params
}: { params: { serverId: string } }) {
  const profile = await currentProfile();
  if (!profile)
    return redirectToSignIn();
  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id
        }
      }
    },
    include: {
      channels: {
        where: {
          name: 'general'
        },
        orderBy: {
          createdAt: 'asc'
        }
      }
    }
  });

  const initialChannel = server?.channels[0];
  if(initialChannel?.name !== 'general')
    return null;
  return redirect(`/servers/${params.serverId}/channels/${initialChannel?.id}`);

  return (
    <div>page</div>
  )
}
