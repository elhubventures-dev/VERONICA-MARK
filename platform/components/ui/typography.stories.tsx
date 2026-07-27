import type { Meta, StoryObj } from "@storybook/react";

import {
  Blockquote,
  Caption,
  Code,
  Display,
  Heading,
  Lead,
  LinkText,
  List,
  ListItem,
  Muted,
  Overline,
  Text,
} from "./typography";

const meta: Meta = {
  title: "Design System/UI/Typography",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="space-y-4 max-w-xl">
      <Overline>Luxury Commerce</Overline>
      <Display>Veronica Mark</Display>
      <Heading as="h2">Managed Brand Marketplace</Heading>
      <Lead>Premium enterprise commerce for luxury brands.</Lead>
      <Text>Body text for product descriptions and content blocks.</Text>
      <Muted>Supporting muted copy for secondary information.</Muted>
      <Caption>Caption text · Updated today</Caption>
      <Code>npm run dev</Code>
      <Blockquote>Elegance is the only beauty that never fades.</Blockquote>
      <List>
        <ListItem>Curated brand onboarding</ListItem>
        <ListItem>Enterprise checkout flows</ListItem>
      </List>
      <LinkText href="#">Explore the platform</LinkText>
    </div>
  ),
};

export const HeadingLevels: Story = {
  render: () => (
    <div className="space-y-2">
      <Heading as="h1">Heading as h1</Heading>
      <Heading as="h3">Heading as h3</Heading>
      <Heading as="h6">Heading as h6</Heading>
    </div>
  ),
};