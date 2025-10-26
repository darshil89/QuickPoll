"use client"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Button } from "@/components/ui/button";
  import { Badge } from "@/components/ui/badge";
  import { Switch } from "@/components/ui/switch";
  import { Checkbox } from "@/components/ui/checkbox";
  import { 
    Eye, 
    FileText, 
    PhoneForwarded, 
    BarChart, 
    CheckCircle, 
    Phone, 
    Edit, 
    StickyNote 
  } from "lucide-react";
  
  interface Column {
    key: string;
    label: string;
    type?: "text" | "badge" | "button" | "buttons" | "checkbox" | "toggle" | "icon";
    variant?: string;
    icon?: any;
    action?: string;
    buttons?: string[];
    tooltip?: string;
  }
  
  interface DataTableProps {
    columns: Column[];
    data: any[];
    onAction?: (action: string, row: any, index?: number) => void;
  }
  
  const iconMap = {
    eye: Eye,
    file: FileText,
    "phone-forwarded": PhoneForwarded,
    "bar-chart": BarChart,
    "check-circle": CheckCircle,
    phone: Phone,
    edit: Edit,
    "sticky-note": StickyNote,
  };
  
  export const DataTable = ({ columns, data, onAction }: DataTableProps) => {
    const renderCell = (column: Column, row: any, rowIndex: number) => {
      const value = row[column.key];
  
      switch (column.type) {
        case "checkbox":
          return (
            <Checkbox
              checked={value}
              onCheckedChange={(checked) =>
                onAction?.(column.action || "toggle", { ...row, [column.key]: checked }, rowIndex)
              }
            />
          );
  
        case "toggle":
          return (
            <Switch
              checked={value}
              onCheckedChange={(checked) =>
                onAction?.(column.action || "toggle", { ...row, [column.key]: checked }, rowIndex)
              }
            />
          );
  
        case "badge":
          // Special handling for score column
          if (column.key === "score") {
            const scoreValue = typeof value === 'number' ? value : parseInt(value);
            const variant = scoreValue >= 90 ? "default" : scoreValue >= 80 ? "secondary" : "outline";
            return (
              <Badge variant={variant}>
                {scoreValue}%
              </Badge>
            );
          }
          return (
            <Badge variant={column.variant as any || "default"}>
              {value}
            </Badge>
          );
  
        case "button":
          return (
            <Button
              variant={column.variant as any || "outline"}
              size="sm"
              onClick={() => onAction?.(column.action || "click", row, rowIndex)}
            >
              {column.label}
            </Button>
          );
  
        case "buttons":
          return (
            <div className="flex gap-2">
              {column.buttons?.map((buttonLabel) => (
                <Button
                  key={buttonLabel}
                  variant="outline"
                  size="sm"
                  onClick={() => onAction?.(buttonLabel.toLowerCase().replace(" ", ""), row, rowIndex)}
                >
                  {buttonLabel}
                </Button>
              ))}
            </div>
          );
  
        case "icon":
          const IconComponent = column.icon ? iconMap[column.icon as keyof typeof iconMap] : null;
          return (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAction?.(column.action || "click", row, rowIndex)}
              title={column.tooltip}
            >
              {IconComponent && <IconComponent className="h-4 w-4" />}
            </Button>
          );
  
        default:
          return <span className="text-sm">{value}</span>;
      }
    };
  
    return (
      <div className="rounded-lg border border-border bg-card">
        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                {columns.map((column) => (
                  <TableHead key={column.key} className="font-semibold text-foreground">
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="border-border hover:bg-accent/50">
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {renderCell(column, row, rowIndex)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden">
          {data.map((row, rowIndex) => (
            <div key={rowIndex} className="border-b border-border p-4 last:border-b-0">
              <div className="space-y-3">
                {columns.map((column) => {
                  // Skip certain columns on mobile for better UX
                  if (column.type === "icon" && column.key !== "active") {
                    return null;
                  }
                  
                  return (
                    <div key={column.key} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        {column.label}:
                      </span>
                      <div className="flex-1 ml-4">
                        {renderCell(column, row, rowIndex)}
                      </div>
                    </div>
                  );
                })}
                
                {/* Action buttons for mobile */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {columns
                    .filter(col => col.type === "icon" && col.key !== "active")
                    .map((column) => {
                      const IconComponent = column.icon ? iconMap[column.icon as keyof typeof iconMap] : null;
                      return (
                        <Button
                          key={column.key}
                          variant="outline"
                          size="sm"
                          onClick={() => onAction?.(column.action || "click", row, rowIndex)}
                          title={column.tooltip}
                          className="flex-1 min-w-0"
                        >
                          {IconComponent && <IconComponent className="h-4 w-4 mr-1" />}
                          <span className="truncate">{column.label}</span>
                        </Button>
                      );
                    })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };