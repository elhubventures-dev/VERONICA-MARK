declare module "@storybook/react" {
  import type { ComponentType, ReactNode } from "react";

  export type Meta<T = ComponentType<unknown>> = {
    title?: string;
    component?: T;
    tags?: string[];
    parameters?: Record<string, unknown>;
    argTypes?: Record<string, unknown>;
    decorators?: Array<(Story: ComponentType) => ReactNode>;
  };

  export type StoryObj<T = Record<string, unknown>> = {
    args?: Partial<T>;
    render?: (args: T) => ReactNode;
    parameters?: Record<string, unknown>;
  };
}
