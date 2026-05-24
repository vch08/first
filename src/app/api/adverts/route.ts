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

  const inserted = await db
    .insert(advert)
    .values({
      title: body.title,
      description: body.description,
      price: body.price,
      category: body.category,
      status: body.status || "Volno",
      seller: body.seller,
    })
    .returning();

  return NextResponse.json(inserted[0]);
}
