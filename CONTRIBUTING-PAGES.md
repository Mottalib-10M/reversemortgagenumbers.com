# Écrire ou étoffer une page de Reverse Mortgage Math (us-reverse-mortgage)

Notice pour les agents qui écrivent les pages. À lire en entier avant d'écrire, avec
`~/Documents/GitHub/RECETTE-SITE.md` (§0, §5, §6, §6.5, §7, §9.3, §11, §17.4, §21, §26).

**Le site** : le reverse mortgage américain assuré par la FHA (HECM, Home Equity Conversion Mortgage), calculé à partir
de la table des facteurs de limite de principal (PLF) publiée par HUD, ligne par ligne comme la fiche de paiement HUD
(« HECM Adjustable Rate Payment Plan », Exhibit 1) : plafond 2026, MIP 2 % et 0,5 %, frais d'origination plafonnés,
dettes soldées, set-aside LESA, limite de la 1re année, ligne de crédit qui croît, solde dans le temps, paiements
mensuels, règle des 95 % pour les héritiers, HECM for Purchase, refinancement. **Anglais américain seul**, sous `/en/`.
Éditeur : la société **Radif Partners** (jamais un nom de personne). Nom : « Reverse Mortgage Math ».

**L'angle (phrase de valeur ajoutée)** : les calculateurs des prêteurs demandent nom, adresse et téléphone avant
l'estimation (longbridge-financial.com) ou donnent un montant sans aucun coût (lendingtree.com) ; l'outil de HUD porte
encore « FY 2018 » et un formulaire de professionnel. Nous publions la table PLF de HUD et chaque ligne de la fiche de
paiement, sans coordonnées. Rapport SERP : `~/Documents/GitHub/reports/us-reverse-mortgage-serp-2026-10-20.md`.

## Interdits

- Jamais se présenter comme HUD, la FHA ou un prêteur ; jamais « official calculator », « HUD calculator » pour parler du
  nôtre, ni « HUD-backed ». Aucun lien vers un prêteur, un courtier, un comparateur (longbridge, AAG, Mutual of Omaha,
  Finance of America, lendingtree, nerdwallet, bankrate…), aucun formulaire, aucun « get a quote », « call », « speak to a
  specialist ». Aucun conseil personnel (« you should take a HECM ») ni promesse. Liens externes : seulement des sources
  officielles (`.gov`), par `h.src(clé)` ou `h.ext(url, texte)` pour une URL officielle **que tu as lue** (à signaler).
- Aucun lien ni copie vers un site du portefeuille (`~/Documents/GitHub/_trame/domaines-ovh.txt`), en particulier ne pas
  traiter les coûts du logement par État ni les plafonds de retraite (sujets d'autres sites).
- **Un chiffre incertain ne se publie pas.** Tout chiffre vient du kit (`K.…`) ou d'un calcul du moteur. Pas de taux de
  prêteur, de marge « typique », de frais de clôture « moyens », de nombre de prêts, de part de marché : rien de cela
  n'est dans le kit. La marge de 1,5 point est **un exemple** et doit être dite comme telle (« an example margin of … »).
  Le plafond 2027 n'est pas publié : il s'écrit « not published yet, expected in December 2026 » (`K.P.limits.next`).
- Dates écrites en toutes lettres (`K.day('2026-10-16')` → « October 16, 2026 »), jamais 2026-10-16 dans le texte.

## D'où viennent les chiffres

| Donnée | Source | Fichier |
|---|---|---|
| Table PLF (âges 18 à 99 × taux attendus 3 % à 18,875 % par 1/8) | HUD, `FY 2018 PLF Tables-Rvsd`, en vigueur depuis le 2 octobre 2017 (ML 2017-12) | `src/data/plf.json` |
| Plafond 2026 (1 249 125 $ = 150 % de 832 750 $), 2025, 2027 à venir | Mortgagee Letter 2025-22 | `src/data/params-2026.json` (`limits`) |
| MIP 2 % / 0,5 %, limite de la 1re année 60 % / +10 %, LESA (1,2, table de vie), frais de gestion 30 / 35 $ | HUD Handbook 4000.1 (Update 18), formulaire HUD Exhibit 1, Reg Z App. L | `params-2026.json` |
| Origination : max(2 500 $, 2 % des 200 000 premiers $ + 1 % au-delà), plafond 6 000 $ | 24 CFR 206.31(a)(1) | `params-2026.json` (`origination`) |
| Âge 62, 95 % pour les héritiers, tenure à 100 − min(âge, 95) | 24 CFR 206.33, 206.125, 206.25(f) | `params-2026.json` |
| CMT 10 ans 5,15 % (semaine close le 16 octobre 2026), CMT 1 an 4,49 % | Trésor américain, courbe des taux par | `params-2026.json` (`rates`) |
| Audit LESA (1 237 emprunteurs, perte projetée 258 M$, tables 1979-81) | HUD OIG 2026-KC-0003, mai 2026 | `params-2026.json` (`oig`) |

Textes officiels extraits, à lire avant d'écrire une règle : `research/sources/*.txt` (Handbook 4000.1 pages HECM, 24 CFR
206, fiche de paiement HUD, ML 2017-12, ML 2025-22, ML 2014-21, aide du calculateur HUD, IRS Pub 936, SSA POMS
SI 01120.220, audit OIG, Reg Z appendice L).

