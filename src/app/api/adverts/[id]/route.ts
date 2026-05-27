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

// UPDATE ADVERT

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const numericId = Number(id);

    if (!Number.isFinite(numericId)) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const formData = await req.formData();

    const status = formData.get("status");
    const title = formData.get("title");
    const description = formData.get("description");
    const category = formData.get("category");
    const seller = formData.get("seller");
    const email = formData.get("email");
    const price = formData.get("price");

    const imageFile = formData.get("imageFile");
    const image = formData.get("image");

    let imageUrl: string | null = null;

    // 1. FILE upload wins
    if (imageFile instanceof File && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}-${imageFile.name}`;
      const filePath = `public/uploads/${fileName}`;

      const fs = await import("fs/promises");
      await fs.writeFile(filePath, buffer);

      imageUrl = `/uploads/${fileName}`;
    }

    // 2. Normalize image string
    const imageString = typeof image === "string" ? image.trim() : "";

    // 3. FINAL IMAGE VALUE (important)
    const finalImage = imageUrl ?? imageString ?? "";

    const updated = await db
      .update(advert)
      .set({
        ...(title && { title: String(title) }),
        ...(description && { description: String(description) }),
        ...(category && { category: String(category) }),
        ...(seller && { seller: String(seller) }),
        ...(status && { status: String(status) }),
        ...(price !== null &&
          price !== undefined && {
            price: Number(price),
          }),
        ...(email && { email: String(email) }),

        // IMPORTANT FIX:
        image: finalImage,
      })
      .where(eq(advert.id, numericId))
      .returning();

    if (!updated.length) {
      return new NextResponse("Advert not found", { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("PUT ERROR:", error);
    return new NextResponse("Failed to update advert", { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const numericId = Number(id);

  console.log("DELETE ID:", id);

  if (!Number.isFinite(numericId)) {
    return new NextResponse("Invalid ID", { status: 400 });
  }

  const deleted = await db.delete(advert).where(eq(advert.id, numericId)).returning();

  if (!deleted.length) {
    return new NextResponse("Not found", { status: 404 });
  }

  return NextResponse.json({ success: true });
}
