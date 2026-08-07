"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { UserGroupIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { EmptyState } from "@/components/data/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { TableSkeleton } from "@/components/feedback/table-skeleton";
import { InstagramProfileLink } from "@/components/data/instagram-profile-link";
import { formatPriceCents } from "@/features/products/lib/format";
import type { Locale } from "@/i18n/config";
import { intlLocale } from "@/i18n/config";

import { useCustomers } from "../hooks/use-customers";
import { useCustomerOrders } from "../hooks/use-customer-orders";
import { formatOrderDate, formatRelativeTime } from "../lib/format";
import type { CustomerSummary, RFMSegment } from "../types";

/** Debounced by hand — same 300ms convention as
 * features/conversations/components/conversation-list.tsx's identical
 * helper (duplicated per feature folder, not shared). */
function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}

const ORDER_STATUS_VARIANT: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
  paid: "success",
  pending: "warning",
  failed: "destructive",
  cancelled: "secondary",
};

/** Segment → badge color, roughly "how good is this for the business":
 * champion/loyal read positive, at_risk/sleeping read as needing
 * attention, lost reads negative, new is neutral. */
const SEGMENT_VARIANT: Record<RFMSegment, "brand" | "success" | "warning" | "destructive" | "outline"> = {
  champion: "brand",
  loyal: "success",
  at_risk: "warning",
  sleeping: "warning",
  lost: "destructive",
  new: "outline",
};

const SEGMENT_FILTER_VALUES: (RFMSegment | "all")[] = [
  "all",
  "champion",
  "loyal",
  "at_risk",
  "sleeping",
  "lost",
  "new",
];

/**
 * The customer database — every conversation annotated with what that
 * customer has actually bought, biggest spenders first. Built so an
 * admin can decide who deserves a cashback/discount based on real
 * purchase history rather than guesswork. Clicking a row opens their
 * full order history (see backend customer.UseCase.Orders — every
 * status, not just paid, so a failed/pending attempt is visible too).
 */
export function CustomersList() {
  const [searchInput, setSearchInput] = React.useState("");
  const search = useDebouncedValue(searchInput, 300);
  const [segmentFilter, setSegmentFilter] = React.useState<RFMSegment | "all">("all");
  const [selectedConversationId, setSelectedConversationId] = React.useState<string | null>(null);

  const { data, isPending, isError, error, refetch } = useCustomers(
    search,
    segmentFilter === "all" ? undefined : segmentFilter,
  );
  const selectedCustomer = data?.find((c) => c.conversation_id === selectedConversationId) ?? null;
  const ordersQuery = useCustomerOrders(selectedConversationId);

  const t = useTranslations("customers");
  const tt = useTranslations("time");
  const tOrderStatus = useTranslations("orderStatus");
  const tSegment = useTranslations("rfmSegment");
  const locale = useLocale() as Locale;

  const customers = data ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative max-w-sm">
        <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="pl-9"
        />
      </div>

      <Tabs
        value={segmentFilter}
        onValueChange={(v) => setSegmentFilter(v as RFMSegment | "all")}
      >
        <TabsList>
          {SEGMENT_FILTER_VALUES.map((value) => (
            <TabsTrigger key={value} value={value}>
              {value === "all" ? tSegment("all") : tSegment(value)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="p-0">
          {isPending ? (
            <div className="p-6">
              <TableSkeleton columns={5} rows={6} />
            </div>
          ) : isError ? (
            <ErrorState
              className="py-16"
              title={t("couldntLoad")}
              description={error instanceof Error ? error.message : undefined}
              onRetry={() => refetch()}
            />
          ) : customers.length === 0 ? (
            <EmptyState
              className="py-16"
              icon={UserGroupIcon}
              title={t("noCustomersTitle")}
              description={t("noCustomersDescription")}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("tableCustomer")}</TableHead>
                  <TableHead>{t("tableChannel")}</TableHead>
                  <TableHead>{t("tableSegment")}</TableHead>
                  <TableHead>{t("tableTotalSpent")}</TableHead>
                  <TableHead>{t("tableOrders")}</TableHead>
                  <TableHead>{t("tableLastMessage")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer: CustomerSummary) => (
                  <TableRow
                    key={customer.conversation_id}
                    className="cursor-pointer"
                    onClick={() => setSelectedConversationId(customer.conversation_id)}
                  >
                    <TableCell>
                      {customer.channel === "instagram" ? (
                        <InstagramProfileLink
                          username={customer.customer_username}
                          fallback={t("unknownCustomer")}
                        />
                      ) : (
                        (customer.customer_username ?? t("unknownCustomer"))
                      )}
                    </TableCell>
                    <TableCell className="capitalize">{customer.channel}</TableCell>
                    <TableCell>
                      <Badge variant={SEGMENT_VARIANT[customer.segment]}>
                        {tSegment(customer.segment)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatPriceCents(customer.total_paid_cents, "UZS")}
                    </TableCell>
                    <TableCell>{customer.paid_order_count}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {customer.last_message_at
                        ? formatRelativeTime(customer.last_message_at, tt)
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Sheet
        open={selectedConversationId !== null}
        onOpenChange={(open) => !open && setSelectedConversationId(null)}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              {selectedCustomer?.customer_username ?? t("unknownCustomer")}
              {selectedCustomer && (
                <Badge variant={SEGMENT_VARIANT[selectedCustomer.segment]}>
                  {tSegment(selectedCustomer.segment)}
                </Badge>
              )}
            </SheetTitle>
            <SheetDescription>{t("orderHistoryDescription")}</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-2 overflow-y-auto px-4 pb-4">
            {ordersQuery.isPending ? (
              <TableSkeleton columns={1} rows={4} />
            ) : ordersQuery.isError ? (
              <ErrorState
                className="py-8"
                title={t("couldntLoadOrders")}
                onRetry={() => ordersQuery.refetch()}
              />
            ) : (ordersQuery.data ?? []).length === 0 ? (
              <EmptyState className="py-8" title={t("noOrdersTitle")} />
            ) : (
              <ul className="flex flex-col gap-2">
                {(ordersQuery.data ?? []).map((order) => (
                  <li
                    key={order.id}
                    className="flex flex-col gap-1 rounded-lg border border-border p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {order.product_name}
                      </span>
                      <Badge variant={ORDER_STATUS_VARIANT[order.status] ?? "secondary"}>
                        {tOrderStatus(order.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                      <span>{formatOrderDate(order.created_at, intlLocale(locale))}</span>
                      <span>{formatPriceCents(order.amount_cents, order.currency)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
