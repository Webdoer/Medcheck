export type BannedLegalNote =
  | 'madras_stay'
  | 'cancer_pain_conditions'
  | 'delhi_hc_quashed_slp';

export interface BannedDrugEntry {
  srNo: number;
  name: string;
  notification: string;
  legalNote?: BannedLegalNote;
}

export const BANNED_DRUGS_SOURCE_TITLE =
  'Ministry of Health & Family Welfare — Drugs Prohibited under Section 26A of Drugs & Cosmetics Act, 1940 (Sr. No. 1–444)';

export const BANNED_DRUG_LEGAL_NOTES: Record<BannedLegalNote, string> = {
  madras_stay:
    '* Presently stayed by the Hon’ble High Court of Madras.',
  cancer_pain_conditions:
    '** Prohibition was revoked with conditions vide G.S.R. No. 367(E) dated 13.04.2017: labeled "Use of drug for cancer pain only" and daily administered dose shall not exceed 300 mg per day.',
  delhi_hc_quashed_slp:
    '*** Notifications S.O. 705(E) to 1048(E) dated 10.03.2016 were quashed by Hon’ble Delhi High Court (01.12.2016); Union of India challenged via SLP before the Supreme Court.',
};

const SO_2016 = (soNum: number): string => `S.O. ${soNum}(E) Dated 10.03.2016`;

