import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const courses = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { enrollments: true } } },
    });

    return NextResponse.json({ success: true, data: courses });
  } catch (err) {
    console.error("[ADMIN_COURSES_GET]", err);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      title,
      titleAr,
      description,
      descriptionAr,
      language,
      videoUrls,
      price,
    } = await req.json();

    if (!title || !videoUrls || videoUrls.length === 0) {
      return NextResponse.json(
        { error: "العنوان وفيديو واحد على الأقل مطلوبان" },
        { status: 400 },
      );
    }

    const course = await prisma.course.create({
      data: {
        title,
        titleAr: titleAr ?? null,
        description: description ?? null,
        descriptionAr: descriptionAr ?? null,
        language: language ?? "AR",
        videoUrls: videoUrls,
        price: price ?? 0,
        published: false,
      },
    });

    return NextResponse.json({ success: true, data: course });
  } catch (err) {
    console.error("[ADMIN_COURSES_POST]", err);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
