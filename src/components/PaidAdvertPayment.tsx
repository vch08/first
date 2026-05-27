"use client";

import { Card, Stack, Text, TextInput } from "@mantine/core";
import { QRCodeCanvas } from "qrcode.react";
import { useMemo, useState } from "react";

type Props = {
  price: number;
};

export default function PaidAdvertPayment({ price }: Props) {
  const [account, setAccount] = useState("");
  const [message, setMessage] = useState("Marketplace");

  // Build Czech QR Payment string (SPD format)
  const qrString = useMemo(() => {
    if (!account || price <= 0) return "";

    return `SPD*1.0*ACC:${account}*AM:${price}*CC:CZK*MSG:${message}`;
  }, [account, price, message]);

  if (!price || price <= 0) return null;

  return (
    <Card withBorder radius="md" p="md" mt="md">
      <Stack gap="sm">
        <Text fw={600}>QR Platba</Text>

        {/* Bank account input (creator side) */}
        <TextInput
          label="Číslo účtu (IBAN nebo CZ formát)"
          placeholder="CZ6508000000192000145399"
          value={account}
          onChange={(e) => setAccount(e.currentTarget.value)}
        />

        <TextInput label="Zpráva pro příjemce" value={message} onChange={(e) => setMessage(e.currentTarget.value)} />

        {/* QR preview */}
        {qrString ? (
          <div style={{ marginTop: 10 }}>
            <QRCodeCanvas value={qrString} size={180} />
          </div>
        ) : (
          <Text size="sm" c="dimmed">
            Zadej číslo účtu pro vygenerování QR kódu
          </Text>
        )}

        <Text size="xs" c="dimmed">
          Platba probíhá mezi uživateli – aplikace ji nezpracovává.
        </Text>
      </Stack>
    </Card>
  );
}
