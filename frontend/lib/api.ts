import { contentService } from '@/services/content.service';
import apiClient from '@/services/api.client';

export const contentApi = contentService;
export const submissionsApi = {
  getUserSubmissions: async () => ({ data: { data: [] } })
};
export default apiClient;
