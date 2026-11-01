// Public API address only. SMTP credentials belong in the backend's hosting secrets.
export const CONTACT_API_URL = import.meta.env.DEV
  ? "/api/contact"
  : "https://veshwikjain-contact.embarko.app/api/contact";
