import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    // Brand & App
    brand_name: 'PlotGuard',
    brand_tag: 'Land record screening',
    workspace: 'Workspace',
    sample_scenarios: 'Sample scenarios',
    demo_walkthrough: 'Demo walkthrough',
    hackathon_track: 'LandTech Innovation Hackathon 2026 · Track P3',

    // Nav tabs
    nav_dashboard: 'Alert queue',
    nav_registry: 'Parcel registry',
    nav_timeline: 'Plot timeline',
    nav_audit: 'Audit trail',
    nav_verifier: 'Deed verifier',

    // Page titles & subtitles
    page_dashboard_title: 'Alert queue',
    page_dashboard_sub: 'Rule-triggered inconsistencies awaiting officer review',
    page_registry_title: 'Parcel registry',
    page_registry_sub: 'Sample cadastral records under screening',
    page_timeline_title: 'Plot timeline',
    page_timeline_sub: 'Chronological deeds, transfers, and mutations',
    page_audit_title: 'Audit trail',
    page_audit_sub: 'Immutable log of detection runs and review actions',
    page_verifier_title: 'Deed verifier',
    page_verifier_sub: 'SHA-256 integrity check against the registry archive',

    // Topbar actions & status
    engine_online: 'Engine online',
    engine_offline: 'Offline',
    connecting: 'Connecting',
    reset_data: 'Reset data',
    run_rules: 'Run rules R1–R5',
    running_rules: 'Running rules',
    theme_to_dark: 'Switch to dark theme',
    theme_to_light: 'Switch to light theme',
    lang_toggle_title: 'বাংলায় দেখুন',
    lang_label: 'বাং',

    // Dashboard metrics
    metric_total_alerts: 'Total alerts',
    metric_across_parcels: 'Across {count} parcels',
    metric_high_severity: 'High severity',
    metric_high_note: 'Double-sale, duplicate deed',
    metric_open: 'Open',
    metric_open_note: 'Awaiting inspection',
    metric_under_review: 'Under review',
    metric_under_review_note: 'Held for inquiry',
    metric_closed: 'Closed',
    review_progress: 'Review progress',

    // Dashboard breakdown & filters
    screening_rules_breakdown: 'Screening rules breakdown',
    inconsistency_queue: 'Inconsistency queue',
    search_alerts_placeholder: 'Search plot ID, rule, or explanation...',
    filter_all_severities: 'All severities',
    filter_all_statuses: 'All statuses',
    filter_all_rules: 'All rules',
    filter_high: 'High',
    filter_review: 'Review',
    filter_open: 'Open',
    filter_under_review: 'Under review',
    filter_resolved: 'Resolved',
    filter_dismissed: 'Dismissed',
    showing_alerts: 'Showing {filtered} of {total} alerts',
    btn_inspect: 'Inspect evidence',
    btn_view_plot: 'View plot',
    no_alerts_matched: 'No alerts match the active filters.',
    all_parcels_cleared: 'All parcels cleared by current screening rules.',

    // Rules
    rule_R1_name: 'Potential Double-Selling',
    rule_R1_short: 'Double-sale',
    rule_R2_name: 'Seller / Owner Conflict',
    rule_R2_short: 'Seller conflict',
    rule_R3_name: 'Registry / Mutation Mismatch',
    rule_R3_short: 'Mutation mismatch',
    rule_R4_name: 'Duplicate Deed Reference',
    rule_R4_short: 'Duplicate deed',
    rule_R5_name: 'Inconsistent Transfer Sequence',
    rule_R5_short: 'Broken chain',

    // Scenarios
    scenario_double_sale: 'Double-sale',
    scenario_clean_transfer: 'Clean transfer',
    scenario_cancelled_deed: 'Cancelled deed',
    scenario_seller_conflict: 'Seller conflict',
    scenario_mutation_mismatch: 'Mutation mismatch',
    scenario_duplicate_deed: 'Duplicate deed',
    scenario_broken_chain: 'Broken chain',

    // Review statuses
    status_open: 'Open',
    status_open_hint: 'Pending inspection',
    status_under_review: 'Under review',
    status_under_review_hint: 'Hold for registry inquiry',
    status_resolved: 'Resolved',
    status_resolved_hint: 'Ownership verified',
    status_dismissed: 'Dismissed',
    status_dismissed_hint: 'Exception justified',

    // Registry View
    search_parcels_placeholder: 'Search plot ID, mouza, khatian, dag, or owner',
    parcels_count: '{filtered} of {total} parcels',
    health_high_conflict: 'High conflict',
    health_needs_review: 'Needs review',
    health_consistent: 'Consistent',
    label_mouza: 'Mouza',
    label_owner: 'Recorded owner',
    label_khatian: 'Khatian',
    label_dag: 'Dag no.',
    label_area: 'Land area',
    label_deeds: 'Registered deeds',
    btn_view_timeline: 'View timeline',

    // Timeline View
    btn_back_to_queue: 'Back to alert queue',
    label_switch_plot: 'Switch parcel',
    label_cadastral_profile: 'Cadastral profile',
    label_active_inconsistencies: 'Active inconsistencies on this plot',
    label_timeline_heading: 'Title chain & transaction timeline',
    label_no_events: 'No timeline events recorded for this parcel.',
    btn_verify_deed_hash: 'Verify deed hash',
    btn_inspect_alert: 'Inspect alert',
    type_deed: 'Deed registration',
    type_mutation: 'Khatian mutation',
    type_transfer: 'Ownership transfer',
    tag_cancelled: 'Cancelled',
    tag_active: 'Active',
    tag_approved: 'Approved',
    tag_pending: 'Pending',

    // Verifier View
    verifier_card_title: 'Deed Document Integrity Verifier',
    verifier_card_desc: 'Computes cryptographic SHA-256 hash and cross-verifies against the registered archive record.',
    select_deed_label: 'Select sample deed to inspect:',
    simulate_tamper_label: 'Simulate document tampering / alteration:',
    tamper_toggle_text: 'Inject unauthorized modification into buyer/area metadata',
    hash_computed: 'Computed document SHA-256:',
    hash_expected: 'Archive registered SHA-256:',
    hash_matched_title: 'AUTHENTIC RECORD - Hash matches archive',
    hash_matched_desc: 'The cryptographic signature matches the registered Sub-Registry deed exactly. No modifications detected.',
    hash_tampered_title: 'TAMPER ALERT - Hash mismatch detected!',
    hash_tampered_desc: 'The document signature does not match the archive hash. Potential unauthorized deed alteration or fraudulent record.',
    deed_details_heading: 'Deed metadata details',

    // Audit Log View
    audit_heading: 'Screening and Officer Action Audit Log',
    search_audit_placeholder: 'Search audit logs by officer, plot, action, or note...',
    btn_refresh: 'Refresh',
    audit_col_action: 'Action',
    audit_col_officer: 'Officer / Actor',
    audit_col_plot: 'Affected refs',
    audit_col_time: 'Timestamp',
    audit_col_details: 'Action details',
    no_audit_logs: 'No audit records match the search.',

    // Modal Evidence Inspector
    inspector_title: 'Alert Evidence Inspector',
    inspector_subtitle: 'Detailed inconsistency evidence and officer review workflow',
    inspector_rule_triggered: 'Rule triggered',
    inspector_severity: 'Severity',
    inspector_current_status: 'Current status',
    inspector_rule_explanation: 'Rule detection explanation',
    inspector_evidence_data: 'Underlying evidence data',
    inspector_workflow_title: 'Update review status',
    inspector_notes_placeholder: 'Enter notes, rationale, or registry verification details...',
    inspector_btn_save: 'Save review decision',
    inspector_btn_cancel: 'Close',

    // Footer
    footer_text_1: 'PlotGuard screening prototype. Fictional sample records only.',
    footer_text_2: 'Alerts flag inconsistencies for human review and are not legal findings.',
  },

  bn: {
    // Brand & App
    brand_name: 'প্লটগার্ড',
    brand_tag: 'ভুমি রেকর্ড স্ক্রিনিং ও জালিয়াতি সনাক্তকরণ',
    workspace: 'কার্যক্ষেত্র',
    sample_scenarios: 'নমুনা পরিস্থিতি',
    demo_walkthrough: 'ডেমো গাইড',
    hackathon_track: 'ল্যান্ডটেক ইনোভেশন হ্যাকাথন ২০২৬ · ট্র্যাক পি৩',

    // Nav tabs
    nav_dashboard: 'সতর্কতা সারি',
    nav_registry: 'খতিয়ান রেজিস্ট্রি',
    nav_timeline: 'জমির সময়রেখা',
    nav_audit: 'অডিট ট্রেইল',
    nav_verifier: 'দলিল যাচাইকরণ',

    // Page titles & subtitles
    page_dashboard_title: 'সতর্কতা সারি',
    page_dashboard_sub: 'স্বয়ংক্রিয় সনাক্তকরণ নিয়মে ধরা পড়া সম্ভাব্য অসঙ্গতিসমূহ',
    page_registry_title: 'ক্যাডাস্ট্রাল রেকর্ড রেজিস্ট্রি',
    page_registry_sub: 'স্ক্রিনিংয়ের আওতাধীন নমুনা খতিয়ান ও দাগসমূহ',
    page_timeline_title: 'জমির সময়রেখা',
    page_timeline_sub: 'কালানুক্রমিক দলিল, নামজারি ও হস্তান্তরের ইতিহাস',
    page_audit_title: 'অডিট লগ ও পরিবর্তন ইতিহাস',
    page_audit_sub: 'নিয়মাবলি যাচাই ও কর্মকর্তাদের গৃহীত পদক্ষেপের অপরিবর্তনযোগ্য লগ',
    page_verifier_title: 'দলিল সত্যতা যাচাইকারী',
    page_verifier_sub: 'সাব-রেজিস্ট্রি আর্কাইভের সাথে SHA-256 হ্যাশ ইন্টিগ্রিটি পরীক্ষা',

    // Topbar actions & status
    engine_online: 'ইঞ্জিন সচল',
    engine_offline: 'সংযোগ বিচ্ছিন্ন',
    connecting: 'সংযোগ হচ্ছে...',
    reset_data: 'ডাটা রিসেট',
    run_rules: 'নিয়মাবলি R1–R5 চালান',
    running_rules: 'যাচাই চলছে...',
    theme_to_dark: 'ডার্ক মোড চালু করুন',
    theme_to_light: 'লাইট মোড চালু করুন',
    lang_toggle_title: 'Switch to English',
    lang_label: 'EN',

    // Dashboard metrics
    metric_total_alerts: 'মোট সতর্কতা',
    metric_across_parcels: '{count}টি পার্সেলের মধ্যে',
    metric_high_severity: 'উচ্চ ঝুঁকি',
    metric_high_note: 'দ্বৈত বিক্রয়, নকল দলিল',
    metric_open: 'উন্মুক্ত',
    metric_open_note: 'পরিদর্শনের অপেক্ষায়',
    metric_under_review: 'পর্যালোচনাধীন',
    metric_under_review_note: 'তদন্তের জন্য স্থগিত',
    metric_closed: 'নিষ্পত্তিকৃত',
    review_progress: 'পর্যালোচনার অগ্রগতি',

    // Dashboard breakdown & filters
    screening_rules_breakdown: 'স্ক্রিনিং নিয়মাবলির বিশ্লেষণ',
    inconsistency_queue: 'অসঙ্গতি তালিকা',
    search_alerts_placeholder: 'প্লট আইডি, নিয়ম বা বিবরণ দিয়ে খুঁজুন...',
    filter_all_severities: 'সকল ঝুঁকি',
    filter_all_statuses: 'সকল অবস্থা',
    filter_all_rules: 'সকল নিয়ম',
    filter_high: 'উচ্চ ঝুঁকি',
    filter_review: 'পর্যালোচনা',
    filter_open: 'উন্মুক্ত',
    filter_under_review: 'পর্যালোচনাধীন',
    filter_resolved: 'মীমাংসিত',
    filter_dismissed: 'বাতিলকৃত',
    showing_alerts: '{total} টির মধ্যে {filtered} টি সতর্কতা প্রদর্শিত',
    btn_inspect: 'প্রমাণাদি দেখুন',
    btn_view_plot: 'জমির তথ্য',
    no_alerts_matched: 'ফিল্টারের সাথে কোনো সতর্কতা মিলেনি।',
    all_parcels_cleared: 'সকল জমির রেকর্ড বর্তমান নিয়মে সঠিক পাওয়া গেছে।',

    // Rules
    rule_R1_name: 'দ্বৈত বিক্রয়ের ঝুঁকি (Potential Double-Selling)',
    rule_R1_short: 'দ্বৈত বিক্রয়',
    rule_R2_name: 'বিক্রেতা ও মালিকানা সংঘাত (Seller / Owner Conflict)',
    rule_R2_short: 'মালিকানা সংঘাত',
    rule_R3_name: 'রেজিস্ট্রি ও নামজারি অমিল (Registry / Mutation Mismatch)',
    rule_R3_short: 'নামজারি অমিল',
    rule_R4_name: 'ডুপ্লিকেট দলিলের ব্যবহার (Duplicate Deed Reference)',
    rule_R4_short: 'ডুপ্লিকেট দলিল',
    rule_R5_name: 'হস্তান্তরের ধারাবাহিকতা ভঙ্গ (Inconsistent Transfer Sequence)',
    rule_R5_short: 'ধারাবাহিকতা ভঙ্গ',

    // Scenarios
    scenario_double_sale: 'দ্বৈত বিক্রয়',
    scenario_clean_transfer: 'বৈধ হস্তান্তর',
    scenario_cancelled_deed: 'বাতিলকৃত দলিল',
    scenario_seller_conflict: 'মালিকানা সংঘাত',
    scenario_mutation_mismatch: 'নামজারি অমিল',
    scenario_duplicate_deed: 'ডুপ্লিকেট দলিল',
    scenario_broken_chain: 'ধারাবাহিকতা ভঙ্গ',

    // Review statuses
    status_open: 'উন্মুক্ত',
    status_open_hint: 'পরিদর্শনের অপেক্ষায়',
    status_under_review: 'পর্যালোচনাধীন',
    status_under_review_hint: 'সাব-রেজিস্ট্রি অনুসন্ধানের জন্য স্থগিত',
    status_resolved: 'মীমাংসিত',
    status_resolved_hint: 'মালিকানা নিশ্চিত ও যাচাইকৃত',
    status_dismissed: 'বাতিল',
    status_dismissed_hint: 'যৌক্তিক ব্যতিক্রম হিসেবে বিবেচিত',

    // Registry View
    search_parcels_placeholder: 'প্লট আইডি, মৌজা, খতিয়ান, দাগ নং বা মালিক দিয়ে খুঁজুন...',
    parcels_count: '{total} টির মধ্যে {filtered} টি পার্সেল',
    health_high_conflict: 'উচ্চ ঝুঁকি',
    health_needs_review: 'পর্যালোচনা প্রয়োজন',
    health_consistent: 'সঙ্গতিপূর্ণ',
    label_mouza: 'মৌজা',
    label_owner: 'রেকর্ডকৃত মালিক',
    label_khatian: 'খতিয়ান নং',
    label_dag: 'দাগ নং',
    label_area: 'জমির পরিমাণ',
    label_deeds: 'নিবন্ধিত দলিল',
    btn_view_timeline: 'সময়রেখা দেখুন',

    // Timeline View
    btn_back_to_queue: 'সতর্কতা তালিকায় ফিরে যান',
    label_switch_plot: 'অন্য পার্সেল নির্বাচন',
    label_cadastral_profile: 'ক্যাডাস্ট্রাল বিবরণী',
    label_active_inconsistencies: 'এই প্লটের সক্রিয় অসঙ্গতিসমূহ',
    label_timeline_heading: 'মালিকানার ধারাবাহিকতা ও দলিলের সময়রেখা',
    label_no_events: 'এই জমির জন্য কোনো ঐতিহাসিক রেকর্ড পাওয়া যায়নি।',
    btn_verify_deed_hash: 'দলিলের হ্যাশ যাচাই',
    btn_inspect_alert: 'সতর্কতা পরিদর্শন',
    type_deed: 'দলিল নিবন্ধন',
    type_mutation: 'নামজারি খতিয়ান',
    type_transfer: 'মালিকানা হস্তান্তর',
    tag_cancelled: 'বাতিলকৃত',
    tag_active: 'কার্যকর',
    tag_approved: 'অনুমোদিত',
    tag_pending: 'অপেক্ষমাণ',

    // Verifier View
    verifier_card_title: 'দলিল সত্যতা ও অখণ্ডতা যাচাইকারী',
    verifier_card_desc: 'ক্রিপ্টোগ্রাফিক SHA-256 হ্যাশ হিসাব করে সাব-রেজিস্ট্রি আর্কাইভের মূল রেকর্ডের সাথে যাচাই করে।',
    select_deed_label: 'যাচাইয়ের জন্য নমুনা দলিল নির্বাচন করুন:',
    simulate_tamper_label: 'দলিল বিকৃতি বা জালিয়াতি সিমুলেট করুন:',
    tamper_toggle_text: 'ক্রেতার নাম বা জমির পরিমাণে অননুমোদিত বিকৃতি প্রবেশ করান',
    hash_computed: 'গণনাকৃত দলিলের SHA-256 হ্যাশ:',
    hash_expected: 'আর্কাইভে সংরক্ষিত মূল SHA-256 হ্যাশ:',
    hash_matched_title: 'খাঁটি ও অবিকৃত দলিল - হ্যাশ হুবহু মিলেছে',
    hash_matched_desc: 'দলিলের ডিজিটাল স্বাক্ষর সাব-রেজিস্ট্রির মূল রেকর্ডের সাথে মিলেছে। কোনো অননুমোদিত পরিবর্তন পাওয়া যায়নি।',
    hash_tampered_title: 'সতর্কতা: দলিল বিকৃত বা জাল হওয়ার সম্ভাবনা!',
    hash_tampered_desc: 'বর্তমান দলিলের হ্যাশ মূল আর্কাইভের সাথে মেলেনি। দলিলের মূল তথ্যে অননুমোদিত পরিবর্তন সনাক্ত হয়েছে।',
    deed_details_heading: 'দলিলের মেটাডাটা ও বিবরণ',

    // Audit Log View
    audit_heading: 'স্ক্রিনিং ও কর্মকর্তা অ্যাকশন অডিট ট্রেইল',
    search_audit_placeholder: 'কর্মকর্তা, প্লট, অ্যাকশন বা বিবরণ দিয়ে খুঁজুন...',
    btn_refresh: 'রিফ্রেশ',
    audit_col_action: 'কার্যক্রম',
    audit_col_officer: 'কর্মকর্তা / সিস্টেম',
    audit_col_plot: 'সংশ্লিষ্ট রেফারেন্স',
    audit_col_time: 'সময় ও তারিখ',
    audit_col_details: 'বিবরণ',
    no_audit_logs: 'অনুসন্ধানের সাথে কোনো অডিট রেকর্ড পাওয়া যায়নি।',

    // Modal Evidence Inspector
    inspector_title: 'সতর্কতার প্রমাণাদি পরিদর্শক',
    inspector_subtitle: 'বিস্তারিত অসঙ্গতির প্রমাণ ও কর্মকর্তা পর্যালোচনা ব্যবস্থা',
    inspector_rule_triggered: 'লঙ্ঘিত নিয়ম',
    inspector_severity: 'ঝুঁকির মাত্রা',
    inspector_current_status: 'বর্তমান অবস্থা',
    inspector_rule_explanation: 'নিয়ম সনাক্তকরণের ব্যাখ্যা',
    inspector_evidence_data: 'প্রাসঙ্গিক প্রমাণাদি ও ডাটা',
    inspector_workflow_title: 'পর্যালোচনা সিদ্ধান্ত আপডেট করুন',
    inspector_notes_placeholder: 'যাচাইকরণের বিস্তারিত নোট বা অফিসিয়াল মন্তব্য লিখুন...',
    inspector_btn_save: 'সিদ্ধান্ত সংরক্ষণ করুন',
    inspector_btn_cancel: 'বন্ধ করুন',

    // Footer
    footer_text_1: 'প্লটগার্ড ভুমি রেকর্ড স্ক্রিনিং প্রোটোটাইপ। কেবল কাল্পনিক নমুনা রেকর্ড।',
    footer_text_2: 'সতর্কতাসমূহ কর্মকর্তাদের পর্যালোচনার উদ্দেশ্যে তৈরি, কোনো চূড়ান্ত আইনি সিদ্ধান্ত নয়।',
  }
};

const LanguageContext = createContext({
  lang: 'en',
  setLang: () => {},
  toggleLang: () => {},
  t: (key) => key
});

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('plotguard-lang') || 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('plotguard-lang', lang);
      document.documentElement.lang = lang;
    } catch {
      /* ignore */
    }
  }, [lang]);

  const toggleLang = () => {
    setLang(prev => (prev === 'en' ? 'bn' : 'en'));
  };

  const t = (key, params = {}) => {
    const dict = translations[lang] || translations.en;
    let text = dict[key] || translations.en[key] || key;
    if (params && typeof params === 'object') {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
