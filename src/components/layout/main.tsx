import { cn } from '@/lib/utils'

type MainProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean
  fluid?: boolean
  ref?: React.Ref<HTMLElement>
}

export function Main({ fixed, className, fluid, ...props }: MainProps) {
  return (
    <main
      data-layout={fixed ? 'fixed' : 'auto'}
      className={cn(
        'max-w-full px-4 py-6',

        // If layout is fixed, make the main container flex and grow
        fixed && 'flex grow flex-col overflow-hidden',

        // add animate transition for fluid to fixed and vice versa
        'transition-[max-width] duration-300 ease-in-out',

        // Avoid animating from max-width:none (not animatable): always set an explicit max-width
        '@7xl/content:mx-auto @7xl/content:w-full',
        fluid ? '@7xl/content:max-w-full' : '@7xl/content:max-w-7xl',
        className
      )}
      {...props}
    />
  )
}
