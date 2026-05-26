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

    const imageFile = formData.get("image");

    let imageUrl: string | undefined;

    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}-${imageFile.name}`;
      const filePath = `public/uploads/${fileName}`;

      const fs = await import("fs/promises");
      await fs.writeFile(filePath, buffer);

      imageUrl = `/uploads/${fileName}`;
    }

    const imageFromForm = formData.get("image") as string;

    const body = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      seller: formData.get("seller") as string,
      status: formData.get("status") as string,
      price: Number(formData.get("price")),
      email: formData.get("email") as string,
    };

    if (body.email && !body.email.includes("@")) {
      return new NextResponse("Invalid email", { status: 400 });
    }

    console.log("UPDATING:", numericId);
    console.log("BODY:", body);

    const updated = await db
      .update(advert)
      .set({
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.seller !== undefined && { seller: body.seller }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.price !== undefined && { price: body.price }),
        ...(body.email !== undefined && { email: body.email }),
        image: imageUrl ?? imageFromForm,
      })
      .where(eq(advert.id, numericId))
      .returning();

    if (!updated.length) {
      return new NextResponse("Advert not found", { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error(error);

    return new NextResponse("Failed to update advert", {
      status: 500,
    });
  }
}
// export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
//   try {
//     const { id } = await params;

//     const numericId = Number(id);

//     if (!Number.isFinite(numericId)) {
//       return new NextResponse("Invalid ID", { status: 400 });
//     }

//     const formData = await req.formData();

//     const title = formData.get("title") as string;
//     const description = formData.get("description") as string;
//     const category = formData.get("category") as string;
//     const seller = formData.get("seller") as string;
//     const status = formData.get("status") as string;
//     const email = formData.get("email") as string;
//     const price = Number(formData.get("price"));

//     const imageFile = formData.get("image") as File | null;

//     let imageUrl: string | undefined;

//     if (imageFile) {
//       const bytes = await imageFile.arrayBuffer();
//       const buffer = Buffer.from(bytes);

//       const fileName = `${Date.now()}-${imageFile.name}`;
//       const filePath = `public/uploads/${fileName}`;

//       await import("fs/promises").then((fs) => fs.writeFile(filePath, buffer));

//       imageUrl = `/uploads/${fileName}`;
//     }

//     const updated = await db
//       .update(advert)
//       .set({
//         ...(title !== undefined && { title }),
//         ...(description !== undefined && { description }),
//         ...(category !== undefined && { category }),
//         ...(seller !== undefined && { seller }),
//         ...(status !== undefined && { status }),
//         ...(price !== undefined && { price }),
//         ...(email !== undefined && { email }),
//         ...(imageUrl && { image: imageUrl }),
//       })
//       .where(eq(advert.id, numericId))
//       .returning();

//     return NextResponse.json(updated[0]);
//   } catch (error) {
//     console.error(error);
//     return new NextResponse("Failed to update advert", { status: 500 });
//   }
// }

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
