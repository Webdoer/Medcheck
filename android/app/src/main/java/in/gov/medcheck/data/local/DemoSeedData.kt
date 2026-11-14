package `in`.gov.medcheck.data.local

object DemoSeedData {
    const val DEMO_UPDATED_AT = "November 2026 · Seeded Set (DEMO)"

    val flaggedBatches: List<FlaggedBatchEntity> = listOf(
        FlaggedBatchEntity(
            id = "cdsco-demo-01",
            drugName = "Cough Care DX Syrup",
            genericName = "Dextromethorphan Hydrobromide Syrup (100ml)",
            batchNumber = "CC-8402",
            manufacturer = "Maiden Relief Formulations Pvt. Ltd.",
            reasonSummary = "Diethylene Glycol (DEG) content exceeded permissible safety limit in lab testing.",
            state = "Uttar Pradesh",
            alertMonth = "October 2026",
            bulletinSource = "DEMO · CDSCO NSQ Alert List (Sr. No. 14)",
            testingLab = "CDL Kolkata",
            severity = "nsq",
            datasetLabel = "DEMO"
        ),
        FlaggedBatchEntity(
            id = "cdsco-demo-02",
            drugName = "Guaifenesin Cough Syrup IP",
            genericName = "Guaifenesin + Terbutaline Oral Solution",
            batchNumber = "GP-2041",
            manufacturer = "Saraswati Bio-Remedies",
            reasonSummary = "Sample failed Assay test (active ingredient below 62% of labeled claim).",
            state = "Uttar Pradesh",
            alertMonth = "October 2026",
            bulletinSource = "DEMO · CDSCO NSQ Alert List (Sr. No. 29)",
            testingLab = "RDTL Chandigarh",
            severity = "nsq",
            datasetLabel = "DEMO"
        ),
        FlaggedBatchEntity(
            id = "cdsco-demo-03",
            drugName = "Calpol 650 Tablets",
            genericName = "Paracetamol IP 650mg",
            batchNumber = "KL-9021-A",
            manufacturer = "Unverified / Suspected Spurious Batch",
            reasonSummary = "Declared spurious by manufacturer inquiry; packaging and weight failed IP standards.",
            state = "Maharashtra",
            alertMonth = "September 2026",
            bulletinSource = "DEMO · CDSCO Spurious Drug Alert (Sr. No. 04)",
            testingLab = "CDTL Mumbai",
            severity = "spurious",
            datasetLabel = "DEMO"
        ),
        FlaggedBatchEntity(
            id = "cdsco-demo-04",
            drugName = "Calcium + Vitamin D3 Tablets",
            genericName = "Calcium Carbonate 500mg + Cholecalciferol",
            batchNumber = "CD-8812",
            manufacturer = "Shivalik Labs Pvt. Ltd.",
            reasonSummary = "Failed Disintegration and Dissolution test in state drug lab screening.",
            state = "Himachal Pradesh",
            alertMonth = "October 2026",
            bulletinSource = "DEMO · CDSCO NSQ Alert List (Sr. No. 41)",
            testingLab = "RDTL Guwahati",
            severity = "nsq",
            datasetLabel = "DEMO"
        ),
        FlaggedBatchEntity(
            id = "cdsco-demo-05",
            drugName = "Azithromycin Tablets IP 500mg",
            genericName = "Azithromycin Dihydrate IP 500mg",
            batchNumber = "AZ-5540",
            manufacturer = "Navjeevan Meditech",
            reasonSummary = "Failed Assay and Dissolution criteria for Azithromycin content.",
            state = "Bihar",
            alertMonth = "September 2026",
            bulletinSource = "DEMO · CDSCO NSQ Alert List (Sr. No. 19)",
            testingLab = "CDL Kolkata",
            severity = "nsq",
            datasetLabel = "DEMO"
        ),
        FlaggedBatchEntity(
            id = "cdsco-demo-06",
            drugName = "Pantoprazole Gastro-Resistant 40mg",
            genericName = "Pantoprazole Sodium IP 40mg",
            batchNumber = "PT-1108",
            manufacturer = "Arogya Pharma Works",
            reasonSummary = "Failed acid-resistance stage dissolution test; tablets disintegrated prematurely.",
            state = "Madhya Pradesh",
            alertMonth = "October 2026",
            bulletinSource = "DEMO · CDSCO NSQ Alert List (Sr. No. 08)",
            testingLab = "CDTL Chennai",
            severity = "nsq",
            datasetLabel = "DEMO"
        ),
        FlaggedBatchEntity(
            id = "cdsco-demo-07",
            drugName = "Amoxicillin + Clavulanate 625mg",
            genericName = "Amoxycillin 500mg + Clavulanic Acid 125mg",
            batchNumber = "AM-108B",
            manufacturer = "Kaveri Lifesciences",
            reasonSummary = "Clavulanic acid assay significantly below standard limits.",
            state = "Tamil Nadu",
            alertMonth = "September 2026",
            bulletinSource = "DEMO · CDSCO NSQ Alert List (Sr. No. 33)",
            testingLab = "CDTL Chennai",
            severity = "nsq",
            datasetLabel = "DEMO"
        ),
        FlaggedBatchEntity(
            id = "cdsco-demo-08",
            drugName = "Montelukast + Levocetirizine",
            genericName = "Montelukast Sodium 10mg + Levocetirizine 5mg",
            batchNumber = "MK-6104",
            manufacturer = "Apex Remedies (Unlicensed Label)",
            reasonSummary = "Reported spurious; genuine manufacturer confirmed batch code was never produced.",
            state = "Gujarat",
            alertMonth = "October 2026",
            bulletinSource = "DEMO · CDSCO Spurious Drug Alert (Sr. No. 02)",
            testingLab = "CDTL Mumbai",
            severity = "spurious",
            datasetLabel = "DEMO"
        ),
        FlaggedBatchEntity(
            id = "cdsco-demo-09",
            drugName = "Cefixime Oral Suspension IP",
            genericName = "Cefixime Trihydrate 50mg/5ml",
            batchNumber = "CX-091I",
            manufacturer = "Pratap Medilabs",
            reasonSummary = "Failed Assay test after reconstitution.",
            state = "Punjab",
            alertMonth = "September 2026",
            bulletinSource = "DEMO · CDSCO NSQ Alert List (Sr. No. 44)",
            testingLab = "RDTL Chandigarh",
            severity = "nsq",
            datasetLabel = "DEMO"
        ),
        FlaggedBatchEntity(
            id = "cdsco-demo-10",
            drugName = "Omeprazole Capsules IP 20mg",
            genericName = "Omeprazole Enteric Coated Capsules 20mg",
            batchNumber = "OM-4019",
            manufacturer = "Narmada Biopharma",
            reasonSummary = "Enteric coating failed buffer stage dissolution.",
            state = "Maharashtra",
            alertMonth = "September 2026",
            bulletinSource = "DEMO · CDSCO NSQ Alert List (Sr. No. 28)",
            testingLab = "CDTL Mumbai",
            severity = "nsq",
            datasetLabel = "DEMO"
        )
    )
}
