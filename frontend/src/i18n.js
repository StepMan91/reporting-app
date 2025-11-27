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
            "sign_in_to_continue": "Sign in to continue reporting",
            "no_account": "Don't have an account?",
            "dont_have_account": "Don't have an account?",
            "register_here": "Register here",
            "already_have_account": "Already have an account?",
            "sign_in_here": "Sign In here",
            "zen_mode": "Zen Mode",
            "language": "Language",
            "passwords_do_not_match": "Passwords do not match",
            "invalid_credentials": "Invalid email or password",
            "sign_up": "Sign Up",
            "sign_in": "Sign In",
            "welcome_user": "Welcome, {{name}}",
            "dashboard_subtitle": "What would you like to do today?",
            "create_new_report": "Create New Report",
            "start_report": "Start Report",
            "view_history": "View History",
            "view_reports": "View Reports",
            "contact_support": "Contact Support",
            "contact_us": "Contact Us",
            "registration_successful": "Registration Successful",
            "account_created_success": "Your account has been created successfully. You can now log in.",
            "continue": "Continue",
            "join_us_today": "Join us today to start reporting",
            "email_address": "Email Address",
            "confirm_password": "Confirm Password"
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
            "sign_in_to_continue": "Connectez-vous pour continuer",
            "no_account": "Pas encore de compte ?",
            "dont_have_account": "Pas encore de compte ?",
            "register_here": "S'inscrire ici",
            "already_have_account": "Déjà un compte ?",
            "sign_in_here": "Se connecter ici",
            "zen_mode": "Mode Zen",
            "language": "Langue",
            "passwords_do_not_match": "Les mots de passe ne correspondent pas",
            "invalid_credentials": "Email ou mot de passe incorrect",
            "sign_up": "S'inscrire",
            "sign_in": "Se connecter",
            "welcome_user": "Bienvenue, {{name}}",
            "dashboard_subtitle": "Que souhaitez-vous faire aujourd'hui ?",
            "create_new_report": "Nouveau Rapport",
            "start_report": "Commencer",
            "view_history": "Historique",
            "view_reports": "Voir les rapports",
            "contact_support": "Support",
            "contact_us": "Nous contacter",
            "registration_successful": "Inscription réussie",
            "account_created_success": "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
            "continue": "Continuer",
            "join_us_today": "Rejoignez-nous pour commencer",
            "email_address": "Adresse Email",
            "confirm_password": "Confirmer le mot de passe"
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
