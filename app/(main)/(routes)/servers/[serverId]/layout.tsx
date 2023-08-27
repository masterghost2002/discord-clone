import { currentProfile } from '@/util/current-profile'
import { redirectToSignIn } from '@clerk/nextjs';
import { db } from '@/lib/db';
import React from 'react'
import { redirect } from 'next/navigation';
import ServerSidebar from '@/components/sidebars/server-sidebar';

export const ServerIdLayout = async (
    { children, params }: { children: React.ReactNode, params: { serverId: string } }) => {
    const profile = await currentProfile();
    if (!profile) return redirectToSignIn();
    const server = await db.server.findUnique({
        where: {
            id: params.serverId,
            // searching for the user also, so that if a person have server id, but he
            // she is not in the server can read the message, to prevent them we are also searching of
            // the user in the server memebers
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })
    if (!server) redirect('/')
    return (
        <div
            className='h-full'
        >
            <div
                className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0"
            >
                <ServerSidebar
                    serverId={params.serverId}
                />
            </div>
            <main
                className='h-full md:pl-60'
            >
                {children}
            </main>
        </div>
    )
}
export default ServerIdLayout
