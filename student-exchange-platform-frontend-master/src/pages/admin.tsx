import React, { useState, useEffect, useMemo } from 'react';
import '../styles/admin.css';

// Mock data for student applications
const mockStudents = [
  {
    id: 1,
    name: "Emma Johnson",
    university: "HKUST",
    major: "Computer Science",
    gpa: 3.9,
    targetUniversity: "University of Tokyo",
    languages: ["English", "Japanese (Basic)"],
    interests: ["Artificial Intelligence", "Robotics", "Japanese Culture"],
    achievements: ["Published research paper on AI", "Hackathon winner 2024"],
    statement: "I am passionate about combining AI research with Japanese technological innovations. My goal is to collaborate with leading researchers at the University of Tokyo to develop new algorithms for robotics applications.",
    ranking: 4.8,
    photo: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 9,
    name: "Hiroshi Tanaka",
    university: "HKUST",
    major: "Data Science",
    gpa: 3.85,
    targetUniversity: "University of Tokyo",
    languages: ["English", "Japanese (Native)", "Mandarin (Basic)"],
    interests: ["Machine Learning", "Natural Language Processing", "Big Data"],
    achievements: ["Data Science Competition Winner", "Research Assistant at HKUST AI Lab"],
    statement: "As a Japanese student studying in Hong Kong, I wish to return to Japan to apply my data science knowledge in Tokyo's advanced tech ecosystem. The University of Tokyo's research facilities are world-class for my interests in NLP.",
    ranking: 4.6,
    photo: "https://randomuser.me/api/portraits/men/42.jpg"
  },
  {
    id: 10,
    name: "Sakura Yamamoto",
    university: "HKUST",
    major: "Biotechnology",
    gpa: 3.7,
    targetUniversity: "University of Tokyo",
    languages: ["English (Advanced)", "Japanese (Native)", "Cantonese (Basic)"],
    interests: ["Genetic Engineering", "Pharmaceutical Research", "Bioethics"],
    achievements: ["Published in Biotechnology Journal", "Summer Intern at Tokyo Medical Research Center"],
    statement: "I want to continue my research in genetic engineering at the University of Tokyo, which has one of the best biotechnology programs in Asia. My experience at HKUST has prepared me well for advanced studies in this field.",
    ranking: 4.3,
    photo: "https://randomuser.me/api/portraits/women/67.jpg"
  },
  {
    id: 17,
    name: "Jin-Ho Park",
    university: "HKUST",
    major: "Neuroscience",
    gpa: 3.75,
    targetUniversity: "University of Tokyo",
    languages: ["English (Fluent)", "Korean (Native)", "Japanese (Intermediate)"],
    interests: ["Brain-Computer Interfaces", "Cognitive Science", "Neural Networks"],
    achievements: ["Research Grant for Neural Interface Study", "Published in Neuroscience Frontiers"],
    statement: "The University of Tokyo's neuroscience department is pioneering research in brain-computer interfaces, which aligns perfectly with my research interests. I hope to contribute to their ongoing work while gaining expertise in Japanese research methodologies.",
    ranking: 4.5,
    photo: "https://randomuser.me/api/portraits/men/35.jpg"
  },
  {
    id: 18,
    name: "Mei-Ling Wong",
    university: "HKUST",
    major: "Quantum Physics",
    gpa: 4.0,
    targetUniversity: "University of Tokyo",
    languages: ["English (Fluent)", "Cantonese (Native)", "Mandarin (Native)", "Japanese (Basic)"],
    interests: ["Quantum Computing", "Theoretical Physics", "Mathematical Modeling"],
    achievements: ["Perfect GPA", "Quantum Computing Research Award", "International Physics Olympiad Gold Medalist"],
    statement: "The University of Tokyo's quantum physics laboratory has equipment that is unavailable at most other institutions. As someone deeply interested in the practical applications of quantum theory, I believe this exchange would significantly advance my research capabilities.",
    ranking: 5.0,
    photo: "https://randomuser.me/api/portraits/women/57.jpg"
  },
  {
    id: 2,
    name: "Liu Wei",
    university: "HKUST",
    major: "International Business",
    gpa: 3.7,
    targetUniversity: "London School of Economics",
    languages: ["Chinese", "English (Advanced)", "French (Basic)"],
    interests: ["Global Economics", "Financial Markets", "British Culture"],
    achievements: ["National Economics Competition Winner", "Student Body President"],
    statement: "As an international business student, I believe studying at LSE will provide me with global perspectives on economic policies. I hope to bring my understanding of Asian markets to discussions while learning European approaches.",
    ranking: 4.5,
    photo: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 11,
    name: "Sarah Chen",
    university: "HKUST",
    major: "Economics",
    gpa: 3.95,
    targetUniversity: "London School of Economics",
    languages: ["English (Fluent)", "Mandarin (Native)", "Cantonese (Native)"],
    interests: ["Behavioral Economics", "International Trade", "Economic Development"],
    achievements: ["HKUST Economics Department Award", "Research Paper on Asian Market Dynamics"],
    statement: "LSE's reputation in economics is unparalleled, and I'm particularly interested in their focus on behavioral economics. My research at HKUST on consumer behavior in Asian markets would complement their European perspective.",
    ranking: 4.9,
    photo: "https://randomuser.me/api/portraits/women/33.jpg"
  },
  {
    id: 12,
    name: "Michael Wong",
    university: "HKUST",
    major: "Finance",
    gpa: 3.8,
    targetUniversity: "London School of Economics",
    languages: ["English (Fluent)", "Cantonese (Native)", "Mandarin (Advanced)"],
    interests: ["Investment Banking", "Financial Regulation", "FinTech"],
    achievements: ["Internship at HSBC Global Markets", "CFA Level 2 Candidate"],
    statement: "I aim to study financial regulations at LSE to better understand the differences between Asian and European financial systems. Their program in financial economics would provide me with the theoretical and practical knowledge I need for my career in international finance.",
    ranking: 4.7,
    photo: "https://randomuser.me/api/portraits/men/75.jpg"
  },
  {
    id: 19,
    name: "Olivia Chen",
    university: "HKUST",
    major: "Public Policy",
    gpa: 3.9,
    targetUniversity: "London School of Economics",
    languages: ["English (Native)", "Mandarin (Native)", "French (Intermediate)"],
    interests: ["International Relations", "Development Economics", "Public Governance"],
    achievements: ["Policy Brief Published in Asian Affairs Journal", "United Nations Youth Delegate"],
    statement: "LSE's reputation in public policy and international relations is unmatched. I'm particularly interested in their approach to development economics and how it can be applied to emerging Asian economies. My background in both Western and Eastern cultures gives me a unique perspective on global governance issues.",
    ranking: 4.8,
    photo: "https://randomuser.me/api/portraits/women/28.jpg"
  },
  {
    id: 20,
    name: "Raj Patel",
    university: "HKUST",
    major: "Economic Development",
    gpa: 3.75,
    targetUniversity: "London School of Economics",
    languages: ["English (Fluent)", "Hindi (Native)", "Cantonese (Intermediate)"],
    interests: ["Sustainable Development", "Poverty Alleviation", "Microfinance"],
    achievements: ["Research on Rural Banking in Developing Nations", "Economic Development Fellowship"],
    statement: "LSE's focus on economic development in the global context would help me expand my research on microfinance initiatives. I'm particularly interested in their work on sustainable development goals and how financial inclusion can help achieve these targets in developing regions.",
    ranking: 4.6,
    photo: "https://randomuser.me/api/portraits/men/82.jpg"
  },
  {
    id: 21,
    name: "Sophia Zhang",
    university: "HKUST",
    major: "Behavioral Economics",
    gpa: 3.95,
    targetUniversity: "London School of Economics",
    languages: ["English (Fluent)", "Mandarin (Native)", "Cantonese (Native)"],
    interests: ["Consumer Psychology", "Decision Theory", "Experimental Economics"],
    achievements: ["Published Research on Consumer Decision-Making", "Economics Department Honor Student"],
    statement: "LSE's behavioral economics program would allow me to explore the psychological aspects of economic decision-making in different cultural contexts. I'm particularly interested in how behavioral insights can inform policy design in both Western and Eastern economies.",
    ranking: 4.9,
    photo: "https://randomuser.me/api/portraits/women/39.jpg"
  },
  {
    id: 3,
    name: "Sofia Rodriguez",
    university: "HKUST",
    major: "Environmental Science",
    gpa: 3.8,
    targetUniversity: "ETH Zurich",
    languages: ["Spanish", "English (Advanced)", "German (Intermediate)"],
    interests: ["Climate Change", "Sustainable Development", "Alpine Ecology"],
    achievements: ["Environmental Research Grant Recipient", "Published in Climate Journal"],
    statement: "My research on South American ecosystems would benefit greatly from ETH Zurich's advanced facilities and faculty expertise. I plan to develop comparative studies between Alpine and Andean environmental conservation strategies.",
    ranking: 4.7,
    photo: "https://randomuser.me/api/portraits/women/68.jpg"
  },
  {
    id: 13,
    name: "David Zhang",
    university: "HKUST",
    major: "Mechanical Engineering",
    gpa: 3.85,
    targetUniversity: "ETH Zurich",
    languages: ["English (Fluent)", "Mandarin (Native)", "German (Basic)"],
    interests: ["Robotics", "Precision Engineering", "Sustainable Manufacturing"],
    achievements: ["HKUST Robotics Team Lead", "Patent Application for Mechanical Design"],
    statement: "ETH Zurich's mechanical engineering program is renowned for its innovation in robotics and precision engineering. I hope to bring my experience in designing autonomous systems and learn from their cutting-edge research facilities.",
    ranking: 4.6,
    photo: "https://randomuser.me/api/portraits/men/52.jpg"
  },
  {
    id: 14,
    name: "Mei Lin",
    university: "HKUST",
    major: "Materials Science",
    gpa: 3.9,
    targetUniversity: "ETH Zurich",
    languages: ["English (Advanced)", "Cantonese (Native)", "Mandarin (Native)", "German (Basic)"],
    interests: ["Nanomaterials", "Sustainable Materials", "Advanced Polymers"],
    achievements: ["Best Undergraduate Research Award", "Co-author on Materials Science Publication"],
    statement: "I'm particularly interested in ETH Zurich's advanced materials laboratory and their work on sustainable materials. My research at HKUST has focused on nanomaterials for energy applications, and I believe ETH's program would help me expand my knowledge in this field.",
    ranking: 4.8,
    photo: "https://randomuser.me/api/portraits/women/79.jpg"
  },
  {
    id: 22,
    name: "Thomas Lee",
    university: "HKUST",
    major: "Civil Engineering",
    gpa: 3.85,
    targetUniversity: "ETH Zurich",
    languages: ["English (Fluent)", "Cantonese (Native)", "German (Basic)"],
    interests: ["Structural Engineering", "Earthquake Resistance", "Sustainable Construction"],
    achievements: ["Civil Engineering Design Competition Winner", "Internship at Arup Engineering"],
    statement: "ETH Zurich's civil engineering program is world-renowned for its innovative approaches to structural design and sustainable construction. I'm particularly interested in their research on earthquake-resistant structures, which is highly relevant to both Hong Kong and Switzerland's mountainous terrain.",
    ranking: 4.7,
    photo: "https://randomuser.me/api/portraits/men/62.jpg"
  },
  {
    id: 23,
    name: "Anna Schmidt",
    university: "HKUST",
    major: "Environmental Engineering",
    gpa: 3.9,
    targetUniversity: "ETH Zurich",
    languages: ["English (Fluent)", "German (Native)", "Cantonese (Basic)"],
    interests: ["Water Treatment Technologies", "Alpine Ecology", "Climate Engineering"],
    achievements: ["Environmental Innovation Award", "Research on Urban Water Systems"],
    statement: "As a German student studying in Hong Kong, I want to bring my multicultural perspective to ETH Zurich's environmental engineering program. Their work on alpine water systems and climate engineering aligns perfectly with my research interests in sustainable urban water management.",
    ranking: 4.8,
    photo: "https://randomuser.me/api/portraits/women/90.jpg"
  },
  {
    id: 24,
    name: "Liam Chen",
    university: "HKUST",
    major: "Robotics Engineering",
    gpa: 3.95,
    targetUniversity: "ETH Zurich",
    languages: ["English (Fluent)", "Mandarin (Native)", "Cantonese (Native)", "German (Intermediate)"],
    interests: ["Autonomous Systems", "Swarm Robotics", "Human-Robot Interaction"],
    achievements: ["Robotics Competition Gold Medal", "Published Paper on Swarm Intelligence"],
    statement: "ETH Zurich's robotics laboratory is pioneering work in swarm robotics and autonomous systems. My research at HKUST has focused on similar areas, and I believe the exchange would allow me to collaborate with leading researchers and access cutting-edge facilities unavailable elsewhere.",
    ranking: 4.9,
    photo: "https://randomuser.me/api/portraits/men/29.jpg"
  },
  {
    id: 4,
    name: "Ahmed Hassan",
    university: "HKUST",
    major: "Architecture",
    gpa: 3.5,
    targetUniversity: "MIT",
    languages: ["Arabic", "English (Advanced)"],
    interests: ["Sustainable Architecture", "Urban Planning", "Digital Design"],
    achievements: ["Regional Design Competition Winner", "Internship at Foster + Partners"],
    statement: "I aim to combine traditional Middle Eastern architectural principles with cutting-edge technology. MIT's architecture program would allow me to explore computational design while bringing my cultural perspective to projects.",
    ranking: 4.2,
    photo: "https://randomuser.me/api/portraits/men/55.jpg"
  },
  {
    id: 15,
    name: "Kevin Park",
    university: "HKUST",
    major: "Computer Engineering",
    gpa: 4.0,
    targetUniversity: "MIT",
    languages: ["English (Fluent)", "Korean (Native)", "Mandarin (Intermediate)"],
    interests: ["Quantum Computing", "Artificial Intelligence", "Cybersecurity"],
    achievements: ["ACM Programming Competition Finalist", "Undergraduate Research Award"],
    statement: "MIT's Computer Science and Artificial Intelligence Laboratory is at the forefront of AI research, which aligns perfectly with my interests. I've been working on neural network optimization at HKUST and would like to continue this research at MIT.",
    ranking: 5.0,
    photo: "https://randomuser.me/api/portraits/men/18.jpg"
  },
  {
    id: 16,
    name: "Aisha Khan",
    university: "HKUST",
    major: "Physics",
    gpa: 3.95,
    targetUniversity: "MIT",
    languages: ["English (Fluent)", "Urdu (Native)", "Mandarin (Basic)"],
    interests: ["Quantum Physics", "Astrophysics", "Computational Physics"],
    achievements: ["Physics Olympiad Gold Medalist", "Research Publication in Quantum Computing"],
    statement: "MIT's physics department is renowned for its cutting-edge research in quantum mechanics. I've been conducting research on quantum entanglement at HKUST, and I believe MIT would provide me with the resources and mentorship to take my research to the next level.",
    ranking: 4.9,
    photo: "https://randomuser.me/api/portraits/women/45.jpg"
  },
  {
    id: 25,
    name: "Daniel Kim",
    university: "HKUST",
    major: "Aerospace Engineering",
    gpa: 3.9,
    targetUniversity: "MIT",
    languages: ["English (Fluent)", "Korean (Native)", "Mandarin (Intermediate)"],
    interests: ["Propulsion Systems", "Aerodynamics", "Space Exploration"],
    achievements: ["Aerospace Design Competition Winner", "Internship at SpaceX"],
    statement: "MIT's aerospace engineering program is at the forefront of innovation in space technology and propulsion systems. My research at HKUST has focused on developing more efficient propulsion systems for small satellites, and I believe MIT's resources would allow me to take this research to the next level.",
    ranking: 4.8,
    photo: "https://randomuser.me/api/portraits/men/15.jpg"
  },
  {
    id: 26,
    name: "Fatima Al-Farsi",
    university: "HKUST",
    major: "Artificial Intelligence",
    gpa: 4.0,
    targetUniversity: "MIT",
    languages: ["English (Fluent)", "Arabic (Native)", "French (Intermediate)"],
    interests: ["Machine Learning", "Neural Networks", "Ethical AI"],
    achievements: ["Perfect GPA", "AI Research Grant", "Published in Top AI Conference"],
    statement: "MIT's Computer Science and Artificial Intelligence Laboratory is doing groundbreaking work in ethical AI development, which aligns perfectly with my research interests. I want to explore how AI can be developed responsibly while still pushing the boundaries of what's possible.",
    ranking: 5.0,
    photo: "https://randomuser.me/api/portraits/women/37.jpg"
  },
  {
    id: 27,
    name: "Jason Wang",
    university: "HKUST",
    major: "Biotechnology",
    gpa: 3.85,
    targetUniversity: "MIT",
    languages: ["English (Fluent)", "Mandarin (Native)", "Cantonese (Native)"],
    interests: ["Synthetic Biology", "CRISPR Technology", "Bioinformatics"],
    achievements: ["Biotech Innovation Award", "Research on Gene Editing Technologies"],
    statement: "MIT's biotechnology program is pioneering work in synthetic biology and gene editing. My research at HKUST has focused on similar areas, and I believe the exchange would provide me with access to cutting-edge facilities and collaboration opportunities with leading researchers in the field.",
    ranking: 4.7,
    photo: "https://randomuser.me/api/portraits/men/93.jpg"
  },
  {
    id: 5,
    name: "Priya Patel",
    university: "HKUST",
    major: "Electrical Engineering",
    gpa: 3.95,
    targetUniversity: "Stanford University",
    languages: ["Hindi", "English (Fluent)", "Python", "C++"],
    interests: ["Renewable Energy", "Semiconductor Technology", "Entrepreneurship"],
    achievements: ["National Merit Scholar", "IEEE Student Paper Award"],
    statement: "Stanford's combination of technical excellence and entrepreneurial spirit perfectly aligns with my goal of developing affordable solar technology solutions. I hope to collaborate with Silicon Valley innovators while bringing insights from India's unique energy challenges.",
    ranking: 4.9,
    photo: "https://randomuser.me/api/portraits/women/79.jpg"
  },
  {
    id: 28,
    name: "Ryan Zhang",
    university: "HKUST",
    major: "Computer Science",
    gpa: 4.0,
    targetUniversity: "Stanford University",
    languages: ["English (Fluent)", "Mandarin (Native)", "Cantonese (Native)"],
    interests: ["Artificial Intelligence", "Computer Vision", "Entrepreneurship"],
    achievements: ["Perfect GPA", "ACM Programming Competition Winner", "Tech Startup Founder"],
    statement: "Stanford's computer science program and its close ties to Silicon Valley provide the perfect environment for me to develop both my technical skills and entrepreneurial ambitions. I've already launched a small AI startup in Hong Kong, and I believe Stanford would help me take it to the next level.",
    ranking: 5.0,
    photo: "https://randomuser.me/api/portraits/men/26.jpg"
  },
  {
    id: 29,
    name: "Leila Mahmoud",
    university: "HKUST",
    major: "Bioengineering",
    gpa: 3.9,
    targetUniversity: "Stanford University",
    languages: ["English (Fluent)", "Arabic (Native)", "French (Advanced)"],
    interests: ["Tissue Engineering", "Regenerative Medicine", "Medical Devices"],
    achievements: ["Bioengineering Innovation Award", "Research on Artificial Organs"],
    statement: "Stanford's bioengineering program is at the cutting edge of tissue engineering and regenerative medicine. My research at HKUST has focused on developing artificial organs, and I believe Stanford's resources and faculty expertise would help me advance this important work.",
    ranking: 4.8,
    photo: "https://randomuser.me/api/portraits/women/89.jpg"
  },
  {
    id: 30,
    name: "Tao Lin",
    university: "HKUST",
    major: "Data Science",
    gpa: 3.85,
    targetUniversity: "Stanford University",
    languages: ["English (Fluent)", "Mandarin (Native)", "Cantonese (Native)"],
    interests: ["Big Data Analytics", "Machine Learning", "Healthcare Informatics"],
    achievements: ["Data Science Competition Winner", "Published Research on Predictive Healthcare Analytics"],
    statement: "Stanford's data science program, particularly its focus on healthcare applications, aligns perfectly with my research interests. I've been working on predictive analytics for disease outbreaks, and I believe Stanford's interdisciplinary approach would help me combine data science with public health expertise.",
    ranking: 4.7,
    photo: "https://randomuser.me/api/portraits/men/72.jpg"
  },
  {
    id: 6,
    name: "Jamal Williams",
    university: "HKUST",
    major: "Biomedical Engineering",
    gpa: 3.6,
    targetUniversity: "Imperial College London",
    languages: ["English", "Spanish (Basic)"],
    interests: ["Medical Devices", "Healthcare Accessibility", "Sports Medicine"],
    achievements: ["University Innovation Fellow", "Community Health Volunteer"],
    statement: "Imperial College's bioengineering program would help me develop the skills to create affordable medical devices for underserved communities. I'm particularly interested in their work on prosthetics and rehabilitation technology.",
    ranking: 4.0,
    photo: "https://randomuser.me/api/portraits/men/22.jpg"
  },
  {
    id: 31,
    name: "Sophia Li",
    university: "HKUST",
    major: "Chemical Engineering",
    gpa: 3.9,
    targetUniversity: "Imperial College London",
    languages: ["English (Fluent)", "Mandarin (Native)", "Cantonese (Native)"],
    interests: ["Sustainable Chemical Processes", "Green Chemistry", "Carbon Capture"],
    achievements: ["Chemical Engineering Design Award", "Research on Carbon Capture Technologies"],
    statement: "Imperial College London's chemical engineering department is leading research in sustainable chemical processes and carbon capture technologies. My work at HKUST has focused on similar areas, and I believe the exchange would provide me with valuable new perspectives and techniques.",
    ranking: 4.8,
    photo: "https://randomuser.me/api/portraits/women/22.jpg"
  },
  {
    id: 32,
    name: "Omar Al-Zaidi",
    university: "HKUST",
    major: "Petroleum Engineering",
    gpa: 3.85,
    targetUniversity: "Imperial College London",
    languages: ["English (Fluent)", "Arabic (Native)", "French (Basic)"],
    interests: ["Energy Transition", "Sustainable Resource Extraction", "Carbon Management"],
    achievements: ["Research on Sustainable Oil Recovery", "Energy Innovation Award"],
    statement: "Imperial College's petroleum engineering program is uniquely positioned at the intersection of traditional energy and the transition to renewables. My research focuses on making resource extraction more sustainable, and I believe Imperial's expertise would help me develop solutions for the energy transition.",
    ranking: 4.7,
    photo: "https://randomuser.me/api/portraits/men/85.jpg"
  },
  {
    id: 33,
    name: "Emily Chen",
    university: "HKUST",
    major: "Public Health",
    gpa: 3.95,
    targetUniversity: "Imperial College London",
    languages: ["English (Native)", "Mandarin (Native)", "Cantonese (Fluent)"],
    interests: ["Global Health Policy", "Infectious Disease Control", "Health Equity"],
    achievements: ["Public Health Research Award", "Internship at World Health Organization"],
    statement: "Imperial College's School of Public Health is world-renowned for its work on global health policy and infectious disease control. As someone who has lived in both Eastern and Western contexts, I hope to bring a unique perspective to their research on health equity and pandemic preparedness.",
    ranking: 4.9,
    photo: "https://randomuser.me/api/portraits/women/95.jpg"
  },
  {
    id: 7,
    name: "Yuki Tanaka",
    university: "HKUST",
    major: "Literature & Philosophy",
    gpa: 3.8,
    targetUniversity: "Sorbonne University",
    languages: ["Japanese", "English (Advanced)", "French (Intermediate)"],
    interests: ["Comparative Literature", "Existentialism", "Cultural Exchange"],
    achievements: ["National Essay Competition Winner", "Published Translator"],
    statement: "Studying at the Sorbonne would allow me to explore the connections between Japanese and French philosophical traditions. I hope to contribute to cross-cultural understanding through my research and translations.",
    ranking: 4.4,
    photo: "https://randomuser.me/api/portraits/women/23.jpg"
  },
  {
    id: 34,
    name: "Marie Wong",
    university: "HKUST",
    major: "Art History",
    gpa: 3.9,
    targetUniversity: "Sorbonne University",
    languages: ["English (Fluent)", "Cantonese (Native)", "French (Advanced)"],
    interests: ["East-West Art Exchange", "Contemporary Art", "Museum Studies"],
    achievements: ["Art History Research Award", "Curatorial Internship at M+ Museum"],
    statement: "The Sorbonne's art history program would provide me with the perfect environment to study the historical exchange between Eastern and Western artistic traditions. As someone raised with both Chinese and Western influences, I hope to bring a unique perspective to discussions about cultural exchange in art.",
    ranking: 4.7,
    photo: "https://randomuser.me/api/portraits/women/53.jpg"
  },
  {
    id: 35,
    name: "Pierre Chen",
    university: "HKUST",
    major: "French Studies",
    gpa: 3.85,
    targetUniversity: "Sorbonne University",
    languages: ["English (Fluent)", "Mandarin (Native)", "Cantonese (Native)", "French (Advanced)"],
    interests: ["French Literature", "Francophone Studies", "Translation Theory"],
    achievements: ["French Poetry Translation Award", "Published in Comparative Literature Journal"],
    statement: "As a student of French literature at HKUST, studying at the Sorbonne would be the culmination of my academic journey. I'm particularly interested in exploring how French literature has influenced and been influenced by Chinese literary traditions, and the Sorbonne's resources would be invaluable for this research.",
    ranking: 4.8,
    photo: "https://randomuser.me/api/portraits/men/33.jpg"
  },
  {
    id: 8,
    name: "Carlos Mendoza",
    university: "HKUST",
    major: "Mechanical Engineering",
    gpa: 3.7,
    targetUniversity: "Technical University of Munich",
    languages: ["Spanish", "English (Fluent)", "German (Basic)"],
    interests: ["Automotive Engineering", "Sustainable Transportation", "Industry 4.0"],
    achievements: ["Formula Student Team Leader", "Automotive Design Patent"],
    statement: "Germany's automotive excellence makes TUM ideal for my studies. I hope to bring my experience in lightweight materials research while learning about electric vehicle technologies to implement solutions back in Latin America.",
    ranking: 4.3,
    photo: "https://randomuser.me/api/portraits/men/91.jpg"
  },
  {
    id: 36,
    name: "Hans Weber",
    university: "HKUST",
    major: "Electrical Engineering",
    gpa: 3.9,
    targetUniversity: "Technical University of Munich",
    languages: ["English (Fluent)", "German (Native)", "Mandarin (Intermediate)"],
    interests: ["Power Systems", "Renewable Energy Integration", "Smart Grids"],
    achievements: ["Electrical Engineering Excellence Award", "Research on Grid Stability with Renewables"],
    statement: "As a German student at HKUST, I want to return to Germany to study at TUM's renowned electrical engineering department. Their work on integrating renewable energy into power grids aligns perfectly with my research interests, and I believe my experience in Hong Kong has given me a unique perspective on energy challenges in dense urban environments.",
    ranking: 4.8,
    photo: "https://randomuser.me/api/portraits/men/60.jpg"
  },
  {
    id: 37,
    name: "Lin Zhao",
    university: "HKUST",
    major: "Industrial Engineering",
    gpa: 3.85,
    targetUniversity: "Technical University of Munich",
    languages: ["English (Fluent)", "Mandarin (Native)", "Cantonese (Native)", "German (Basic)"],
    interests: ["Industry 4.0", "Smart Manufacturing", "Supply Chain Optimization"],
    achievements: ["Industrial Engineering Innovation Award", "Research on Smart Factory Implementation"],
    statement: "TUM's leadership in Industry 4.0 technologies makes it the perfect place to continue my research on smart manufacturing. I'm particularly interested in how these technologies can be adapted for different manufacturing contexts, from German precision engineering to Chinese mass production.",
    ranking: 4.7,
    photo: "https://randomuser.me/api/portraits/women/76.jpg"
  },
  {
    id: 38,
    name: "Markus Schulz",
    university: "HKUST",
    major: "Aerospace Engineering",
    gpa: 4.0,
    targetUniversity: "Technical University of Munich",
    languages: ["English (Fluent)", "German (Native)", "French (Intermediate)"],
    interests: ["Aircraft Design", "Aerodynamics", "Sustainable Aviation"],
    achievements: ["Perfect GPA", "Aerospace Design Competition Winner", "Internship at Airbus"],
    statement: "TUM's aerospace engineering program, with its close ties to the European aviation industry, would be the perfect environment for me to develop my research on sustainable aviation technologies. I hope to combine the theoretical rigor of German engineering education with the innovative spirit I've experienced at HKUST.",
    ranking: 5.0,
    photo: "https://randomuser.me/api/portraits/men/41.jpg"
  }
];

