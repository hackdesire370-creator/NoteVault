// ═══════════════════════════════════════════════════════
//  data.js — Seed data for NoteVault
// ═══════════════════════════════════════════════════════

const DEPARTMENTS = [
  { id: 'cs',    name: 'Computer Science',      icon: '💻', color: '#5b6ef5' },
  { id: 'ec',    name: 'Electronics & Comm.',   icon: '📡', color: '#22d3ee' },
  { id: 'me',    name: 'Mechanical Eng.',        icon: '⚙️',  color: '#f59e0b' },
  { id: 'ce',    name: 'Civil Engineering',      icon: '🏗️', color: '#34d399' },
  { id: 'ch',    name: 'Chemical Engineering',   icon: '🧪', color: '#f87171' },
  { id: 'ma',    name: 'Mathematics',            icon: '📐', color: '#a78bfa' },
  { id: 'ph',    name: 'Physics',                icon: '⚛️',  color: '#60a5fa' },
  { id: 'bi',    name: 'Biotechnology',          icon: '🧬', color: '#4ade80' },
  { id: 'mb',    name: 'MBA / Management',       icon: '📊', color: '#fb923c' },
  { id: 'ai',    name: 'AI & Data Science',      icon: '🤖', color: '#e879f9' },
  { id: 'it',    name: 'Information Technology', icon: '🖧',  color: '#38bdf8' },
  { id: 'ee',    name: 'Electrical Engineering', icon: '⚡', color: '#facc15' },
];

