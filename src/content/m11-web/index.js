import { defineModule } from "../i18n.js";
import exercises from "./exercises.js";
import exercisesEn from "./exercises.en.js";
import httpFr from "./01-http.md?raw";
import httpEn from "./01-http.en.md?raw";
import urlFr from "./02-url.md?raw";
import urlEn from "./02-url.en.md?raw";
import requestsFr from "./03-requests.md?raw";
import requestsEn from "./03-requests.en.md?raw";
import flaskFr from "./04-flask.md?raw";
import flaskEn from "./04-flask.en.md?raw";

export default defineModule(
  {
    id: "m11",
    number: 11,
    session: 8,
    title: { fr: "Applications web", en: "Web applications" },
    shortTitle: { fr: "Applications web", en: "Web applications" },
    description: {
      fr: "Séance 8 : clients et serveurs, vie d'une requête HTTP (IP, DNS, ports, TCP), anatomie d'une URL, requêtes avec requests, serveur web Flask (routes, gabarits, formulaires, JSON) et le distributeur en ligne.",
      en: "Session 8: clients and servers, life of an HTTP request (IP, DNS, ports, TCP), anatomy of a URL, requests with requests, Flask web server (routes, templates, forms, JSON) and the online vending machine.",
    },
    lessons: [
      {
        id: "m11-l1",
        number: "11.1",
        title: { fr: "Clients, serveurs et HTTP", en: "Clients, servers and HTTP" },
        duration: "35 min",
        objectives: {
          fr: [
            "Suivre la vie d'une requête HTTP",
            "Connaître IP, DNS, ports et codes de statut",
            "Lire et écrire requêtes et réponses HTTP",
            "Sérialiser les données d'une API en JSON",
          ],
          en: [
            "Follow the life of an HTTP request",
            "Know IP, DNS, ports and status codes",
            "Read and write HTTP requests and responses",
            "Serialize API data as JSON",
          ],
        },
        theory: { fr: httpFr, en: httpEn },
      },
      {
        id: "m11-l2",
        number: "11.2",
        title: { fr: "Anatomie d'une URL", en: "Anatomy of a URL" },
        duration: "30 min",
        objectives: {
          fr: [
            "Nommer chaque partie d'une URL",
            "Connaître les ports par défaut",
            "Encoder et décoder une query",
            "Utiliser urllib.parse",
          ],
          en: [
            "Name every part of a URL",
            "Know the default ports",
            "Encode and decode a query",
            "Use urllib.parse",
          ],
        },
        theory: { fr: urlFr, en: urlEn },
      },
      {
        id: "m11-l3",
        number: "11.3",
        title: { fr: "Requêtes HTTP en Python", en: "HTTP requests in Python" },
        duration: "35 min",
        objectives: {
          fr: [
            "Envoyer des requêtes GET et POST",
            "Lire le statut, le texte et le JSON d'une réponse",
            "Gérer les erreurs avec raise_for_status",
            "Paginer et réessayer",
          ],
          en: [
            "Send GET and POST requests",
            "Read the status, text and JSON of a response",
            "Handle errors with raise_for_status",
            "Paginate and retry",
          ],
        },
        theory: { fr: requestsFr, en: requestsEn },
      },
      {
        id: "m11-l4",
        number: "11.4",
        title: { fr: "Un serveur web avec Flask", en: "A web server with Flask" },
        duration: "45 min",
        objectives: {
          fr: [
            "Définir des routes et des gestionnaires",
            "Utiliser des gabarits Jinja2",
            "Traiter formulaires, redirections et JSON",
            "Tester une application avec test_client",
          ],
          en: [
            "Define routes and handlers",
            "Use Jinja2 templates",
            "Handle forms, redirections and JSON",
            "Test an application with test_client",
          ],
        },
        theory: { fr: flaskFr, en: flaskEn },
      },
    ],
  },
  exercises,
  exercisesEn,
);
