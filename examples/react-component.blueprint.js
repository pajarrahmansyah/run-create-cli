/**
 * Blueprint Example: React Component
 * 
 * Usage:
 *   rcc gen examples/react-component.blueprint.js Button
 * 
 * This will generate:
 *   - src/components/button.tsx
 *   - src/components/button.test.tsx
 */

export default {
	files: [
		{
			path: (name) => `src/components/${name.kebab}.tsx`,
			template: (name) => `import React from 'react';

export interface ${name.pascal}Props {
	/**
	 * The content of the ${name.lower}
	 */
	children?: React.ReactNode;
	
	/**
	 * Additional CSS classes
	 */
	className?: string;
	
	/**
	 * Click handler
	 */
	onClick?: () => void;
}

/**
 * ${name.pascal} Component
 */
export const ${name.pascal}: React.FC<${name.pascal}Props> = ({
	children,
	className = '',
	onClick,
}) => {
	return (
		<${name.lower}
			className={\`${name.kebab} \${className}\`}
			onClick={onClick}
		>
			{children}
		</${name.lower}>
	);
};
`,
		},
		{
			path: (name) => `src/components/${name.kebab}.test.tsx`,
			template: (name) => `import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ${name.pascal} } from './${name.kebab}';

describe('${name.pascal}', () => {
	it('should render children', () => {
		render(<${name.pascal}>Hello World</${name.pascal}>);
		expect(screen.getByText('Hello World')).toBeInTheDocument();
	});

	it('should apply custom className', () => {
		const { container } = render(
			<${name.pascal} className="custom-class">Content</${name.pascal}>
		);
		const element = container.firstChild;
		expect(element).toHaveClass('${name.kebab}');
		expect(element).toHaveClass('custom-class');
	});

	it('should handle onClick event', () => {
		const handleClick = vi.fn();
		render(<${name.pascal} onClick={handleClick}>Click Me</${name.pascal}>);
		
		const element = screen.getByText('Click Me');
		fireEvent.click(element);
		
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it('should render without children', () => {
		const { container } = render(<${name.pascal} />);
		expect(container.firstChild).toBeInTheDocument();
	});
});
`,
		},
	],
};