const SUBJECTS_BY_DEPT = {
  cs: ['Data Structures', 'Algorithms', 'Operating Systems', 'DBMS', 'Computer Networks', 'Software Engineering', 'Compiler Design', 'Theory of Computation'],
  ec: ['Signals & Systems', 'Digital Electronics', 'Analog Circuits', 'VLSI Design', 'Communication Systems', 'Microprocessors'],
  me: ['Thermodynamics', 'Fluid Mechanics', 'Machine Design', 'Manufacturing', 'Heat Transfer', 'Kinematics'],
  ce: ['Structural Analysis', 'Soil Mechanics', 'Concrete Technology', 'Surveying', 'Fluid Mechanics'],
  ch: ['Organic Chemistry', 'Physical Chemistry', 'Chemical Reaction Engineering', 'Process Control'],
  ma: ['Calculus', 'Linear Algebra', 'Differential Equations', 'Probability & Statistics', 'Discrete Mathematics'],
  ph: ['Classical Mechanics', 'Quantum Mechanics', 'Electromagnetism', 'Optics', 'Thermodynamics'],
  bi: ['Cell Biology', 'Genetics', 'Microbiology', 'Biochemistry', 'Bioinformatics'],
  mb: ['Marketing Management', 'Financial Accounting', 'Business Law', 'HR Management', 'Operations Research'],
  ai: ['Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'Data Mining', 'Big Data Analytics'],
  it: ['Web Technologies', 'Cloud Computing', 'Cyber Security', 'Mobile Computing', 'IoT'],
  ee: ['Circuit Theory', 'Power Systems', 'Control Systems', 'Electrical Machines', 'Power Electronics'],
};

let NOTES = [
  {
    id: 'n1', title: 'Complete Data Structures Notes', subject: 'Data Structures', dept: 'cs',
    semester: '3', topic: 'Unit 1–5 Full Coverage', description: 'Comprehensive handwritten + typed notes covering arrays, linked lists, stacks, queues, trees, graphs, and hashing. Includes solved examples and complexity analysis.',
    tags: ['arrays', 'trees', 'graphs', 'sorting'], uploadedBy: 'u2', uploaderName: 'Priya Sharma',
    uploadDate: '2026-06-10', downloads: 142, likes: 38, rating: 4.7, ratingCount: 29,
    status: 'approved', fileType: 'PDF', fileSize: '4.2 MB', fileName: 'ds_complete.pdf',
    comments: [
      { id: 'c1', userId: 'u3', userName: 'Rahul M.', text: 'This is exactly what I needed before my exam. Great coverage!', date: '2026-06-12', likes: 14, liked: false },
      { id: 'c2', userId: 'u4', userName: 'Sneha K.', text: 'The graph section especially is very clear. Thank you!', date: '2026-06-15', likes: 7, liked: false },
    ]
  },
  {
    id: 'n2', title: 'Machine Learning: Supervised Algorithms', subject: 'Machine Learning', dept: 'ai',
    semester: '5', topic: 'Regression, Classification, SVM', description: 'Detailed notes on supervised learning: linear/logistic regression, decision trees, random forests, SVM with kernel tricks. Includes math derivations.',
    tags: ['ml', 'regression', 'SVM', 'classification'], uploadedBy: 'u3', uploaderName: 'Rahul Mehta',
    uploadDate: '2026-06-18', downloads: 98, likes: 27, rating: 4.5, ratingCount: 18,
    status: 'approved', fileType: 'PDF', fileSize: '3.1 MB', fileName: 'ml_supervised.pdf',
    comments: [
      { id: 'c3', userId: 'u2', userName: 'Priya S.', text: 'Math derivations are so clear, saved me hours of research!', date: '2026-06-20', likes: 9, liked: false },
    ]
  },
  {
    id: 'n3', title: 'Linear Algebra — Full Semester Notes', subject: 'Linear Algebra', dept: 'ma',
    semester: '2', topic: 'Vectors, Matrices, Eigen Values', description: 'Covers vector spaces, linear transformations, determinants, eigenvalues/eigenvectors, and diagonalization. Includes practice problems.',
    tags: ['matrices', 'vectors', 'eigenvalues'], uploadedBy: 'u4', uploaderName: 'Sneha Kulkarni',
    uploadDate: '2026-05-22', downloads: 201, likes: 55, rating: 4.9, ratingCount: 43,
    status: 'approved', fileType: 'PDF', fileSize: '2.8 MB', fileName: 'linear_algebra.pdf',
    comments: []
  },
  {
    id: 'n4', title: 'Operating Systems — Process Management', subject: 'Operating Systems', dept: 'cs',
    semester: '4', topic: 'Processes, Threads, Scheduling', description: 'Notes on process lifecycle, threads, CPU scheduling algorithms (FCFS, SJF, Round Robin, Priority), synchronization and deadlocks.',
    tags: ['processes', 'scheduling', 'deadlock'], uploadedBy: 'u2', uploaderName: 'Priya Sharma',
    uploadDate: '2026-06-01', downloads: 87, likes: 21, rating: 4.3, ratingCount: 15,
    status: 'approved', fileType: 'PDF', fileSize: '1.9 MB', fileName: 'os_process.pdf',
    comments: [
      { id: 'c4', userId: 'u5', userName: 'Arjun T.', text: 'Scheduling section is clear. Would love notes on memory management too!', date: '2026-06-05', likes: 3, liked: false },
    ]
  },
  {
    id: 'n5', title: 'Organic Chemistry: Reaction Mechanisms', subject: 'Organic Chemistry', dept: 'ch',
    semester: '2', topic: 'SN1, SN2, Elimination, Addition', description: 'Detailed mechanisms for nucleophilic substitution, elimination reactions, and addition reactions with stereochemistry notes.',
    tags: ['SN1', 'SN2', 'mechanisms', 'stereochemistry'], uploadedBy: 'u5', uploaderName: 'Arjun Tiwari',
    uploadDate: '2026-06-08', downloads: 64, likes: 19, rating: 4.6, ratingCount: 12,
    status: 'approved', fileType: 'PDF', fileSize: '2.2 MB', fileName: 'ochem_mechanisms.pdf',
    comments: []
  },
  {
    id: 'n6', title: 'Computer Networks — OSI & TCP/IP', subject: 'Computer Networks', dept: 'cs',
    semester: '5', topic: 'Layered Architecture, Protocols', description: 'Covers OSI model layers, TCP/IP stack, IP addressing, subnetting, routing protocols (RIP, OSPF, BGP), and transport layer (TCP vs UDP).',
    tags: ['OSI', 'TCP', 'routing', 'protocols'], uploadedBy: 'u3', uploaderName: 'Rahul Mehta',
    uploadDate: '2026-06-25', downloads: 76, likes: 23, rating: 4.4, ratingCount: 17,
    status: 'approved', fileType: 'DOCX', fileSize: '1.5 MB', fileName: 'networks_osi.docx',
    comments: []
  },
  {
    id: 'n7', title: 'Thermodynamics — Laws & Cycles', subject: 'Thermodynamics', dept: 'me',
    semester: '3', topic: 'Laws of Thermodynamics, Carnot Cycle', description: 'Complete notes on zeroth, first, second, third laws, entropy, enthalpy, and thermodynamic cycles with solved numerical problems.',
    tags: ['thermodynamics', 'entropy', 'Carnot', 'cycles'], uploadedBy: 'u4', uploaderName: 'Sneha Kulkarni',
    uploadDate: '2026-05-30', downloads: 53, likes: 16, rating: 4.2, ratingCount: 10,
    status: 'approved', fileType: 'PDF', fileSize: '3.5 MB', fileName: 'thermo_laws.pdf',
    comments: []
  },
  {
    id: 'n8', title: 'Deep Learning — CNNs and RNNs', subject: 'Deep Learning', dept: 'ai',
    semester: '6', topic: 'Convolutional & Recurrent Networks', description: 'Architecture deep dives into CNNs (LeNet, AlexNet, ResNet), RNNs, LSTMs, GRUs, attention mechanism basics.',
    tags: ['CNN', 'RNN', 'LSTM', 'deep learning'], uploadedBy: 'u2', uploaderName: 'Priya Sharma',
    uploadDate: '2026-07-01', downloads: 45, likes: 12, rating: 4.8, ratingCount: 9,
    status: 'pending', fileType: 'PDF', fileSize: '5.1 MB', fileName: 'dl_cnn_rnn.pdf',
    comments: []
  },
  {
    id: 'n9', title: 'Power Systems — Load Flow Analysis', subject: 'Power Systems', dept: 'ee',
    semester: '6', topic: 'Gauss-Seidel, Newton-Raphson', description: 'Load flow methods: bus admittance matrix, Gauss-Seidel and Newton-Raphson iterative methods with worked examples.',
    tags: ['load flow', 'power systems', 'Newton-Raphson'], uploadedBy: 'u5', uploaderName: 'Arjun Tiwari',
    uploadDate: '2026-06-14', downloads: 39, likes: 10, rating: 4.0, ratingCount: 7,
    status: 'pending', fileType: 'PDF', fileSize: '2.0 MB', fileName: 'power_loadflow.pdf',
    comments: []
  },
  {
    id: 'n10', title: 'DBMS — ER Model & Normalization', subject: 'DBMS', dept: 'cs',
    semester: '4', topic: 'ER Diagrams, 1NF–BCNF', description: 'Entity-Relationship model, relational algebra, SQL basics, and normalization up to BCNF with examples and exercises.',
    tags: ['ER model', 'normalization', 'SQL', 'relational algebra'], uploadedBy: 'u3', uploaderName: 'Rahul Mehta',
    uploadDate: '2026-06-22', downloads: 115, likes: 31, rating: 4.6, ratingCount: 24,
    status: 'approved', fileType: 'PDF', fileSize: '2.6 MB', fileName: 'dbms_er.pdf',
    comments: [
      { id: 'c5', userId: 'u4', userName: 'Sneha K.', text: 'The BCNF explanation finally clicked for me after reading this!', date: '2026-06-24', likes: 11, liked: false },
    ]
  },
];

let USERS = [
  { id: 'u1', firstName: 'Admin', lastName: 'User', email: 'admin@notevault.com', password: 'admin123', dept: 'cs', role: 'admin', joined: '2026-01-01', uploads: 0, downloads: 0, favorites: [] },
  { id: 'u2', firstName: 'Priya', lastName: 'Sharma', email: 'priya@example.com', password: 'student123', dept: 'cs', role: 'student', joined: '2026-02-14', uploads: 3, downloads: 28, favorites: ['n3', 'n6'] },
  { id: 'u3', firstName: 'Rahul', lastName: 'Mehta', email: 'rahul@example.com', password: 'student123', dept: 'ai', role: 'student', joined: '2026-03-05', uploads: 3, downloads: 41, favorites: ['n1', 'n4'] },
  { id: 'u4', firstName: 'Sneha', lastName: 'Kulkarni', email: 'sneha@example.com', password: 'student123', dept: 'ma', role: 'student', joined: '2026-03-20', uploads: 2, downloads: 19, favorites: ['n2'] },
  { id: 'u5', firstName: 'Arjun', lastName: 'Tiwari', email: 'arjun@example.com', password: 'student123', dept: 'ee', role: 'student', joined: '2026-04-11', uploads: 2, downloads: 33, favorites: [] },
];

// Active session (persisted to sessionStorage)
let currentUser = null;
