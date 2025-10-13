import { Icons } from '@/components/ui/icons';

export interface DetailNav {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
}
export interface NavItem {
  title: string;
  items: DetailNav[];
}
