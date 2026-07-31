"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { FormAlert } from "@/components/feedback/form-alert";
import { ApiError } from "@/lib/api/errors";

import {
  uploadTextSchema,
  uploadFileTitleSchema,
  type UploadTextValues,
  type UploadFileTitleValues,
} from "../schemas/upload.schema";
import { useUploadDocument } from "../hooks/use-upload-document";

/** Only .txt/.md uploads are actually parsed server-side — anything else
 * (PDF, DOCX) is rejected with a clear 400 rather than silently mangled.
 * See KnowledgeHandler.Upload's doc comment. */
const ACCEPTED_FILE_EXTENSIONS = ".txt,.md";

export function UploadDocumentForm() {
  const router = useRouter();
  const uploadMutation = useUploadDocument();

  return (
    <Card>
      <CardContent>
        <Tabs defaultValue="text">
          <TabsList>
            <TabsTrigger value="text">Paste text</TabsTrigger>
            <TabsTrigger value="file">Upload a file</TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="pt-4">
            <TextUploadForm
              onSuccess={() => router.push("/knowledge-base")}
              mutation={uploadMutation}
            />
          </TabsContent>

          <TabsContent value="file" className="pt-4">
            <FileUploadForm
              onSuccess={() => router.push("/knowledge-base")}
              mutation={uploadMutation}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function TextUploadForm({
  onSuccess,
  mutation,
}: {
  onSuccess: () => void;
  mutation: ReturnType<typeof useUploadDocument>;
}) {
  const form = useForm<UploadTextValues>({
    resolver: zodResolver(uploadTextSchema),
    defaultValues: { title: "", content: "" },
  });

  function onSubmit(values: UploadTextValues) {
    mutation.mutate(
      { kind: "text", title: values.title, content: values.content },
      { onSuccess },
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="text-title">Title</Label>
        <Input
          id="text-title"
          placeholder="Refund policy"
          aria-invalid={!!form.formState.errors.title}
          {...form.register("title")}
        />
        {form.formState.errors.title && (
          <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="text-content">Content</Label>
        <Textarea
          id="text-content"
          rows={12}
          placeholder="Paste the text you want the AI to be able to answer from…"
          aria-invalid={!!form.formState.errors.content}
          {...form.register("content")}
        />
        {form.formState.errors.content && (
          <p className="text-xs text-destructive">{form.formState.errors.content.message}</p>
        )}
      </div>

      {mutation.isError && (
        <FormAlert variant="error">
          {mutation.error instanceof ApiError
            ? mutation.error.message
            : "Something went wrong. Please try again."}
        </FormAlert>
      )}

      <div>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Uploading…" : "Upload document"}
        </Button>
      </div>
    </form>
  );
}

function FileUploadForm({
  onSuccess,
  mutation,
}: {
  onSuccess: () => void;
  mutation: ReturnType<typeof useUploadDocument>;
}) {
  const [file, setFile] = React.useState<File | null>(null);
  const [fileError, setFileError] = React.useState<string | null>(null);

  const form = useForm<UploadFileTitleValues>({
    resolver: zodResolver(uploadFileTitleSchema),
    defaultValues: { title: "" },
  });

  function onSubmit(values: UploadFileTitleValues) {
    if (!file) {
      setFileError("Choose a .txt or .md file");
      return;
    }
    setFileError(null);
    mutation.mutate({ kind: "file", title: values.title, file }, { onSuccess });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="file-title">Title</Label>
        <Input
          id="file-title"
          placeholder="Refund policy"
          aria-invalid={!!form.formState.errors.title}
          {...form.register("title")}
        />
        {form.formState.errors.title && (
          <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="file-input">File</Label>
        <Input
          id="file-input"
          type="file"
          accept={ACCEPTED_FILE_EXTENSIONS}
          aria-invalid={!!fileError}
          onChange={(e) => {
            setFile(e.target.files?.[0] ?? null);
            setFileError(null);
          }}
        />
        <p className="text-xs text-muted-foreground">
          .txt or .md only — PDF/DOCX parsing isn&apos;t implemented yet.
        </p>
        {fileError && <p className="text-xs text-destructive">{fileError}</p>}
      </div>

      {mutation.isError && (
        <FormAlert variant="error">
          {mutation.error instanceof ApiError
            ? mutation.error.message
            : "Something went wrong. Please try again."}
        </FormAlert>
      )}

      <div>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Uploading…" : "Upload document"}
        </Button>
      </div>
    </form>
  );
}
