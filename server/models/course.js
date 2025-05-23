import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
        default: 0
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['programming', 'design', 'business', 'marketing', 'music', 'other']
    },
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true,
        default: 'beginner'
    },
    image: {
        type: String,
        default: ''
    },
    lectures: [{
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        video: {
            type: String,
            required: true
        },
        duration: {
            type: Number,
            default: 0
        },
        order: {
            type: Number,
            required: true
        }
    }],
    enrolledStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    ratings: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        review: String,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    averageRating: {
        type: Number,
        default: 0
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    }
}, {
    timestamps: true
});

// Update timestamps before saving
courseSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Calculate average rating
courseSchema.methods.calculateAverageRating = function() {
    if (this.ratings.length === 0) {
        this.averageRating = 0;
        this.totalRatings = 0;
    } else {
        const sum = this.ratings.reduce((acc, curr) => acc + curr.rating, 0);
        this.averageRating = sum / this.ratings.length;
        this.totalRatings = this.ratings.length;
    }
};

// Add lecture with order
courseSchema.methods.addLecture = function(lecture) {
    const maxOrder = this.lectures.length > 0 
        ? Math.max(...this.lectures.map(l => l.order))
        : 0;
    lecture.order = maxOrder + 1;
    this.lectures.push(lecture);
};

// Remove lecture and reorder
courseSchema.methods.removeLecture = function(lectureId) {
    this.lectures = this.lectures.filter(lecture => lecture._id.toString() !== lectureId);
    // Reorder remaining lectures
    this.lectures.forEach((lecture, index) => {
        lecture.order = index + 1;
    });
};

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);

export default Course; 