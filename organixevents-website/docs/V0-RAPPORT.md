# OrganixEvents — rapport de livraison V0

Date : 30 septembre 2026

## 1. URL de prévisualisation

- **Aperçu de relecture (artifact Claude, privé)** : version statique complète du site (EN/FR/DE), identique au build Netlify sauf les images (WebP seul) et le formulaire (non envoyé).
- **Netlify** : pas encore déployé. Deux étapes de votre côté :
  1. Relier GitHub à Claude (claude.ai → Settings → Connectors → GitHub) pour que je puisse pousser le code sur `OrganixEvents/organixevents-website` — ou pousser vous-même l'archive fournie (historique git inclus).
  2. Netlify → *Add new site* → *Import from GitHub* → choisir le repo. Tout est déjà configuré dans `netlify.toml` (aucun `npm install`). Activer la détection des formulaires et une notification e-mail pour le formulaire `enquiry`.
- Le site est en **noindex** partout tant que `SITE_INDEXABLE` n'est pas activé. Le domaine organixevents.com n'est pas touché, Squarespace non plus.

## 2. Structure du repository

```
netlify.toml              configuration Netlify
scripts/build.mjs         générateur du site (routes, langues, SEO, sitemap, en-têtes)
scripts/images.py         génération des images responsives (AVIF + WebP)
scripts/serve.mjs         serveur local
source-media/             photos originales (media pack)
public/brand/             logo, symbole X (vectoriels), favicon, image de partage
public/media/             images générées
src/content/site.json     contact, langues, navigation, partenaires
src/content/experiences/  une fiche JSON par expérience (modèle de données)
src/content/pages/        textes des pages par langue (home.en.json, …)
src/content/inspirations.json   inspirations Custom (non réservables)
src/i18n/                 textes d'interface EN / FR / DE
src/templates/            gabarits des pages
src/assets/               CSS + JS
docs/CONTENT-GUIDE.md     comment modifier dates, prix, images, statuts, langues
```

Pages générées pour chaque langue : Home, North Macedonia, Winter (+ Georgia, Norway, The Alps), Summer (+ Youth Camps, Portugal Wake, Summer Adventures), Custom, About, Partners, Enquire (+ page de remerciement), 404.

## 3. Assets manquants (placeholders visibles sur le site)

| Asset | Où | Statut |
|---|---|---|
| Logos officiels des partenaires (Julbo, Blizzard, SwissForce, Nidecker) | Home, About, Partners | nom en texte + mention « logo à venir » |
| Photos de Bryan et Stéphane | About | placeholder |
| Photos de Géorgie (Bakhmaro) | Winter, Georgia | placeholder |
| Photos du Portugal (spot de wake, maison) | Portugal Wake | photos de wake utilisées, lieu probablement suisse (à remplacer) |
| Photos des camps jeunes (Lac de Joux / Léman) | Youth Camps | photo de SUP utilisée, à confirmer |
| Photo paysage haute définition du snowcat (≥ 2400 px de large) | Hero Home, North Macedonia | photo de crête utilisée sur desktop, snowcat sur mobile |
| Polices officielles | global | le brandbook n'est pas lisible ici (71 Mo) ; Montserrat utilisée d'après les mockups — à confirmer |
| Photos pour les inspirations Custom (Groenland, Japon…) | Custom | cartes typographiques volontairement sans photo (pas de stock générique) |
| Instagram / réseaux sociaux | footer | aucun lien ajouté |

Logo et symbole X : extraits en vectoriel depuis `ORGANIX LOGO.pdf` (Drive), sans modification.

## 4. Contenus à confirmer

**Macédoine du Nord (prioritaire)**
1. **Encadrement** : le brief dit « 1 guide local certifié UIAGM + 1 membre du staff ». La brochure 2027 indique « 2 guides certifiés + 1 chauffeur » et présente le guide local comme **UIMLA** (accompagnateur en montagne, pas guide UIAGM). Le site suit le brief (« guide local certifié UIAGM ») : merci de confirmer la certification exacte avant la mise en ligne.
2. **Prix** : CHF 2 250 est présenté comme la base pour 8 personnes (brief). Dans la brochure 2027, CHF 2 250 correspond à 11–12 participants et 8 participants = CHF 2 500.
3. **Wild Tracks** : la brochure présente l'offre comme « Organixevents et Wild Tracks ». Le brief n'en parle pas : non mentionné sur le site.
4. Éléments repris de la brochure : hôtel familial au-dessus de Popova Shapka avec départ du snowcat depuis la porte, sauna, pension complète, transferts aéroport inclus, arrivée/départ par Skopje, matériel avalanche obligatoire, montagnes du Šar. Le nom de l'hôtel (Bora) n'est pas affiché.
5. **Semaine type** et **journée type** : présentées explicitement comme exemples, reformulées à partir de la brochure.
6. Photos du dossier Macédoine dont le lieu est à vérifier : `nm-dusk` (coucher de soleil rose sur chaîne dentelée avec pylône) et `nm-village` (village de chalets, utilisé pour « Hébergement »).

**Autres**
7. Géorgie : dates « 9–16 janvier 2027 », taille de groupe (8–10), hébergement en pension complète — issues de la brochure.
8. Stéphane : nom de famille non affiché (Pfeuti d'après une brochure). Qualifications non inventées.
9. Coordonnées (téléphone, e-mail gmail, adresse au Sentier) : reprises des brochures.
10. Photo hélicoptère (Alpes) : marque « Air-Glaciers » visible. Retirée des sections Custom, conservée dans la galerie Alpes (l'héliski en Suisse fait partie de l'offre).
11. Textes d'interface FR / DE (menus, boutons, formulaire) : rédigés par moi, à relire par une personne de langue maternelle. Les pages elles-mêmes sont en anglais uniquement (voir point 5.3).

## 5. Décisions techniques différentes du brief ou implicites

1. **Pas de Next.js / framework** : l'environnement de build n'avait pas accès au registre npm. Plutôt que du code Next.js impossible à tester, le site est un générateur statique en Node pur (zéro dépendance). Conséquences : build Netlify sans `npm install`, HTML pré-rendu, très bonnes Core Web Vitals. Le contenu étant en JSON structuré, une migration vers Next.js + Sanity reste simple si besoin.
2. **Contenu en fichiers JSON** plutôt qu'un CMS (validé avec vous) : chaque expérience peut être ajoutée, masquée (`status: hidden`), redatée, repricée ou changer d'image sans toucher au design.
3. **Langues** : `/en/`, `/fr/`, `/de/` existent partout. Une page non traduite affiche l'anglais avec un bandeau, est en `noindex` et pointe (canonical) vers la version anglaise. Aucune traduction automatique visible. Le hreflang et le sitemap n'incluent que les versions réellement traduites. La racine `/` redirige vers `/en/` ; la détection FR/DE s'active dès que les traductions existent.
4. **Formulaire** : Netlify Forms (pas de backend). Pas de budget demandé. Champs conditionnels selon l'intérêt choisi ; pré-sélection via les boutons des pages (ex. « Plan your Norway trip » coche Winter + Norway).
5. **Analytics** : aucun outil chargé ; les événements `enquiry_started`, `enquiry_submitted`, `north_macedonia_enquiry`, `winter_enquiry`, `summer_enquiry`, `custom_enquiry` sont poussés dans `window.dataLayer`, prêts pour GA4 / Plausible / GTM.
6. **Mockups** : le symbole X officiel sert de masque photo (comme sur le billboard) ; palette tirée du fichier logo (violet #5E5DB4, lavande #BEB5E1, menthe #BEE8CB, encre #231F20).