## Les fichiers d'une page

| Page | Fichier | Route |
|---|---|---|
| Sujet + calculateur | `src/content/guides/<id>.ts` (`defineGuide`) | `/en/<slug>/` |
| Accueil | `src/content/home.ts` | `/en/` |

Pages prévues : `src/lib/planned.ts`. **Modèle (copier la structure, jamais les phrases)** :
`src/content/guides/principal-limit-factor.ts`.

Le gabarit affiche seul : H1, `intro`, le calculateur (`tool`, réglé par `toolArg`), le chapeau replié (`resume`), le corps
(`body`), la FAQ, les pages liées, les sources.

### Champs

| Champ | Règle |
|---|---|
| `title` | **50 à 60 caractères**, contient **2026**, **terme-clé en tête puis le pays** (« Reverse Mortgage at 70 in 2026: Amount and Costs, US »). Jamais How/What/When/Is/Can ni « US »/« Calculator » en tête ; pas de tiret cadratin ni demi-cadratin ; unique. Une espace insécable compte pour un caractère |
| `description` | **150 à 160 caractères**, contient 2026, un chiffre du kit, unique |
| `intro` | une phrase propre à la page |
| `resume` | **UN** paragraphe de 120 mots ou plus (viser 130 à 170) : la réponse, chiffres compris ; la première phrase porte le message |
| `body(h)` | HTML (`h2`, `h3`, `p`, `ul`, `h.table`). ≥ 650 mots de prose hors tableaux (viser 750 à 1 000) |
| `faqs` | 3 à 6 vraies questions, réponses **40 à 90 mots** ; **une question n'existe qu'une fois sur tout le site** (voir la FAQ de l'accueil dans `home.ts`) |
| `related` | 3 à 6 ids de `planned.ts` |
| `sources` | ≥ 2 clés de `params-2026.json > sources` |
| `tool` | une clé de `src/lib/tool-specs.ts` (voir ci-dessous) |
| `toolArg` | valeurs par défaut pour cette page (ids des champs), ex. `{ age: 75 }`, `{ value: 750000, liens: 200000 }` |

### Calculateurs (`tool`) et leurs champs

| Clé | Rôle | Champs (id) |
|---|---|---|
| `hecm` | complet : toutes les lignes de la fiche HUD + tableau solde / ligne de crédit sur 30 ans | `age`, `value`, `liens`, `rt` ('arm' / 'fixed'), `margin`, `fr` (taux fixe), `plan` ('loc' / 'max' / 'tenure'), `orig` ('max' / 'none'), `cc` (autres frais), `c10`, `c1`, `lesa` ('none' / 'full' / 'partial'), `tax` (taxes + assurance par an), `mris`, `fee` |
| `plf` | facteur de la table HUD et principal limit, avec les cases voisines | `age`, `value`, `rt`, `margin`, `fr`, `c10` |
| `lesa` | set-aside taxes et assurance | `age`, `tax`, `value`, `rt`, `margin`, `fr`, `lesa` ('full' / 'partial'), `mris`, `c10`, `c1` |
| `origination` | plafond des frais d'origination | `value` |
| `mip` | MIP initial et annuel en dollars | `value`, `bal`, `yrs`, `nr` |
| `firstyear` | limite de la 1re année (lignes 17 à 21) | `age`, `value`, `liens`, `rt`, `margin`, `fr`, `orig`, `cc`, `c10` |
| `loc` | croissance d'une ligne de crédit inutilisée | `amt`, `nr` |
| `balance` | solde d'une somme empruntée dans le temps | `amt`, `nr`, `yrs` |
| `payments` | paiements mensuels tenure ou term | `age`, `value`, `liens`, `pt` ('tenure' / 'term'), `term`, `margin`, `c10`, `c1`, `orig`, `cc` |
| `heirs` | règle des 95 % | `bal`, `value` |
| `purchase` | HECM for Purchase : apport | `age`, `price`, `value`, `rt`, `margin`, `fr`, `orig`, `cc`, `c10`, `c1` |
| `refi` | refinancement HECM vers HECM | `age`, `value`, `ob`, `om`, `opl`, `or`, `rt`, `margin`, `fr`, `orig`, `cc`, `c10`, `c1` |

## Le kit (règle des chiffres)

```ts
import { KIT as K } from '../../lib/kit';
K.P                         // params-2026.json : K.P.limits.mca2026, K.P.mip.upfront, K.P.origination.cap, K.P.firstYear.base, K.P.rates.cmt10Week, K.P.lesa.lifeExpectancy['74']…
K.EXP, K.NOTE               // taux attendu par défaut (CMT 10 ans + marge d'exemple) = 6.65, taux de la note (CMT 1 an + marge) = 5.99
K.loan({ age: 75, value: 300000, liens: 50000 })   // moteur HECM sur les défauts (70 ans, 400 000 $, ajustable) :
                            // { factor, ageT, rateT, mca, capped, pl, imip, origination, originationCap, lesa, lesaYear1, lesaAfter, sfsa,
                            //   mo, financed, l17, l18, l19, l20, idl, extra10, firstYearCash, npl, laterCash, forfeited, shortfall, tenure, tenureMonths }
K.loan({ fixed: true })     // taux fixe : expected = note = K.EXP ; firstYearCash = lump sum, forfeited = perdu
K.loan({ lesa: 'full', charges: 6000 })            // avec LESA
K.project({ age: 75 }, 30)  // [{ year, age, balance, credit, lesa, limit }] fin de chaque année
K.tool('payments', { age: 80 })  // résultat d'un calculateur { label, value, sub, rows, table?, note? }
K.plf(age, rate%) → facteur ; K.rateT(6.65) → 6.625 ; K.mca(value) ; K.orig(mca) ; K.imip(mca)
K.lesa(chargesAnnuelles, age, rate%) ; K.talc(age) → années ; K.sfsa(fee, age, note%)
K.credit(montant, note%, mois) ; K.balance(montant, note%, mois) → { balance, interest, mip }
K.heirs(solde, valeur) → { payoff, floor, nonRecourse } ; K.pay(montant, mois, rate%) ; K.tenureMonths(age) ; K.refi(mcaNew, mcaOld, oldRate)
K.usd(x) "$1,234" · K.usd2 · K.pct(0.02) "2 %" (décimal) · K.pct(x, 1) · K.pp(6.65) "6.65 %" (déjà en %) · K.pp(x, 2) · K.f(0.386) "0.386" · K.num · K.dec(x, d) · K.day('2026-10-16')
```

Dans `body(h)` : tout le kit, plus `h.a(id, texte)` (lien interne ; id inconnu = test en échec, sauf id prévu dans
`planned.ts`), `h.table(entêtes, lignes, légende, alignements)`, `h.src(clé, texte)`, `h.ext(url, texte)`, `h.box(titre, html)`,
`h.mini(kind, { t: 'titre', p: ['ids des champs montrés'], d: { valeurs par défaut } })`.

**Mini-simulateurs (RECETTE §9.3)** : 1 à 3 par page, **au moins un**, sur le sujet du paragraphe qui précède, 1 ou 2 champs
montrés, valeurs propres à la page. Jamais le même mini avec les mêmes valeurs qu'une autre page.

## Ton et unicité

- Anglais américain, voix humaine, phrases de longueur variable, **le chiffre d'abord**. Lecteur : un propriétaire de 62
  ans et plus, souvent retraité, ou son enfant adulte qui l'aide ; il veut savoir combien, ce que ça coûte, ce qu'il
  risque, sans être rappelé par un vendeur. Expliquer chaque sigle à sa première apparition (HECM, MIP, PLF, MCA, LESA,
  CMT, NBS).
- Interdits (le test les refuse) : tirets cadratin et demi-cadratin, « it's important to note », « dive into », « delve »,
  « whether you're », « navigate the », « Moreover », « Additionally », « Furthermore », « game changer », « unlock »,
  « guaranteed », « call us », « get a quote », « speak to a specialist ». Pas de triplets en série, pas de conclusion qui
  résume, pas d'émoji.
- **Pourcentages** : `K.pct` / `K.pp`, ou à la main avec une espace : `60 %` (l'insécable est posée au build). Jamais `60%`.
- **Unicité** (§6) : `check-unique` compare toutes les pages (texte hors tableaux et calculateurs, chiffres neutralisés,
  seuil 30 %). Titres `h2`/`h3` propres, angle propre, exemples chiffrés propres à la page (âges, valeurs, dettes
  différents d'une page à l'autre). Ne jamais reprendre une phrase d'une autre page.

## Contrôles

```bash
cd ~/Documents/GitHub/a-publier/Mottalib-10M/us-reverse-mortgage
PAGE_FILES=age-70,lesa npx vitest run tests/pages.test.ts   # tes pages
python3 scripts/sim-pages.py --only age-70,lesa             # similarité (après le test ci-dessus)
npx vitest run tests/engine.test.ts                         # moteur
```

Ne lance ni build, ni serveur, ni Playwright : le coordinateur s'en charge (5 sites se construisent en même temps).
