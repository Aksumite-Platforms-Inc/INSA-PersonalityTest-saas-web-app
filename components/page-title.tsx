import { Separator } from "@/components/ui/separator"

interface PageTitleProps {
  title: string
  description?: string
}

export function PageTitle({ title, description }: PageTitleProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {description && <p className="text-muted-foreground">{description}</p>}
      <Separator />
    </div>
  )
}
