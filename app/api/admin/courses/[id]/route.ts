import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const course = await prisma.course.update({
      where: { id },
      data: {
        title: body.title ?? undefined,
        titleAr: body.titleAr ?? undefined,
        description: body.description ?? undefined,
        descriptionAr: body.descriptionAr ?? undefined,
        published: body.published ?? undefined,
        videoUrls: body.videoUrls ?? undefined,
        price: body.price ?? undefined,
        language: body.language ?? undefined,
      },
    });

    return NextResponse.json({ success: true, data: course });
  } catch (err) {
    console.error("[ADMIN_COURSE_PATCH]", err);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.course.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[ADMIN_COURSE_DELETE]", err);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
