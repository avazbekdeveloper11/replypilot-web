import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";

import { ProductsTable } from "./products-table";
import { AddProductButton } from "./add-product-button";

export async function ProductsView() {
  const t = await getTranslations("products");

  return (
    <>
      <PageHeader
        title={t("pageTitle")}
        description={t("pageDescription")}
        actions={<AddProductButton />}
      />
      <Card>
        <CardContent>
          <ProductsTable />
        </CardContent>
      </Card>
    </>
  );
}
