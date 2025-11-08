import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>)

    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
  })

  it('should handle click events', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)

    const button = screen.getByRole('button', { name: /click me/i })
    await user.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>)

    const button = screen.getByRole('button', { name: /disabled button/i })
    expect(button).toBeDisabled()
  })

  it('should apply variant classes correctly', () => {
    const { container } = render(<Button variant="destructive">Delete</Button>)

    const button = container.querySelector('button')
    expect(button).toHaveClass('bg-destructive')
  })

  it('should apply size classes correctly', () => {
    const { container } = render(<Button size="lg">Large Button</Button>)

    const button = container.querySelector('button')
    expect(button).toHaveClass('h-11')
  })

  it('should not trigger onClick when disabled', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()

    render(<Button disabled onClick={handleClick}>Disabled</Button>)

    const button = screen.getByRole('button', { name: /disabled/i })
    await user.click(button)

    expect(handleClick).not.toHaveBeenCalled()
  })
})
