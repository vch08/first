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
  const body = await req.json();

  console.log("POST BODY:", body); // IMPORTANT DEBUG

  if (!body.email?.includes("@")) {
    return NextResponse.json({ error: "Invalid or missing email" }, { status: 400 });
  }

  const inserted = await db
    .insert(advert)
    .values({
      title: body.title,
      description: body.description,
      price: body.price,
      category: body.category,
      status: body.status || "Volno",
      seller: body.seller,
      email: body.email.trim(),
    })
    .returning();

  return NextResponse.json(inserted[0]);
}
