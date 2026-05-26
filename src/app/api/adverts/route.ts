import { NextResponse } from "next/server";
import { db } from "@/db";
import { advert } from "@/db/schemas/advert.schema";
// import Link from "next/link";
// import { Button } from "@mantine/core";

export async function GET() {
  const data = await db.select().from(advert);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const seller = formData.get("seller") as string;
    const email = formData.get("email") as string;
    const price = Number(formData.get("price"));
    const status = (formData.get("status") as string) || "Volno";
    const image = formData.get("image") as string;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const inserted = await db
      .insert(advert)
      .values({
        title,
        description,
        category,
        seller,
        email,
        price,
        status,
        image,
      })
      .returning();

    return NextResponse.json(inserted[0]);
  } catch (err) {
    console.error("POST /adverts failed:", err);

    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
