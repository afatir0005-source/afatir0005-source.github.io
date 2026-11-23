// ──────────────────────────────────────────────────────────────
//  All page content lives here.
//
//  EXPERIENCE  → the tabs in "Work experience" (first tab = latest).
//                Each tab has `cards`: the 3D drag carousel. A card with
//                a `project` id opens that project page; a card without
//                one is an activity (seminar, role, responsibility).
//  PROJECTS    → the "Selected work" slider (featured: true) and the full
//                index; each opens project.html?id=<id>.
//                Drop screenshots into assets/projects/<id>/ and list them
//                in `images`. `art` picks the generated illustration style:
//                "window" | "graph" | "camera" | "chip" | "pipeline"
//  GYM         → the questionnaire card beside About
//
//  domain: "qa" | "cv" | "dl" | "eng"
// ──────────────────────────────────────────────────────────────

window.SITE_DATA = {

  role: "Product Engineer",
  company: "OneScreen Solutions",
  companyUrl: "https://www.onescreensolutions.com",
  city: "Islamabad, Pakistan",

  builds: ["test automation platforms", "Selenium regression suites", "YOLO detectors", "vision models for the edge", "firmware test rigs"],

  marquee: ["QA Automation", "Selenium", "Python", "Firmware testing", "Computer Vision", "YOLO", "PyTorch", "OpenCV", "Deep Learning", "Raspberry Pi", "ADB", "Regression suites"],

  about: {
    lead: "QA automation by trade, computer vision by habit. At OneScreen I test interactive displays and firmware, and write the automation so nobody has to click through five hundred cases by hand; on the side I train vision models for Upwork clients.",
    paras: [
      "Off the clock I lift most mornings, shoot photos most weekends, play snooker when there is time, and spend long weekends in cities I have not seen. If you have a PR I should chase, send it."
    ]
  },

  // ⚠ Update the PR line with your real numbers.
  gym: {
    eyebrow: "questionnaire",
    pages: [
      {
        title: "Ask me about the gym",
        sub: "Three questions people actually ask.",
        items: [
          { q: "Which exercise do you love the most?", a: "Incline dumbbell press. Nothing else makes a chest day feel finished." },
          { q: "What is your PR on the incline DB press?", a: "32.5 kg per hand for 6 clean reps. Chasing the 35s before the year ends." },
          { q: "How do you track it?", a: "A spreadsheet, of course. Sets, reps, load, RPE. Progressive overload is just regression testing for the body." }
        ]
      },
      {
        title: "About weight gain and loss",
        sub: "The whole science, in two answers.",
        items: [
          { q: "How to lose weight?", a: "Eat in a calorie deficit. Everything else is detail." },
          { q: "How to gain?", a: "Eat in a calorie surplus, and lift so the extra goes where you want it." }
        ]
      },
      {
        title: "Ask me about the camera",
        sub: "Weekend photographer, honest answers.",
        items: [
          { q: "Portrait or landscape?", a: "Landscape for the hills, portrait for people. Most weekends it ends up landscape." },
          { q: "Prime or zoom lens?", a: "A 50 mm prime. One focal length makes you move your feet and think about the frame." },
          { q: "Best light to shoot in?", a: "Golden hour, always. Margalla Hills around five in the evening, nothing comes close." }
        ]
      }
    ]
  },

  stats: [
    { value: 500,  suffix: "+", label: "firmware test cases automated" },
    { value: 150,  suffix: "+", label: "defects caught before release" },
    { value: 40,   suffix: "+", label: "app modules under Selenium" },
    { value: 5000, suffix: "+", label: "images annotated" }
  ],

  domains: { qa: "QA & Automation", cv: "Computer Vision", dl: "Deep Learning", eng: "Engineering" },

  experience: [
    {
      id: "onescreen",
      tab: "OneScreen",
      current: true,
      org: "OneScreen Solutions",
      role: "Product Engineer",
      place: "Islamabad, Pakistan",
      period: "Aug 2025 – Present",
      kind: "Full-time",
      what: "I own quality for interactive flat panels, OPS modules and the OneScreen Write app, and I write the automation that replaces manual regression.",
      solves: "Every firmware build used to need hours of hand testing per device. Now a 500+ case platform runs it over ADB, and Selenium covers 40+ Write modules, so defects are caught before customers see them.",
      skills: ["Python", "Selenium", "ADB", "Android firmware", "Regression testing", "Test planning", "Asana", "Excel"],
      groups: [
        { title: "What I did at OneScreen", cards: [
          { title: "Automated Firmware Testing Platform", sub: "500+ cases over ADB", project: "firmware-platform" },
          { title: "OneScreen Write Automation", sub: "40+ modules in Selenium", project: "write-automation" },
          { title: "Release QA & ODM Coordination", sub: "CVTE, firmware, customers", kind: "Management" },
          { title: "Remote Testing Plans & SOPs", sub: "20+ runs with Logistics", kind: "Responsibility" },
          { title: "Issue & Performance Tracking", sub: "Asana + Excel", kind: "Responsibility" }
        ] }
      ],
      confidential: true
    },
    {
      id: "upwork",
      tab: "Upwork",
      org: "Upwork",
      role: "Freelance Computer Vision Developer",
      place: "Remote",
      period: "Jul 2022 – Present",
      kind: "Freelance",
      what: "Detection, recognition and OCR systems for clients around the world, from dataset to deployed model.",
      solves: "Clients arrive with a camera feed and a question: read this plate, recognise this gesture, measure this shape. I pick the model that fits their hardware and ship it. The code stays with them, so each job is described, not linked.",
      skills: ["PyTorch", "OpenCV", "YOLO v5 / v8 / v11", "ViT", "Swin", "Tesseract", "Roboflow", "CVAT", "LabelImg"],
      groups: [
        { title: "Client projects on Upwork", cards: [
          { title: "Automatic Number Plate Recognition", sub: "Client project", project: "anpr" },
          { title: "Sign Language Recogniser", sub: "Client project", project: "sign-recogniser" },
          { title: "Superellipse Fitting with FLED", sub: "Client project", project: "superellipse" },
          { title: "Detector & Transformer Benchmarks", sub: "YOLO v5/v8/v11 · ViT · Swin", project: "benchmarks" },
          { title: "5,000+ Images Annotated", sub: "Roboflow · CVAT · LabelImg", kind: "Data work" }
        ] }
      ],
      confidential: true
    },
    {
      id: "nust",
      tab: "NUST",
      org: "National University of Sciences and Technology (NUST)",
      role: "BE Electrical Engineering",
      place: "H-12, Islamabad, Pakistan",
      period: "Nov 2021 – Jul 2025",
      kind: "Degree",
      what: "A core electrical engineering degree, steered toward computer vision and deep learning. Most of the projects on this site started here.",
      solves: "Four years of building things that had to work on real hardware: a final-year project that reads banknotes aloud, detectors trained end to end, and 10+ IEEE sessions run for other students.",
      skills: ["Python", "C / C++", "MATLAB", "PSpice", "Embedded systems", "Signals & systems", "Machine learning"],
      groups: [
        { title: "Academic projects", cards: [
          { title: "AI-Powered Smart Glasses", sub: "Final Year Project", project: "smart-glasses" },
          { title: "Video Captioning with ViT", sub: "Course project", project: "video-captioning" },
          { title: "Custom Object Detection with YOLOv8", sub: "Course project", project: "yolov8-custom" },
          { title: "Identity Card Scanner (CNIC)", sub: "Course project", project: "cnic-scanner" }
        ] },
        { title: "Societies & events", cards: [
          { title: "10+ IEEE Sessions", sub: "Conducted for students", kind: "IEEE" },
          { title: "Seminars & Workshops", sub: "Organised and hosted", kind: "Events" },
          { title: "12+ Degree Projects", sub: "Hardware and software", kind: "Co-curricular" }
        ] }
      ]
    }
  ],

  // Shorter internships, shown in their own section after the tabs.
  internships: [
    {
      id: "hexler",
      org: "Hexler Tech",
      role: "Computer Vision Intern",
      place: "Islamabad, Pakistan",
      period: "Mar – Apr 2025",
      what: "Data and model work aimed at single-board computers: a YOLO model for bus-driver negligence and 1,000+ validated entries for the Common Voice Urdu dataset.",
      skills: ["YOLO", "Python", "SBC deployment", "Dataset curation"],
      images: ["assets/internships/hexler/1.jpg"]
    },
    {
      id: "fccl",
      org: "Fauji Cement Company Limited (FCCL)",
      role: "Electrical Engineering Intern",
      place: "Jhang Bhatar, Pakistan",
      period: "Jun – Aug 2023",
      what: "Production-floor engineering in a cement plant: shift scheduling under EHS rules, line-layout analysis, and a transformer line taken from 30 MVA to 40 MVA.",
      skills: ["Transformers", "PLC", "Production planning", "EHS", "SAP"],
      images: ["assets/internships/fccl/1.jpg", "assets/internships/fccl/2.jpg", "assets/internships/fccl/3.jpg"]
    }
  ],

  projects: [
    {
      id: "firmware-platform", featured: true, art: "window",
      title: "Automated Firmware Testing Platform",
      tag: "OneScreen · 2025 – present", domain: "qa", org: "OneScreen Solutions", period: "Aug 2025 – Present", year: "2025",
      summary: "A web-based test runner with 500+ cases that needs nothing but an ADB connection.",
      problem: "Every firmware build for the interactive displays had to be checked by hand: boot, touch, HDMI, OPS, sleep and wake, dozens of app flows. It took hours per device and was never done the same way twice.",
      approach: "I wrote a browser-based platform that talks to the display over ADB, runs a registry of test cases and reports per case with logs and screenshots. One suite covers every OneScreen interactive display and OPS device.",
      outcome: "500+ cases run unattended per build. Coverage up 30%. 150+ bugs and major defects caught before release, with findings coordinated back to CVTE for the next firmware.",
      pipeline: ["Build drops", "ADB connect", "Case registry", "Runner", "Logs + screens", "Report → Asana"],
      bullets: ["Device discovery over ADB, with model-specific case sets for IFPs and OPS modules.", "Per-case timeouts, retries and flaky-case quarantine so one hang never blocks the run.", "Run history per firmware build, so a regression is traced to the build that introduced it."],
      stack: ["Python", "ADB", "Android", "Web dashboard", "Regression testing"], images: [], confidential: true
    },
    {
      id: "write-automation", featured: true, art: "window",
      title: "OneScreen Write Automation",
      tag: "OneScreen · 2025 – present", domain: "qa", org: "OneScreen Solutions", period: "2025 – Present", year: "2025",
      summary: "Event-driven Selenium workflows across 40+ functional modules of the whiteboard app.",
      problem: "The Write app has a large surface: pens, shapes, pages, import, export, multi-user. Regression on each release meant a full day of manual clicking.",
      approach: "Modelled each module as a set of events and expected states, then built Selenium workflows that drive the app the way a teacher would and assert on the result.",
      outcome: "40+ modules automated. Suites run per build and report by module, so a regression is found the same day it lands.",
      pipeline: ["Build", "Selenium grid", "Module suites", "Assertions", "Report"],
      bullets: ["Shared page-object layer so a UI change is fixed in one place.", "Screenshots on failure attached to the report for triage."],
      stack: ["Selenium", "Python", "Page objects", "Regression testing"], images: [], confidential: true
    },
    {
      id: "release-qa", art: "graph", noLink: true,
      title: "Release QA & ODM Coordination",
      tag: "OneScreen · ongoing", domain: "qa", org: "OneScreen Solutions", period: "Aug 2025 – Present", year: "2025",
      summary: "The human side of QA: customers, logistics and the display manufacturer.",
      problem: "Fixes found in testing only matter if they land in the next firmware, and customers need answers while they wait.",
      approach: "A single tracked loop: defects logged in Asana with logs and repro steps, triaged with CVTE (the display ODM), verified on the next build, and closed with the customer.",
      outcome: "20+ remote testing runs planned with Logistics, SOPs and QA documentation written, and customer technical queries handled end to end.",
      pipeline: ["Defect", "Asana ticket", "CVTE triage", "Next firmware", "Verify", "Customer"],
      bullets: ["Performance logs tracked per build in Excel.", "SOPs so any engineer can run a remote test plan the same way."],
      stack: ["Asana", "Excel", "SOPs", "Customer support"], images: [], confidential: true
    },
    {
      id: "smart-glasses", featured: true, art: "camera",
      title: "AI-Powered Smart Glasses",
      tag: "NUST · Final Year Project", domain: "cv", org: "NUST", period: "Jan – Jul 2025", year: "2025",
      summary: "Glasses that read currency notes aloud for visually impaired users.",
      problem: "A visually impaired person cannot tell a 100-rupee note from a 1,000. Phone apps help, but a phone needs a free hand and a steady aim.",
      approach: "A camera on the glasses feeds a YOLOv8 note detector on a Raspberry Pi 4. The detected denomination is spoken through a text-to-speech engine. A GPIO button triggers a read.",
      outcome: "97% detection accuracy. 16–20 FPS in real time after resolution reduction and model quantisation. Modular enough to be practical to wear.",
      pipeline: ["Camera", "OpenCV capture", "YOLOv8 (quantised)", "Denomination", "pyttsx3 TTS", "Speaker"],
      bullets: ["Dataset of Pakistani notes across lighting, folds and partial views.", "Quantised and resolution-tuned for the Pi 4 without losing accuracy.", "Power-efficient processing loop so the battery lasts a day."],
      stack: ["YOLOv8", "Raspberry Pi 4", "OpenCV", "Quantisation", "pyttsx3", "GPIO"], images: []
    },
    {
      id: "anpr", featured: true, art: "camera",
      title: "Automatic Number Plate Recognition",
      tag: "Upwork client", domain: "cv", org: "Upwork client", period: "Client project", year: "2023",
      summary: "Plate localisation, character segmentation and OCR as one pipeline.",
      problem: "The client needed plates read from live camera feeds at an entrance, not from clean stills.",
      approach: "A detector finds the plate, a second stage segments and reads the characters, with filtering to handle glare, angle and motion blur.",
      outcome: "Delivered as a Python service the client runs on their own hardware. Details are under NDA.",
      pipeline: ["Camera feed", "Plate detector", "Segmentation", "OCR", "Plate string"],
      bullets: ["Tuned for angle and lighting variation at a real gate.", "Runs on a standard CPU at camera frame rate."],
      stack: ["YOLO", "OpenCV", "OCR", "Python"], images: [], confidential: true
    },
    {
      id: "sign-recogniser", featured: true, art: "graph",
      title: "Sign Language Recogniser",
      tag: "Upwork client · home lab follow-up", domain: "dl", org: "Upwork client, then home lab", period: "Client project · Jan – Mar 2026", year: "2026",
      summary: "Hand landmarks in, gesture classes out, in real time.",
      problem: "Recognise signs from a laptop webcam without special hardware.",
      approach: "MediaPipe supplies 21 hand landmarks per frame. The client version used a lightweight classifier. My follow-up uses a ResNet18 backbone pretrained on ImageNet with a custom head and dropout, for American Sign Language.",
      outcome: "Real-time predictions with on-screen confidence on CPU.",
      pipeline: ["Webcam", "MediaPipe hands", "21 landmarks", "ResNet18 + head", "ASL class"],
      bullets: ["Geometry-aware cropping driven by the landmarks.", "Dropout in the head for regularisation on a small dataset."],
      stack: ["MediaPipe", "PyTorch", "ResNet18", "OpenCV"], images: []
    },
    {
      id: "superellipse", art: "graph",
      title: "Superellipse Fitting with FLED",
      tag: "Upwork client", domain: "cv", org: "Upwork client", period: "Client project", year: "2024",
      summary: "A shape-analysis problem solved with fast least-squares ellipse fitting.",
      problem: "Measure object shapes in noisy images where standard contour fitting failed.",
      approach: "Multi-layer filtering to cut noise, then superellipse fitting on the cleaned edges.",
      outcome: "Feature-extraction accuracy improved enough for the client's downstream measurement. Under NDA.",
      pipeline: ["Image", "Multi-layer filtering", "Edge extraction", "Superellipse fit", "Parameters"],
      bullets: [], stack: ["OpenCV", "NumPy", "Image filtering"], images: [], confidential: true
    },
    {
      id: "benchmarks", art: "window",
      title: "Detector & Transformer Benchmarks",
      tag: "Upwork · across projects", domain: "dl", org: "Upwork clients", period: "2023 – 2025", year: "2024",
      summary: "YOLO v5, v8 and v11 against Vision Transformers and Swin on client datasets.",
      problem: "Clients ask for 'the best model'. The honest answer depends on their hardware, latency budget and data.",
      approach: "Same split, same metrics, every candidate: YOLO v5/v8/v11, ViT and Swin, trained on 5,000+ images annotated in Roboflow, CVAT and LabelImg.",
      outcome: "Accuracy, speed and model size reported side by side so each client picked the right trade-off for their deployment.",
      pipeline: ["Annotate", "Split", "Train 5 models", "Evaluate", "Report"],
      bullets: [], stack: ["YOLO v5 / v8 / v11", "ViT", "Swin", "Roboflow", "CVAT", "LabelImg"], images: [], confidential: true
    },
    {
      id: "virtual-tryon", featured: true, art: "pipeline",
      title: "AI Virtual Try-On System",
      tag: "Home lab · 2025", domain: "dl", org: "Personal project", period: "Sep – Nov 2025", year: "2025",
      summary: "GAN-based try-on for fashion e-commerce: warp a garment onto a person and synthesise the result.",
      problem: "Show a shopper what a garment looks like on them from one photo.",
      approach: "Multi-modal feature fusion with a 41-channel input (3 RGB + 18 pose heatmaps + 20 human-parsing channels) feeding a generator, judged by a spectral-normalised PatchGAN discriminator with 2.8M parameters.",
      outcome: "Stable adversarial training with adversarial, perceptual and L1 losses.",
      pipeline: ["Person photo", "Pose + parsing", "41-ch fusion", "Generator", "PatchGAN", "Try-on image"],
      bullets: [], stack: ["PyTorch", "GANs", "PatchGAN", "Pose estimation", "Human parsing"], images: []
    },
    {
      id: "video-captioning", art: "pipeline",
      title: "Video Captioning with Vision Transformer",
      tag: "NUST · 2025", domain: "dl", org: "NUST", period: "Feb – Jun 2025", year: "2025",
      summary: "Writes a sentence describing a short video clip.",
      problem: "Generate coherent captions for short clips from the MSVD dataset.",
      approach: "About 1,900 MSVD videos pre-processed with VGG16 frame features and tokenised captions. Vision Transformer embeddings capture spatial structure across frames; an LSTM decoder generates the caption word by word.",
      outcome: "Coherent textual descriptions on held-out clips.",
      pipeline: ["Video", "Frames", "VGG16 / ViT features", "LSTM decoder", "Caption"],
      bullets: [], stack: ["TensorFlow / Keras", "ViT", "LSTM", "VGG16", "MSVD"], images: []
    },
    {
      id: "yolov8-custom", art: "camera",
      title: "Custom Object Detection with YOLOv8",
      tag: "NUST · 2024", domain: "cv", org: "NUST", period: "Mar – Apr 2024", year: "2024",
      summary: "Dataset to live inference, end to end.",
      problem: "Learn the full detection workflow on a custom class set.",
      approach: "Annotated and prepared the dataset in Roboflow with rotation, flipping and scaling augmentation. Trained YOLOv8 and deployed it with Python and OpenCV for live video inference and tracking.",
      outcome: "Real-time detection with high precision on the custom classes.",
      pipeline: ["Images", "Roboflow annotation", "Augmentation", "YOLOv8 train", "Live inference"],
      bullets: [], stack: ["YOLOv8", "Roboflow", "OpenCV", "Python"], images: []
    },
    {
      id: "cnic-scanner", art: "camera",
      title: "Identity Card Scanner (CNIC)",
      tag: "NUST · 2022", domain: "cv", org: "NUST", period: "Apr – Aug 2022", year: "2022",
      summary: "Finds a Pakistani CNIC, reads it and checks the face.",
      problem: "Extract and verify ID details automatically, under varying backgrounds and lighting.",
      approach: "YOLOv5 detects and localises the card in real time. Face detection matches the printed photo against the holder's live camera image. Tesseract OCR pulls the CNIC fields.",
      outcome: "High accuracy on CNIC fields; robust localisation across conditions.",
      pipeline: ["Camera", "YOLOv5 card detect", "Face match", "Tesseract OCR", "Fields"],
      bullets: [], stack: ["YOLOv5", "Tesseract OCR", "Face detection", "OpenCV"], images: []
    },
    {
      id: "bus-driver", art: "chip",
      title: "Bus-Driver Negligence Detection",
      tag: "Hexler Tech · 2025", domain: "cv", org: "Hexler Tech", period: "Jan – Apr 2025", year: "2025",
      summary: "A YOLO model that flags distracted driving, built to run on a single-board computer.",
      problem: "Detect driver negligence from an in-cabin camera on cheap hardware.",
      approach: "Trained a YOLO model on in-cabin footage and exported it for an SBC in the vehicle.",
      outcome: "Deployed to the SBC target.",
      pipeline: ["Cabin camera", "YOLO", "Negligence class", "Alert"],
      bullets: [], stack: ["YOLO", "Python", "SBC deployment"], images: []
    },
    {
      id: "common-voice", art: "graph", noLink: true,
      title: "Common Voice Urdu",
      tag: "Hexler Tech · 2025", domain: "dl", org: "Hexler Tech", period: "Jan – Apr 2025", year: "2025",
      summary: "1,000+ validated entries contributed to the open Urdu speech dataset.",
      problem: "Urdu speech models starve for clean, validated data.",
      approach: "Recorded and validated clips on Mozilla Common Voice as part of the internship's data push.",
      outcome: "1,000+ validated entries added to the public Urdu corpus.",
      pipeline: ["Prompt", "Record", "Validate", "Corpus"],
      bullets: [], stack: ["Common Voice", "Dataset curation"], images: []
    },
    {
      id: "transformer-line", art: "chip", noLink: true,
      title: "Transformer Production Line",
      tag: "Fauji Cement · 2023", domain: "eng", org: "Fauji Cement Company Limited", period: "Jun – Aug 2023", year: "2023",
      summary: "Helped raise transformer production capacity from 30 MVA to 40 MVA.",
      problem: "Output targets were slipping across shifts, and every change had to stay inside EHS rules.",
      approach: "Coordinated daily production scheduling across shifts, analysed line layouts and manufacturing steps, and flagged the bottlenecks.",
      outcome: "Capacity up from 30 MVA to 40 MVA with EHS compliance intact.",
      pipeline: ["Schedule", "Shift plan", "Line layout", "QC", "Output"],
      bullets: ["Hands-on with production workflows and quality control of electrical systems."], stack: ["Transformers", "PLC", "Production planning", "EHS", "SAP"], images: []
    }
  ],

  education: [
    {
      school: "National University of Sciences and Technology (NUST)",
      degree: "BE Electrical Engineering",
      place: "H-12, Islamabad",
      period: "Nov 2021 to Jul 2025",
      note: "Electrical engineering at the core, steered toward computer vision and deep learning.",
      detail: "Final-year project: AI-powered smart glasses that read banknotes aloud. Conducted 10+ IEEE sessions and seminars and built 12+ hardware and software projects across the degree."
    },
    {
      school: "Punjab College",
      degree: "FSc Pre-Engineering",
      place: "Gujranwala",
      period: "Mar 2019 to Aug 2021",
      note: "Physics, chemistry and mathematics. The part of the map everything else is measured from.",
      detail: ""
    }
  ],

  toolbelt: [
    { group: "QA & Test Automation", domain: "qa", items: ["Selenium", "Python test frameworks", "Regression suites", "Firmware testing", "ADB", "Product validation", "Test planning", "Bug triage", "SOPs & QA docs", "Asana", "Excel"] },
    { group: "Computer Vision", domain: "cv", items: ["OpenCV", "YOLO v5 / v8 / v11", "MediaPipe", "Tesseract OCR", "ANPR", "Roboflow", "CVAT", "LabelImg", "LabelMe", "Augmentation"] },
    { group: "Deep Learning", domain: "dl", items: ["PyTorch", "TensorFlow", "Keras", "CNN", "RNN / LSTM", "GANs", "ResNet", "Vision Transformer", "Swin", "Quantisation", "RAG"] },
    { group: "Languages & Tools", domain: "qa", items: ["Python", "C / C++", "Git", "Google Colab", "AWS", "MATLAB", "PSpice", "SAP", "MS Office"] },
    { group: "Edge & Hardware", domain: "eng", items: ["Raspberry Pi", "ESP32", "Arduino", "GPIO", "PLC", "Single-board computers", "Power transformers"] },
    { group: "Ways of working", domain: "eng", items: ["Project management", "Production planning", "Process optimisation", "Customer support", "Cross-team coordination"] }
  ],

  certifications: [
    { title: "Python Data Structures",       issuer: "Coursera", year: "", link: "" },   // paste credential URL into link
    { title: "Machine Learning with Python", issuer: "Coursera", year: "", link: "" }
  ],

  hobbies: [
    { name: "Photography",   note: "Composition is just another detection problem.", icon: "camera" },
    { name: "Weightlifting", note: "Progressive overload, logged like a test run.",   icon: "barbell" },
    { name: "Traveling",     note: "New cities, new datasets.",                        icon: "compass" },
    { name: "Snooker",       note: "Angles, spin and patience.",                       icon: "snooker" }
  ]
};