// Function to convert ranking to stars
const rankingToStars = (ranking: number) => {
  // Convert ranking from 0-5 scale to 0-5 stars
  const fullStars = Math.floor(ranking);
  const halfStar = ranking % 1 >= 0.5;
  
  const stars = [];
  
  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(<span key={`full-${i}`} className="star full">★</span>);
  }
  
  // Add half star if needed
  if (halfStar) {
    stars.push(<span key="half" className="star half">★</span>);
  }
  
  // Add empty stars
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
  }
  
  return stars;
};

// Define application status type
type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'waitlisted';

// Add status to student type
interface Student {
  id: number;
  name: string;
  university: string;
  major: string;
  gpa: number;
  targetUniversity: string;
  languages: string[];
  interests: string[];
  achievements: string[];
  statement: string;
  ranking: number;
  photo: string;
  status?: ApplicationStatus;
}

const AdminPage: React.FC = () => {
  // Add status to each student
  const studentsWithStatus = mockStudents.map(student => ({
    ...student,
    status: 'pending' as ApplicationStatus
  }));

  const [students, setStudents] = useState<Student[]>(studentsWithStatus);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(studentsWithStatus);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('ranking');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterUniversity, setFilterUniversity] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [language, setLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState<Record<string, string>>({});
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error' | 'info'>('info');

  // Get unique target universities for filter dropdown
  const targetUniversities = useMemo(() => {
    const universities = students.map(student => student.targetUniversity);
    return ['All Universities', ...Array.from(new Set(universities))].sort();
  }, [students]);
  
  // Clear selection when filter changes
  useEffect(() => {
    // Clear the selected student when filter changes
    setSelectedStudent(null);
  }, [filterUniversity]);

  // Filter and sort students
  useEffect(() => {
    let result = [...students];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.major.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.targetUniversity.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply university filter
    if (filterUniversity && filterUniversity !== 'All Universities') {
      result = result.filter(student => student.targetUniversity === filterUniversity);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'university':
          comparison = a.university.localeCompare(b.university);
          break;
        case 'targetUniversity':
          comparison = a.targetUniversity.localeCompare(b.targetUniversity);
          break;
        case 'ranking':
        default:
          comparison = a.ranking - b.ranking;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredStudents(result);
  }, [students, searchTerm, sortBy, sortOrder, filterUniversity]);

  // Mock translation function
  const translateText = (text: string, targetLang: string) => {
    setIsTranslating(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Mock translations (in a real app, this would be an API call)
      const translations: Record<string, Record<string, string>> = {
        fr: {
          "I am passionate about": "Je suis passionné par",
          "My research on": "Mes recherches sur",
          "I aim to combine": "Je vise à combiner",
          "HKUST's combination": "La combinaison de HKUST",
          "Imperial College's": "Le programme de l'Imperial College",
          "Studying at the Sorbonne": "Étudier à la Sorbonne",
          "Germany's automotive": "L'excellence automobile allemande"
        },
        es: {
          "I am passionate about": "Me apasiona",
          "My research on": "Mi investigación sobre",
          "I aim to combine": "Mi objetivo es combinar",
          "HKUST's combination": "La combinación de HKUST",
          "Imperial College's": "El programa de Imperial College",
          "Studying at the Sorbonne": "Estudiar en la Sorbona",
          "Germany's automotive": "La excelencia automotriz de Alemania"
        },
        zh: {
          "I am passionate about": "我热衷于",
          "My research on": "我对...的研究",
          "I aim to combine": "我的目标是结合",
          "HKUST's combination": "香港科技大学的结合",
          "Imperial College's": "帝国理工学院的",
          "Studying at the Sorbonne": "在索邦大学学习",
          "Germany's automotive": "德国的汽车卓越"
        }
      };
      
      if (targetLang === 'en') {
        setTranslatedText({});
      } else {
        const langTranslations = translations[targetLang] || {};
        const newTranslations: Record<string, string> = {};
        
        // Apply simple mock translations
        if (selectedStudent) {
          let translatedStatement = selectedStudent.statement;
          
          Object.entries(langTranslations).forEach(([original, translated]) => {
            if (translatedStatement.includes(original)) {
              translatedStatement = translatedStatement.replace(original, translated);
            }
          });
          
          newTranslations.statement = translatedStatement;
        }
        
        setTranslatedText(newTranslations);
      }
      
      setIsTranslating(false);
    }, 500);
  };

  // Handle language change
  useEffect(() => {
    if (selectedStudent && language !== 'en') {
      translateText(selectedStudent.statement, language);
    } else {
      setTranslatedText({});
    }
  }, [language, selectedStudent]);

  // Handle student selection with toggle functionality
  const handleStudentSelect = (student: any) => {
    // If the student is already selected, deselect them
    if (selectedStudent?.id === student.id) {
      setSelectedStudent(null);
      return;
    }
    
    // Otherwise, select the student
    setSelectedStudent(student);
    if (language !== 'en') {
      translateText(student.statement, language);
    }
  };

  // Handle sort change
  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };
  
  // Handle application status change
  const updateApplicationStatus = (studentId: number, newStatus: ApplicationStatus) => {
    // Update students array
    const updatedStudents = students.map(student => 
      student.id === studentId ? { ...student, status: newStatus } : student
    );
    
    setStudents(updatedStudents);
    
    // Update selected student if it's the one being modified
    if (selectedStudent && selectedStudent.id === studentId) {
      setSelectedStudent({ ...selectedStudent, status: newStatus });
    }
    
    // Show notification
    const student = students.find(s => s.id === studentId);
    const statusMessages = {
      approved: `${student?.name}'s application has been approved.`,
      rejected: `${student?.name}'s application has been rejected.`,
      waitlisted: `${student?.name} has been added to the waitlist.`,
      pending: `${student?.name}'s application status has been reset to pending.`
    };
    
    const statusTypes: Record<ApplicationStatus, 'success' | 'error' | 'info'> = {
      approved: 'success',
      rejected: 'error',
      waitlisted: 'info',
      pending: 'info'
    };
    
    setNotificationMessage(statusMessages[newStatus]);
    setNotificationType(statusTypes[newStatus]);
    setShowNotification(true);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };
  
  // Handler for approve button
  const handleApprove = () => {
    if (selectedStudent) {
      updateApplicationStatus(selectedStudent.id, 'approved');
    }
  };
  
  // Handler for reject button
  const handleReject = () => {
    if (selectedStudent) {
      updateApplicationStatus(selectedStudent.id, 'rejected');
    }
  };
  
  // Handler for waitlist button
  const handleWaitlist = () => {
    if (selectedStudent) {
      updateApplicationStatus(selectedStudent.id, 'waitlisted');
    }
  };

  return (
    <div className="content-container">
      {showNotification && (
        <div className={`notification notification-${notificationType}`}>
          <div className="notification-content">
            <span className="notification-icon">
              {notificationType === 'success' && '✅'}
              {notificationType === 'error' && '❌'}
              {notificationType === 'info' && 'ℹ️'}
            </span>
            <span className="notification-message">{notificationMessage}</span>
          </div>
          <button className="notification-close" onClick={() => setShowNotification(false)}>×</button>
        </div>
      )}
      <div className="admin-header">
        <div className="admin-title-section">
          <h1 className="page-title">HKUST Exchange Program</h1>
          <p className="admin-subtitle">Review <span className="university-highlight">HKUST students</span> applying to different target universities</p>
          
          <div className="filters-row">
            <div className="filter-container">
              <label htmlFor="university-filter">Filter by Target University:</label>
              <select
                id="university-filter"
                value={filterUniversity}
                onChange={(e) => setFilterUniversity(e.target.value)}
                className="filter-select"
              >
                {targetUniversities.map((university, index) => (
                  <option key={index} value={university}>{university}</option>
                ))}
              </select>
            </div>
            
            <div className="search-container">
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>
        </div>
        
        <div className="admin-actions">
        </div>
      </div>
      
      <div className="admin-content">
        <div className="students-grid">
          {filteredStudents.map(student => (
            <div 
              key={student.id} 
              className={`student-card ${selectedStudent?.id === student.id ? 'selected' : ''}`}
              onClick={() => handleStudentSelect(student)}
            >
              <div className="student-card-header">
                <div className="student-photo">
                  <img src={student.photo} alt={student.name} />
                </div>
                <div className="student-basic-info">
                  <h3>{student.name}</h3>
                  <p className="student-university">{student.university}</p>
                  <div className="student-ranking">
                    {rankingToStars(student.ranking)}
                    <span className="ranking-number">{student.ranking.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              
              <div className="student-card-details">
                <div className="detail-item">
                  <span className="detail-icon">🎓</span>
                  <span className="detail-label">Major:</span>
                  <span className="detail-value">{student.major}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">🌍</span>
                  <span className="detail-label">Target:</span>
                  <span className="detail-value">{student.targetUniversity}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">📊</span>
                  <span className="detail-label">GPA:</span>
                  <span className="detail-value">{student.gpa}</span>
                </div>
              </div>
              
              <div className="student-card-footer">
                {student.status && student.status !== 'pending' && (
                  <div className={`status-indicator status-${student.status}`}>
                    {student.status === 'approved' && 'Approved'}
                    {student.status === 'rejected' && 'Rejected'}
                    {student.status === 'waitlisted' && 'Waitlisted'}
                  </div>
                )}
                <button className="btn-view-details">View Details</button>
              </div>
            </div>
          ))}
        </div>
        
        {selectedStudent && (
          <div className="student-details-panel">
            <div className="panel-header">
              <h2>Student Details</h2>
              <div className="language-selector">
                <label htmlFor="language-select">Translate to:</label>
                <select
                  id="language-select"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  disabled={isTranslating}
                >
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="es">Spanish</option>
                  <option value="zh">Chinese</option>
                </select>
                {isTranslating && <span className="translating-indicator">Translating...</span>}
              </div>
            </div>
            
            <div className="panel-content">
              <div className="student-profile-header">
                <div className="profile-photo">
                  <img src={selectedStudent.photo} alt={selectedStudent.name} />
                </div>
                <div className="profile-info">
                  <h2>{selectedStudent.name}</h2>
                  <p className="profile-university">{selectedStudent.university}</p>
                  <div className="profile-ranking">
                    {rankingToStars(selectedStudent.ranking)}
                    <span className="ranking-number">{selectedStudent.ranking.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              
              <div className="profile-section">
                <h3>Academic Information</h3>
                <div className="profile-grid">
                  <div className="profile-item">
                    <span className="profile-label">Major</span>
                    <span className="profile-value">{selectedStudent.major}</span>
                  </div>
                  <div className="profile-item">
                    <span className="profile-label">GPA</span>
                    <span className="profile-value">{selectedStudent.gpa}</span>
                  </div>
                  <div className="profile-item">
                    <span className="profile-label">Target University</span>
                    <span className="profile-value">{selectedStudent.targetUniversity}</span>
                  </div>
                </div>
              </div>
              
              <div className="profile-section">
                <h3>Languages</h3>
                <div className="language-tags">
                  {selectedStudent.languages.map((lang: string, index: number) => (
                    <span key={index} className="language-tag">{lang}</span>
                  ))}
                </div>
              </div>
              
              <div className="profile-section">
                <h3>Interests</h3>
                <div className="interest-tags">
                  {selectedStudent.interests.map((interest: string, index: number) => (
                    <span key={index} className="interest-tag">{interest}</span>
                  ))}
                </div>
              </div>
              
              <div className="profile-section">
                <h3>Achievements</h3>
                <ul className="achievements-list">
                  {selectedStudent.achievements.map((achievement: string, index: number) => (
                    <li key={index}>{achievement}</li>
                  ))}
                </ul>
              </div>
              
              <div className="profile-section">
                <h3>Personal Statement</h3>
                <div className="statement-container">
                  <p>{translatedText.statement || selectedStudent.statement}</p>
                </div>
              </div>
              
              <div className="profile-actions">
                <button 
                  className={`btn-approve ${selectedStudent.status === 'approved' ? 'active' : ''}`}
                  onClick={handleApprove}
                  disabled={selectedStudent.status === 'approved'}
                >
                  {selectedStudent.status === 'approved' ? 'Approved' : 'Approve Application'}
                </button>
                <button 
                  className={`btn-reject ${selectedStudent.status === 'rejected' ? 'active' : ''}`}
                  onClick={handleReject}
                  disabled={selectedStudent.status === 'rejected'}
                >
                  {selectedStudent.status === 'rejected' ? 'Rejected' : 'Reject Application'}
                </button>
                <button 
                  className={`btn-waitlist ${selectedStudent.status === 'waitlisted' ? 'active' : ''}`}
                  onClick={handleWaitlist}
                  disabled={selectedStudent.status === 'waitlisted'}
                >
                  {selectedStudent.status === 'waitlisted' ? 'Waitlisted' : 'Add to Waitlist'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
