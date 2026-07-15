const fs = require("fs");

const dashboardPath = "frontend/app/dashboard/dsa/[id]/page.tsx";
const sharedPath = "frontend/components/shared/dsa-detail.tsx";

let content = fs.readFileSync(dashboardPath, "utf8");

// Replace export default function DSAPage() with export function DSADetail({ isDashboard = false }: { isDashboard?: boolean })
content = content.replace(
  "export default function DSAPage() {",
  "export function DSADetail({ isDashboard = false }: { isDashboard?: boolean }) {",
);

// We need to conditionally render Breadcrumbs.
// We can find the `<header...` block and wrap it with `{isDashboard && (`
content = content.replace(
  /<header className="bg-background sticky top-0 flex h-16 shrink-0 items-center border-b px-4 justify-between z-10 shadow-sm">/g,
  '{isDashboard && (\n        <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center border-b px-4 justify-between z-10 shadow-sm">',
);
content = content.replace(
  /<\/header>\n\n        <div className="flex-1 overflow-y-auto bg-background">/g,
  '</header>\n      )}\n\n        <div className="flex-1 overflow-y-auto bg-background">',
);

// In the dashboard page, it was returning `<> ... </>` because of my script. Wait, no, `remove_wrappers` replaced `<ProtectedRoute>` with `<>`.
// So it returns `<> ... </>`.
// But for the public version, we need Navbar and Footer.
// We can define a wrapper inside the component:
const wrapperFn = `
  const layoutWrapper = (children: React.ReactNode) => {
    if (!isDashboard) {
      return (
        <div className="min-h-screen flex flex-col bg-background">
          {/* Public Navbar would be imported here */}
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          {/* Public Footer would be imported here */}
        </div>
      );
    }
    return <>{children}</>;
  };

  return layoutWrapper(
`;

content = content.replace("return (", wrapperFn);

// We need to replace the ending `);` with `  ));` because `layoutWrapper(` opened a paren.
// The file ends with:
//   );
// }
// </>
content = content.replace(/<\/div>\n<\/>/g, "</div>");
content = content.replace(/<\/>\n  \);\n}/g, "  ));\n}");

fs.writeFileSync(sharedPath, content);
console.log("Done creating dsa-detail.tsx");
