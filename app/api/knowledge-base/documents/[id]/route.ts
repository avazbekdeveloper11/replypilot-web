import { NextResponse } from "next/server";

import { goApiFetch } from "@/lib/api/server";
import { errorResponse } from "@/lib/api/route-handler";
import { getAccessToken } from "@/lib/auth/cookies";
import type { KnowledgeDocument } from "@/features/knowledge-base/types";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "not signed in" } },
      { status: 401 },
    );
  }

  const { id } = await params;

  try {
    const document = await goApiFetch<KnowledgeDocument>(`/v1/knowledge-base/documents/${id}`, {
      accessToken,
    });
    return NextResponse.json({ data: document });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "not signed in" } },
      { status: 401 },
    );
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json(
      { error: { code: "INVALID_INPUT", message: "invalid request body" } },
      { status: 400 },
    );
  }

  try {
    const document = await goApiFetch<KnowledgeDocument>(`/v1/knowledge-base/documents/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
      accessToken,
    });
    return NextResponse.json({ data: document });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "not signed in" } },
      { status: 401 },
    );
  }

  const { id } = await params;

  try {
    const result = await goApiFetch<{ deleted: boolean }>(`/v1/knowledge-base/documents/${id}`, {
      method: "DELETE",
      accessToken,
    });
    return NextResponse.json({ data: result });
  } catch (err) {
    return errorResponse(err);
  }
}
