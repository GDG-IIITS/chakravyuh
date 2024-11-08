import { SetMetadata } from '@nestjs/common';

export const ALLOW_INACTIVE_KEY = 'allowInactive';
export const AllowInactive = () => SetMetadata(ALLOW_INACTIVE_KEY, true);
