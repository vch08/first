import { notFound } from "next/navigation";

export default async function AdvertDetailPage({ params }: { params: { id: string; locale: string } }) {
  const res = await fetch(`http://localhost:3000/api/adverts/${params.id}`, {
    cache: "no-store",
  });

  if (!res.ok) return notFound();

  const advert = await res.json();

  return (
    <div style={{ padding: 24 }}>
      <h1>{advert.title}</h1>
      <p>{advert.description}</p>
      <p>{advert.price}</p>
      <p>{advert.seller}</p>
      <p>{advert.email}</p>
    </div>
  );
}
