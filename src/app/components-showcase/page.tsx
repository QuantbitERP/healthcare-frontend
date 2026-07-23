"use client";

import React from "react";
import Button from "@/components/buttons/Button";
import Alerts from "@/components/alerts/Alerts";
import Tags from "@/components/statusTags/Tags";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@radix-ui/react-separator";

export default function ComponentsShowcase() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Component Showcase</h1>
          <p className="text-lg text-muted-foreground">
            Explore all available components in your inventory management system
          </p>
        </div>

        {/* Custom Components Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Custom Components</h2>

          {/* Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
              <CardDescription>Custom button component with various variants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Button type="primary-button" size="button-medium">Primary Small</Button>
                <Button type="primary-button" size="button-medium">Primary Medium</Button>
                <Button type="primary-button" size="button-large">Primary Large</Button>
                <Button type="secondary-button" size="button-medium">Secondary</Button>
                <Button type="danger-button" size="button-medium">Danger</Button>
                <Button type="link-primary" variant="link-button">Link Button</Button>
                <Button variant="icon" iconSrc="assets/icons/Search.svg" alt="Search" />
                <Button variant="outline" type="primary-button">Outline</Button>
                <Button disabled>Disabled</Button>
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Alerts</CardTitle>
              <CardDescription>Custom alert component with different variants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alerts
                variant="success"
                heading="Success"
                content="Operation completed successfully"
                showButton
                buttonText="View Details"
              />
              <Alerts
                variant="warning"
                heading="Warning"
                content="Please review your input"
                showCloseIcon
              />
              <Alerts
                variant="danger"
                heading="Error"
                content="Something went wrong"
                showButton
                showCloseIcon
                buttonText="Retry"
              />
              <Alerts
                variant="primary"
                heading="Information"
                content="Here's some useful information"
                showButton
                buttonText="Learn More"
              />
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags & Badges</CardTitle>
              <CardDescription>Status tags with different colors and variants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Tags variant="tag" type="primary" tagText="Primary" border />
                <Tags variant="tag" type="secondary" tagText="Secondary" border />
                <Tags variant="tag" type="danger" tagText="Danger" border />
                <Tags variant="tag" type="warning" tagText="Warning" border />
                <Tags variant="tag" type="success" tagText="Success" border />
                <Tags variant="tag" type="info" tagText="Info" border />
                <Tags variant="tag" type="pink" tagText="Pink" border />
                <Tags variant="tag" type="teal" tagText="Teal" border />
                <Tags variant="tag" type="cyan" tagText="Cyan" border />
              </div>
              <div className="flex flex-wrap gap-2">
                <Tags variant="badge" type="primary" tagText="Badge Primary" />
                <Tags variant="badge" type="success" tagText="Badge Success" />
                <Tags variant="badge" type="warning" tagText="Badge Warning" />
              </div>
            </CardContent>
          </Card>

          {/* Patient Card - Commented out due to missing dependencies */}
          <Card>
            <CardHeader>
              <CardTitle>Patient Card</CardTitle>
              <CardDescription>Complex patient information card component (requires Redux store setup)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center text-muted-foreground">
                <p>Patient Card component requires Redux store and API setup to function properly.</p>
                <p className="text-sm mt-2">This component is available in the codebase but needs additional configuration.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* UI Components Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">UI Components</h2>

          {/* Form Components */}
          <Card>
            <CardHeader>
              <CardTitle>Form Components</CardTitle>
              <CardDescription>Input fields, labels, and form controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Enter your password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Type your message here." />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms">Accept terms and conditions</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="notifications" />
                  <Label htmlFor="notifications">Enable notifications</Label>
                </div>

                <RadioGroup defaultValue="option1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option1" id="option1" />
                    <Label htmlFor="option1">Option 1</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option2" id="option2" />
                    <Label htmlFor="option2">Option 2</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Components */}
          <Card>
            <CardHeader>
              <CardTitle>Navigation Components</CardTitle>
              <CardDescription>Tabs, accordion, and navigation elements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                  <div className="rounded-md border p-4">
                    <h3 className="text-lg font-medium">Overview Tab Content</h3>
                    <p className="text-sm text-muted-foreground">This is the overview tab content.</p>
                  </div>
                </TabsContent>
                <TabsContent value="analytics" className="space-y-4">
                  <div className="rounded-md border p-4">
                    <h3 className="text-lg font-medium">Analytics Tab Content</h3>
                    <p className="text-sm text-muted-foreground">This is the analytics tab content.</p>
                  </div>
                </TabsContent>
              </Tabs>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Is it accessible?</AccordionTrigger>
                  <AccordionContent>
                    Yes. It adheres to the WAI-ARIA design pattern.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Is it styled?</AccordionTrigger>
                  <AccordionContent>
                    Yes. It comes with default styles that matches the other components.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Is it animated?</AccordionTrigger>
                  <AccordionContent>
                    Yes. It is animated by default, but you can disable it if you prefer.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Feedback Components */}
          <Card>
            <CardHeader>
              <CardTitle>Avatar Components</CardTitle>
              <CardDescription>User avatar components</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>VC</AvatarFallback>
                </Avatar>
              </div>
            </CardContent>
          </Card>

          {/* Utility Components */}
          <Card>
            <CardHeader>
              <CardTitle>Utility Components</CardTitle>
              <CardDescription>Badges, separators, and utility elements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Section 1</div>
                <div className="text-sm text-muted-foreground">Content for section 1</div>
                <Separator />
                <div className="text-sm font-medium">Section 2</div>
                <div className="text-sm text-muted-foreground">Content for section 2</div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Layout Components */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Layout Components</h2>
          <Card>
            <CardHeader>
              <CardTitle>App Sidebar</CardTitle>
              <CardDescription>Navigation sidebar component (requires additional setup)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center text-muted-foreground">
                <p>App Sidebar component is available but requires additional dependencies to function.</p>
                <p className="text-sm mt-2">Check the components/app-sidebar.jsx file for implementation details.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t">
          <p className="text-sm text-muted-foreground">
            Component showcase for Inventory Management System
          </p>
        </footer>
      </div>
    </div>
  );
}
