import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'focus:ring-ring inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
          {
            'text-primary-foreground border-transparent bg-primary hover:bg-primary/80':
              variant === 'default',
            'text-secondary-foreground border-transparent bg-secondary hover:bg-secondary/80':
              variant === 'secondary',
            'bg-destructive text-destructive-foreground hover:bg-destructive/80 border-transparent':
              variant === 'destructive',
            'text-foreground': variant === 'outline'
          },
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = 'Badge'

export { Badge }
