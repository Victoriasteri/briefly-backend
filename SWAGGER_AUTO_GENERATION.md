# Swagger Auto-Generation Guide

## NestJS Swagger Plugin

The Swagger plugin is now enabled in `nest-cli.json`. It automatically generates Swagger documentation from:

1. **TypeScript types** - Automatically infers types (string, number, boolean, etc.)
2. **class-validator decorators** - Generates validation rules (minLength, maxLength, pattern, etc.)
3. **Required/Optional** - Determines from TypeScript optional types (`?`)
4. **JSDoc comments** - Can extract descriptions from comments

## What Gets Auto-Generated

### Without Plugin (Manual):

```typescript
@ApiProperty({
  description: 'User email address',
  example: 'user@example.com',
  type: String,
  required: true,
})
@IsEmail()
email: string;
```

### With Plugin (Auto-Generated):

```typescript
/**
 * User email address
 * @example user@example.com
 */
@IsEmail()
email: string;
```

The plugin automatically generates:

- ✅ `type: String` from TypeScript type
- ✅ `required: true` (no `?` in type)
- ✅ `format: email` from `@IsEmail()` decorator
- ✅ `description` from JSDoc comment
- ✅ `example` from JSDoc `@example` tag

## Simplifying Your DTOs

### Option 1: Use JSDoc Comments (Recommended)

```typescript
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class SignUpDto {
  /**
   * User email address
   * @example user@example.com
   */
  @IsEmail()
  email: string;

  /**
   * User password (minimum 6 characters)
   * @example password123
   */
  @IsString()
  @MinLength(6)
  password: string;

  /**
   * Additional user metadata
   * @example { firstName: 'John', lastName: 'Doe' }
   */
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
```

### Option 2: Minimal (Plugin Does Everything)

```typescript
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsObject,
} from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
```

This will still generate:

- Types from TypeScript
- Validation rules from decorators
- Required/optional from `?` operator

## What You Still Need to Add Manually

1. **Custom Examples** - If you want specific examples, use JSDoc `@example`
2. **Complex Descriptions** - Use JSDoc comments
3. **Response Types** - Still need `@ApiResponse({ type: YourDto })` in controllers
4. **Operation Descriptions** - Still use `@ApiOperation({ summary: '...' })`

## Benefits

✅ **Less Code** - Remove repetitive `@ApiProperty` decorators
✅ **Type Safety** - Types are automatically inferred
✅ **DRY Principle** - Single source of truth (TypeScript types)
✅ **Auto-Updates** - When you change types, Swagger updates automatically
✅ **Validation Rules** - Automatically synced from class-validator

## Example: Before vs After

### Before (Manual):

```typescript
export class SignInDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    type: String,
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
    type: String,
    required: true,
  })
  @IsString()
  password: string;
}
```

### After (Auto-Generated):

```typescript
export class SignInDto {
  /**
   * User email address
   * @example user@example.com
   */
  @IsEmail()
  email: string;

  /**
   * User password
   * @example password123
   */
  @IsString()
  password: string;
}
```

## Plugin Configuration

The plugin is configured in `nest-cli.json`:

```json
{
  "plugins": [
    {
      "name": "@nestjs/swagger",
      "options": {
        "classValidatorShim": true, // Uses class-validator decorators
        "introspectComments": true // Extracts JSDoc comments
      }
    }
  ]
}
```

## Tips

1. **Use JSDoc for descriptions** - Cleaner than `@ApiProperty`
2. **Keep validation decorators** - They generate validation rules automatically
3. **Use TypeScript types** - Let the plugin infer types
4. **Optional fields** - Use `?` operator, plugin handles it
5. **Complex types** - Still use `@ApiProperty` for complex nested objects if needed

## Testing

After enabling the plugin:

1. Rebuild: `npm run build`
2. Start server: `npm run start:dev`
3. Check Swagger: `http://localhost:3000/api`
4. Verify auto-generated types and validation rules
