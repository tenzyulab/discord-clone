import { currentProfile } from "@/lib/current-profile"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PATCH(
    req: Request,
    { params }: { params: { serverId: string } }
) {
    try {
        const profile = await currentProfile()
        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 })
        }
        if (!params.serverId) {
            return new NextResponse('Server ID Missing', { status: 400 })
        }

        const { name, imageUrl } = await req.json()
        const server = await prisma.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id
            },
            data: {
                name,
                imageUrl
            }
        })

        return NextResponse.json(server)
    } catch (error) {
        console.log('[SERVER_ID_PATCH]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}