import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const user = await prisma.user.findFirst({
      orderBy: { createdAt: "asc" },
      select: {
        name: true,
        email: true,
        bio: true,
        image: true,
        github: true,
        linkedin: true,
        facebook: true,
        twitter: true,
        instagram: true,
        youtube: true,
        website: true,
        resume: true,
        role: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "No profile found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: user })
  } catch (error) {
    console.error("Error fetching public profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