export const BANNED_DRUGS: BannedDrugEntry[] = [
  { srNo: 1, name: 'Amidopyrine', notification: 'GSR NO. 578(E) Dated 23.07.1983' },
  { srNo: 2, name: 'Fixed dose combinations of vitamins with anti-inflammatory agents and tranquilizers', notification: 'GSR NO. 578(E) Dated 23.07.1983' },
  { srNo: 3, name: 'Fixed dose combinations of Atropine in Analgesics and Antipyretics', notification: 'GSR NO. 578(E) Dated 23.07.1983' },
  { srNo: 4, name: 'Fixed dose combinations of Strychnine and Caffeine in tonics', notification: 'GSR NO. 578(E) Dated 23.07.1983' },
  { srNo: 5, name: 'Fixed dose combinations of Yohimbine and Strychnine with Testosterone and Vitamins', notification: 'GSR NO. 578(E) Dated 23.07.1983' },
  { srNo: 6, name: 'Fixed dose combinations of Iron with Strychnine, Arsenic and Yohimbine', notification: 'GSR NO. 578(E) Dated 23.07.1983' },
  { srNo: 7, name: 'Fixed dose combinations of Sodium Bromide / Chloral hydrate with other drugs', notification: 'GSR NO. 578(E) Dated 23.07.1983' },
  { srNo: 8, name: 'Phenacetin', notification: 'GSR NO. 578(E) Dated 23.07.1983' },
  { srNo: 9, name: 'Fixed dose combinations of antihistaminic with anti-diarrhoeals', notification: 'GSR NO. 578(E) Dated 23.07.1983' },
  { srNo: 10, name: 'Fixed dose combinations of Penicillin with Sulphonamides', notification: 'GSR NO. 578(E) Dated 23.07.1983' },
  { srNo: 11, name: 'Fixed dose combinations of Vitamins with Analgesics', notification: 'GSR NO. 578(E) Dated 23.07.1983' },
  { srNo: 12, name: 'Fixed dose combinations of any other Tetracycline with Vitamin C', notification: 'GSR NO. 578(E) Dated 23.07.1983' },
  { srNo: 13, name: 'Fixed dose combinations of Hydroxyquinoline group of drugs with any other drug except for preparations meant for external use', notification: 'Substituted vide GSR NO. 793(E) Dated 13.12.1995' },
  { srNo: 14, name: 'Fixed dose combinations of Corticosteroids with any other drug for internal use except for preparations meant for meter dose inhalers and dry powder inhalers', notification: 'Substituted vide GSR NO. 738(E) Dated 09.10.2009' },
  { srNo: 15, name: 'Fixed dose combinations of Chloramphenicol with any other drug for internal use', notification: 'Substituted vide GSR NO. 1057(E) Dated 03.11.1988' },
  { srNo: 16, name: 'Fixed dose combinations of crude Ergot preparations except those containing Ergotamine, Caffeine, analgesics, antihistamines for the treatment of migraine, headaches', notification: 'Substituted vide GSR NO. 304(E) Dated 07.06.1991' },
  { srNo: 17, name: 'Fixed dose combinations of Vitamins with Anti TB drugs except combination of Isoniazid with Pyridoxine Hydrochloride (Vitamin B6)', notification: 'GSR NO. 578(E) Dated 23.07.1983' },
  { srNo: 18, name: 'Penicillin skin/eye Ointment', notification: 'GSR NO. 578(E) Dated 23.07.1983' },
  { srNo: 19, name: 'Tetracycline Liquid Oral preparations', notification: 'GSR NO. 578(E) Dated 23.07.1983' },
  { srNo: 20, name: 'Nialamide', notification: 'GSR NO. 578(E) Dated 23.07.1983' },
  { srNo: 21, name: 'Practolol', notification: 'GSR NO. 578(E) Dated 23.07.1983' },
  { srNo: 22, name: 'Methapyrilene, its salts', notification: 'GSR NO. 578(E) Dated 23.07.1983' },
  { srNo: 23, name: 'Methaqualone', notification: 'GSR NO. 49(E) Dated 31.01.1984' },
  { srNo: 24, name: 'Oxytetracycline Liquid Oral preparations', notification: 'GSR NO. 322(E) Dated 03.05.1984' },
  { srNo: 25, name: 'Demeclocycline Liquid Oral preparations', notification: 'GSR NO. 322(E) Dated 03.05.1984' },
  { srNo: 26, name: 'Combination of anabolic Steroids with other drugs', notification: 'GSR NO. 863(E) Dated 22.11.1985' },
  { srNo: 27, name: 'Fixed dose combination of Oestrogen and Progestin (other than oral contraceptive) containing per tablet Estrogen > 50 mcg (EthinylEstradiol) and > 3 mg (Norethisterone Acetate) and all FDC injectable preparations containing synthetic Oestrogen and Progesterone', notification: 'Substituted vide GSR NO. 743(E) Dated 10.08.1989' },
  { srNo: 28, name: 'Fixed dose combination of Sedatives / hypnotics / anxiolytics with analgesics-antipyretics', notification: 'GSR NO. 999(E) Dated 26.12.1990' },
  { srNo: 29, name: 'Fixed dose combination of Rifampicin, Isoniazid and Pyrazinamide, except those providing daily adult dose (Rifampicin 450–600 mg, Isoniazid 300–400 mg, Pyrazinamide 1000–1500 mg)', notification: 'Substituted vide GSR NO. 100(E) Dated 11.02.2003' },
  { srNo: 30, name: 'Fixed dose combination of Histamine H-2 receptor antagonists with antacids except for those combinations approved by Drugs Controller, India', notification: 'GSR NO. 999(E) Dated 26.12.1990' },
  { srNo: 31, name: 'Patent and proprietary medicines of fixed dose combinations of essential oils with alcohol > 20% proof except preparations given in the Indian Pharmacopoeia', notification: 'GSR NO. 999(E) Dated 26.12.1990' },
  { srNo: 32, name: 'All Pharmaceutical preparations containing Chloroform exceeding 0.5% w/w or v/v', notification: 'GSR NO. 999(E) Dated 26.12.1990' },
  { srNo: 33, name: 'Fixed dose combination of Ethambutol with INH other than INH/Ethambutol 200/600 mg or 300/800 mg', notification: 'GSR NO. 69(E) Dated 11.02.1991' },
  { srNo: 34, name: 'Fixed dose combination containing more than one antihistamine', notification: 'GSR NO. 69(E) Dated 11.02.1991' },
  { srNo: 35, name: 'Fixed dose combination of any anthelmintic with cathartic / purgative except for piperazine / Santonin', notification: 'GSR NO. 69(E) Dated 11.02.1991' },
  { srNo: 36, name: 'Fixed dose combination of Salbutamol or any other bronchodilator with centrally acting anti-tussive and/or antihistamine', notification: 'Substituted vide GSR NO. 290(E) Dated 16.04.2008' },
  { srNo: 37, name: 'Fixed dose combination of laxatives and/or anti-spasmodic drugs in enzyme preparations', notification: 'GSR NO. 69(E) Dated 11.02.1991' },
  { srNo: 38, name: 'Fixed dose combination of Metoclopramide with systemically absorbed drugs except FDC of metoclopramide with aspirin/paracetamol', notification: 'Substituted vide GSR NO. 603(E) Dated 24.08.2001' },
  { srNo: 39, name: 'Fixed dose combination of centrally acting antitussive with antihistamine, having high atropine like activity in expectorants', notification: 'GSR NO. 395(E) Dated 19.05.1999' },
  { srNo: 40, name: 'Preparations claiming to combat cough associated with asthma containing centrally acting antitussive and/or an antihistamine', notification: 'GSR NO. 395(E) Dated 19.05.1999' },
  { srNo: 41, name: 'Liquid oral tonic preparations containing glycerophosphates and/or other phosphates and/or central nervous system stimulant and containing alcohol more than 20% proof', notification: 'GSR NO. 395(E) Dated 19.05.1999' },
  { srNo: 42, name: 'Fixed dose combination containing Pectin and/or Kaolin with any drug which is systemically absorbed from GI tract', notification: 'GSR NO. 395(E) Dated 19.05.1999' },
  { srNo: 43, name: 'Chloral Hydrate as a drug', notification: 'GSR NO. 304(E) Dated 07.06.1991' },
  { srNo: 44, name: 'Dovers Powder I.P.', notification: 'GSR NO. 612(E) Dated 09.08.1994' },
  { srNo: 45, name: 'Dover’s Powder Tablets I.P.', notification: 'GSR NO. 612(E) Dated 09.08.1994' },
  { srNo: 46, name: 'Antidiarrhoeal formulations containing Kaolin or Pectin or Attapulgite or Activated Charcoal', notification: 'GSR NO. 731(E) Dated 30.09.1994' },
  { srNo: 47, name: 'Antidiarrhoeal formulations containing PhthalylSulphathiazole or Sulphaguanidine or SuccinylSulphathiazole', notification: 'GSR NO. 731(E) Dated 30.09.1994' },
  { srNo: 48, name: 'Antidiarrhoeal formulations containing Neomycin or Streptomycin or Dihydrostreptomycin including their respective salts or esters', notification: 'GSR NO. 731(E) Dated 30.09.1994' },
  { srNo: 49, name: 'Liquid Oral antidiarrhoeals or any other dosage form for pediatric use containing Diphenoxylate or Loperamide or Atropine or Belladonna or Hyoscyamine', notification: 'GSR NO. 731(E) Dated 30.09.1994' },
  { srNo: 50, name: 'Liquid Oral antidiarrhoeals or any other dosage form for pediatric use containing halogenated hydroxyquinolines', notification: 'GSR NO. 731(E) Dated 30.09.1994' },
  { srNo: 51, name: 'Fixed dose combination of antidiarrhoeals with electrolytes', notification: 'GSR NO. 731(E) Dated 30.09.1994' },
  { srNo: 52, name: 'Patent and Proprietary Oral Rehydration Salts (ORS) not conforming to specified WHO/CDSCO osmolarity, sodium, dextrose, or labelling parameters', notification: 'GSR NO. 57(E) Dated 07.02.1995' },
  { srNo: 53, name: 'Fixed dose combination of Oxyphenbutazone or Phenylbutazone with any other drug', notification: 'GSR NO. 633(E) Dated 13.09.1995' },
  { srNo: 54, name: 'Fixed dose combination of Analgin with any other drug', notification: 'GSR NO. 405(E) Dated 03.06.1996' },
  { srNo: 55, name: 'Fixed dose combination of dextropropoxyphene with any other drug other than anti-spasmodics and/or NSAIDs', notification: 'GSR NO. 633(E) Dated 13.09.1995' },
  { srNo: 56, name: 'Fixed dose combination of an allopathic drug (Second Schedule) with an Ayurvedic, Siddha or Unani drug', notification: 'GSR NO. 633(E) Dated 13.09.1995' },
  { srNo: 57, name: 'Mepacrine Hydrochloride (Quinacrine and its salts) in any dosage form for use for female sterilization or contraception', notification: 'GSR NO. 499(E) Dated 14.08.1998' },
  { srNo: 58, name: 'Fenfluramine', notification: 'GSR NO. 499(E) Dated 14.08.1998' },
  { srNo: 59, name: 'Dexfenfluramine', notification: 'GSR NO. 499(E) Dated 14.08.1998' },
  { srNo: 60, name: 'Fixed dose combination of Diazepam and Diphenhydramine Hydrochloride', notification: 'GSR NO. 169(E) Dated 12.03.2001' },
  { srNo: 61, name: 'Cosmetics licensed as toothpaste / tooth powder containing tobacco', notification: 'GSR NO. 444(E) Dated 30.04.1992' },
  { srNo: 62, name: 'Parenteral Preparations fixed combination of Streptomycin with Penicillin', notification: 'GSR NO. 93(E) Dated 25.02.1997' },
  { srNo: 63, name: 'Fixed dose combination of Vitamin B1, Vitamin B6 and Vitamin B12 for human use', notification: 'GSR NO. 702(E) Dated 14.10.1999' },
  { srNo: 64, name: 'Fixed dose combination of haemoglobin in any form (natural or synthetic)', notification: 'GSR NO. 814(E) Dated 16.12.1999' },
  { srNo: 65, name: 'Fixed dose combination of Pancreatin or Pancrelipase containing amylase, protease and lipase with any other enzyme', notification: 'GSR NO. 814(E) Dated 16.12.1999' },
  { srNo: 66, name: 'Fixed dose combination of Nitrofurantoin and Trimethoprim', notification: 'GSR NO. 170(E) Dated 12.03.2001' },
  { srNo: 67, name: 'Fixed dose combination of Phenobarbitone with any anti-asthmatic drugs', notification: 'GSR NO. 170(E) Dated 12.03.2001' },
  { srNo: 68, name: 'Fixed dose combination of Phenobarbitone with Hyoscin and/or Hyoscyamine', notification: 'GSR NO. 170(E) Dated 12.03.2001' },
  { srNo: 69, name: 'Fixed dose combination of Phenobarbitone with Ergotamine and/or Belladonna', notification: 'GSR NO. 170(E) Dated 12.03.2001' },
  { srNo: 70, name: 'Fixed dose combination of Haloperidol with any anti-cholinergic agent including Propantheline Bromide', notification: 'GSR NO. 170(E) Dated 12.03.2001' },
  { srNo: 71, name: 'Fixed dose combination of Nalidixic Acid with any anti-amoebic including Metronidazole', notification: 'GSR NO. 170(E) Dated 12.03.2001' },
  { srNo: 72, name: 'Fixed dose combination of Loperamide Hydrochloride with Furazolidone', notification: 'GSR NO. 170(E) Dated 12.03.2001' },
  { srNo: 73, name: 'Fixed dose combination of Cyproheptadine with Lysine or Peptone', notification: 'GSR NO. 170(E) Dated 12.03.2001' },
  { srNo: 74, name: 'Astemizole', notification: 'GSR NO. 191(E) Dated 05.03.2003' },
  { srNo: 75, name: 'Terfenadine (Terfinadine)', notification: 'GSR NO. 191(E) Dated 05.03.2003' },
  { srNo: 76, name: 'Phenformin', notification: 'GSR NO. 780(E) Dated 01.10.2003' },
  { srNo: 77, name: 'Rofecoxib and its formulations', notification: 'GSR NO. 810(E) Dated 13.12.2004' },
  { srNo: 78, name: 'Valdecoxib and its formulations', notification: 'GSR NO. 510(E) Dated 28.07.2005' },
  { srNo: 79, name: 'Diclofenac and its formulations (for animal use)', notification: 'GSR NO. 499(E) Dated 04.07.2008' },
  { srNo: 80, name: 'Rimonabant', notification: 'GSR NO. 884(E) Dated 11.12.2009' },
  { srNo: 81, name: 'Rosiglitazone', notification: 'GSR NO. 910(E) Dated 12.11.2010' },
  { srNo: 82, name: 'Nimesulide formulations for human use in children below 12 years of age', notification: 'GSR NO. 82(E) Dated 10.02.2011' },
  { srNo: 83, name: 'Cisapride and its formulations for human use', notification: 'GSR NO. 82(E) Dated 10.02.2011' },
  { srNo: 84, name: 'Phenylpropanolamine (Phenypropanolamine) and its formulations for human use', notification: 'GSR NO. 82(E) Dated 10.02.2011', legalNote: 'madras_stay' },
  { srNo: 85, name: 'Human Placental Extract and its formulations for human use except topical wound healing & injection for pelvic inflammatory disease', notification: 'Substituted vide GSR NO. 418(E) Dated 30.05.2011' },
  { srNo: 86, name: 'Sibutramine and its formulations for human use', notification: 'GSR NO. 82(E) Dated 10.02.2011' },
  { srNo: 87, name: 'R-Sibutramine and its formulations for human use', notification: 'GSR NO. 82(E) Dated 10.02.2011' },
  { srNo: 88, name: 'Gatifloxacin formulation for systemic use in human by any route including oral and injectable', notification: 'GSR NO. 218(E) Dated 16.03.2011' },
  { srNo: 89, name: 'Tegaserod and its formulations', notification: 'GSR NO. 218(E) Dated 16.03.2011' },
  { srNo: 90, name: 'Letrozole for induction of ovulation in anovulatory infertility', notification: 'GSR NO. 752(E) Dated 12.10.2011' },
  { srNo: 91, name: 'Serodiagnostic test kits for diagnosis of tuberculosis', notification: 'GSR 432(E) & 433(E) Dated 07.06.2012' },
  { srNo: 92, name: 'Dextropropoxyphene and formulations containing Dextropropoxyphene for human use', notification: 'G.S.R. 332(E) Dated 23.05.2013', legalNote: 'cancer_pain_conditions' },
  { srNo: 93, name: 'Fixed dose combination of Flupenthixol + Melitracen for human use', notification: 'G.S.R. 377(E) Dated 18.06.2013 & 498(E) Dated 11.07.2014' },
  { srNo: 94, name: 'Analgin and all formulations containing analgin for human use (Initial suspension revoked allowing conditional use)', notification: 'G.S.R. No. 378(E) Dated 18.06.2013; conditional G.S.R. 86(E) Dated 13.02.2014' },
  { srNo: 95, name: 'Pioglitazone and all formulations containing Pioglitazone for human use (Initial suspension revoked allowing conditional use)', notification: 'G.S.R. No. 379(E) Dated 18.06.2013; conditional G.S.R. 520(E) Dated 31.07.2013' },

  // S.O. 705(E) to S.O. 1048(E) Dated 10.03.2016 (Sr. No. 96 to 439)
  { srNo: 96, name: 'Aceclofenac + Paracetamol + Rabeprazole', notification: SO_2016(705), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 97, name: 'Nimesulide + Diclofenac', notification: SO_2016(706), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 98, name: 'Nimesulide + Cetirizine + Caffeine', notification: SO_2016(707), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 99, name: 'Nimesulide + Tizanidine', notification: SO_2016(708), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 100, name: 'Paracetamol + Cetirizine (Cetrizine) + Caffeine', notification: SO_2016(709), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 101, name: 'Diclofenac + Tramadol + Chlorzoxazone', notification: SO_2016(710), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 102, name: 'Dicyclomine + Paracetamol + Domperidone', notification: SO_2016(711), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 103, name: 'Nimesulide + Paracetamol dispersible tablets', notification: SO_2016(712), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 104, name: 'Paracetamol + Phenylephrine + Caffeine', notification: SO_2016(713), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 105, name: 'Diclofenac + Tramadol + Paracetamol', notification: SO_2016(714), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 106, name: 'Diclofenac + Paracetamol + Chlorzoxazone + Famotidine', notification: SO_2016(715), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 107, name: 'Naproxen + Paracetamol', notification: SO_2016(716), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 108, name: 'Nimesulide + Serratiopeptidase', notification: SO_2016(717), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 109, name: 'Paracetamol + Diclofenac + Famotidine', notification: SO_2016(718), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 110, name: 'Nimesulide + Pitofenone + Fenpiverinium + Benzyl alcohol', notification: SO_2016(719), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 111, name: 'Omeprazole + Paracetamol + Diclofenac', notification: SO_2016(720), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 112, name: 'Nimesulide + Paracetamol injection', notification: SO_2016(721), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 113, name: 'Tamsulosin + Diclofenac', notification: SO_2016(722), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 114, name: 'Paracetamol + Phenylephrine + Chlorpheniramine + Dextromethorphan + Caffeine', notification: SO_2016(723), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 115, name: 'Diclofenac + Zinc Carnosine', notification: SO_2016(724), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 116, name: 'Diclofenac + Paracetamol + Chlorpheniramine maleate + Magnesium trisilicate', notification: SO_2016(725), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 117, name: 'Paracetamol + Pseudoephedrine + Cetirizine (Cetrizine)', notification: SO_2016(726), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 118, name: 'Phenylbutazone + Sodium Salicylate', notification: SO_2016(727), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 119, name: 'Lornoxicam + Paracetamol + Trypsin', notification: SO_2016(728), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 120, name: 'Paracetamol + Mefenamic Acid + Ranitidine + Dicyclomine', notification: SO_2016(729), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 121, name: 'Nimesulide + Dicyclomine', notification: SO_2016(730), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 122, name: 'Heparin + Diclofenac', notification: SO_2016(731), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 123, name: 'Glucosamine + Methyl Sulfonyl Methane + Vitamin D3 + Manganese + Boron + Copper + Zinc', notification: SO_2016(732), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 124, name: 'Paracetamol + Tapentadol', notification: SO_2016(733), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 125, name: 'Tranexamic Acid + Proanthocyanidin', notification: SO_2016(734), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 126, name: 'Benzoxonium Chloride + Lidocaine', notification: SO_2016(735), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 127, name: 'Lornoxicam + Paracetamol + Tramadol', notification: SO_2016(736), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 128, name: 'Lornoxicam + Paracetamol + Serratiopeptidase', notification: SO_2016(737), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 129, name: 'Diclofenac + Paracetamol + Magnesium trisilicate', notification: SO_2016(738), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 130, name: 'Paracetamol + Domperidone + Caffeine', notification: SO_2016(739), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 131, name: 'Ammonium Chloride + Sodium Citrate + Chlorpheniramine Maleate + Menthol', notification: SO_2016(740), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 132, name: 'Paracetamol + Prochlorperazine Maleate', notification: SO_2016(741), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 133, name: 'Combikit of 3 tablets of Serratiopeptidase (enteric coated 20000 units) + Diclofenac Potassium & 2 tablets of Doxycycline', notification: SO_2016(742), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 134, name: 'Nimesulide + Paracetamol suspension', notification: SO_2016(743), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 135, name: 'Aceclofenac + Paracetamol + Famotidine', notification: SO_2016(744), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 136, name: 'Aceclofenac + Zinc Carnosine', notification: SO_2016(745), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 137, name: 'Paracetamol + Disodium Hydrogen Citrate + Caffeine', notification: SO_2016(746), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 138, name: 'Paracetamol + DL Methionine', notification: SO_2016(747), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 139, name: 'Disodium Hydrogen citrate + Paracetamol', notification: SO_2016(748), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 140, name: 'Paracetamol + Caffeine + Codeine Phosphate', notification: SO_2016(749), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 141, name: 'Aceclofenac (SR) + Paracetamol', notification: SO_2016(750), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 142, name: 'Diclofenac + Paracetamol injection', notification: SO_2016(751), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 143, name: 'Azithromycin + Cefixime', notification: SO_2016(752), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 144, name: 'Amoxicillin + Dicloxacillin', notification: SO_2016(753), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 145, name: 'Amoxicillin 250 mg + Potassium Clavulanate Diluted 62.5 mg', notification: SO_2016(754), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 146, name: 'Azithromycin + Levofloxacin', notification: SO_2016(755), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 147, name: 'Cefixime + Linezolid', notification: SO_2016(756), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 148, name: 'Amoxicillin + Cefixime + Potassium Clavulanic Acid', notification: SO_2016(757), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 149, name: 'Ofloxacin + Nitazoxanide', notification: SO_2016(758), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 150, name: 'Cefpodoxime Proxetil + Levofloxacin', notification: SO_2016(759), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 151, name: 'Combikit of Azithromycin dihydrate, Secnidazole and Fluconazole', notification: SO_2016(760), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 152, name: 'Levofloxacin + Ornidazole + Alpha Tocopherol Acetate', notification: SO_2016(761), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 153, name: 'Nimorazole + Ofloxacin', notification: SO_2016(762), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 154, name: 'Azithromycin + Ofloxacin', notification: SO_2016(763), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 155, name: 'Amoxicillin (Amoxycillin) + Tinidazole', notification: SO_2016(764), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 156, name: 'Doxycycline + Serratiopeptidase', notification: SO_2016(765), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 157, name: 'Cefixime + Levofloxacin', notification: SO_2016(766), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 158, name: 'Ofloxacin + Metronidazole + Zinc Acetate', notification: SO_2016(767), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 159, name: 'Diphenoxylate + Atropine + Furazolidone', notification: SO_2016(768), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 160, name: 'Combikit of Fluconazole Tablet, Azithromycin Tablet and Ornidazole Tablets', notification: SO_2016(769), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 161, name: 'Ciprofloxacin + Phenazopyridine', notification: SO_2016(770), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 162, name: 'Amoxicillin (Amoxycillin) + Dicloxacillin + Serratiopeptidase', notification: SO_2016(771), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 163, name: 'Azithromycin + Cefpodoxime', notification: SO_2016(772), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 164, name: 'Lignocaine (Lidocaine) + Clotrimazole + Ofloxacin + Beclomethasone', notification: SO_2016(773), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 165, name: 'Cefuroxime + Linezolid', notification: SO_2016(774), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 166, name: 'Ofloxacin + Ornidazole + Zinc bisglycinate', notification: SO_2016(775), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 167, name: 'Metronidazole + Norfloxacin', notification: SO_2016(776), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 168, name: 'Amoxicillin + Bromhexine', notification: SO_2016(777), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 169, name: 'Ciprofloxacin + Fluticasone + Clotrimazole + Neomycin', notification: SO_2016(778), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 170, name: 'Metronidazole + Tetracycline', notification: SO_2016(779), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 171, name: 'Cephalexin + Neomycin + Prednisolone', notification: SO_2016(780), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 172, name: 'Azithromycin + Ambroxol', notification: SO_2016(781), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 173, name: 'Cilnidipine + Metoprolol succinate + Metoprolol tartrate', notification: SO_2016(782), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 174, name: 'L-Arginine + Sildenafil', notification: SO_2016(783), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 175, name: 'Atorvastatin + Vitamin D3 + Folic Acid + Vitamin B12 + Pyridoxine', notification: SO_2016(784), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 176, name: 'Metformin + Atorvastatin', notification: SO_2016(785), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 177, name: 'Clindamycin + Telmisartan', notification: SO_2016(786), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 178, name: 'Olmesartan + Hydrochlorothiazide + Chlorthalidone', notification: SO_2016(787), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 179, name: 'L-5-Methyltetrahydrofolate calcium + Escitalopram', notification: SO_2016(788), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 180, name: 'Pholcodine + Promethazine', notification: SO_2016(789), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 181, name: 'Paracetamol + Promethazine', notification: SO_2016(790), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 182, name: 'Betahistine + Ginkgo Biloba Extract + Vinpocetine + Piracetam', notification: SO_2016(791), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 183, name: 'Cetirizine Dihydrochloride + Diethylcarbamazine', notification: SO_2016(792), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 184, name: 'Doxylamine + Pyridoxine + Mefenamic Acid + Paracetamol', notification: SO_2016(793), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 185, name: 'Drotaverine + Clidinium + Chlordiazepoxide', notification: SO_2016(794), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 186, name: 'Imipramine + Diazepam', notification: SO_2016(795), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 187, name: 'Flupentixol + Escitalopram', notification: SO_2016(796), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 188, name: 'Paracetamol + Prochlorperazine', notification: SO_2016(797), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 189, name: 'Gabapentin + Mecobalamin + Pyridoxine + Thiamine', notification: SO_2016(798), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 190, name: 'Imipramine + Chlordiazepoxide + Trifluoperazine + Trihexyphenidyl', notification: SO_2016(799), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 191, name: 'Chlorpromazine + Trihexyphenidyl', notification: SO_2016(800), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 192, name: 'Ursodeoxycholic Acid + Silymarin', notification: SO_2016(801), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 193, name: 'Metformin 1000/1000/500/500mg + Pioglitazone 7.5/7.5/7.5/7.5mg + Glimepiride 1/2/1/2mg', notification: SO_2016(802), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 194, name: 'Gliclazide 80 mg + Metformin 325 mg', notification: SO_2016(803), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 195, name: 'Voglibose + Metformin + Chromium Picolinate', notification: SO_2016(804), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 196, name: 'Pioglitazone 7.5/7.5mg + Metformin 500/1000mg', notification: SO_2016(805), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 197, name: 'Glimepiride 1mg/2mg/3mg + Pioglitazone 15mg + Metformin 1000mg', notification: SO_2016(806), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 198, name: 'Glimepiride 1mg/2mg + Pioglitazone 15mg + Metformin 850mg', notification: SO_2016(807), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 199, name: 'Metformin 850mg + Pioglitazone 7.5 mg + Glimepiride 2mg', notification: SO_2016(808), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 200, name: 'Metformin 850mg + Pioglitazone 7.5 mg + Glimepiride 1mg', notification: SO_2016(809), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 201, name: 'Metformin 500mg + Gliclazide SR 30mg/60mg + Pioglitazone 7.5mg', notification: SO_2016(810), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 202, name: 'Voglibose + Pioglitazone + Metformin', notification: SO_2016(811), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 203, name: 'Metformin + Bromocriptine', notification: SO_2016(812), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 204, name: 'Metformin + Glimepiride + Methylcobalamin', notification: SO_2016(813), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 205, name: 'Pioglitazone 30 mg + Metformin 500mg', notification: SO_2016(814), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 206, name: 'Glimepiride + Pioglitazone + Metformin', notification: SO_2016(815), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 207, name: 'Glipizide 2.5mg + Metformin 400mg', notification: SO_2016(816), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 208, name: 'Pioglitazone 15mg + Metformin 850 mg', notification: SO_2016(817), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 209, name: 'Metformin ER + Gliclazide MR + Voglibose', notification: SO_2016(818), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 210, name: 'Chromium Polynicotinate + Metformin Hydrochloride', notification: SO_2016(819), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 211, name: 'Metformin Hydrochloride + Gliclazide + Pioglitazone + Chromium Polynicotinate', notification: SO_2016(820), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 212, name: 'Metformin + Gliclazide + Chromium Polynicotinate', notification: SO_2016(821), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 213, name: 'Glibenclamide + Metformin (SR) + Pioglitazone', notification: SO_2016(822), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 214, name: 'Metformin (sustained release) 500mg + Pioglitazone 15 mg + Glimepiride 3mg', notification: SO_2016(823), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 215, name: 'Metformin (SR) 500mg + Pioglitazone 5mg', notification: SO_2016(824), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 216, name: 'Chloramphenicol + Beclomethasone + Clotrimazole + Lignocaine', notification: SO_2016(825), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 217, name: 'Clotrimazole + Ofloxacin + Lignocaine + Glycerine and Propylene glycol', notification: SO_2016(826), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 218, name: 'Chloramphenicol + Lignocaine + Betamethasone + Clotrimazole + Ofloxacin + Antipyrine', notification: SO_2016(827), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 219, name: 'Ofloxacin + Clotrimazole + Betamethasone + Lignocaine', notification: SO_2016(828), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 220, name: 'Gentamicin Sulphate + Clotrimazole + Betamethasone + Lignocaine', notification: SO_2016(829), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 221, name: 'Clotrimazole + Beclomethasone + Ofloxacin + Lignocaine', notification: SO_2016(830), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 222, name: 'Beclomethasone + Clotrimazole + Chloramphenicol + Gentamicin + Lignocaine Ear drops', notification: SO_2016(831), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 223, name: 'Flunarizine + Paracetamol + Domperidone', notification: SO_2016(832), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 224, name: 'Rabeprazole + Zinc carnosine', notification: SO_2016(833), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 225, name: 'Magaldrate + Famotidine + Simethicone', notification: SO_2016(834), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 226, name: 'Cyproheptadine + Thiamine', notification: SO_2016(835), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 227, name: 'Magaldrate + Ranitidine + Pancreatin + Domperidone', notification: SO_2016(836), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 228, name: 'Ranitidine + Magaldrate + Simethicone', notification: SO_2016(837), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 229, name: 'Magaldrate + Papain + Fungal diastase + Simethicone', notification: SO_2016(838), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 230, name: 'Rabeprazole + Zinc + Domperidone', notification: SO_2016(839), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 231, name: 'Famotidine + Oxetacaine (Oxytacaine) + Magaldrate', notification: SO_2016(840), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 232, name: 'Ranitidine + Domperidone + Simethicone', notification: SO_2016(841), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 233, name: 'Alginic Acid + Sodium Bicarbonate + Dried Aluminium Hydroxide + Magnesium Hydroxide', notification: SO_2016(842), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 234, name: 'Clidinium + Paracetamol + Dicyclomine + Activated Dimethicone', notification: SO_2016(843), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 235, name: 'Furazolidone + Metronidazole + Loperamide', notification: SO_2016(844), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 236, name: 'Rabeprazole + Diclofenac + Paracetamol', notification: SO_2016(845), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 237, name: 'Ranitidine + Magaldrate', notification: SO_2016(846), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 238, name: 'Norfloxacin + Metronidazole + Zinc Acetate', notification: SO_2016(847), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 239, name: 'Zinc Carnosine + Oxetacaine', notification: SO_2016(848), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 240, name: 'Oxetacaine + Magaldrate + Famotidine', notification: SO_2016(849), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 241, name: 'Pantoprazole (Enteric Coated) + Zinc Carnosine (Film Coated)', notification: SO_2016(850), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 242, name: 'Zinc Carnosine + Magnesium Hydroxide + Dried Aluminium Hydroxide + Simethicone', notification: SO_2016(851), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 243, name: 'Zinc Carnosine + Sucralfate', notification: SO_2016(852), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 244, name: 'Mebeverine Hydrochloride & Inner HPMC capsule (Streptococcus Faecalis + Clostridium butyricum + Bacillus mesentricus + Lactic Acid Bacillus)', notification: SO_2016(853), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 245, name: 'Clindamycin + Clotrimazole + Lactic Acid Bacillus', notification: SO_2016(854), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 246, name: 'Sildenafil + Estradiol Valerate', notification: SO_2016(855), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 247, name: 'Clomifene Citrate + Ubidecarenone + Zinc + Folic Acid + Methylcobalamin + Pyridoxine + Lycopene + Selenium + Levocarnitine Tartrate + L-Arginine', notification: SO_2016(856), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 248, name: 'Thyroxine + Pyridoxine + Folic Acid', notification: SO_2016(857), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 249, name: 'Gentamicin + Dexamethasone + Chloramphenicol + Tobramycin + Ofloxacin', notification: SO_2016(858), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 250, name: 'Dextromethorphan + Levocetirizine + Phenylephrine + Zinc', notification: SO_2016(859), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 251, name: 'Nimesulide + Loratadine + Phenylephrine + Ambroxol', notification: SO_2016(860), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 252, name: 'Bromhexine + Phenylephrine + Chlorpheniramine Maleate', notification: SO_2016(861), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 253, name: 'Dextromethorphan + Bromhexine + Guaiphenesin', notification: SO_2016(862), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 254, name: 'Paracetamol + Loratadine + Phenylephrine + Dextromethorphan + Caffeine', notification: SO_2016(863), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 255, name: 'Nimesulide + Phenylephrine + Caffeine + Levocetirizine', notification: SO_2016(864), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 256, name: 'Azithromycin + Acebrophylline', notification: SO_2016(865), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 257, name: 'Diphenhydramine + Terpine + Ammonium Chloride + Sodium Chloride + Menthol', notification: SO_2016(866), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 258, name: 'Nimesulide + Paracetamol + Cetirizine (Cetrizine) + Phenylephrine', notification: SO_2016(867), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 259, name: 'Paracetamol + Loratadine + Dextromethorphan + Pseudoephedrine + Caffeine', notification: SO_2016(868), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 260, name: 'Chlorpheniramine maleate + Dextromethorphan + Guaiphenesin + Ammonium chloride + Menthol', notification: SO_2016(869), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 261, name: 'Chlorpheniramine Maleate + Ammonium Chloride + Sodium Citrate', notification: SO_2016(870), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 262, name: 'Cetirizine + Phenylephrine + Paracetamol + Zinc Gluconate', notification: SO_2016(871), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 263, name: 'Ambroxol + Guaiphenesin + Ammonium Chloride + Phenylephrine + Chlorpheniramine Maleate + Menthol', notification: SO_2016(872), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 264, name: 'Dextromethorphan + Bromhexine + Chlorpheniramine maleate + Guaiphenesin', notification: SO_2016(873), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 265, name: 'Levocetirizine + Ambroxol + Phenylephrine + Guaiphenesin', notification: SO_2016(874), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 266, name: 'Dextromethorphan + Chlorpheniramine + Chlorpheniramine maleate', notification: SO_2016(875), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 267, name: 'Cetirizine + Ambroxol + Guaiphenesin + Ammonium chloride + Phenylephrine + Menthol', notification: SO_2016(876), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 268, name: 'Chlorpheniramine + Phenylephrine + Caffeine', notification: SO_2016(877), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 269, name: 'Dextromethorphan + Triprolidine + Phenylephrine', notification: SO_2016(878), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 270, name: 'Terpinhydrate + Dextromethorphan + Menthol', notification: SO_2016(879), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 271, name: 'Dextromethorphan + Phenylephrine + Zinc gluconate + Menthol', notification: SO_2016(880), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 272, name: 'Chlorpheniramine + Codeine + Sodium Citrate + Menthol syrup', notification: SO_2016(881), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 273, name: 'Enrofloxacin + Bromhexine', notification: SO_2016(882), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 274, name: 'Bromhexine + Dextromethorphan + Phenylephrine + Menthol', notification: SO_2016(883), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 275, name: 'Levofloxacin + Bromhexine', notification: SO_2016(884), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 276, name: 'Levocetirizine + Ranitidine', notification: SO_2016(885), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 277, name: 'Levocetirizine + Phenylephrine + Ambroxol + Guaiphenesin + Paracetamol', notification: SO_2016(886), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 278, name: 'Cetirizine + Dextromethorphan + Phenylephrine + Zinc gluconate + Paracetamol + Menthol', notification: SO_2016(887), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 279, name: 'Paracetamol + Pseudoephedrine + Dextromethorphan + Cetirizine', notification: SO_2016(888), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 280, name: 'Diphenhydramine + Guaiphenesin + Ammonium chloride + Bromhexine', notification: SO_2016(889), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 281, name: 'Chlorpheniramine + Dextromethorphan + Phenylephrine + Paracetamol', notification: SO_2016(890), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 282, name: 'Dextromethorphan + Promethazine', notification: SO_2016(891), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 283, name: 'Diethylcarbamazine + Cetirizine (Cetrizine) + Guaiphenesin', notification: SO_2016(892), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 284, name: 'Pseudoephedrine + Dextromethorphan + Cetirizine', notification: SO_2016(893), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 285, name: 'Chlorpheniramine + Phenylephrine + Dextromethorphan + Menthol', notification: SO_2016(894), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 286, name: 'Ambroxol + Terbutaline + Dextromethorphan', notification: SO_2016(895), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 287, name: 'Dextromethorphan + Chlorpheniramine + Guaiphenesin', notification: SO_2016(896), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 288, name: 'Terbutaline + Bromhexine + Guaiphenesin + Dextromethorphan', notification: SO_2016(897), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 289, name: 'Dextromethorphan + Triprolidine (Tripolidine) + Phenylephrine', notification: SO_2016(898), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 290, name: 'Paracetamol + Dextromethorphan + Chlorpheniramine', notification: SO_2016(899), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 291, name: 'Pholcodine + Phenylephrine + Promethazine', notification: SO_2016(900), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 292, name: 'Codeine + Levocetirizine + Menthol', notification: SO_2016(901), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 293, name: 'Dextromethorphan + Ambroxol + Guaifenesin + Phenylephrine + Chlorpheniramine', notification: SO_2016(902), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 294, name: 'Cetirizine + Phenylephrine + Dextromethorphan + Menthol', notification: SO_2016(903), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 295, name: 'Roxithromycin + Serratiopeptidase', notification: SO_2016(904), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 296, name: 'Paracetamol + Phenylephrine + Triprolidine', notification: SO_2016(905), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 297, name: 'Acetaminophen + Loratadine + Ambroxol + Phenylephrine', notification: SO_2016(906), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 298, name: 'Cetirizine + Acetaminophen + Dextromethorphan + Phenylephrine + Zinc gluconate', notification: SO_2016(907), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 299, name: 'Diphenhydramine + Guaifenesin + Bromhexine + Ammonium Chloride + Menthol', notification: SO_2016(908), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 300, name: 'Chlorpheniramine Maleate + Codeine syrup', notification: SO_2016(909), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 301, name: 'Cetirizine + Dextromethorphan + Zinc Gluconate + Menthol', notification: SO_2016(910), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 302, name: 'Paracetamol + Phenylephrine + Desloratadine + Zinc Gluconate + Ambroxol', notification: SO_2016(911), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 303, name: 'Levocetirizine + Montelukast + Acebrophylline', notification: SO_2016(912), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 304, name: 'Dextromethorphan + Phenylephrine + Ammonium Chloride + Menthol', notification: SO_2016(913), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 305, name: 'Dextromethorphan + Bromhexine + Guaiphenesin + Menthol', notification: SO_2016(914), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 306, name: 'Acrivastine + Paracetamol + Caffeine + Phenylephrine', notification: SO_2016(915), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 307, name: 'Naphazoline + Carboxy Methyl Cellulose + Menthol + Camphor + Phenylephrine', notification: SO_2016(916), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 308, name: 'Dextromethorphan + Cetirizine', notification: SO_2016(917), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 309, name: 'Nimesulide + Paracetamol + Levocetirizine + Phenylephrine + Caffeine', notification: SO_2016(918), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 310, name: 'Terbutaline + Ambroxol + Guaiphenesin + Zinc + Menthol', notification: SO_2016(919), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 311, name: 'Codeine + Chlorpheniramine + Alcohol syrup', notification: SO_2016(920), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 312, name: 'Dextromethorphan + Phenylephrine + Guaifenesin + Triprolidine', notification: SO_2016(921), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 313, name: 'Ammonium Chloride + Bromhexine + Dextromethorphan', notification: SO_2016(922), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 314, name: 'Diethylcarbamazine + Cetirizine + Ambroxol', notification: SO_2016(923), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 315, name: 'Ethylmorphine + Noscapine + Chlorpheniramine Maleate', notification: SO_2016(924), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 316, name: 'Cetirizine + Dextromethorphan + Ambroxol', notification: SO_2016(925), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 317, name: 'Bromhexine + Dextromethorphan + Ammonium Chloride + Menthol', notification: SO_2016(926), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 318, name: 'Ambroxol + Guaifenesin + Phenylephrine + Chlorpheniramine', notification: SO_2016(927), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 319, name: 'Paracetamol + Phenylephrine + Chlorpheniramine + Zinc Gluconate', notification: SO_2016(928), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 320, name: 'Dextromethorphan + Phenylephrine + Cetirizine + Paracetamol + Caffeine', notification: SO_2016(929), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 321, name: 'Dextromethorphan + Chlorpheniramine + Guaifenesin + Ammonium Chloride', notification: SO_2016(930), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 322, name: 'Levocetirizine + Dextromethorphan + Zinc', notification: SO_2016(931), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 323, name: 'Paracetamol + Phenylephrine + Levocetirizine + Caffeine', notification: SO_2016(932), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 324, name: 'Chlorpheniramine + Ammonium Chloride + Sodium Chloride', notification: SO_2016(933), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 325, name: 'Paracetamol + Dextromethorphan + Bromhexine + Phenylephrine + Diphenhydramine', notification: SO_2016(934), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 326, name: 'Salbutamol + Bromhexine + Guaiphenesin + Menthol', notification: SO_2016(935), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 327, name: 'Chlorpheniramine + Ammonium Chloride + Noscapine + Sodium Citrate', notification: SO_2016(936), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 328, name: 'Cetirizine + Dextromethorphan + Bromhexine + Guaifenesin', notification: SO_2016(937), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 329, name: 'Diethyl Carbamazine + Chlorpheniramine + Guaifenesin', notification: SO_2016(938), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 330, name: 'Ketotifen + Cetirizine', notification: SO_2016(939), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 331, name: 'Terbutaline + Bromhexine + Etofylline', notification: SO_2016(940), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 332, name: 'Ketotifen + Theophylline', notification: SO_2016(941), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 333, name: 'Ambroxol + Salbutamol + Theophylline', notification: SO_2016(942), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 334, name: 'Cetirizine + Nimesulide + Phenylephrine', notification: SO_2016(943), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 335, name: 'Chlorpheniramine + Phenylephrine + Paracetamol + Zinc Gluconate', notification: SO_2016(944), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 336, name: 'Acetaminophen + Guaifenesin + Dextromethorphan + Chlorpheniramine', notification: SO_2016(945), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 337, name: 'Cetirizine + Dextromethorphan + Phenylephrine + Tulsi', notification: SO_2016(946), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 338, name: 'Cetirizine + Phenylephrine + Paracetamol + Ambroxol + Caffeine', notification: SO_2016(947), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 339, name: 'Guaifenesin + Dextromethorphan', notification: SO_2016(948), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 340, name: 'Levocetirizine + Paracetamol + Phenylephrine + Caffeine', notification: SO_2016(949), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 341, name: 'Caffeine + Paracetamol + Phenylephrine + Chlorpheniramine', notification: SO_2016(950), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 342, name: 'Ketotifen + Levocetirizine (Levocetrizine)', notification: SO_2016(951), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 343, name: 'Paracetamol + Levocetirizine + Phenylephrine + Zinc Gluconate', notification: SO_2016(952), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 344, name: 'Paracetamol + Phenylephrine + Triprolidine + Caffeine', notification: SO_2016(953), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 345, name: 'Caffeine + Paracetamol + Phenylephrine + Cetirizine', notification: SO_2016(954), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 346, name: 'Dextromethorphan + Phenylephrine + Guaifenesin', notification: SO_2016(955), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 347, name: 'Ambroxol + Levocetirizine + Phenylephrine + Guaiphenesin + Menthol', notification: SO_2016(956), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 348, name: 'Pseudoephedrine + Cetirizine', notification: SO_2016(957), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 349, name: 'Dextromethorphan + Chlorpheniramine + Ammonium Chloride + Menthol', notification: SO_2016(958), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 350, name: 'Paracetamol + Caffeine + Phenylephrine + Chlorpheniramine', notification: SO_2016(959), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 351, name: 'Salbutamol + Aminophylline + Guaifenesin', notification: SO_2016(960), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 352, name: 'Salbutamol + Theophylline + Bromhexine', notification: SO_2016(961), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 353, name: 'Chlorpheniramine + Dextromethorphan + Guaifenesin + Phenylephrine', notification: SO_2016(962), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 354, name: 'Caffeine + Paracetamol + Chlorpheniramine', notification: SO_2016(963), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 355, name: 'Ammonium Chloride + Dextromethorphan + Cetirizine + Menthol', notification: SO_2016(964), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 356, name: 'Dextromethorphan + Paracetamol + Cetirizine + Phenylephrine', notification: SO_2016(965), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 357, name: 'Chlorpheniramine + Terpin + Antimony Potassium Tartrate + Ammonium chloride + Sodium Citrate + Menthol', notification: SO_2016(966), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 358, name: 'Terbutaline Sulphate + Etofylline + Ambroxol', notification: SO_2016(967), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 359, name: 'Paracetamol + Codeine + Chlorpheniramine', notification: SO_2016(968), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 360, name: 'Paracetamol + Pseudoephedrine + Cetirizine + Caffeine', notification: SO_2016(969), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 361, name: 'Chlorpheniramine + Ammonium Chloride + Menthol', notification: SO_2016(970), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 362, name: 'N-Acetyl Cysteine + Ambroxol + Phenylephrine + Levocetirizine', notification: SO_2016(971), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 363, name: 'Dextromethorphan + Phenylephrine + Triprolidine + Menthol', notification: SO_2016(972), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 364, name: 'Salbutamol + Cetirizine + Ambroxol', notification: SO_2016(973), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 365, name: 'Dextromethorphan + Phenylephrine + Bromhexine + Guaifenesin + Chlorpheniramine', notification: SO_2016(974), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 366, name: 'Nimesulide + Cetirizine + Phenylephrine', notification: SO_2016(975), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 367, name: 'Naphazoline + Chlorpheniramine + Zinc Sulphate + Boric Acid IP + Sodium chloride + Chlorobutol', notification: SO_2016(976), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 368, name: 'Paracetamol + Bromhexine + Phenylephrine + Chlorpheniramine + Guaifenesin', notification: SO_2016(977), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 369, name: 'Salbutamol + Bromhexine', notification: SO_2016(978), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 370, name: 'Dextromethorphan + Phenylephrine + Guaifenesin + Cetirizine + Acetaminophen', notification: SO_2016(979), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 371, name: 'Guaifenesin + Bromhexine + Chlorpheniramine + Paracetamol', notification: SO_2016(980), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 372, name: 'Chlorpheniramine + Ammonium Chloride + Chloroform + Menthol', notification: SO_2016(981), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 373, name: 'Salbutamol + Choline Theophyllinate + Ambroxol', notification: SO_2016(982), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 374, name: 'Chlorpheniramine + Codeine phosphate + Menthol syrup', notification: SO_2016(983), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 375, name: 'Pseudoephedrine + Bromhexine', notification: SO_2016(984), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 376, name: 'Cetirizine + Phenylephrine + Paracetamol + Caffeine + Nimesulide', notification: SO_2016(985), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 377, name: 'Dextromethorphan + Cetirizine + Guaifenesin + Ammonium Chloride', notification: SO_2016(986), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 378, name: 'Ambroxol + Salbutamol + Choline Theophyllinate + Menthol', notification: SO_2016(987), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 379, name: 'Paracetamol + Chlorpheniramine + Ambroxol + Guaifenesin + Phenylephrine', notification: SO_2016(988), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 380, name: 'Chlorpheniramine + Vasaka + Tolu balsam + Ammonium Chloride + Sodium Citrate + Menthol', notification: SO_2016(989), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 381, name: 'Bromhexine + Cetirizine (Cetrizine) + Phenylephrine + Guaifenesin + Menthol', notification: SO_2016(990), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 382, name: 'Dextromethorphan + Ambroxol + Ammonium Chloride + Chlorpheniramine + Menthol', notification: SO_2016(991), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 383, name: 'Dextromethorphan + Phenylephrine + Cetirizine + Zinc + Menthol', notification: SO_2016(992), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 384, name: 'Terbutaline + N-Acetyl L-Cysteine + Guaifenesin', notification: SO_2016(993), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 385, name: 'Calcium Gluconate + Levocetirizine', notification: SO_2016(994), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 386, name: 'Paracetamol + Levocetirizine + Pseudoephedrine', notification: SO_2016(995), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 387, name: 'Salbutamol + Choline Theophyllinate + Carbocisteine', notification: SO_2016(996), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 388, name: 'Chlorpheniramine + Vitamin C', notification: SO_2016(997), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 389, name: 'Calcium Gluconate + Chlorpheniramine + Vitamin C', notification: SO_2016(998), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 390, name: 'Chlorpheniramine + Paracetamol + Pseudoephedrine + Caffeine', notification: SO_2016(999), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 391, name: 'Guaifenesin + Bromhexine + Chlorpheniramine + Phenylephrine + Paracetamol + Serratiopeptidase (10000 SP Units)', notification: SO_2016(1000), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 392, name: 'Paracetamol + Pheniramine', notification: SO_2016(1001), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 393, name: 'Betamethasone + Fusidic Acid + Gentamicin + Tolnaftate + Iodochlorhydroxyquinoline (ICHQ)', notification: SO_2016(1002), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 394, name: 'Clobetasol + Ofloxacin + Miconazole + Zinc Sulphate', notification: SO_2016(1003), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 395, name: 'Clobetasol + Gentamicin + Miconazole + Zinc Sulphate', notification: SO_2016(1004), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 396, name: 'Levocetirizine + Ambroxol + Phenylephrine + Paracetamol', notification: SO_2016(1005), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 397, name: 'Permethrin + Cetrimide + Menthol', notification: SO_2016(1006), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 398, name: 'Beclomethasone + Clotrimazole + Neomycin + Iodochlorhydroxyquinoline', notification: SO_2016(1007), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 399, name: 'Neomycin + Doxycycline', notification: SO_2016(1008), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 400, name: 'Ciprofloxacin + Fluocinolone + Clotrimazole + Neomycin + Chlorocresol', notification: SO_2016(1009), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 401, name: 'Clobetasol + Ofloxacin + Ketoconazole + Zinc Sulphate', notification: SO_2016(1010), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 402, name: 'Betamethasone + Gentamicin + Tolnaftate + Iodochlorhydroxyquinoline', notification: SO_2016(1011), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 403, name: 'Clobetasol + Gentamicin + Tolnaftate + Iodochlorhydroxyquinoline + Ketoconazole', notification: SO_2016(1012), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 404, name: 'Allantoin + Dimethicone + Urea + Propylene + Glycerin + Liquid paraffin', notification: SO_2016(1013), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 405, name: 'Acriflavine + Thymol + Cetrimide', notification: SO_2016(1014), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 406, name: 'Betamethasone + Neomycin + Tolnaftate + Iodochlorhydroxyquinoline + Chlorocresol', notification: SO_2016(1015), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 407, name: 'Clobetasol + Neomycin + Miconazole + Clotrimazole', notification: SO_2016(1016), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 408, name: 'Ketoconazole + Tea Tree oil + Allantoin + Zinc Oxide + Aloe Vera + Jojoba oil + Lavender oil + Soap noodles', notification: SO_2016(1017), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 409, name: 'Clobetasol + Ofloxacin + Ornidazole + Terbinafine', notification: SO_2016(1018), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 410, name: 'Clobetasol + Neomycin + Miconazole + Zinc Sulphate', notification: SO_2016(1019), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 411, name: 'Beclomethasone + Neomycin + Tolnaftate + Iodochlorhydroxyquinoline + Chlorocresol', notification: SO_2016(1020), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 412, name: 'Betamethasone + Gentamicin + Zinc Sulphate + Clotrimazole + Chlorocresol', notification: SO_2016(1021), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 413, name: 'Borax + Boric acid + Naphazoline + Menthol + Camphor + Methyl hydroxy benzoate', notification: SO_2016(1022), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 414, name: 'Bromhexine + Dextromethorphan', notification: SO_2016(1023), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 415, name: 'Dextromethorphan + Chlorpheniramine + Bromhexine', notification: SO_2016(1024), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 416, name: 'Menthol + Anesthetic Ether', notification: SO_2016(1025), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 417, name: 'Dextromethorphan + Chlorpheniramine + Ammonium Chloride + Sodium Citrate + Menthol', notification: SO_2016(1026), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 418, name: 'Ergotamine Tartrate + Belladonna dry extract + Caffeine + Paracetamol', notification: SO_2016(1027), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 419, name: 'Phenytoin + Phenobarbitone sodium', notification: SO_2016(1028), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 420, name: 'Gliclazide 40mg + Metformin 400mg', notification: SO_2016(1029), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 421, name: 'Paracetamol + Ambroxol + Phenylephrine + Chlorpheniramine', notification: SO_2016(1030), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 422, name: 'Ofloxacin + Ornidazole suspension', notification: SO_2016(1031), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 423, name: 'Albuterol + Etofylline + Bromhexine + Menthol', notification: SO_2016(1032), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 424, name: 'Albuterol + Bromhexine + Theophylline', notification: SO_2016(1033), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 425, name: 'Salbutamol + Hydroxyethyltheophylline (Etofylline) + Bromhexine', notification: SO_2016(1034), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 426, name: 'Paracetamol + Phenylephrine + Levocetirizine + Sodium Citrate', notification: SO_2016(1035), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 427, name: 'Paracetamol + Propyphenazone + Caffeine', notification: SO_2016(1036), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 428, name: 'Guaifenesin + Diphenhydramine + Bromhexine + Phenylephrine', notification: SO_2016(1037), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 429, name: 'Dried Aluminium Hydroxide Gel + Propantheline Bromide + Diazepam', notification: SO_2016(1038), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 430, name: 'Bromhexine + Phenylephrine + Chlorpheniramine + Paracetamol', notification: SO_2016(1039), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 431, name: 'Beclomethasone + Clotrimazole + Gentamicin + Iodochlorhydroxyquinoline', notification: SO_2016(1040), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 432, name: 'Telmisartan + Metformin', notification: SO_2016(1041), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 433, name: 'Ammonium Citrate + Vitamin B12 + Folic Acid + Zinc Sulphate', notification: SO_2016(1042), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 434, name: 'Levothyroxine + Pyridoxine + Nicotinamide', notification: SO_2016(1043), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 435, name: 'Benfotiamine + Metformin', notification: SO_2016(1044), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 436, name: 'Thyroid + Thiamine + Riboflavin + Pyridoxine + Calcium Pantothenate + Tocopheryl Acetate + Nicotinamide', notification: SO_2016(1045), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 437, name: 'Ascorbic Acid + Menadione Sodium Bisulphate + Rutin + Dibasic Calcium Phosphate + Adrenochrome Mono Semicarbazone', notification: SO_2016(1046), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 438, name: 'Phenylephrine + Chlorpheniramine + Paracetamol + Bromhexine + Caffeine', notification: SO_2016(1047), legalNote: 'delhi_hc_quashed_slp' },
  { srNo: 439, name: 'Clotrimazole + Beclomethasone + Lignocaine + Ofloxacin + Acetic Acid + Sodium Methyl Paraben + Propyl Paraben', notification: SO_2016(1048), legalNote: 'delhi_hc_quashed_slp' },

  // S.O. 1851(E) to S.O. 1855(E) Dated 08.06.2017 (Sr. No. 440 to 444)
  { srNo: 440, name: 'Fixed Dose Combinations of Nimesulide + Levocetirizine', notification: 'S.O. 1851(E) Dated 08.06.2017' },
  { srNo: 441, name: 'Fixed Dose Combinations of Ofloxacin + Ornidazole Injection', notification: 'S.O. 1852(E) Dated 08.06.2017' },
  { srNo: 442, name: 'Fixed Dose Combinations of Gemifloxacin + Ambroxol', notification: 'S.O. 1853(E) Dated 08.06.2017' },
  { srNo: 443, name: 'Fixed Dose Combinations of Glucosamine + Ibuprofen', notification: 'S.O. 1854(E) Dated 08.06.2017' },
  { srNo: 444, name: 'Fixed Dose Combinations of Etodolac + Paracetamol', notification: 'S.O. 1855(E) Dated 08.06.2017' },
];

