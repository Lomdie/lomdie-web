"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function Table({
  className,
  topScrollbar = false,
  ...props
}: React.ComponentProps<"table"> & { topScrollbar?: boolean }) {
  const topScrollRef = React.useRef<HTMLDivElement>(null)
  const tableScrollRef = React.useRef<HTMLDivElement>(null)
  const topScrollWidthRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!topScrollbar) return
    const table = tableScrollRef.current?.querySelector("table")
    const spacer = topScrollWidthRef.current
    if (!table || !spacer) return

    const updateWidth = () => {
      spacer.style.width = `${table.scrollWidth}px`
    }
    updateWidth()
    const observer = new ResizeObserver(updateWidth)
    observer.observe(table)
    return () => observer.disconnect()
  }, [topScrollbar])

  const syncScroll = (source: "top" | "table") => {
    const top = topScrollRef.current
    const table = tableScrollRef.current
    if (!top || !table) return
    if (source === "top" && table.scrollLeft !== top.scrollLeft) table.scrollLeft = top.scrollLeft
    if (source === "table" && top.scrollLeft !== table.scrollLeft) top.scrollLeft = table.scrollLeft
  }

  return (
    <>
      {topScrollbar ? (
        <div
          ref={topScrollRef}
          className="w-full overflow-x-auto overflow-y-hidden border-b border-border/70"
          role="region"
          tabIndex={0}
          aria-label="Défilement horizontal du tableau"
          onScroll={() => syncScroll("top")}
        >
          <div ref={topScrollWidthRef} className="h-1" />
        </div>
      ) : null}
      <div
        ref={tableScrollRef}
        data-slot="table-container"
        className="relative w-full overflow-x-auto"
        onScroll={() => syncScroll("table")}
      >
        <table
          data-slot="table"
          className={cn("w-full caption-bottom text-sm", className)}
          {...props}
        />
      </div>
    </>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
