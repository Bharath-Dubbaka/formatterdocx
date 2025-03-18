class ResumeService {
  static sectionHeaders = {
    contact: ["contact", "personal information", "name", "email", "phone"],
    skills: ["skills", "technical skills", "key skills", "technologies", "expertise"],
    experience: ["experience", "professional experience", "work history", "employment"],
    education: ["education", "academic background", "qualifications"],
    summary: ["summary", "profile", "professional summary", "about me"],
    projects: ["projects", "personal projects", "key projects"],
    certifications: ["certifications", "certificates", "professional certifications"],
    achievements: ["achievements", "awards", "honors"],
  };

  static async parseResume(text) {
    try {
      const sections = this.identifySections(text);
      const mappedSections = this.mapSectionsToTemplate(sections);
      
      return {
        metadata: {
          totalSections: sections.length,
          timestamp: new Date().toISOString(),
        },
        sections: mappedSections,
      };
    } catch (error) {
      console.error("Error parsing resume:", error);
      throw new Error("Failed to parse resume content");
    }
  }

  static identifySections(text) {
    const sections = [];
    const lines = text.split("\n");
    
    let currentSection = { title: "Unknown", type: "unknown", content: "" };
    let isProcessingContent = false;

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return; // Skip empty lines

      const lowerCaseLine = trimmedLine.toLowerCase();
      let foundHeader = false;

      // Check if line is a section header
      for (const [type, headers] of Object.entries(this.sectionHeaders)) {
        if (headers.some(header => 
          lowerCaseLine.includes(header) && 
          lowerCaseLine.length < header.length + 10 // Avoid matching content that just contains header words
        )) {
          // Save previous section if it has content
          if (currentSection.content.trim()) {
            sections.push({...currentSection});
          }

          // Start new section
          currentSection = {
            title: trimmedLine,
            type,
            content: "",
            raw: "" // Keep raw content for debugging
          };
          
          foundHeader = true;
          isProcessingContent = true;
          break;
        }
      }

      if (!foundHeader && isProcessingContent) {
        currentSection.content += trimmedLine + "\n";
        currentSection.raw += line + "\n";
      }
    });

    // Add the last section
    if (currentSection.content.trim()) {
      sections.push(currentSection);
    }

    return sections;
  }

  static mapSectionsToTemplate(sections) {
    return sections.map(section => {
      const mappedSection = { ...section };
      
      switch (section.type) {
        case "contact":
          mappedSection.content = this.parseContactInfo(section.content);
          break;
        case "skills":
          mappedSection.content = this.parseSkills(section.content);
          break;
        case "experience":
          mappedSection.content = this.parseExperience(section.content);
          break;
        case "education":
          mappedSection.content = this.parseEducation(section.content);
          break;
        // Other sections keep their original content
        default:
          mappedSection.content = section.content.trim();
      }

      return mappedSection;
    });
  }

  static parseContactInfo(content) {
    const contact = {
      name: "",
      email: "",
      phone: "",
      location: "",
      portfolio: "",
      linkedin: ""
    };

    const lines = content.split("\n");
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    const urlRegex = /https?:\/\/[^\s]+/;
    const linkedinRegex = /linkedin\.com\/[^\s]+/;

    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Extract email
      const emailMatch = trimmedLine.match(emailRegex);
      if (emailMatch && !contact.email) {
        contact.email = emailMatch[0];
      }

      // Extract phone
      const phoneMatch = trimmedLine.match(phoneRegex);
      if (phoneMatch && !contact.phone) {
        contact.phone = phoneMatch[0];
      }

      // Extract LinkedIn
      const linkedinMatch = trimmedLine.match(linkedinRegex);
      if (linkedinMatch && !contact.linkedin) {
        contact.linkedin = linkedinMatch[0];
      }

      // Extract portfolio URL
      const urlMatch = trimmedLine.match(urlRegex);
      if (urlMatch && !contact.portfolio && !trimmedLine.includes("linkedin")) {
        contact.portfolio = urlMatch[0];
      }

      // If line doesn't contain any of the above and is short, it might be the name
      if (!contact.name && 
          !emailMatch && !phoneMatch && !urlMatch && 
          trimmedLine.length > 0 && trimmedLine.length < 50) {
        contact.name = trimmedLine;
      }

      // Location is usually a short line with city/state or similar
      if (!contact.location && 
          trimmedLine.length > 0 && 
          trimmedLine.length < 50 && 
          !emailMatch && !phoneMatch && !urlMatch) {
        // Check if line looks like a location (contains common location keywords)
        const locationKeywords = ["road", "street", "ave", "lane", "city", "state", "country"];
        if (locationKeywords.some(keyword => trimmedLine.toLowerCase().includes(keyword))) {
          contact.location = trimmedLine;
        }
      }
    });

    return contact;
  }

  static parseSkills(content) {
    // Split by common delimiters and clean up
    const skillsList = content
      .split(/[,•|\n]+/)
      .map(skill => skill.trim())
      .filter(skill => 
        skill.length > 0 && 
        skill.length < 50 && // Avoid long phrases
        !/^\d+/.test(skill) // Avoid lines starting with numbers (likely not skills)
      );

    return skillsList;
  }

  static parseExperience(content) {
    const experiences = [];
    const lines = content.split("\n").filter(line => line.trim());
    
    let currentExp = {
      company: "",
      title: "",
      duration: "",
      location: "",
      responsibilities: []
    };

    let isProcessingResponsibilities = false;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Look for date patterns
      const datePattern = /(?:\d{1,2}\/\d{1,2}\/\d{2,4})|(?:\d{4}\s*-\s*(?:\d{4}|present))|(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*\d{4})/i;
      
      if (datePattern.test(trimmedLine)) {
        // If we find a date and we have a previous experience, save it
        if (currentExp.company) {
          experiences.push({...currentExp});
          currentExp = {
            company: "",
            title: "",
            duration: "",
            location: "",
            responsibilities: []
          };
        }
        currentExp.duration = trimmedLine;
        isProcessingResponsibilities = false;
      }
      // Look for bullet points or numbered lists for responsibilities
      else if (trimmedLine.startsWith("•") || trimmedLine.startsWith("-") || /^\d+\./.test(trimmedLine)) {
        isProcessingResponsibilities = true;
        currentExp.responsibilities.push(trimmedLine.replace(/^[•\-\d.]\s*/, ""));
      }
      // If line is short, it might be company name or title
      else if (trimmedLine.length < 100) {
        if (!currentExp.company) {
          currentExp.company = trimmedLine;
        } else if (!currentExp.title) {
          currentExp.title = trimmedLine;
        } else if (!currentExp.location && /[A-Z]{2}/.test(trimmedLine)) { // Look for state abbreviations
          currentExp.location = trimmedLine;
        }
      }
      // If we're processing responsibilities and line doesn't match other patterns
      else if (isProcessingResponsibilities) {
        currentExp.responsibilities.push(trimmedLine);
      }
    });

    // Add the last experience
    if (currentExp.company || currentExp.responsibilities.length > 0) {
      experiences.push(currentExp);
    }

    return experiences;
  }

  static parseEducation(content) {
    const education = [];
    const lines = content.split("\n").filter(line => line.trim());
    
    let currentEdu = {
      degree: "",
      institution: "",
      duration: "",
      gpa: "",
      achievements: []
    };

    lines.forEach((line) => {
      const trimmedLine = line.trim();
      
      // Look for degree keywords
      const degreeKeywords = ["bachelor", "master", "phd", "diploma", "certificate", "b.tech", "m.tech", "b.e", "m.e"];
      const isDegreeLine = degreeKeywords.some(keyword => 
        trimmedLine.toLowerCase().includes(keyword)
      );

      // Look for GPA
      const gpaMatch = trimmedLine.match(/GPA:?\s*(\d+\.?\d*)/i);
      
      if (isDegreeLine) {
        if (currentEdu.degree) {
          education.push({...currentEdu});
          currentEdu = {
            degree: "",
            institution: "",
            duration: "",
            gpa: "",
            achievements: []
          };
        }
        currentEdu.degree = trimmedLine;
      }
      else if (gpaMatch) {
        currentEdu.gpa = gpaMatch[1];
      }
      // Look for dates
      else if (/\d{4}/.test(trimmedLine) && trimmedLine.length < 50) {
        currentEdu.duration = trimmedLine;
      }
      // If line is short and we don't have institution, it might be the institution name
      else if (trimmedLine.length < 100 && !currentEdu.institution) {
        currentEdu.institution = trimmedLine;
      }
      // Other lines might be achievements
      else {
        currentEdu.achievements.push(trimmedLine);
      }
    });

    // Add the last education entry
    if (currentEdu.degree || currentEdu.institution) {
      education.push(currentEdu);
    }

    return education;
  }
}

export default ResumeService;
