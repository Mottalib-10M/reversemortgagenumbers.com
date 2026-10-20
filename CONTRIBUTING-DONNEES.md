# Données de Reverse Mortgage Math (us-reverse-mortgage) : d'où elles viennent, comment les refaire

Toutes les valeurs affichées sortent de deux fichiers de `src/data/`. Rien n'est saisi à la main dans le code ni dans
les pages (`CONTRIBUTING-PAGES.md`).

| Fichier | Contenu | Source |
|---|---|---|
| `plf.json` | table des facteurs de limite de principal (PLF) : 82 âges (18 à 99) × 128 taux attendus (3 % à 18,875 % par 1/8), en millièmes | HUD, `FY 2018 PLF Tables-Rvsd Introduction.xls`, feuille « Consolidated Table », liée sous « Principal Limit Factors » sur hud.gov/hud-partners/single-family-lender ; copie dans `research/sources/hud-plf-fy2018.xls` |
| `params-2026.json` | plafond du MCA, MIP, règle d'origination, limite de 1re année, LESA (facteur 1,2, table de vie de Reg Z), frais de gestion, tenure, refinancement, CMT 10 ans et 1 an de la semaine, marge d'exemple, audit OIG, sources | à la main, chaque valeur avec sa clé de source, relue le 2026-10-20 |

Textes officiels extraits : `research/sources/` (Handbook 4000.1 Update 18 pages HECM, 24 CFR 206, fiche de paiement HUD,
ML 2017-12, ML 2025-22, ML 2014-21, aide du calculateur HUD, Reg Z appendice L, IRS Pub 936, SSA POMS, audit OIG, courbe
des taux du Trésor 2026).

Après toute mise à jour : `npx vitest run` (valeurs de contrôle de la table, règle d'origination, exemples du Handbook,
lignes de la fiche HUD), puis `npm run build` et les contrôles de la recette.

## Chaque semaine (facultatif) : taux du Trésor

`rates.cmt10Week` et `rates.cmt1Week` = moyennes des taux « par » quotidiens 10 ans et 1 an de la dernière semaine
complète (courbe du Trésor, `home.treasury.gov`, CSV de l'année), `cmt10WeekEnding` = vendredi de cette semaine. Les
défauts des calculateurs (`K.EXP`, `K.NOTE`) et les textes suivent seuls.

## En décembre 2026 : plafond 2027

HUD publie le plafond HECM de l'année par Mortgagee Letter (pour 2026 : ML 2025-22, du 11 décembre 2025, 150 % de la
limite conforme de Freddie Mac). Le jour de la lettre :

1. Créer `params-2027.json` à partir de celui-ci : `limits.mca2027` (ou renommer `mca2026` et adapter les imports),
   `limits.letter`, `letterDate`, `caseNumbersFrom` / `To`, `conforming2027`, et `next` pour 2028 (`status: "pending"`).
2. Ajouter la clé de source de la nouvelle lettre.
3. `grep -rn "2026" src/content src/components src/pages` : titres, descriptions et textes qui nomment l'année.
4. `npx vitest run`, build, contrôles, commit.

## Si HUD remplace la table PLF

Une nouvelle Mortgagee Letter l'annonce, avec une date de numéro de dossier. Télécharger le nouveau classeur, refaire
`plf.json` (même forme : `rates`, `ages`, `url`, `effective`), mettre à jour `plf.effective`, `plf.letter` et les valeurs
de contrôle de `tests/engine.test.ts` (lues dans le nouveau classeur), puis relire les pages qui citent la table de 2017.
