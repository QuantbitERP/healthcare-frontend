import { OpenAPI } from './core/OpenAPI';

// Use the correct base URL for deposit service
// The deposit service endpoints already include /api/v1/Deposit/...
OpenAPI.BASE = process.env.NEXT_PUBLIC_BASEAPI_URL!;
