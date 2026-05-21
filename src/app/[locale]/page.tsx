"use client";

import {
  Badge,
  Button,
  Card,
  Group,
  Modal,
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
import { useCallback, useEffect, useState } from "react";
import type { Advert } from "@/db/schemas";

export default function App() {
  const [adverts, setAdverts] = useState<Advert[]>([]);

  const fetchAdverts = useCallback(async () => {
    const res = await fetch("/api/adverts");
    const data = await res.json();

    setAdverts(data);
  }, []);

  useEffect(() => {
    fetchAdverts();
  }, [fetchAdverts]);

  const handleAddAdvert = async (values: Omit<Advert, "id">) => {
    await fetch("/api/adverts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    fetchAdverts();
  };

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      price: "",
      category: "",
      status: "",
      seller: "",
    },
  });

  const [opened, setOpened] = useState(false);

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

            <TextInput label="Cena" {...form.getInputProps("price")} />

            <Select
              label="Kategorie"
              {...form.getInputProps("category")}
              placeholder="Kategorie"
              data={["Nábytek", "Dětské věci", "Oblečení", "Elektronika", "Knihy", "Ostatní věci z domácnosti"]}
            />

            <Select placeholder="Stav" data={["Volno", "Rezervováno"]} label="Stav" {...form.getInputProps("status")} />

            <TextInput label="Prodejce" {...form.getInputProps("seller")} />

            <Button type="submit" color="orange">
              Uložit
            </Button>
          </Stack>
        </form>
      </Modal>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} mt="md">
        <TextInput placeholder="Hledat..." leftSection={<IconSearch size={16} />} />

        <Select
          placeholder="Kategorie"
          data={["Vše", "Nábytek", "Dětské věci", "Oblečení", "Elektronika", "Knihy", "Ostatní věci z domácnosti"]}
        />

        <Select placeholder="Stav" data={["Vše", "Volno", "Rezervováno"]} />
      </SimpleGrid>
      <SegmentedControl
        data={[
          { value: "all", label: "Vše" },
          { value: "free", label: "Zdarma" },
          { value: "paid", label: "Placené" },
        ]}
      />
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
        {adverts.map((advert) => (
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

                {/* <Badge color={advert.price === "Zdarma" ? "green" : "orange"}>{advert.price}</Badge> */}
                <Badge color={advert.price === "Zdarma" ? "green" : "orange"}>
                  {advert.price === "Zdarma" ? "Zdarma" : `${advert.price} Kč`}
                </Badge>
              </Group>

              <Text size="sm" c="dimmed">
                Nabízí: {advert.seller}
              </Text>

              <Button color="orange" fullWidth>
                Detail
              </Button>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
