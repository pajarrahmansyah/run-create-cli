/**
 * Blueprint Example: API Service
 * 
 * Usage:
 *   rcc gen examples/api-service.blueprint.js UserService
 * 
 * This will generate:
 *   - src/services/user-service.ts
 *   - src/services/user-service.test.ts
 */

export default {
	files: [
		{
			path: (name) => `src/services/${name.kebab}.ts`,
			template: (name) => `import { ApiClient } from '@/lib/api-client';

/**
 * ${name.pascal} - API Service
 */
export class ${name.pascal} {
	private client: ApiClient;

	constructor(client: ApiClient) {
		this.client = client;
	}

	/**
	 * Get all ${name.lower} items
	 */
	async getAll() {
		return this.client.get('/${name.kebab}');
	}

	/**
	 * Get ${name.lower} by ID
	 */
	async getById(id: string) {
		return this.client.get(\`/${name.kebab}/\${id}\`);
	}

	/**
	 * Create new ${name.lower}
	 */
	async create(data: any) {
		return this.client.post('/${name.kebab}', data);
	}

	/**
	 * Update ${name.lower}
	 */
	async update(id: string, data: any) {
		return this.client.put(\`/${name.kebab}/\${id}\`, data);
	}

	/**
	 * Delete ${name.lower}
	 */
	async delete(id: string) {
		return this.client.delete(\`/${name.kebab}/\${id}\`);
	}
}
`,
		},
		{
			path: (name) => `src/services/${name.kebab}.test.ts`,
			template: (name) => `import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ${name.pascal} } from './${name.kebab}';
import { ApiClient } from '@/lib/api-client';

describe('${name.pascal}', () => {
	let service: ${name.pascal};
	let mockClient: ApiClient;

	beforeEach(() => {
		mockClient = {
			get: vi.fn(),
			post: vi.fn(),
			put: vi.fn(),
			delete: vi.fn(),
		} as any;

		service = new ${name.pascal}(mockClient);
	});

	describe('getAll', () => {
		it('should fetch all ${name.lower} items', async () => {
			const mockData = [{ id: '1', name: 'Test' }];
			vi.mocked(mockClient.get).mockResolvedValue(mockData);

			const result = await service.getAll();

			expect(mockClient.get).toHaveBeenCalledWith('/${name.kebab}');
			expect(result).toEqual(mockData);
		});
	});

	describe('getById', () => {
		it('should fetch ${name.lower} by id', async () => {
			const mockData = { id: '1', name: 'Test' };
			vi.mocked(mockClient.get).mockResolvedValue(mockData);

			const result = await service.getById('1');

			expect(mockClient.get).toHaveBeenCalledWith('/${name.kebab}/1');
			expect(result).toEqual(mockData);
		});
	});

	describe('create', () => {
		it('should create new ${name.lower}', async () => {
			const mockData = { name: 'New Item' };
			const mockResponse = { id: '1', ...mockData };
			vi.mocked(mockClient.post).mockResolvedValue(mockResponse);

			const result = await service.create(mockData);

			expect(mockClient.post).toHaveBeenCalledWith('/${name.kebab}', mockData);
			expect(result).toEqual(mockResponse);
		});
	});

	describe('update', () => {
		it('should update ${name.lower}', async () => {
			const mockData = { name: 'Updated' };
			const mockResponse = { id: '1', ...mockData };
			vi.mocked(mockClient.put).mockResolvedValue(mockResponse);

			const result = await service.update('1', mockData);

			expect(mockClient.put).toHaveBeenCalledWith('/${name.kebab}/1', mockData);
			expect(result).toEqual(mockResponse);
		});
	});

	describe('delete', () => {
		it('should delete ${name.lower}', async () => {
			vi.mocked(mockClient.delete).mockResolvedValue({ success: true });

			const result = await service.delete('1');

			expect(mockClient.delete).toHaveBeenCalledWith('/${name.kebab}/1');
			expect(result).toEqual({ success: true });
		});
	});
});
`,
		},
	],
};