const SPELLING_CANONICAL_RULES: [RegExp, string][] = [
  [/\bacetaminophen\b/g, 'paracetamol'],
  [/\bparacetamole\b/g, 'paracetamol'],
  [/\bamoxycillin\b/g, 'amoxicillin'],
  [/\bcetrizine\b/g, 'cetirizine'],
  [/\blevocetrizine\b/g, 'levocetirizine'],
  [/\bchlopheniramine\b|\bchlorepheniramine\b|\bchlorpheniramine\s*maleate\b/g, 'chlorpheniramine'],
  [/\bphenylephirine\b|\bphenyephrine\b/g, 'phenylephrine'],
  [/\bdextromethophan\b|\bdextrometharphan\b|\bdextromethorphen\b/g, 'dextromethorphan'],
  [/\bguaiphenesin\b/g, 'guaifenesin'],
  [/\blignocaine\b|\blignocain\b/g, 'lidocaine'],
  [/\bclotimazole\b|\bclomitrimazole\b/g, 'clotrimazole'],
  [/\bgentamycin\b/g, 'gentamicin'],
  [/\bmetroprolol\b/g, 'metoprolol'],
  [/\boflaxacin\b/g, 'ofloxacin'],
  [/\bphenypropanolamine\b/g, 'phenylpropanolamine'],
  [/\brifanpicin\b/g, 'rifampicin'],
  [/\bterfinadine\b/g, 'terfenadine'],
  [/\bpencillin\b/g, 'penicillin'],
  [/\bchloramphennicol\b/g, 'chloramphenicol'],
  [/\bbecloemthasone\b/g, 'beclomethasone'],
  [/\boxytacaine\b/g, 'oxetacaine'],
  [/\btripolidine\b/g, 'triprolidine'],
  [/\bpseudoepheridine\b/g, 'pseudoephedrine'],
  [/\bacebrophyline\b/g, 'acebrophylline'],
  [/\bceffeine\b|\bcaffiene\b/g, 'caffeine'],
  [/\bsalbutamoll\b|\balbuterol\b/g, 'salbutamol'],
  [/\btheophylinate\b|\bthoephylline\b/g, 'theophylline'],
  [/\bmethylcobalamin\b|\bmecobalamin\b/g, 'methylcobalamin'],
  [/\bi\.?p\.?\b/g, ''],
];

