import { db } from "../lib/firebase";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";

class UserService {
  static DEFAULT_TEMPLATES = {
    templates: [
      {
        id: "template1",
        name: "BYDCorp Format",
        sections: [
          "Professional Summary",
          "Technical Skills",
          "Work Experience",
          "Education",
        ],
      },
      {
        id: "template2",
        name: "Cohert Inc Format",
        sections: [
          "Professional Summary",
          "Technical Skills",
          "Education",
          "Professional Experience",
        ],
      },
    ],
    lastUpdated: new Date().toISOString(),
  };

  static async createOrUpdateUser(uid, userData) {
    try {
      const userRef = doc(db, "userDetails", uid);
      const data = {
        ...userData,
        templates: this.DEFAULT_TEMPLATES.templates,
        lastUpdated: new Date().toISOString(),
      };
      await setDoc(userRef, data, { merge: true });
      return data;
    } catch (error) {
      console.error("Error creating/updating user:", error);
      throw error;
    }
  }

  static async getUserTemplates(uid) {
    try {
      const userRef = doc(db, "userDetails", uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await this.createOrUpdateUser(uid, this.DEFAULT_TEMPLATES);
        return this.DEFAULT_TEMPLATES.templates;
      }

      return userSnap.data().templates || [];
    } catch (error) {
      console.error("Error getting user templates:", error);
      return this.DEFAULT_TEMPLATES.templates;
    }
  }

  static async addTemplate(uid, template) {
    try {
      const userRef = doc(db, "userDetails", uid);
      const templates = await this.getUserTemplates(uid);
      
      const newTemplate = {
        id: `template${Date.now()}`,
        ...template,
      };

      const updatedTemplates = [...templates, newTemplate];
      await setDoc(userRef, { 
        templates: updatedTemplates,
        lastUpdated: new Date().toISOString(),
      }, { merge: true });

      return newTemplate;
    } catch (error) {
      console.error("Error adding template:", error);
      throw error;
    }
  }

  static async deleteTemplate(uid, templateId) {
    try {
      const userRef = doc(db, "userDetails", uid);
      const templates = await this.getUserTemplates(uid);
      
      const updatedTemplates = templates.filter(t => t.id !== templateId);
      await setDoc(userRef, { 
        templates: updatedTemplates,
        lastUpdated: new Date().toISOString(),
      }, { merge: true });

      return true;
    } catch (error) {
      console.error("Error deleting template:", error);
      throw error;
    }
  }
}

export default UserService;