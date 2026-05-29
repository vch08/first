"use client";

import {
  Badge,
  Button,
  Card,
  Divider,
  FileInput,
  Group,
  Image,
  NumberInput,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PaidAdvertPayment from "@/components/PaidAdvertPayment";
import type { Advert } from "@/db/schemas";

type Props = {
  advert: Advert;
  locale: string;
};

console.log("FILE LOADED: AdvertClient.tsx");

export default function AdvertClient({ advert, locale }: Props) {
  console.log("ADVERT FROM API:", advert);
  const [isEditing, setIsEditing] = useState(false);

  const router = useRouter();

  const [form, setForm] = useState({
    title: advert.title ?? "",
    description: advert.description ?? "",
    category: advert.category ?? "",
    seller: advert.seller ?? "",
    status: advert.status ?? "",
    price: advert.price ?? 0,

    email: advert.email ?? "",
    image: advert.image ?? "",
    imageFile: null as File | null,
    accountNumber: advert.accountNumber ?? "",
    paymentMessage: advert.paymentMessage ?? "",
  });

  async function reserveAdvert(id: number | string) {
    try {
      if (!id) {
        console.error("Missing ID");
        return;
      }

      const formData = new FormData();
      formData.append("status", "Rezervováno");

      const res = await fetch(`/api/adverts/${id}`, {
        method: "PUT",
        body: formData,
      });

      const text = await res.text();

      if (!res.ok) {
        console.error("Reservation failed:", text);
        return;
      }

      const updated = JSON.parse(text);

      setForm(updated);
    } catch (err) {
      console.error("Error reserving advert:", err);
    }
  }

  async function deleteAdvert(id: number | string) {
    console.log("DELETE CLICKED:", id);

    if (!id) {
      console.error("Missing ID");
      return;
    }

    const confirmed = window.confirm("Opravdu chceš smazat tuto nabídku?");
    if (!confirmed) return;

    const res = await fetch(`/api/adverts/${id}`, {
      method: "DELETE",
    });

    const text = await res.text();

    console.log("DELETE STATUS:", res.status);
    console.log("DELETE RESPONSE:", text);

    if (!res.ok) {
      console.error("Delete failed:", text);
      return;
    }

    window.location.href = `/${locale}`;
  }

  function confirmDelete() {
    openConfirmModal({
      title: "Smazat inzerát",
      children: "Opravdu chceš smazat tuto nabídku?",
      labels: { confirm: "Smazat", cancel: "Zrušit" },
      confirmProps: { color: "red" },
      onConfirm: () => deleteAdvert(advert.id),
    });
  }

  async function saveChanges(id: number | string, values: any) {
    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("category", values.category);
    formData.append("status", values.status);
    formData.append("seller", values.seller);
    formData.append("email", values.email);
    formData.append("price", String(values.price));
    formData.append("accountNumber", values.accountNumber);
    formData.append("paymentMessage", values.paymentMessage);

    formData.append("image", values.image);

    if (values.imageFile) {
      formData.append("imageFile", values.imageFile);
    }

    const res = await fetch(`/api/adverts/${id}`, {
      method: "PUT",
      body: formData,
    });

    const text = await res.text();

    if (!res.ok) {
      console.error("SAVE FAILED:", text);
      return;
    }

    return JSON.parse(text);
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <Card shadow="md" radius="lg" p="xl" withBorder>
        <Stack gap="md">
          {/* TITLE */}
          <div>
            <Text fw={700} size="xl" mb={5}>
              Název
            </Text>

            {isEditing ? (
              <TextInput value={form.title} onChange={(e) => setForm({ ...form, title: e.currentTarget.value })} />
            ) : (
              <Text size="lg">{form.title}</Text>
            )}
          </div>

          <Divider />

          <div>
            <Text fw={600} mb={5}>
              Popis
            </Text>

            {isEditing ? (
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.currentTarget.value })}
              />
            ) : (
              <Text c="dimmed">{form.description}</Text>
            )}
          </div>

          <Stack gap={8}>
            <Group justify="space-between">
              <Text fw={500}>Kategorie</Text>

              {isEditing ? (
                <Select
                  value={form.category}
                  onChange={(value) => setForm({ ...form, category: value || "" })}
                  data={["Nábytek", "Dětské věci", "Oblečení", "Elektronika", "Knihy", "Ostatní věci z domácnosti"]}
                />
              ) : (
                <Text>{form.category}</Text>
              )}
            </Group>

            <Group justify="space-between">
              <Text fw={500}>Prodávající</Text>

              {isEditing ? (
                <TextInput value={form.seller} onChange={(e) => setForm({ ...form, seller: e.currentTarget.value })} />
              ) : (
                <Text>{form.seller}</Text>
              )}
            </Group>

            <Group justify="space-between">
              <Text fw={500}>Email</Text>

              {isEditing ? (
                <TextInput
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.currentTarget.value })}
                  placeholder="example@email.com"
                />
              ) : (
                <Text c="dimmed">{form.email}</Text>
              )}
            </Group>

            <Group justify="space-between">
              <Text fw={500}>Stav</Text>

              {isEditing ? (
                <Select
                  value={form.status}
                  onChange={(value) => setForm({ ...form, status: value || "" })}
                  data={[
                    { value: "Volno", label: "Volno" },
                    { value: "Rezervováno", label: "Rezervováno" },
                  ]}
                />
              ) : (
                <Badge color={form.status === "Volno" ? "green" : "purple"}>{form.status}</Badge>
              )}
            </Group>
          </Stack>

          <Divider />

          <div>
            <Text fw={600} mb={5}>
              Obrázek
            </Text>

            {isEditing ? (
              <TextInput
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.currentTarget.value })}
                placeholder="https://..."
              />
            ) : form.image ? (
              <Image
                src={form.image}
                alt="advert"
                h={220}
                w="100%"
                fit="contain"
                style={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: 8,
                }}
              />
            ) : (
              <Text c="dimmed">Žádný obrázek</Text>
            )}
          </div>

          {isEditing && (
            <FileInput
              placeholder="Vložit obrázek"
              accept="image/*"
              value={form.imageFile}
              onChange={(file) => setForm({ ...form, imageFile: file })}
            />
          )}

          <Divider my="md" />

          <Group justify="space-between" align="flex-start">
            <Text fw={600} mb={5}>
              Cena
            </Text>

            {isEditing ? (
              <NumberInput
                value={form.price}
                onChange={(value) => setForm({ ...form, price: Number(value) || 0 })}
                min={0}
                style={{ width: 120 }}
              />
            ) : (
              <Badge color={form.price == null || Number(form.price) === 0 ? "green" : "orange"}>
                {form.price == null || Number(form.price) === 0 ? "Zdarma" : `${Number(form.price).toFixed(0)} Kč`}
              </Badge>
            )}
          </Group>

          {Number(form.price) > 0 && (
            <PaidAdvertPayment
              price={Number(form.price)}
              accountNumber={form.accountNumber}
              paymentMessage={form.paymentMessage}
            />
          )}

          <Divider my="md" />

          {isEditing && (
            <Button color="red" variant="light" onClick={confirmDelete}>
              Smazat
            </Button>
          )}

          <Group justify="space-between">
            <Link href={`/${locale}`}>
              <Button color="orange" variant="light">
                ← Zpět
              </Button>
            </Link>

            <Group>
              <Button
                color="orange"
                variant="light"
                onClick={async () => {
                  if (isEditing) {
                    await saveChanges(advert.id, form);
                    setIsEditing(false);
                  } else {
                    setIsEditing(true);
                  }
                }}
              >
                {isEditing ? "Uložit" : "Upravit"}
              </Button>

              {isEditing && (
                <Button variant="default" onClick={() => setIsEditing(false)}>
                  Zrušit
                </Button>
              )}
            </Group>

            <Button
              color={form.status === "Volno" ? "orange" : "gray"}
              variant="light"
              disabled={form.status !== "Volno"}
              onClick={() => reserveAdvert(advert.id)}
            >
              {form.status === "Volno" ? "Rezervovat" : "Rezervováno"}
            </Button>
          </Group>
        </Stack>
      </Card>
    </div>
  );
}
