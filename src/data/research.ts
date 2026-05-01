export interface ResearchProject {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  date: string;
  tags: string[];
  image?: string;
  content: {
    sections: {
      title: string;
      content: string;
      visualType?: "image" | "graph" | "equation" | "code" | "table";
      visual?: string;
    }[];
  };
  references?: {
    title: string;
    authors?: string[];
    publication?: string;
    year?: number;
    url?: string;
  }[];
  relatedProjects?: string[];
}

const researchProjects: ResearchProject[] = [
  {
    id: "ga-for-machine-learning",
    slug: "ga-for-machine-learning",
    title: "Genetic Algorithms for Hyper Parameter Tuning in Machine Learning",
    shortDescription: "Exploring the possiblity of using genetic algorithms to optimize hyper-parameter tuning for machine learning models.",
    fullDescription: "This research explores the use of genetic algorithms to optimize hyper-parameter tuning for machine learning models. We use the latest in genetic algorithm research to create a system that can find the best hyper-parameters for a given machine learning model.",
    date: "2024-04-20",
    tags: ["Genetic Algorithms", "Machine Learning", "Hyper-parameter Tuning"],
    image: "/research-2.jpg",
    content: {
      sections: [
        {
          title: "Introduction",
          content: "Genetic algorithms are a type of evolutionary algorithm that can be used to optimize hyper-parameter tuning for machine learning models. We use the latest in genetic algorithm research to create a system that can find the best hyper-parameters for a given machine learning model."
        },
        {
          title: "Genetic Algorithm Optimization",
          content: "We use the latest in genetic algorithm research to create a system that can find the best hyper-parameters for a given machine learning model.",
          visualType: "graph",
          visual: "/research/ga-for-machine-learning.svg"
        }
      ]
    }
  },
];

export function getAllResearch(): ResearchProject[] {
  return researchProjects;
}

export function getResearchBySlug(slug: string): ResearchProject | undefined {
  return researchProjects.find(project => project.slug === slug);
}

export function getRelatedResearch(projectId: string): ResearchProject[] {
  const project = researchProjects.find(p => p.id === projectId);
  if (!project || !project.relatedProjects || project.relatedProjects.length === 0) {
    // Return some default recommendations if no relations exist
    return researchProjects.filter(p => p.id !== projectId).slice(0, 2);
  }
  
  return project.relatedProjects
    .map(id => researchProjects.find(p => p.id === id))
    .filter((p): p is ResearchProject => p !== undefined);
} 