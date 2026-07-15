import api from "./api.client";

const getList = async (endpoint: string, page = 1, limit = 100) => {
  const response = await api.get(`${endpoint}?page=${page}&limit=${limit}`);
  return response.data;
};

const getSingle = async (endpoint: string, id: string) => {
  const response = await api.get(`${endpoint}/${id}`);
  return response.data;
};

export const contentService = {
  getDsaQuestions: (page = 1, limit = 100) => getList("/dsa", page, limit),
  getMachineCodingQuestions: (page = 1, limit = 100) =>
    getList("/machine-coding", page, limit),
  getSystemDesignQuestions: (page = 1, limit = 100) =>
    getList("/system-design", page, limit),
  getBlogs: (page = 1, limit = 100) => getList("/blogs", page, limit),
  getVideos: (page = 1, limit = 100) => getList("/videos", page, limit),
  getPlacementPrep: (page = 1, limit = 100) =>
    getList("/placement-prep", page, limit),
  getPlacementPrepTopics: (page = 1, limit = 100) =>
    getList("/placement-prep", page, limit),
  getProjects: (page = 1, limit = 100) => getList("/projects", page, limit),

  getSingleDsa: (id: string) => getSingle("/dsa", id),
  getSingleMachineCoding: (id: string) => getSingle("/machine-coding", id),
  getSingleSystemDesign: (id: string) => getSingle("/system-design", id),
  getSingleBlog: (id: string) => getSingle("/blogs", id),
  getSingleVideo: (id: string) => getSingle("/videos", id),
  getSinglePlacementPrep: (id: string) => getSingle("/placement-prep", id),
  getSingleProject: (id: string) => getSingle("/projects", id),
};
