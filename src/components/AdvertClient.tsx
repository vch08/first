"use client";

import {
  Badge,
  Button,
  Card,
  Divider,
  Group,
  NumberInput,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import Link from "next/link";
import { useState } from "react";
import type { Advert } from "@/db/schemas";

type Props = {
  advert: Advert;
  locale: string;
};

export default function AdvertClient({ advert, locale }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    title: advert.title,
    description: advert.description,
    category: advert.category,
    seller: advert.seller,
    status: advert.status,
    price: advert.price,
    email: advert.email ?? "",
  });

  async function reserveAdvert() {
    try {
      const res = await fetch(`/api/adverts/${advert.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "Rezervováno",
        }),
      });

      if (!res.ok) {
        console.error("Reservation failed");
        return;
      }

      const updated = await res.json();

      setForm(updated);
    } catch (err) {
      console.error("Error reserving advert:", err);
    }
  }

  async function deleteAdvert() {
    console.log("DELETE CLICKED");

    const confirmed = window.confirm("Opravdu chceš smazat tuto nabídku?");
    if (!confirmed) return;

    const res = await fetch(`/api/adverts/${advert.id}`, {
      method: "DELETE",
    });

    const text = await res.text(); // 👈 IMPORTANT

    console.log("DELETE STATUS:", res.status);
    console.log("DELETE RESPONSE:", text);

    if (!res.ok) {
      console.error("Delete failed:", text);
      return;
    }

    window.location.href = `/${locale}`;
  }

  // function confirmDelete() {
  //   modals.openConfirmModal({
  //     title: "Smazat inzerát",
  //     children: "Opravdu chceš smazat tuto nabídku?",
  //     labels: { confirm: "Smazat", cancel: "Zrušit" },
  //     confirmProps: { color: "red" },
  //     onConfirm: deleteAdvert,
  //   });
  // }

  function confirmDelete() {
    openConfirmModal({
      title: "Smazat inzerát",
      children: "Opravdu chceš smazat tuto nabídku?",
      labels: { confirm: "Smazat", cancel: "Zrušit" },
      confirmProps: { color: "red" },
      onConfirm: deleteAdvert,
    });
  }

  async function saveChanges() {
    try {
      const res = await fetch(`/api/adverts/${advert.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        console.error("Save failed");
        return;
      }

      const updated = await res.json();

      setForm(updated);

      setIsEditing(false);
    } catch (err) {
      console.error("Error saving advert:", err);
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <Card shadow="md" radius="lg" p="xl" withBorder>
        <Stack gap="md">
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

          <Group justify="space-between" align="flex-start"></Group>

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

          {isEditing ? (
            <Button color="red" variant="light" onClick={confirmDelete}>
              Smazat
            </Button>
          ) : null}

          <Divider />

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
                    await saveChanges();
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
              onClick={reserveAdvert}
            >
              {form.status === "Volno" ? "Rezervovat" : "Rezervováno"}
            </Button>
          </Group>
        </Stack>
      </Card>
    </div>
  );
}
