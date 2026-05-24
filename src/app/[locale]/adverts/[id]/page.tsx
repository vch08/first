// import AdvertClient from "@/components/AdvertClient";

// export default async function Page({ params }: { params: { locale: string; id: string } }) {
//   const { locale, id } = params;

//   console.log("DETAIL PAGE ID:", id);

//   const res = await fetch(`http://localhost:3000/api/adverts/${id}`, {
//     cache: "no-store",
//   });

//   if (!res.ok) {
//     return <div>Listing not found</div>;
//   }

//   const advert = await res.json();

//   return <AdvertClient advert={advert} locale={locale} />;
// }

import AdvertClient from "@/components/AdvertClient";

export default async function Page({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;

  console.log("DETAIL PAGE ID:", id);

  const res = await fetch(`http://localhost:3000/api/adverts/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return <div>Listing not found</div>;
  }

  const advert = await res.json();

  return <AdvertClient advert={advert} locale={locale} />;
}
