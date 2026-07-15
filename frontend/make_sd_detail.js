const fs = require("fs");

const dashboardPath = "frontend/app/dashboard/system-design/[id]/page.tsx";
const sharedPath = "frontend/components/shared/system-design-detail.tsx";

let content = fs.readFileSync(dashboardPath, "utf8");

// Update imports
content = content.replace(
  "import { useParams, useRouter } from 'next/navigation';",
  'import { useParams, useRouter } from \'next/navigation\';\nimport { PublicNavbar } from "@/components/public-navbar";\nimport { PublicFooter } from "@/components/public-footer";\nimport { SidebarTrigger } from "@/components/ui/sidebar";\nimport { Separator } from "@/components/ui/separator";\nimport { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";',
);

// Replace export default function SystemDesignDetailPage() with export function SystemDesignDetail({ isDashboard = false }: { isDashboard?: boolean })
content = content.replace(
  "export default function SystemDesignDetailPage() {",
  "export function SystemDesignDetail({ isDashboard = false }: { isDashboard?: boolean }) {",
);

// Wrap header with isDashboard check and add layoutWrapper
content = content.replace(
  /<header className="bg-background sticky top-0 flex h-16 shrink-0 items-center border-b px-4 justify-between z-10 shadow-sm">/g,
  '{isDashboard && (\n        <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center border-b px-4 justify-between z-10 shadow-sm">',
);

content = content.replace(
  /<\/header>\n\n        {\/\* Single Column Layout \*\//g,
  "</header>\n      )}\n\n        {/* Single Column Layout */",
);

const wrapperFn = `
  const layoutWrapper = (children: React.ReactNode) => {
    if (!isDashboard) {
      return (
        <div className="min-h-screen flex flex-col bg-background">
          <PublicNavbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <PublicFooter />
        </div>
      );
    }
    return <>{children}</>;
  };

  return layoutWrapper(
`;

content = content.replace(
  'return (\n\n      <div className="flex flex-col h-screen overflow-hidden bg-background">',
  wrapperFn +
    '\n      <div className="flex flex-col h-screen overflow-hidden bg-background">',
);

// Update end
content = content.replace(/<\/div>\n    \);\n}/g, "</div>\n  ));\n}");
// Or if it ends with just `</div>\n  );` without spaces:
content = content.replace(/<\/div>\n  \);\n}/g, "</div>\n  ));\n}");

fs.writeFileSync(sharedPath, content);
console.log("Done creating system-design-detail.tsx");
