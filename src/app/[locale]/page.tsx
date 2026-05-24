"use client";

import {
  Badge,
  Button,
  Card,
  Group,
  Modal,
  NumberInput,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconSearch } from "@tabler/icons-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { Advert } from "@/db/schemas";

export default function App() {
  const [adverts, setAdverts] = useState<Advert[]>([]);
  const [priceFilter, setPriceFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Vše");
  const [status, setStatus] = useState("Vše");

  const fetchAdverts = useCallback(async () => {
    const res = await fetch("/api/adverts");
    const data = await res.json();

    setAdverts(data);
  }, []);

  useEffect(() => {
    fetchAdverts();
  }, [fetchAdverts]);

  const handleAddAdvert = async (values: Omit<Advert, "id">) => {
    try {
      const res = await fetch("/api/adverts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error("Failed to create advert");
      }

      await fetchAdverts();
      form.reset();
      setOpened(false);
    } catch (err) {
      console.error(err);
    }
  };

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      price: 0,
      category: "",
      status: "",
      seller: "",
    },

    validate: {
      title: (value) => (value.trim() ? null : "Název je povinný"),
      description: (value) => (value.trim() ? null : "Popis je povinný"),
      category: (value) => (value.trim() ? null : "Kategorie je povinná"),
      price: (value) => (value >= 0 ? null : "Cena musí být 0 nebo vyšší"),
      seller: (value) => (value.trim() ? null : "Prodejce je povinný"),
    },
  });

  const [opened, setOpened] = useState(false);
  const params = useParams();
  const locale = params.locale as string;

  const filteredAdverts = adverts.filter((advert) => {
    const matchesSearch = advert.title.toLowerCase().includes(search.toLowerCase());

    const matchesPrice =
      priceFilter === "all"
        ? true
        : priceFilter === "free"
          ? advert.price == null || Number(advert.price) === 0
          : Number(advert.price) > 0;

    const matchesCategory =
      category === "Vše" ? true : advert.category?.trim().toLowerCase() === category.toLowerCase();

    const matchesStatus = status === "Vše" ? true : advert.status === status;

    return matchesSearch && matchesPrice && matchesCategory && matchesStatus;
  });

  return (
    <Stack p="lg">
      <Title order={1}>Bazar</Title>
      <Group>
        <p style={{ width: "60%" }}>Interní bazar Blogic Store, Nabízej věci kolegům k prodeji nebo zdarma.</p>

        <Button color="orange" style={{ marginLeft: "100px", width: "30%" }} onClick={() => setOpened(true)}>
          + Přidat nabídku
        </Button>
      </Group>

      <Modal opened={opened} onClose={() => setOpened(false)} title="Přidat nabídku" centered>
        <form onSubmit={form.onSubmit(handleAddAdvert)}>
          <Stack>
            <TextInput label="Název" {...form.getInputProps("title")} />

            <TextInput label="Popis" {...form.getInputProps("description")} />

            <NumberInput label="Cena" placeholder="Zadej cenu" min={0} {...form.getInputProps("price")} />

            <Select
              label="Kategorie"
              {...form.getInputProps("category")}
              placeholder="Kategorie"
              data={["Nábytek", "Dětské věci", "Oblečení", "Elektronika", "Knihy", "Ostatní věci z domácnosti"]}
            />

            <Select placeholder="Stav" data={["Volno", "Rezervováno"]} label="Stav" {...form.getInputProps("status")} />

            <TextInput label="Prodejce" {...form.getInputProps("seller")} />

            <Button onClick={() => {}} type="submit" color="orange">
              Uložit
            </Button>
          </Stack>
        </form>
      </Modal>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} mt="md">
        <TextInput
          placeholder="Hledat..."
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />

        <Select
          placeholder="Kategorie"
          value={category}
          onChange={(value) => setCategory(value || "Vše")}
          data={["Vše", "Nábytek", "Dětské věci", "Oblečení", "Elektronika", "Knihy", "Ostatní věci z domácnosti"]}
        />

        <Select
          placeholder="Stav"
          value={status}
          onChange={(value) => setStatus(value ?? "Vše")}
          data={["Vše", "Volno", "Rezervováno"]}
        />
      </SimpleGrid>
      <SegmentedControl
        value={priceFilter}
        onChange={setPriceFilter}
        data={[
          { value: "all", label: "Vše" },
          { value: "free", label: "Zdarma" },
          { value: "paid", label: "Placené" },
        ]}
      />
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
        {filteredAdverts.map((advert) => (
          <Card key={advert.id} shadow="sm" padding="lg" radius="md" withBorder>
            <Stack>
              <Group justify="space-between">
                <Text fw={700}>{advert.title}</Text>

                <Badge color={advert.status === "Volno" ? "green" : "purple"}>{advert.status}</Badge>
              </Group>

              <Text size="sm" c="dimmed">
                {advert.description}
              </Text>

              <Group gap="xs">
                <Badge color="white" style={{ border: "2px solid blue", color: "blue" }}>
                  {advert.category}
                </Badge>

                <Badge color={advert.price == null || Number(advert.price) === 0 ? "green" : "orange"}>
                  {advert.price == null || Number(advert.price) === 0
                    ? "Zdarma"
                    : `${Number(advert.price).toFixed(0)} Kč`}
                </Badge>
              </Group>

              <Text size="sm" c="dimmed">
                Nabízí: {advert.seller}
              </Text>

              <Link href={`/${locale}/adverts/${advert.id}`}>
                <Button fullWidth color="orange" variant="light">
                  Detail
                </Button>
              </Link>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
