import express from "express";
import { 
    getAllCourses, 
    getSingleCourse, 
    fetchLectures,
    createCourse,
    updateCourse,
    deleteCourse,
    addLecture,
    updateLecture,
    deleteLecture
} from "../controllers/course.js";
import { isAuth, isInstructor, hasCourseAccess } from "../middleware/auth.js";
import { upload, uploadVideo, handleUploadError } from "../middleware/uploadFiles.js";
import { courseValidation } from "../middleware/validator.js";

const router = express.Router();

// Public routes
router.get("/all", getAllCourses);
router.get("/:id", getSingleCourse);

// Protected routes
router.get("/:id/lectures", isAuth, hasCourseAccess, fetchLectures);

// Instructor routes
router.post(
    "/", 
    isAuth, 
    isInstructor, 
    upload.single('thumbnail'),
    handleUploadError,
    courseValidation,
    createCourse
);

router.put(
    "/:id", 
    isAuth, 
    isInstructor, 
    upload.single('thumbnail'),
    handleUploadError,
    courseValidation,
    updateCourse
);

router.delete("/:id", isAuth, isInstructor, deleteCourse);

// Lecture routes
router.post(
    "/:id/lectures", 
    isAuth, 
    isInstructor, 
    uploadVideo.single('lecture'),
    handleUploadError,
    addLecture
);

router.put(
    "/:id/lectures/:lectureId", 
    isAuth, 
    isInstructor, 
    uploadVideo.single('lecture'),
    handleUploadError,
    updateLecture
);

router.delete("/:id/lectures/:lectureId", isAuth, isInstructor, deleteLecture);

export default router;
