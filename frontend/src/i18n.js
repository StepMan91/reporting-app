import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            "welcome": "Welcome",
            "login": "Sign In",
            "register": "Register",
            "logout": "Logout",
            "email": "Email",
            "password": "Password",
            "create_account": "Create Account",
            "dashboard": "Dashboard",
            "reports": "Reports",
            "create_report": "Create Report",
            "contact": "Contact",
            "loading": "Loading...",
            "success": "Success",
            "error": "Error",
            "welcome_back": "Welcome Back",
            "sign_in_text": "Sign in to continue reporting",
            "no_account": "Don't have an account?",
            "register_here": "Register here",
            "already_have_account": "Already have an account?",
            "sign_in_here": "Sign In here",
            "zen_mode": "Zen Mode",
            "language": "Language"
        }
    },
    fr: {
        translation: {
            "welcome": "Bienvenue",
            "login": "Connexion",
            "register": "S'inscrire",
            "logout": "Déconnexion",
            "email": "Email",
            "password": "Mot de passe",
            "create_account": "Créer un compte",
            "dashboard": "Tableau de bord",
            "reports": "Rapports",
            "create_report": "Créer un rapport",
            "contact": "Contact",
            "loading": "Chargement...",
            "success": "Succès",
            "error": "Erreur",
            "welcome_back": "Bon retour",
            "sign_in_text": "Connectez-vous pour continuer",
            "no_account": "Pas encore de compte ?",
            "register_here": "S'inscrire ici",
            "already_have_account": "Déjà un compte ?",
            "sign_in_here": "Se connecter ici",
            "zen_mode": "Mode Zen",
            "language": "Langue"
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en", // default language
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;
