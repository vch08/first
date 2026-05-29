"use client";

import { Card, Stack, Text } from "@mantine/core";
import { QRCodeCanvas } from "qrcode.react";
import { useMemo } from "react";

type Props = {
  price: number;
  accountNumber: string;
  paymentMessage: string;
};

function sanitizeMessage(msg: string) {
  return (msg || "Marketplace")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9 .,-]/g, "")
    .trim();
}

function isValidIBAN(iban: string) {
  return /^CZ\d{22}$/.test(iban);
}

export default function PaidAdvertPayment({ price, accountNumber, paymentMessage }: Props) {
  const qrString = useMemo(() => {
    const safePrice = Number(price);

    if (!accountNumber || safePrice <= 0) return "";

    const iban = accountNumber.trim().toUpperCase();

    // HARD REQUIREMENT
    if (!isValidIBAN(iban)) return "";

    const message = sanitizeMessage(paymentMessage);

    return `SPD*1.0*ACC:${iban}*AM:${safePrice.toFixed(2)}*CC:CZK*MSG:${message}`;
  }, [accountNumber, price, paymentMessage]);

  if (!qrString) {
    return (
      <Card withBorder radius="md" p="md" mt="md">
        <Stack gap="sm">
          <Text fw={600}>QR Platba</Text>
          <Text size="sm" c="dimmed">
            Zadej platný IBAN (CZ formát) pro generování QR
          </Text>
        </Stack>
      </Card>
    );
  }

  return (
    <Card withBorder radius="md" p="md" mt="md">
      <Stack gap="sm">
        <Text fw={600}>QR Platba</Text>
        <QRCodeCanvas value={qrString} size={180} />
      </Stack>
    </Card>
  );
}
