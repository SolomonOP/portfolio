const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Project = require('../models/Project');
const Service = require('../models/Service');
const Testimonial = require('../models/Testimonial');

dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

const sampleProjects = [
  {
    title: 'Exam Seating Arrangement System',
    description: 'A smart web application that automatically generates non-adjacent seating arrangements for examinations.',
    longDescription: 'This intelligent system revolutionizes exam hall management by automating the complex process of seating arrangement. It ensures fair and secure examination environments by preventing adjacent seating of students from the same class or batch.',
    category: 'fullstack',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Flask', 'MySQL', 'PDF Generation'],
    image: '/assets/images/projects/exam-system.jpg',
    liveUrl: 'https://exam-system.example.com',
    githubUrl: 'https://github.com/spidy/exam-system',
    featured: true,
    features: [
      'PDF student data upload & extraction',
      'Smart seating allocation algorithm',
      'Drag-and-drop seat swapping',
      'Hall-wise PDF export',
      'Editable seating interface'
    ]
  },
  {
    title: 'Portfolio Website for Developers',
    description: 'A fully responsive and animated portfolio template designed for personal branding.',
    longDescription: 'A modern, cinematic portfolio template that helps developers showcase their work with style. Features smooth animations, interactive elements, and a clean, professional design that stands out.',
    category: 'web',
    technologies: ['React', 'Framer Motion', 'Tailwind CSS', 'Node.js'],
    image: '/assets/images/projects/portfolio.jpg',
    liveUrl: 'https://portfolio-template.example.com',
    githubUrl: 'https://github.com/spidy/portfolio-template',
    featured: true,
    features: [
      'Smooth scroll animations',
      'Modern UI layout',
      'Mobile-first design',
      'Optimized performance',
      'Dark/Light mode'
    ]
  },
  {
    title: 'Spider-Sense Task Manager',
    description: 'A productivity app with intuitive task management and team collaboration features.',
    category: 'fullstack',
    technologies: ['MERN', 'Socket.io', 'Redux', 'Tailwind'],
    image: '/assets/images/projects/task-manager.jpg',
    liveUrl: 'https://tasks.spidy.dev',
    githubUrl: 'https://github.com/spidy/task-manager',
    featured: true
  },
  {
    title: 'Web-Slinger Games',
    description: 'A collection of interactive web-based mini games built with vanilla JavaScript.',
    category: 'game',
    technologies: ['JavaScript', 'HTML5 Canvas', 'CSS3'],
    image: '/assets/images/projects/web-games.jpg',
    liveUrl: 'https://games.spidy.dev',
    githubUrl: 'https://github.com/spidy/web-games',
    featured: false
  }
];

const sampleServices = [
  {
    title: 'Creative Website Design',
    description: 'Modern, responsive, and visually appealing websites tailored to your brand identity.',
    icon: '🎨',
    features: [
      'Custom design tailored to your brand',
      'Mobile-first responsive layout',
      'SEO optimized structure',
      'Fast loading performance'
    ]
  },
  {
    title: 'Full Stack Web Development',
    description: 'Complete web applications with frontend, backend, and database integration.',
    icon: '⚡',
    features: [
      'MERN stack expertise',
      'RESTful API development',
      'Database design & optimization',
      'Secure authentication systems'
    ]
  },
  {
    title: 'UI/UX Design',
    description: 'Clean layouts, intuitive user experiences, and smooth interactions.',
    icon: '🎯',
    features: [
      'User-centered design approach',
      'Wireframing & prototyping',
      'Interactive animations',
      'Usability testing'
    ]
  },
  {
    title: 'Custom Web Solutions',
    description: 'From student management systems to automated tools — I build scalable solutions.',
    icon: '🛠️',
    features: [
      'Requirement analysis',
      'Custom architecture design',
      'Scalable solutions',
      'Maintenance & support'
    ]
  }
];

const sampleTestimonials = [
  {
    clientName: 'Sarah Johnson',
    clientPosition: 'CEO',
    clientCompany: 'TechStart Inc.',
    content: 'Solomon delivered a modern and high-quality website that exceeded our expectations. Professional and creative throughout the process.',
    rating: 5,
    projectType: 'Web Development',
    featured: true
  },
  {
    clientName: 'Michael Chen',
    clientPosition: 'Product Manager',
    clientCompany: 'InnovateLabs',
    content: 'Working with Solomon was a game-changer for our project. His technical expertise and creative problem-solving skills are outstanding.',
    rating: 5,
    projectType: 'Full Stack Application',
    featured: true
  },
  {
    clientName: 'Priya Patel',
    clientPosition: 'Founder',
    clientCompany: 'DesignStudio',
    content: 'The attention to detail and user experience in the design was phenomenal. Highly recommended for any creative project.',
    rating: 5,
    projectType: 'UI/UX Design',
    featured: false
  }
];

const seedData = async () => {
  try {
    // Clear existing data
    await Project.deleteMany();
    await Service.deleteMany();
    await Testimonial.deleteMany();
    
    console.log('📦 Existing data cleared');
    
    // Insert new data
    await Project.insertMany(sampleProjects);
    await Service.insertMany(sampleServices);
    await Testimonial.insertMany(sampleTestimonials);
    
    console.log('✅ Sample data seeded successfully');
    console.log(`📊 Projects: ${sampleProjects.length}`);
    console.log(`📊 Services: ${sampleServices.length}`);
    console.log(`📊 Testimonials: ${sampleTestimonials.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedData();