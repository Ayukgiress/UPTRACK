import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Navigation
      "Dashboard": "Dashboard",
      "Overview": "Overview",
      "Pending": "Pending",
      "Completed": "Completed",
      "Charts": "Charts",
      "Settings": "Settings",
      "Supervisor": "Supervisor",

      // Common
      "Save": "Save",
      "Cancel": "Cancel",
      "Delete": "Delete",
      "Edit": "Edit",
      "Add": "Add",
      "Loading...": "Loading...",
      "No data available": "No data available",

      // Auth
      "Login": "Login",
      "Register": "Register",
      "Logout": "Logout",
      "Email": "Email",
      "Password": "Password",
      "Name": "Name",
      "Confirm Password": "Confirm Password",
      "Forgot Password?": "Forgot Password?",
      "Don't have an account?": "Don't have an account?",
      "Already have an account?": "Already have an account?",

      // Todo
      "Add Todo": "Add Todo",
      "Title": "Title",
      "Description": "Description",
      "Due Date": "Due Date",
      "Priority": "Priority",
      "High": "High",
      "Medium": "Medium",
      "Low": "Low",
      "Assign to Supervisor": "Assign to Supervisor",
      "Add Subtask": "Add Subtask",
      "Mark as Complete": "Mark as Complete",
      "Mark as Pending": "Mark as Pending",

      // Settings
      "Profile": "Profile",
      "Notifications": "Notifications",
      "Privacy": "Privacy",
      "Appearance": "Appearance",
      "Theme": "Theme",
      "Language": "Language",
      "Light": "Light",
      "Dark": "Dark",
      "System": "System",
      "English": "English",
      "Français": "Français",
      "Bio": "Bio",
      "Tell us about yourself...": "Tell us about yourself...",
      "Email Notifications": "Email Notifications",
      "Receive updates via email": "Receive updates via email",
      "Push Notifications": "Push Notifications",
      "Get instant notifications": "Get instant notifications",
      "Task Reminders": "Task Reminders",
      "Remind me about due tasks": "Remind me about due tasks",
      "Profile Visibility": "Profile Visibility",
      "Public": "Public",
      "Friends Only": "Friends Only",
      "Private": "Private",
      "Data Sharing": "Data Sharing",
      "Allow anonymous usage data": "Allow anonymous usage data",
      "Save Changes": "Save Changes",
      "Settings saved successfully!": "Settings saved successfully!",

      // Supervisor
      "Assigned Tasks": "Assigned Tasks",
      "No assigned tasks": "No assigned tasks",
      "You don't have any assigned tasks yet.": "You don't have any assigned tasks yet.",
      "View Details": "View Details",
      "Comment": "Comment",
      "Add a comment...": "Add a comment...",
      "Comments": "Comments",
      "No comments yet. Be the first to add one!": "No comments yet. Be the first to add one!",

      // Home
      "Welcome to UpTrack": "Welcome to UpTrack",
      "Your Personal Todo Manager": "Your Personal Todo Manager",
      "Get Started": "Get Started",
      "Features": "Features",
      "Manage your tasks efficiently": "Manage your tasks efficiently",
      "Collaborate with your team": "Collaborate with your team",
      "Track your progress": "Track your progress",

      // Errors
      "Failed to load data": "Failed to load data",
      "Failed to save changes": "Failed to save changes",
      "Please try again": "Please try again"
    }
  },
  fr: {
    translation: {
      // Navigation
      "Dashboard": "Tableau de Bord",
      "Overview": "Aperçu",
      "Pending": "En Attente",
      "Completed": "Terminé",
      "Charts": "Graphiques",
      "Settings": "Paramètres",
      "Supervisor": "Superviseur",

      // Common
      "Save": "Sauvegarder",
      "Cancel": "Annuler",
      "Delete": "Supprimer",
      "Edit": "Modifier",
      "Add": "Ajouter",
      "Loading...": "Chargement...",
      "No data available": "Aucune donnée disponible",

      // Auth
      "Login": "Connexion",
      "Register": "S'inscrire",
      "Logout": "Déconnexion",
      "Email": "Email",
      "Password": "Mot de passe",
      "Name": "Nom",
      "Confirm Password": "Confirmer le mot de passe",
      "Forgot Password?": "Mot de passe oublié ?",
      "Don't have an account?": "Vous n'avez pas de compte ?",
      "Already have an account?": "Vous avez déjà un compte ?",

      // Todo
      "Add Todo": "Ajouter une Tâche",
      "Title": "Titre",
      "Description": "Description",
      "Due Date": "Date d'échéance",
      "Priority": "Priorité",
      "High": "Élevée",
      "Medium": "Moyenne",
      "Low": "Faible",
      "Assign to Supervisor": "Assigner au Superviseur",
      "Add Subtask": "Ajouter une Sous-tâche",
      "Mark as Complete": "Marquer comme Terminé",
      "Mark as Pending": "Marquer comme En Attente",

      // Settings
      "Profile": "Profil",
      "Notifications": "Notifications",
      "Privacy": "Confidentialité",
      "Appearance": "Apparence",
      "Theme": "Thème",
      "Language": "Langue",
      "Light": "Clair",
      "Dark": "Sombre",
      "System": "Système",
      "English": "Anglais",
      "Français": "Français",
      "Bio": "Biographie",
      "Tell us about yourself...": "Parlez-nous de vous...",
      "Email Notifications": "Notifications par Email",
      "Receive updates via email": "Recevoir les mises à jour par email",
      "Push Notifications": "Notifications Push",
      "Get instant notifications": "Recevoir des notifications instantanées",
      "Task Reminders": "Rappels de Tâches",
      "Me rappeler des tâches dues": "Me rappeler des tâches dues",
      "Profile Visibility": "Visibilité du Profil",
      "Public": "Public",
      "Friends Only": "Amis Uniquement",
      "Private": "Privé",
      "Data Sharing": "Partage de Données",
      "Allow anonymous usage data": "Autoriser les données d'utilisation anonymes",
      "Save Changes": "Sauvegarder les Modifications",
      "Settings saved successfully!": "Paramètres sauvegardés avec succès !",

      // Supervisor
      "Assigned Tasks": "Tâches Assignées",
      "No assigned tasks": "Aucune tâche assignée",
      "You don't have any assigned tasks yet.": "Vous n'avez encore aucune tâche assignée.",
      "View Details": "Voir les Détails",
      "Comment": "Commenter",
      "Add a comment...": "Ajouter un commentaire...",
      "Comments": "Commentaires",
      "No comments yet. Be the first to add one!": "Aucun commentaire pour le moment. Soyez le premier à en ajouter un !",

      // Home
      "Welcome to UpTrack": "Bienvenue sur UpTrack",
      "Your Personal Todo Manager": "Votre Gestionnaire de Tâches Personnel",
      "Get Started": "Commencer",
      "Features": "Fonctionnalités",
      "Manage your tasks efficiently": "Gérez vos tâches efficacement",
      "Collaborate with your team": "Collaborez avec votre équipe",
      "Track your progress": "Suivez vos progrès",

      // Errors
      "Failed to load data": "Échec du chargement des données",
      "Failed to save changes": "Échec de la sauvegarde des modifications",
      "Please try again": "Veuillez réessayer"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
