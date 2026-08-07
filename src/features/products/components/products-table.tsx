"use client";

import { useTranslations } from "next-intl";
import { CubeIcon } from "@heroicons/react/24/outline";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/data/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { TableSkeleton } from "@/components/feedback/table-skeleton";

import { useProducts } from "../hooks/use-products";
import { formatPriceCents } from "../lib/format";
import { ProductRowActions } from "./product-row-actions";
import { AddProductButton } from "./add-product-button";

export function ProductsTable() {
  const { data, isPending, isError, error, refetch } = useProducts();
  const t = useTranslations("products");

  if (isPending) return <TableSkeleton columns={3} rows={5} />;

  if (isError) {
    return (
      <ErrorState
        title={t("couldntLoadProducts")}
        description={error instanceof Error ? error.message : undefined}
        onRetry={() => refetch()}
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={CubeIcon}
        title={t("noProductsYet")}
        description={t("noProductsDescription")}
        action={<AddProductButton />}
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("name")}</TableHead>
          <TableHead>{t("price")}</TableHead>
          <TableHead>{t("status")}</TableHead>
          <TableHead className="w-20" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">{product.name}</span>
                {product.description && (
                  <span className="text-xs text-muted-foreground">{product.description}</span>
                )}
              </div>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {product.price_cents != null
                ? formatPriceCents(product.price_cents, product.currency)
                : t("priceOnRequest")}
            </TableCell>
            <TableCell>
              <Badge variant={product.is_active ? "success" : "secondary"}>
                {product.is_active ? t("active") : t("inactive")}
              </Badge>
            </TableCell>
            <TableCell>
              <ProductRowActions product={product} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
