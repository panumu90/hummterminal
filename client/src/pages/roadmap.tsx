import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Roadmap() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-16">
        <header className="mb-12">
          <h1 className="text-2xl font-medium tracking-tight">Roadmap</h1>
          <p className="mt-2 text-sm text-muted-foreground">High‑level focus areas. Subject to change.</p>
        </header>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <Card className="shadow-none border-muted">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium tracking-wider text-muted-foreground uppercase">Now</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 text-sm">
                <div className="border-b border-muted pb-3 last:border-0 last:pb-0">Refine onboarding and first‑value time</div>
                <div className="border-b border-muted pb-3 last:border-0 last:pb-0">Stabilize core workflow execution</div>
                <div className="pb-0">Improve performance under load</div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none border-muted">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium tracking-wider text-muted-foreground uppercase">Next</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 text-sm">
                <div className="border-b border-muted pb-3 last:border-0 last:pb-0">Advanced analytics and insights</div>
                <div className="border-b border-muted pb-3 last:border-0 last:pb-0">Team collaboration improvements</div>
                <div className="pb-0">Integrations with key third‑party tools</div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none border-muted">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium tracking-wider text-muted-foreground uppercase">Later</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 text-sm">
                <div className="border-b border-muted pb-3 last:border-0 last:pb-0">Role‑based access and governance</div>
                <div className="border-b border-muted pb-3 last:border-0 last:pb-0">Offline mode and sync</div>
                <div className="pb-0">Custom extension SDK</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <p className="mt-10 text-xs text-muted-foreground">Last updated: Q3 2025</p>
      </div>
    </div>
  );
}


