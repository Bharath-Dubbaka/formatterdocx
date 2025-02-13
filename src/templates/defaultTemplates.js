export const modernTemplate = {
  id: "modern_template",
  name: "Modern Professional",
  styles: {
    document: {
      font: "Roboto",
      fontSize: "11pt",
      lineSpacing: 1.15,
      margins: {
        top: "1in",
        bottom: "1in",
        left: "1in",
        right: "1in"
      }
    },
    sections: {
      heading: {
        font: "Roboto",
        fontSize: "16pt",
        bold: true,
        color: "#2D3748",
        spacing: "12pt"
      },
      content: {
        fontSize: "11pt",
        lineSpacing: 1.15,
        bulletStyle: "•"
      }
    }
  },
  sections: [
    "Professional Summary",
    "Technical Skills",
    "Professional Experience",
    "Education",
    "Certifications"
  ]
};

export const minimalTemplate = {
  id: "minimal_template",
  name: "Minimal Clean",
  styles: {
    document: {
      font: "Arial",
      fontSize: "10.5pt",
      lineSpacing: 1.08,
      margins: {
        top: "0.8in",
        bottom: "0.8in",
        left: "0.8in",
        right: "0.8in"
      }
    },
    sections: {
      heading: {
        font: "Calibri",
        fontSize: "14pt",
        bold: true,
        color: "#1A202C",
        spacing: "10pt"
      },
      content: {
        fontSize: "10.5pt",
        lineSpacing: 1.08,
        bulletStyle: "−"
      }
    }
  },
  sections: [
    "Summary",
    "Skills",
    "Experience",
    "Education",
    "Projects"
  ]
};