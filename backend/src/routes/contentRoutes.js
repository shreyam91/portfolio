const express = require('express');
const contentController = require('../controllers/contentController');

const router = express.Router();

// DSA
router.get('/dsa', contentController.getDSA);
router.get('/dsa/:id', contentController.getSingleDSA);
router.post('/dsa/sync', async (req, res, next) => {
  if (process.env.ADMIN_SECRET && req.headers.authorization !== process.env.ADMIN_SECRET) {
    return next(new (require('../utils/AppError'))('Unauthorized', 401));
  }
  next();
}, contentController.syncDsa);

// Machine Coding
router.get('/machine-coding', contentController.getMachineCoding);
router.get('/machine-coding/:id', contentController.getSingleMachineCoding);

// System Design
router.get('/system-design', contentController.getSystemDesign);
router.get('/system-design/:id', contentController.getSingleSystemDesign);



// Blogs
router.get('/blogs', contentController.getBlogs);
router.get('/blogs/:id', contentController.getSingleBlog);



// Projects
router.post('/projects/seed', contentController.seedProjects);
router.get('/projects', contentController.getProjects);
router.get('/projects/:id', contentController.getSingleProject);

// Resources
router.get('/resources', contentController.getResources);
router.get('/resources/:id', contentController.getSingleResource);

module.exports = router;
