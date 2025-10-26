"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import React from "react"

interface CardUniversalProps {
  icon: React.ReactNode
  title: string
  description?: string
  children: React.ReactNode
}

export default function CardUniversal({
  icon,
  title,
  description,
  children,
}: CardUniversalProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          {icon}
          <CardTitle className="text-lg sm:text-xl text-gray-600 select-none">
            {title}
          </CardTitle>
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}