export function normalizeDrugText(input: string): string {
  let out = input.toLowerCase();
  for (const [pattern, replacement] of SPELLING_CANONICAL_RULES) {
    out = out.replace(pattern, replacement);
  }
  return out
    .replace(/[()[\],]/g, ' ')
    .replace(/\b\d+(?:\.\d+)?\s*(?:mg|mcg|gm|g|ml|%|units|sp|sr|mr|er)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const SINGLE_BANNED_KEYWORDS: {
  srNo: number;
  terms: string[];
  requireAllContext?: string[];
  excludeContext?: string[];
}[] = [
  { srNo: 1, terms: ['amidopyrine', 'aminopyrine'] },
  { srNo: 8, terms: ['phenacetin'] },
  { srNo: 18, terms: ['penicillin'], requireAllContext: ['ointment', 'eye', 'skin'] },
  { srNo: 19, terms: ['tetracycline'], requireAllContext: ['syrup', 'liquid', 'suspension', 'oral'] },
  { srNo: 20, terms: ['nialamide'] },
  { srNo: 21, terms: ['practolol'] },
  { srNo: 22, terms: ['methapyrilene'] },
  { srNo: 23, terms: ['methaqualone'] },
  { srNo: 24, terms: ['oxytetracycline'], requireAllContext: ['syrup', 'liquid', 'suspension', 'oral'] },
  { srNo: 25, terms: ['demeclocycline'], requireAllContext: ['syrup', 'liquid', 'suspension', 'oral'] },
  { srNo: 43, terms: ['chloral hydrate'] },
  { srNo: 44, terms: ['dovers powder', 'dover s powder', "dover's powder"] },
  { srNo: 58, terms: ['fenfluramine'] },
  { srNo: 59, terms: ['dexfenfluramine'] },
  { srNo: 74, terms: ['astemizole'] },
  { srNo: 75, terms: ['terfenadine'] },
  { srNo: 76, terms: ['phenformin'] },
  { srNo: 77, terms: ['rofecoxib'] },
  { srNo: 78, terms: ['valdecoxib'] },
  { srNo: 79, terms: ['diclofenac'], requireAllContext: ['animal', 'veterinary', 'vet'] },
  { srNo: 80, terms: ['rimonabant'] },
  { srNo: 81, terms: ['rosiglitazone'] },
  { srNo: 82, terms: ['nimesulide'], requireAllContext: ['child', 'children', 'pediatric', 'paediatric', 'suspension', 'drops'] },
  { srNo: 83, terms: ['cisapride'] },
  { srNo: 84, terms: ['phenylpropanolamine'] },
  { srNo: 86, terms: ['sibutramine'] },
  { srNo: 87, terms: ['r-sibutramine', 'r sibutramine'] },
  { srNo: 88, terms: ['gatifloxacin'], excludeContext: ['eye', 'ophthalmic'] },
  { srNo: 89, terms: ['tegaserod'] },
  { srNo: 92, terms: ['dextropropoxyphene'] },
  { srNo: 94, terms: ['analgin', 'metamizole'] },
  { srNo: 95, terms: ['pioglitazone'] },
];

function extractFdcIngredients(entryName: string): string[] | null {
  const cleaned = entryName
    .replace(/^Fixed Dose Combinations? of\s+/i, '')
    .replace(/\b(?:dispersible tablets|injection|suspension|syrup|ear drops|tablets|tablet)\b/gi, '');
  if (!cleaned.includes('+')) return null;

  const parts = cleaned
    .split('+')
    .map((p) => normalizeDrugText(p))
    .map((p) => p.replace(/\b(?:maleate|hydrochloride|sulphate|sodium|potassium|citrate|acetate|phosphate|tartrate|gluconate|bisglycinate|diluted|acid|gel|dry extract)\b/g, '').trim())
    .filter((p) => p.length >= 3);

  return parts.length >= 2 ? Array.from(new Set(parts)) : null;
}

export function findBannedDrugMatches(
  medicineName: string,
  genericName = ''
): BannedDrugEntry[] {
  const combinedRaw = `${medicineName} ${genericName}`.trim();
  if (combinedRaw.length < 3) return [];

  const normalizedQuery = normalizeDrugText(combinedRaw);
  const queryWords = new Set(normalizedQuery.split(/\s+/).filter((w) => w.length >= 3));
  const matches: BannedDrugEntry[] = [];
  const seen = new Set<number>();

  // 1. Check exact/full substring or multi-word drug name match
  for (const entry of BANNED_DRUGS) {
    const normEntry = normalizeDrugText(entry.name);
    if (
      normalizedQuery.length >= 6 &&
      (normEntry === normalizedQuery ||
        (normalizedQuery.includes('+') && normEntry.includes(normalizedQuery)) ||
        (normEntry.length >= 8 && normalizedQuery.includes(normEntry)))
    ) {
      seen.add(entry.srNo);
      matches.push(entry);
    }
  }

  // 2. Check FDC '+' ingredient combinations (all ingredients of a banned FDC must be present)
  for (const entry of BANNED_DRUGS) {
    if (seen.has(entry.srNo)) continue;
    const ingredients = extractFdcIngredients(entry.name);
    if (!ingredients) continue;

    // Prevent single-ingredient safe medicine searches from triggering multi-drug FDCs
    const presentCount = ingredients.filter((ing) => {
      const ingTokens = ing.split(/\s+/).filter((t) => t.length >= 3);
      return ingTokens.length > 0 && ingTokens.every((t) => queryWords.has(t) || normalizedQuery.includes(t));
    }).length;

    if (presentCount === ingredients.length) {
      seen.add(entry.srNo);
      matches.push(entry);
    }
  }

  // 3. Check banned single-substance / conditional drugs
  for (const rule of SINGLE_BANNED_KEYWORDS) {
    if (seen.has(rule.srNo)) continue;
    const hasTerm = rule.terms.some((term) => {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp(`\\b${escaped}\\b`, 'i').test(normalizedQuery);
    });
    if (!hasTerm) continue;

    if (rule.requireAllContext && rule.requireAllContext.length > 0) {
      const hasContext = rule.requireAllContext.some((ctx) =>
        normalizedQuery.includes(ctx)
      );
      if (!hasContext) continue;
    }

    if (rule.excludeContext && rule.excludeContext.length > 0) {
      const hasExcluded = rule.excludeContext.some((ctx) =>
        normalizedQuery.includes(ctx)
      );
      if (hasExcluded) continue;
    }

    const entry = BANNED_DRUGS.find((d) => d.srNo === rule.srNo);
    if (entry) {
      seen.add(entry.srNo);
      matches.push(entry);
    }
  }

  return matches.slice(0, 8);
}
