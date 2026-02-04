// Role-specific quizzes and challenges

export const ROLE_QUIZZES = {
    software_developer: {
        role: 'Software Developer',
        icon: '💻',
        questions: [
            {
                id: 'sd_1',
                question: 'What is the time complexity of binary search?',
                options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
                correctAnswer: 1,
                explanation: 'Binary search divides the search space in half each time, resulting in O(log n) complexity.',
                points: 15,
            },
            {
                id: 'sd_2',
                question: 'Which data structure uses LIFO (Last In, First Out)?',
                options: ['Queue', 'Stack', 'Array', 'Linked List'],
                correctAnswer: 1,
                explanation: 'A Stack follows LIFO - the last element added is the first one removed.',
                points: 10,
            },
            {
                id: 'sd_3',
                question: 'What does REST stand for in API development?',
                options: [
                    'Rapid Easy Server Technology',
                    'Representational State Transfer',
                    'Remote Execution Service Tool',
                    'Reliable Endpoint System Transfer'
                ],
                correctAnswer: 1,
                explanation: 'REST (Representational State Transfer) is an architectural style for designing networked applications.',
                points: 10,
            },
        ],
    },

    data_scientist: {
        role: 'Data Scientist',
        icon: '📊',
        questions: [
            {
                id: 'ds_1',
                question: 'Which algorithm is commonly used for classification problems?',
                options: ['Linear Regression', 'K-Means', 'Random Forest', 'PCA'],
                correctAnswer: 2,
                explanation: 'Random Forest is an ensemble learning method commonly used for classification tasks.',
                points: 15,
            },
            {
                id: 'ds_2',
                question: 'What does the "P" in P-value stand for?',
                options: ['Probability', 'Percentage', 'Prediction', 'Parameter'],
                correctAnswer: 0,
                explanation: 'P-value represents the probability of obtaining results at least as extreme as observed.',
                points: 10,
            },
            {
                id: 'ds_3',
                question: 'Which library is primarily used for data manipulation in Python?',
                options: ['NumPy', 'Matplotlib', 'Pandas', 'Scikit-learn'],
                correctAnswer: 2,
                explanation: 'Pandas is the go-to library for data manipulation and analysis in Python.',
                points: 10,
            },
        ],
    },

    designer: {
        role: 'UX/UI Designer',
        icon: '🎨',
        questions: [
            {
                id: 'ux_1',
                question: 'What is the primary purpose of wireframing?',
                options: [
                    'To create the final design',
                    'To plan layout and structure',
                    'To add colors and typography',
                    'To test with users'
                ],
                correctAnswer: 1,
                explanation: 'Wireframes are low-fidelity representations used to plan the layout and structure of a design.',
                points: 10,
            },
            {
                id: 'ux_2',
                question: 'Which principle states that related elements should be grouped together?',
                options: ['Contrast', 'Proximity', 'Alignment', 'Repetition'],
                correctAnswer: 1,
                explanation: 'The Proximity principle suggests that related items should be placed close together.',
                points: 15,
            },
            {
                id: 'ux_3',
                question: 'What is a "persona" in UX design?',
                options: [
                    'A design pattern',
                    'A fictional user representation',
                    'A color scheme',
                    'A navigation style'
                ],
                correctAnswer: 1,
                explanation: 'A persona is a fictional character created to represent a user type based on research.',
                points: 10,
            },
        ],
    },

    product_manager: {
        role: 'Product Manager',
        icon: '📋',
        questions: [
            {
                id: 'pm_1',
                question: 'What does MVP stand for in product development?',
                options: [
                    'Most Valuable Player',
                    'Minimum Viable Product',
                    'Maximum Value Proposition',
                    'Market Validation Process'
                ],
                correctAnswer: 1,
                explanation: 'MVP (Minimum Viable Product) is a version with just enough features to satisfy early customers.',
                points: 10,
            },
            {
                id: 'pm_2',
                question: 'Which framework is used for prioritizing product features?',
                options: ['SWOT', 'RICE', 'PEST', 'Porter\'s Five Forces'],
                correctAnswer: 1,
                explanation: 'RICE (Reach, Impact, Confidence, Effort) is a popular framework for feature prioritization.',
                points: 15,
            },
            {
                id: 'pm_3',
                question: 'What is a "user story" in Agile methodology?',
                options: [
                    'A bug report',
                    'A feature description from user perspective',
                    'A test case',
                    'A sprint review'
                ],
                correctAnswer: 1,
                explanation: 'A user story describes a feature from an end-user perspective, typically in the format: As a [user], I want [goal] so that [benefit].',
                points: 10,
            },
        ],
    },

    devops_engineer: {
        role: 'DevOps Engineer',
        icon: '⚙️',
        questions: [
            {
                id: 'do_1',
                question: 'What does CI/CD stand for?',
                options: [
                    'Code Integration / Code Delivery',
                    'Continuous Integration / Continuous Deployment',
                    'Complete Implementation / Complete Development',
                    'Central Infrastructure / Central Distribution'
                ],
                correctAnswer: 1,
                explanation: 'CI/CD stands for Continuous Integration and Continuous Deployment/Delivery.',
                points: 10,
            },
            {
                id: 'do_2',
                question: 'Which tool is commonly used for container orchestration?',
                options: ['Jenkins', 'Kubernetes', 'Ansible', 'Terraform'],
                correctAnswer: 1,
                explanation: 'Kubernetes is the leading platform for automating deployment, scaling, and management of containerized applications.',
                points: 15,
            },
            {
                id: 'do_3',
                question: 'What is "Infrastructure as Code" (IaC)?',
                options: [
                    'Writing code on servers',
                    'Managing infrastructure through code files',
                    'Building hardware components',
                    'Debugging network issues'
                ],
                correctAnswer: 1,
                explanation: 'IaC is the practice of managing and provisioning infrastructure through machine-readable configuration files.',
                points: 10,
            },
        ],
    },
};

// Get quiz by role
export const getQuizByRole = (role) => {
    const normalizedRole = role.toLowerCase().replace(/\s+/g, '_');
    return ROLE_QUIZZES[normalizedRole] || ROLE_QUIZZES.software_developer;
};

// Calculate quiz score
export const calculateScore = (questions, answers) => {
    let totalPoints = 0;
    let correctCount = 0;

    questions.forEach((question, index) => {
        if (answers[index] === question.correctAnswer) {
            totalPoints += question.points;
            correctCount++;
        }
    });

    return {
        totalPoints,
        correctCount,
        totalQuestions: questions.length,
        percentage: Math.round((correctCount / questions.length) * 100),
    };
};
