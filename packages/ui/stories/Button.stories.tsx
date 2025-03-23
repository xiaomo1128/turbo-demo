import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
      ],
      description: '按钮的样式变体',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: '按钮的尺寸',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    asChild: {
      control: 'boolean',
      description: '是否作为子组件，使用Radix UI的Slot功能',
    },
    onClick: { action: 'clicked' },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '基于Radix UI Themes构建的可定制按钮组件。支持多种样式变体和尺寸。',
      },
    },
  },
  decorators: [
    (Story) => (
      <Theme>
        <Story />
      </Theme>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: '默认按钮',
    variant: 'default',
    size: 'default',
  },
};

export const Destructive: Story = {
  args: {
    children: '删除按钮',
    variant: 'destructive',
    size: 'default',
  },
};

export const Outline: Story = {
  args: {
    children: '轮廓按钮',
    variant: 'outline',
    size: 'default',
  },
};

export const Secondary: Story = {
  args: {
    children: '次要按钮',
    variant: 'secondary',
    size: 'default',
  },
};

export const Ghost: Story = {
  args: {
    children: '幽灵按钮',
    variant: 'ghost',
    size: 'default',
  },
};

export const Link: Story = {
  args: {
    children: '链接按钮',
    variant: 'link',
    size: 'default',
  },
};

export const Small: Story = {
  args: {
    children: '小按钮',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    children: '大按钮',
    size: 'lg',
  },
};

export const Icon: Story = {
  args: {
    children: '📁',
    size: 'icon',
    'aria-label': '图标按钮',
  },
};

export const Disabled: Story = {
  args: {
    children: '禁用按钮',
    disabled: true,
  },
};

export const WithClickHandler: Story = {
  args: {
    children: '点击我',
    onClick: () => alert('按钮被点击了！'),
  },
};

// 使用模板创建一组相同配置的故事
export const ButtonGroup: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Button {...args} variant="default">
        默认
      </Button>
      <Button {...args} variant="destructive">
        删除
      </Button>
      <Button {...args} variant="outline">
        轮廓
      </Button>
      <Button {...args} variant="secondary">
        次要
      </Button>
      <Button {...args} variant="ghost">
        幽灵
      </Button>
      <Button {...args} variant="link">
        链接
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示所有按钮变体的组合。',
      },
    },
  },
};

export const SizeGroup: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button {...args} size="sm">
          小按钮
        </Button>
        <Button {...args}>默认按钮</Button>
        <Button {...args} size="lg">
          大按钮
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示不同尺寸的按钮。',
      },
    },
  },
};
