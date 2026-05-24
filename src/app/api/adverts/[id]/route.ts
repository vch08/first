import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { advert } from "@/db/schemas";

//
// GET SINGLE ADVERT
//
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const numericId = Number(id);

  console.log("LOOKING FOR ID:", id, "→", numericId);

  if (!Number.isFinite(numericId)) {
    return new NextResponse("Invalid ID", { status: 400 });
  }

  const data = await db.select().from(advert).where(eq(advert.id, numericId)).limit(1);

  if (!data.length) {
    return new NextResponse("Not found", { status: 404 });
  }

  return NextResponse.json(data[0]);
}

//
// UPDATE ADVERT
//
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const numericId = Number(id);

    if (!Number.isFinite(numericId)) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const body = await req.json();

    console.log("UPDATING:", numericId);
    console.log("BODY:", body);

    const updated = await db
      .update(advert)
      .set({
        title: body.title,
        description: body.description,
        category: body.category,
        seller: body.seller,
        status: body.status,
        price: body.price,
      })
      .where(eq(advert.id, numericId))
      .returning();

    if (!updated.length) {
      return new NextResponse("Advert not found", {
        status: 404,
      });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error(error);

    return new NextResponse("Failed to update advert", {
      status: 500,
    });
  }
}
