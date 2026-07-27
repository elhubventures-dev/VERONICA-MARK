import type { Meta, StoryObj } from "@storybook/react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

const meta: Meta = {
  title: "Design System/UI/Tabs",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Brand overview content.</TabsContent>
      <TabsContent value="analytics">Analytics dashboard content.</TabsContent>
      <TabsContent value="settings">Settings panel content.</TabsContent>
    </Tabs>
  ),
};

export const TwoTabs: Story = {
  render: () => (
    <Tabs defaultValue="active" className="w-[300px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="archived">Archived</TabsTrigger>
      </TabsList>
      <TabsContent value="active">Active listings.</TabsContent>
      <TabsContent value="archived">Archived listings.</TabsContent>
    </Tabs>
  ),
};