import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";

import { ProductsTable } from "./products-table";
import { AddProductButton } from "./add-product-button";
import { ImportProductsDialog } from "./import-products-dialog";

export async function ProductsView() {
  const t = await getTranslations("products");

  return (
    <>
      <PageHeader
        title={t("pageTitle")}
        description={t("pageDescription")}
        actions={
          <div className="flex items-center gap-2">
            <ImportProductsDialog />
            <AddProductButton />
          </div>
        }
      />
      <Card>
        <CardContent>
          <ProductsTable />
        </CardContent>
      </Card>
    </>
  );
}
