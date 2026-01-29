export const FPrint = (element: HTMLElement) => {
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";

  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentWindow?.document;

  if (iframeDoc) {
    (iframeDoc as Document).open();

    // Grab all current stylesheets from your app (including Tailwind)
    const styles = Array.from(
      document.querySelectorAll("style, link[rel='stylesheet']")
    )
      .map((node) => node.outerHTML)
      .join("\n");

    (iframeDoc as Document).write(`
      <html>
        <head>
          <title>Print</title>
          ${styles} <!-- ✅ Inject styles -->
          <style>
            /* Add print-specific styles if needed */
            @page {
              size: A4;
              margin: 20mm;
            }
          </style>
        </head>
        <body>
          ${element.innerHTML}
        </body>
      </html>
    `);

    (iframeDoc as Document).close();

    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();

      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    };
  }
};
