"use client";

// Last-resort boundary — only fires if the ROOT layout itself throws
// (FRONTEND_ARCHITECTURE.md §5), which also means AppProviders/globals.css
// may not have mounted. It renders its own <html>/<body> and deliberately
// uses inline styles, not Tailwind classes or design-system components,
// so it can't be taken down by whatever broke the root layout.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          display: "flex",
          minHeight: "100dvh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          textAlign: "center",
          padding: "16px",
        }}
      >
        <h1 style={{ fontSize: "20px", fontWeight: 600 }}>
          Something went wrong
        </h1>
        <p style={{ fontSize: "14px", color: "#71717a", maxWidth: "360px" }}>
          The application hit an unexpected error. Try again, or reload the
          page.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: "8px",
            padding: "8px 16px",
            borderRadius: "6px",
            background: "#18181b",
            color: "#fafafa",
            fontSize: "14px",
            fontWeight: 500,
            border: "none",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
