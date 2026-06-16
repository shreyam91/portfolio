const express = require('express');
const contentController = require('../controllers/contentController');

const router = express.Router();

// DSA
router.get('/dsa', contentController.getDSA);
router.get('/dsa/:id', contentController.getSingleDSA);

// Machine Coding
router.get('/machine-coding', contentController.getMachineCoding);
router.get('/machine-coding/:id', contentController.getSingleMachineCoding);

// System Design
router.get('/system-design', contentController.getSystemDesign);
router.get('/system-design/:id', contentController.getSingleSystemDesign);

// Placement Prep
router.get('/placement-prep', contentController.getPlacementPrep);
router.get('/placement-prep/:id', contentController.getSinglePlacementPrep);

// Blogs
router.get('/blogs', contentController.getBlogs);
router.get('/blogs/:id', contentController.getSingleBlog);

// Videos
router.get('/videos', contentController.getVideos);
router.get('/videos/:id', contentController.getSingleVideo);

// Projects
router.post('/projects/seed', contentController.seedProjects);
router.get('/projects', contentController.getProjects);
router.get('/projects/:id', contentController.getSingleProject);

module.exports = router;
