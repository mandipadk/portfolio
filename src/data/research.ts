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
    id: "quantum-ml",
    slug: "quantum-machine-learning",
    title: "Quantum Computing Applications in Machine Learning",
    shortDescription: "Exploring how quantum computing can enhance machine learning algorithms and create new paradigms for AI advancement.",
    fullDescription: "This research investigates the intersection of quantum computing and machine learning, focusing on how quantum algorithms can provide exponential speedup for specific ML tasks and create entirely new approaches to pattern recognition and data analysis.",
    date: "2023-06-15",
    tags: ["Quantum Computing", "Machine Learning", "AI", "Quantum Algorithms"],
    image: "/research/quantum-ml.jpg",
    content: {
      sections: [
        {
          title: "Introduction",
          content: "Quantum computing represents a paradigm shift in computational capabilities, promising exponential speedups for certain classes of problems. This research explores how these capabilities can be applied to machine learning, potentially revolutionizing how we train models, recognize patterns, and analyze complex datasets."
        },
        {
          title: "Quantum Machine Learning Algorithms",
          content: "We examine several quantum algorithms that show promise for machine learning applications, including quantum principal component analysis, quantum support vector machines, and quantum neural networks. For each, we analyze the theoretical speedup and practical implementation challenges on today's quantum hardware.",
          visualType: "equation",
          visual: "|ψ⟩ = ∑ cᵢ|i⟩"
        },
        {
          title: "Experiments and Results",
          content: "Our experiments on both quantum simulators and actual quantum hardware show that while theoretical advantages exist, current quantum computers face significant noise barriers that limit practical applications. However, certain quantum-inspired classical algorithms show immediate promise for specific machine learning tasks.",
          visualType: "graph",
          visual: "/research/quantum-ml-results.svg"
        },
        {
          title: "Future Directions",
          content: "As quantum hardware continues to improve, we outline several promising research directions, including hybrid quantum-classical algorithms, error mitigation techniques specific to machine learning applications, and entirely new approaches to feature engineering that leverage quantum superposition."
        }
      ]
    },
    references: [
      {
        title: "Quantum Machine Learning",
        authors: ["Biamonte, J.", "Wittek, P.", "Pancotti, N.", "Rebentrost, P.", "Wiebe, N.", "Lloyd, S."],
        publication: "Nature",
        year: 2017,
        url: "https://www.nature.com/articles/nature23474"
      },
      {
        title: "Quantum algorithms for supervised and unsupervised machine learning",
        authors: ["Lloyd, S.", "Mohseni, M.", "Rebentrost, P."],
        publication: "arXiv preprint",
        year: 2013,
        url: "https://arxiv.org/abs/1307.0411"
      }
    ]
  },
  {
    id: "computational-dimensions",
    slug: "computational-dimensions",
    title: "Exploring Complex Computational Dimensions",
    shortDescription: "Investigating the theoretical foundations and practical applications of higher-dimensional computational spaces.",
    fullDescription: "This research explores how extending computational models into complex number spaces and higher-dimensional constructs can lead to novel algorithms and more efficient solutions to previously intractable problems.",
    date: "2023-09-28",
    tags: ["Computational Theory", "Complex Numbers", "Higher Dimensions", "Algorithm Design"],
    image: "/research/computational-dimensions.jpg",
    content: {
      sections: [
        {
          title: "Theoretical Foundations",
          content: "We begin by examining the mathematical foundations of higher-dimensional computational spaces, exploring how complex numbers, quaternions, and other hypercomplex number systems can be utilized in computational contexts. This includes developing formal models for algorithms that operate natively in these spaces.",
          visualType: "equation",
          visual: "f(z) = ∑ aₙz^n, z ∈ ℂ"
        },
        {
          title: "Algorithmic Advantages",
          content: "Higher-dimensional computation offers several advantages over traditional approaches, including more compact representation of certain problems, natural modeling of physical phenomena, and potential computational speedups for specific problem classes. We analyze these advantages through case studies and theoretical complexity analysis.",
          visualType: "code",
          visual: "function complexDimension(z) {\n  return z.conjugate() * z.exponential();\n}"
        },
        {
          title: "Implementation Challenges",
          content: "Despite theoretical advantages, practical implementation of higher-dimensional computational models faces challenges, including hardware designed primarily for real-number computation, increased complexity in algorithm design, and difficulties in interpretation and visualization of results.",
          visualType: "image",
          visual: "/research/implementation-challenges.png"
        },
        {
          title: "Applications and Case Studies",
          content: "We present several case studies where higher-dimensional computational approaches have shown promise, including signal processing, computer graphics, quantum simulation, machine learning, and optimization problems."
        }
      ]
    },
    references: [
      {
        title: "Computing with Complex Numbers",
        authors: ["Smith, A.", "Jones, B."],
        publication: "Journal of Computational Theory",
        year: 2020,
        url: "https://example.org/computing-complex"
      },
      {
        title: "Higher-Dimensional Algorithm Design",
        authors: ["Zhang, L.", "Williams, R."],
        publication: "Proceedings of the International Conference on Advanced Computing",
        year: 2022,
        url: "https://example.org/higher-dim-algos"
      }
    ],
    relatedProjects: ["quantum-ml"]
  },
  {
    id: "quantum-algorithms",
    slug: "quantum-algorithm-optimization",
    title: "Novel Approaches to Quantum Algorithm Optimization",
    shortDescription: "Developing new techniques to optimize quantum circuits and algorithms for near-term quantum hardware.",
    fullDescription: "This research focuses on practical quantum algorithm optimization techniques that enable meaningful quantum advantage even on noisy intermediate-scale quantum (NISQ) devices available today.",
    date: "2023-12-01",
    tags: ["Quantum Computing", "Algorithm Optimization", "NISQ", "Quantum Circuits"],
    image: "/research/quantum-optimization.jpg",
    content: {
      sections: [
        {
          title: "The NISQ Era Challenge",
          content: "Current quantum computers have limited qubit counts and significant error rates, making implementation of many theoretical quantum algorithms impractical. This research addresses this gap by developing optimization techniques specifically designed for NISQ devices.",
          visualType: "image",
          visual: "/research/nisq-devices.png"
        },
        {
          title: "Circuit Depth Reduction",
          content: "We introduce several novel techniques for quantum circuit depth reduction while preserving computational fidelity. These include automated gate decomposition strategies, optimized qubit routing algorithms, and hardware-specific circuit transformations.",
          visualType: "graph",
          visual: "/research/circuit-depth-comparison.svg"
        },
        {
          title: "Error Mitigation Strategies",
          content: "Our research develops practical error mitigation techniques that can be applied to real quantum algorithms running on today's hardware. These include zero-noise extrapolation, probabilistic error cancellation, and symmetry-based verification approaches.",
          visualType: "equation",
          visual: "E[Ô] = ∑ cᵢ E[Ôᵢ]"
        },
        {
          title: "Benchmark Results",
          content: "We evaluated our optimization techniques on several quantum algorithms including VQE, QAOA, and quantum machine learning models, demonstrating significant improvements in accuracy and success probability when compared to unoptimized implementations."
        }
      ]
    },
    references: [
      {
        title: "Quantum Error Mitigation for Near-term Applications",
        authors: ["Temme, K.", "Bravyi, S.", "Gambetta, J.M."],
        publication: "Physical Review Letters",
        year: 2017,
        url: "https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.119.180509"
      },
      {
        title: "Hardware-efficient Variational Quantum Eigensolver",
        authors: ["Kandala, A.", "Mezzacapo, A.", "Temme, K."],
        publication: "Nature",
        year: 2017,
        url: "https://www.nature.com/articles/nature23879"
      }
    ],
    relatedProjects: ["quantum-ml", "computational-dimensions"]
  }
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