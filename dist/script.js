'use strict';
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
menu.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(expanded));
  navigation.classList.toggle('open', expanded);
  menu.querySelector('span').textContent = expanded ? '−' : '＋';
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    menu.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('open');
    menu.querySelector('span').textContent = '＋';
  }
});
document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(filter => {
      const selected = filter === button;
      filter.classList.toggle('active', selected);
      filter.setAttribute('aria-pressed', String(selected));
    });
    document.querySelectorAll('.project-card').forEach(card => {
      card.hidden = button.dataset.filter !== 'all' && !card.dataset.category.split(' ').includes(button.dataset.filter);
    });
  });
});
const projectDetails = {
  crime: {
    type: 'DATA ENGINEERING / URBAN ANALYTICS', title: 'CrimeFlow LA',
    description: 'An end-to-end team project that turns Los Angeles crime reports into a Databricks analytical lakehouse and Tableau dashboards. The project report documents a source snapshot of 1,004,991 records across 28 columns; this is a source profiling count, not a verified Gold-layer row count.',
    approach: 'Profiled the source with Alteryx and ingested the CSV from a Unity Catalog volume into Bronze. The PySpark Silver layer drops null primary crime codes and reporting districts, parses dates, normalizes location text, handles missing values, and expands up to four crime codes per incident. Four AUTO CDC flows maintain crime-code, status, weapon, and location dimensions. A streaming append flow joins those dimensions into the Gold fact table, while standalone SQL creates the fifth, calendar dimension.',
    result: 'Delivered a Gold fact table and five dimensions, plus a packaged Tableau workbook with two dashboards and nine worksheets covering temporal patterns, geographic hotspots, crime types, and weapon usage. The fact grain is incident–crime-code occurrence, so unique incident counts must use distinct incident identifiers. Dashboard counts describe reported records, not population-adjusted crime rates. The repository includes the notebook, data model, original report, setup guide, and documented data-quality limitations.',
    tags: ['Databricks', 'PySpark', 'AUTO CDC', 'Alteryx', 'Dimensional modeling', 'Tableau'], repo: 'crimeflow-la'
  },
  food: {
    type: 'DATA ENGINEERING / PUBLIC HEALTH', title: 'Food Inspection ETL',
    description: 'Chicago and Dallas publish food inspection data with very different structures: 17 columns in one source and 114 in the other. This project brings both into a consistent analytical model.',
    approach: 'Profiled the data in Alteryx, then implemented Bronze, Silver, and Gold layers with PySpark and Databricks Delta Live Tables. Standardized dates and violations, enforced data quality expectations, and tracked facility changes with SCD Type 2 dimensions. A bridge table resolves the many-to-many relationship between inspections and violations.',
    result: 'Unified 130,462 Chicago records and 47,219 Dallas records into a dimensional model with Power BI reporting for inspection trends, geographic analysis, facility scorecards, and record-level drill-down.',
    tags: ['PySpark', 'Databricks', 'Delta Live Tables', 'Alteryx', 'Power BI'], repo: 'Food_Inspection_ETL'
  },
  churn: {
    type: 'MACHINE LEARNING / EXPLAINABILITY', title: 'Customer Churn, Explained',
    description: 'A customer retention workflow that predicts churn risk and explains the factors behind it, using the IBM Telco dataset of 7,043 customers.',
    approach: 'Compared logistic regression, random forest, XGBoost, and an MLP. Addressed class imbalance within cross-validation folds. Used SHAP and LIME to explain predictions and checked top drivers against actual cohort churn rates. Built a Streamlit dashboard with customer scoring, segment analysis, and a model card.',
    result: 'The tuned XGBoost model achieved a reported test AUC-ROC of 0.84. Lowering the decision threshold to 0.38 caught 76.2% of churners, with 53.9% precision. The tradeoff is documented alongside the model results in the repository.',
    tags: ['Python', 'XGBoost', 'SHAP', 'LIME', 'Streamlit'], repo: 'customer-churn-xai'
  },
  city: {
    type: 'ANALYTICS / CITY OPERATIONS', title: 'Reading Kansas City’s Pulse',
    description: 'An end-to-end analysis of 1.5M+ Kansas City 311 service requests, investigating how residents use city services and where requests take longer to resolve.',
    approach: 'Profiled and cleaned the data with Alteryx, addressing duplicate records, inconsistent categories, missing values, and invalid closure dates. Wrote ten SQL Server analyses using aggregations, CTEs, and window functions, then built Tableau and Power BI dashboards.',
    result: 'Surfaced department workload patterns, geographic hotspots, channel preferences, and resolution-time differences. Phone accounted for roughly 77% of requests. Invalid negative closure times were identified as data quality issues rather than interpreted as operational performance.',
    tags: ['Alteryx', 'SQL Server', 'Tableau', 'Power BI'], repo: '311_kc_service_requests'
  },
  pets: {
    type: 'DATA ENGINEERING / VISUAL ANALYTICS', title: 'Seattle Pet Licenses',
    description: 'A pet licensing data pipeline and analytics project connecting orchestration, dimensional modeling, and visual exploration.',
    approach: 'Architected an Azure Data Factory master workflow with three sub-pipelines to ingest, transform, and bulk-load 13 Snowflake datasets. Designed a five-table star schema, resolved breed hierarchies with species-scoped surrogate keys, and joined ZIP codes to geographic information.',
    result: 'Post-load validation checked dimension and fact tables for data loss. Tableau dashboards made the licensing data explorable by species, breed, and geography.',
    tags: ['Azure Data Factory', 'Snowflake', 'Azure Blob Storage', 'Parquet', 'Tableau'], repo: 'Seattle_Pet_Licenses_Analysis'
  }
};
const dialog = document.querySelector('#project-dialog');
document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => {
    const project = projectDetails[button.dataset.project];
    ['type', 'title', 'description', 'approach', 'result'].forEach(key => {
      document.querySelector('#dialog-' + key).textContent = project[key];
    });
    const tags = document.querySelector('#dialog-tags');
    tags.replaceChildren(...project.tags.map(tag => {
      const span = document.createElement('span');
      span.textContent = tag;
      return span;
    }));
    document.querySelector('#dialog-source').href = 'https://github.com/atharvagadgil13/' + project.repo;
    document.body.classList.add('dialog-open');
    dialog.showModal();
  });
});
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
dialog.addEventListener('click', event => {
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
document.querySelector('.copy-email').addEventListener('click', async () => {
  const status = document.querySelector('.copy-status');
  try {
    await navigator.clipboard.writeText('gadgil.at@northeastern.edu');
    status.textContent = 'Email copied — let’s connect.';
  } catch {
    status.textContent = 'gadgil.at@northeastern.edu';
  }
});
document.querySelector('#year').textContent = new Date().getFullYear();
