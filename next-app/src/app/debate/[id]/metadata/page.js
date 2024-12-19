'use client';

import React from "react";
import {useParams} from "next/navigation";
import styles from "../../../speaker/[id]/SpeakerProfile.module.css";
import metadataStyles from "./DebateMetadata.module.css";
import SpeakerCard from "../../../components/Speaker/SpeakerCard/SpeakerCard.js";
import { constants } from "../../../../../constants/constants.js";

const DebateMetadata = () => {

  const STRAPI_URL = constants.STRAPI_URL;

  const { id: documentId } = useParams(); // Fix like in speakers page

  // const [debateData, setDebateData] = useState(null);
  // const [loading, setLoading] = useState(true);

  // TODO: Add logic to fetch debate data from Strapi
  const debateData = {
    documentId: documentId,
    title: "ΠΡΑΚΤΙΚΑ ΒΟΥΛΗΣ 1997-12-01",
    openingSection: "Αθήνα, σήμερα την 1η Φεβρουαρίου 1994, ημέρα Τρίτη και ώρα 18.20’ συνήλθε στην Αίθουσα συνεδριάσεων του Βουλευτηρίου, η Βουλή σε Ολομέλεια, για να συνεδριάσει υπό την Προεδρία του Προέδρου κ. ΑΠΟΣΤΟΛΟΥ ΚΑΚΛΑΜΑΝΗ.",
    topics: ["Healthcare Reform", "Education Budget"],
    session: {
      session_date: "Τρίτη 1 Φεβρουαρίου 1994",
      period: "Η΄ ΠΕΡΙΟΔΟΣ (ΠΡΟΕΔΡΕΥΟΜΕΝΗΣ ΔΗΜΟΚΡΑΤΙΑΣ)",
      session: "ΣΥΝΟΔΟΣ Α΄",
      meeting: "ΣΥΝΕΔΡΙΑΣΗ ΝΒ΄"
    },
    summary: "What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
    "speakers": [
      {
        "id": 1758,
        "documentId": "z6agn7t3lfghy8xio504zlq8",
        "link": "https://www.wikidata.org/wiki/Q12881714",
        "createdAt": "2024-12-19T18:21:20.543Z",
        "updatedAt": "2024-12-19T18:21:20.594Z",
        "publishedAt": "2024-12-19T18:21:20.606Z",
        "speaker_name": "Νικήτας Βενιζέλος",
        "speaker_id": "nikitas_benizelos",
        "description": "Έλληνας πολιτικός",
        "gender": "άνδρας",
        "date_of_birth": "Τετάρτη 1 Ιανουαρίου 1930",
        "place_of_birth": "Αθήνα",
        "educated_at": "",
        "website": null,
        "occupation": "πολιτικός",
        "languages": "νέα ελληνική γλώσσα",
        "date_of_death": "Τετάρτη 12 Φεβρουαρίου 2020",
        "image": {
          "id": 263,
          "documentId": "ukux20xf4f0mp6o9dmpkt3w9",
          "name": "image.jpeg",
          "alternativeText": null,
          "caption": null,
          "width": 280,
          "height": 365,
          "formats": {
            "thumbnail": {
              "name": "thumbnail_image.jpeg",
              "hash": "thumbnail_image_b72496d27b",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 120,
              "height": 156,
              "size": 4.04,
              "sizeInBytes": 4037,
              "url": "/uploads/thumbnail_image_b72496d27b.jpeg"
            }
          },
          "hash": "image_b72496d27b",
          "ext": ".jpeg",
          "mime": "image/jpeg",
          "size": 10.36,
          "url": "/uploads/image_b72496d27b.jpeg",
          "previewUrl": null,
          "provider": "local",
          "provider_metadata": null,
          "createdAt": "2024-12-19T18:21:17.799Z",
          "updatedAt": "2024-12-19T18:21:17.799Z",
          "publishedAt": "2024-12-19T18:21:17.800Z"
        }
      },
      {
        "id": 1788,
        "documentId": "jf6w8nditpa2slrnfi0qbowd",
        "link": "https://www.wikidata.org/wiki/Q12873648",
        "createdAt": "2024-12-19T18:21:32.663Z",
        "updatedAt": "2024-12-19T18:21:32.703Z",
        "publishedAt": "2024-12-19T18:21:32.720Z",
        "speaker_name": "ΑΝΔΡΕΑΣ ΛΕΝΤΑΚΗΣ",
        "speaker_id": "andreas_lentakis",
        "description": "Έλληνας πολιτικός και συγγραφέας 1934-1997",
        "gender": "άνδρας",
        "date_of_birth": "Δευτέρα 1 Ιανουαρίου 1934",
        "place_of_birth": "Αντίς Αμπέμπα",
        "educated_at": "National and Kapodistrian University of Athens",
        "website": null,
        "occupation": "συγγραφέας, πολιτικός",
        "languages": "νέα ελληνική γλώσσα",
        "date_of_death": "Τετάρτη 1 Ιανουαρίου 1997",
        "image": {
          "id": 269,
          "documentId": "yc2wztglixuexk4p6h6yufzf",
          "name": "image.jpeg",
          "alternativeText": null,
          "caption": null,
          "width": 4896,
          "height": 3672,
          "formats": {
            "thumbnail": {
              "name": "thumbnail_image.jpeg",
              "hash": "thumbnail_image_57a04ba5b2",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 208,
              "height": 156,
              "size": 10.61,
              "sizeInBytes": 10613,
              "url": "/uploads/thumbnail_image_57a04ba5b2.jpeg"
            },
            "small": {
              "name": "small_image.jpeg",
              "hash": "small_image_57a04ba5b2",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 500,
              "height": 375,
              "size": 49.83,
              "sizeInBytes": 49834,
              "url": "/uploads/small_image_57a04ba5b2.jpeg"
            },
            "medium": {
              "name": "medium_image.jpeg",
              "hash": "medium_image_57a04ba5b2",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 750,
              "height": 563,
              "size": 103.8,
              "sizeInBytes": 103798,
              "url": "/uploads/medium_image_57a04ba5b2.jpeg"
            },
            "large": {
              "name": "large_image.jpeg",
              "hash": "large_image_57a04ba5b2",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 1000,
              "height": 750,
              "size": 170.74,
              "sizeInBytes": 170742,
              "url": "/uploads/large_image_57a04ba5b2.jpeg"
            }
          },
          "hash": "image_57a04ba5b2",
          "ext": ".jpeg",
          "mime": "image/jpeg",
          "size": 2588.63,
          "url": "/uploads/image_57a04ba5b2.jpeg",
          "previewUrl": null,
          "provider": "local",
          "provider_metadata": null,
          "createdAt": "2024-12-19T18:21:31.114Z",
          "updatedAt": "2024-12-19T18:21:31.114Z",
          "publishedAt": "2024-12-19T18:21:31.115Z"
        }
      },
      {
        "id": 1776,
        "documentId": "r2cx7yyfd8izi7edc8llhxlw",
        "link": "https://www.wikidata.org/wiki/Q451135",
        "createdAt": "2024-12-19T18:21:24.842Z",
        "updatedAt": "2024-12-19T18:21:24.883Z",
        "publishedAt": "2024-12-19T18:21:24.894Z",
        "speaker_name": "ΔΗΜΗΤΡΙΟΣ ΣΙΟΥΦΑΣ",
        "speaker_id": "dimitrios_sioufas",
        "description": "Έλληνας πολιτικός, πρόεδρος της Βουλής των Ελλήνων (2007-2009)",
        "gender": "άνδρας",
        "date_of_birth": "Τρίτη 15 Αυγούστου 1944",
        "place_of_birth": "Ελληνόπυργος Καρδίτσας",
        "educated_at": "Aristotle University of Thessaloniki (bachelor's degree in jurisprudence), Panteion University (bachelor's degree in public administration), Panteion University (bachelor's degree in political science)",
        "website": null,
        "occupation": "δικηγόρος, πολιτικός",
        "languages": "νέα ελληνική γλώσσα",
        "date_of_death": "Παρασκευή 11 Ιανουαρίου 2019",
        "image": {
          "id": 266,
          "documentId": "zx7rkhmc9rvd8lkmw13sdtxh",
          "name": "image.jpeg",
          "alternativeText": null,
          "caption": null,
          "width": 294,
          "height": 473,
          "formats": {
            "thumbnail": {
              "name": "thumbnail_image.jpeg",
              "hash": "thumbnail_image_894ff7703f",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 97,
              "height": 156,
              "size": 3.51,
              "sizeInBytes": 3507,
              "url": "/uploads/thumbnail_image_894ff7703f.jpeg"
            }
          },
          "hash": "image_894ff7703f",
          "ext": ".jpeg",
          "mime": "image/jpeg",
          "size": 17.2,
          "url": "/uploads/image_894ff7703f.jpeg",
          "previewUrl": null,
          "provider": "local",
          "provider_metadata": null,
          "createdAt": "2024-12-19T18:21:23.529Z",
          "updatedAt": "2024-12-19T18:21:23.529Z",
          "publishedAt": "2024-12-19T18:21:23.529Z"
        }
      },
      {
        "id": 1758,
        "documentId": "z6agn7t3lfghy8xio504zlq8",
        "link": "https://www.wikidata.org/wiki/Q12881714",
        "createdAt": "2024-12-19T18:21:20.543Z",
        "updatedAt": "2024-12-19T18:21:20.594Z",
        "publishedAt": "2024-12-19T18:21:20.606Z",
        "speaker_name": "Νικήτας Βενιζέλος",
        "speaker_id": "nikitas_benizelos",
        "description": "Έλληνας πολιτικός",
        "gender": "άνδρας",
        "date_of_birth": "Τετάρτη 1 Ιανουαρίου 1930",
        "place_of_birth": "Αθήνα",
        "educated_at": "",
        "website": null,
        "occupation": "πολιτικός",
        "languages": "νέα ελληνική γλώσσα",
        "date_of_death": "Τετάρτη 12 Φεβρουαρίου 2020",
        "image": {
          "id": 263,
          "documentId": "ukux20xf4f0mp6o9dmpkt3w9",
          "name": "image.jpeg",
          "alternativeText": null,
          "caption": null,
          "width": 280,
          "height": 365,
          "formats": {
            "thumbnail": {
              "name": "thumbnail_image.jpeg",
              "hash": "thumbnail_image_b72496d27b",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 120,
              "height": 156,
              "size": 4.04,
              "sizeInBytes": 4037,
              "url": "/uploads/thumbnail_image_b72496d27b.jpeg"
            }
          },
          "hash": "image_b72496d27b",
          "ext": ".jpeg",
          "mime": "image/jpeg",
          "size": 10.36,
          "url": "/uploads/image_b72496d27b.jpeg",
          "previewUrl": null,
          "provider": "local",
          "provider_metadata": null,
          "createdAt": "2024-12-19T18:21:17.799Z",
          "updatedAt": "2024-12-19T18:21:17.799Z",
          "publishedAt": "2024-12-19T18:21:17.800Z"
        }
      },
      {
        "id": 1788,
        "documentId": "jf6w8nditpa2slrnfi0qbowd",
        "link": "https://www.wikidata.org/wiki/Q12873648",
        "createdAt": "2024-12-19T18:21:32.663Z",
        "updatedAt": "2024-12-19T18:21:32.703Z",
        "publishedAt": "2024-12-19T18:21:32.720Z",
        "speaker_name": "ΑΝΔΡΕΑΣ ΛΕΝΤΑΚΗΣ",
        "speaker_id": "andreas_lentakis",
        "description": "Έλληνας πολιτικός και συγγραφέας 1934-1997",
        "gender": "άνδρας",
        "date_of_birth": "Δευτέρα 1 Ιανουαρίου 1934",
        "place_of_birth": "Αντίς Αμπέμπα",
        "educated_at": "National and Kapodistrian University of Athens",
        "website": null,
        "occupation": "συγγραφέας, πολιτικός",
        "languages": "νέα ελληνική γλώσσα",
        "date_of_death": "Τετάρτη 1 Ιανουαρίου 1997",
        "image": {
          "id": 269,
          "documentId": "yc2wztglixuexk4p6h6yufzf",
          "name": "image.jpeg",
          "alternativeText": null,
          "caption": null,
          "width": 4896,
          "height": 3672,
          "formats": {
            "thumbnail": {
              "name": "thumbnail_image.jpeg",
              "hash": "thumbnail_image_57a04ba5b2",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 208,
              "height": 156,
              "size": 10.61,
              "sizeInBytes": 10613,
              "url": "/uploads/thumbnail_image_57a04ba5b2.jpeg"
            },
            "small": {
              "name": "small_image.jpeg",
              "hash": "small_image_57a04ba5b2",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 500,
              "height": 375,
              "size": 49.83,
              "sizeInBytes": 49834,
              "url": "/uploads/small_image_57a04ba5b2.jpeg"
            },
            "medium": {
              "name": "medium_image.jpeg",
              "hash": "medium_image_57a04ba5b2",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 750,
              "height": 563,
              "size": 103.8,
              "sizeInBytes": 103798,
              "url": "/uploads/medium_image_57a04ba5b2.jpeg"
            },
            "large": {
              "name": "large_image.jpeg",
              "hash": "large_image_57a04ba5b2",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 1000,
              "height": 750,
              "size": 170.74,
              "sizeInBytes": 170742,
              "url": "/uploads/large_image_57a04ba5b2.jpeg"
            }
          },
          "hash": "image_57a04ba5b2",
          "ext": ".jpeg",
          "mime": "image/jpeg",
          "size": 2588.63,
          "url": "/uploads/image_57a04ba5b2.jpeg",
          "previewUrl": null,
          "provider": "local",
          "provider_metadata": null,
          "createdAt": "2024-12-19T18:21:31.114Z",
          "updatedAt": "2024-12-19T18:21:31.114Z",
          "publishedAt": "2024-12-19T18:21:31.115Z"
        }
      },
      {
        "id": 1776,
        "documentId": "r2cx7yyfd8izi7edc8llhxlw",
        "link": "https://www.wikidata.org/wiki/Q451135",
        "createdAt": "2024-12-19T18:21:24.842Z",
        "updatedAt": "2024-12-19T18:21:24.883Z",
        "publishedAt": "2024-12-19T18:21:24.894Z",
        "speaker_name": "ΔΗΜΗΤΡΙΟΣ ΣΙΟΥΦΑΣ",
        "speaker_id": "dimitrios_sioufas",
        "description": "Έλληνας πολιτικός, πρόεδρος της Βουλής των Ελλήνων (2007-2009)",
        "gender": "άνδρας",
        "date_of_birth": "Τρίτη 15 Αυγούστου 1944",
        "place_of_birth": "Ελληνόπυργος Καρδίτσας",
        "educated_at": "Aristotle University of Thessaloniki (bachelor's degree in jurisprudence), Panteion University (bachelor's degree in public administration), Panteion University (bachelor's degree in political science)",
        "website": null,
        "occupation": "δικηγόρος, πολιτικός",
        "languages": "νέα ελληνική γλώσσα",
        "date_of_death": "Παρασκευή 11 Ιανουαρίου 2019",
        "image": {
          "id": 266,
          "documentId": "zx7rkhmc9rvd8lkmw13sdtxh",
          "name": "image.jpeg",
          "alternativeText": null,
          "caption": null,
          "width": 294,
          "height": 473,
          "formats": {
            "thumbnail": {
              "name": "thumbnail_image.jpeg",
              "hash": "thumbnail_image_894ff7703f",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 97,
              "height": 156,
              "size": 3.51,
              "sizeInBytes": 3507,
              "url": "/uploads/thumbnail_image_894ff7703f.jpeg"
            }
          },
          "hash": "image_894ff7703f",
          "ext": ".jpeg",
          "mime": "image/jpeg",
          "size": 17.2,
          "url": "/uploads/image_894ff7703f.jpeg",
          "previewUrl": null,
          "provider": "local",
          "provider_metadata": null,
          "createdAt": "2024-12-19T18:21:23.529Z",
          "updatedAt": "2024-12-19T18:21:23.529Z",
          "publishedAt": "2024-12-19T18:21:23.529Z"
        }
      },
      {
        "id": 1758,
        "documentId": "z6agn7t3lfghy8xio504zlq8",
        "link": "https://www.wikidata.org/wiki/Q12881714",
        "createdAt": "2024-12-19T18:21:20.543Z",
        "updatedAt": "2024-12-19T18:21:20.594Z",
        "publishedAt": "2024-12-19T18:21:20.606Z",
        "speaker_name": "Νικήτας Βενιζέλος",
        "speaker_id": "nikitas_benizelos",
        "description": "Έλληνας πολιτικός",
        "gender": "άνδρας",
        "date_of_birth": "Τετάρτη 1 Ιανουαρίου 1930",
        "place_of_birth": "Αθήνα",
        "educated_at": "",
        "website": null,
        "occupation": "πολιτικός",
        "languages": "νέα ελληνική γλώσσα",
        "date_of_death": "Τετάρτη 12 Φεβρουαρίου 2020",
        "image": {
          "id": 263,
          "documentId": "ukux20xf4f0mp6o9dmpkt3w9",
          "name": "image.jpeg",
          "alternativeText": null,
          "caption": null,
          "width": 280,
          "height": 365,
          "formats": {
            "thumbnail": {
              "name": "thumbnail_image.jpeg",
              "hash": "thumbnail_image_b72496d27b",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 120,
              "height": 156,
              "size": 4.04,
              "sizeInBytes": 4037,
              "url": "/uploads/thumbnail_image_b72496d27b.jpeg"
            }
          },
          "hash": "image_b72496d27b",
          "ext": ".jpeg",
          "mime": "image/jpeg",
          "size": 10.36,
          "url": "/uploads/image_b72496d27b.jpeg",
          "previewUrl": null,
          "provider": "local",
          "provider_metadata": null,
          "createdAt": "2024-12-19T18:21:17.799Z",
          "updatedAt": "2024-12-19T18:21:17.799Z",
          "publishedAt": "2024-12-19T18:21:17.800Z"
        }
      },
      {
        "id": 1788,
        "documentId": "jf6w8nditpa2slrnfi0qbowd",
        "link": "https://www.wikidata.org/wiki/Q12873648",
        "createdAt": "2024-12-19T18:21:32.663Z",
        "updatedAt": "2024-12-19T18:21:32.703Z",
        "publishedAt": "2024-12-19T18:21:32.720Z",
        "speaker_name": "ΑΝΔΡΕΑΣ ΛΕΝΤΑΚΗΣ",
        "speaker_id": "andreas_lentakis",
        "description": "Έλληνας πολιτικός και συγγραφέας 1934-1997",
        "gender": "άνδρας",
        "date_of_birth": "Δευτέρα 1 Ιανουαρίου 1934",
        "place_of_birth": "Αντίς Αμπέμπα",
        "educated_at": "National and Kapodistrian University of Athens",
        "website": null,
        "occupation": "συγγραφέας, πολιτικός",
        "languages": "νέα ελληνική γλώσσα",
        "date_of_death": "Τετάρτη 1 Ιανουαρίου 1997",
        "image": {
          "id": 269,
          "documentId": "yc2wztglixuexk4p6h6yufzf",
          "name": "image.jpeg",
          "alternativeText": null,
          "caption": null,
          "width": 4896,
          "height": 3672,
          "formats": {
            "thumbnail": {
              "name": "thumbnail_image.jpeg",
              "hash": "thumbnail_image_57a04ba5b2",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 208,
              "height": 156,
              "size": 10.61,
              "sizeInBytes": 10613,
              "url": "/uploads/thumbnail_image_57a04ba5b2.jpeg"
            },
            "small": {
              "name": "small_image.jpeg",
              "hash": "small_image_57a04ba5b2",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 500,
              "height": 375,
              "size": 49.83,
              "sizeInBytes": 49834,
              "url": "/uploads/small_image_57a04ba5b2.jpeg"
            },
            "medium": {
              "name": "medium_image.jpeg",
              "hash": "medium_image_57a04ba5b2",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 750,
              "height": 563,
              "size": 103.8,
              "sizeInBytes": 103798,
              "url": "/uploads/medium_image_57a04ba5b2.jpeg"
            },
            "large": {
              "name": "large_image.jpeg",
              "hash": "large_image_57a04ba5b2",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 1000,
              "height": 750,
              "size": 170.74,
              "sizeInBytes": 170742,
              "url": "/uploads/large_image_57a04ba5b2.jpeg"
            }
          },
          "hash": "image_57a04ba5b2",
          "ext": ".jpeg",
          "mime": "image/jpeg",
          "size": 2588.63,
          "url": "/uploads/image_57a04ba5b2.jpeg",
          "previewUrl": null,
          "provider": "local",
          "provider_metadata": null,
          "createdAt": "2024-12-19T18:21:31.114Z",
          "updatedAt": "2024-12-19T18:21:31.114Z",
          "publishedAt": "2024-12-19T18:21:31.115Z"
        }
      },
      {
        "id": 1776,
        "documentId": "r2cx7yyfd8izi7edc8llhxlw",
        "link": "https://www.wikidata.org/wiki/Q451135",
        "createdAt": "2024-12-19T18:21:24.842Z",
        "updatedAt": "2024-12-19T18:21:24.883Z",
        "publishedAt": "2024-12-19T18:21:24.894Z",
        "speaker_name": "ΔΗΜΗΤΡΙΟΣ ΣΙΟΥΦΑΣ",
        "speaker_id": "dimitrios_sioufas",
        "description": "Έλληνας πολιτικός, πρόεδρος της Βουλής των Ελλήνων (2007-2009)",
        "gender": "άνδρας",
        "date_of_birth": "Τρίτη 15 Αυγούστου 1944",
        "place_of_birth": "Ελληνόπυργος Καρδίτσας",
        "educated_at": "Aristotle University of Thessaloniki (bachelor's degree in jurisprudence), Panteion University (bachelor's degree in public administration), Panteion University (bachelor's degree in political science)",
        "website": null,
        "occupation": "δικηγόρος, πολιτικός",
        "languages": "νέα ελληνική γλώσσα",
        "date_of_death": "Παρασκευή 11 Ιανουαρίου 2019",
        "image": {
          "id": 266,
          "documentId": "zx7rkhmc9rvd8lkmw13sdtxh",
          "name": "image.jpeg",
          "alternativeText": null,
          "caption": null,
          "width": 294,
          "height": 473,
          "formats": {
            "thumbnail": {
              "name": "thumbnail_image.jpeg",
              "hash": "thumbnail_image_894ff7703f",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 97,
              "height": 156,
              "size": 3.51,
              "sizeInBytes": 3507,
              "url": "/uploads/thumbnail_image_894ff7703f.jpeg"
            }
          },
          "hash": "image_894ff7703f",
          "ext": ".jpeg",
          "mime": "image/jpeg",
          "size": 17.2,
          "url": "/uploads/image_894ff7703f.jpeg",
          "previewUrl": null,
          "provider": "local",
          "provider_metadata": null,
          "createdAt": "2024-12-19T18:21:23.529Z",
          "updatedAt": "2024-12-19T18:21:23.529Z",
          "publishedAt": "2024-12-19T18:21:23.529Z"
        }
      },
      {
        "id": 1758,
        "documentId": "z6agn7t3lfghy8xio504zlq8",
        "link": "https://www.wikidata.org/wiki/Q12881714",
        "createdAt": "2024-12-19T18:21:20.543Z",
        "updatedAt": "2024-12-19T18:21:20.594Z",
        "publishedAt": "2024-12-19T18:21:20.606Z",
        "speaker_name": "Νικήτας Βενιζέλος",
        "speaker_id": "nikitas_benizelos",
        "description": "Έλληνας πολιτικός",
        "gender": "άνδρας",
        "date_of_birth": "Τετάρτη 1 Ιανουαρίου 1930",
        "place_of_birth": "Αθήνα",
        "educated_at": "",
        "website": null,
        "occupation": "πολιτικός",
        "languages": "νέα ελληνική γλώσσα",
        "date_of_death": "Τετάρτη 12 Φεβρουαρίου 2020",
        "image": {
          "id": 263,
          "documentId": "ukux20xf4f0mp6o9dmpkt3w9",
          "name": "image.jpeg",
          "alternativeText": null,
          "caption": null,
          "width": 280,
          "height": 365,
          "formats": {
            "thumbnail": {
              "name": "thumbnail_image.jpeg",
              "hash": "thumbnail_image_b72496d27b",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 120,
              "height": 156,
              "size": 4.04,
              "sizeInBytes": 4037,
              "url": "/uploads/thumbnail_image_b72496d27b.jpeg"
            }
          },
          "hash": "image_b72496d27b",
          "ext": ".jpeg",
          "mime": "image/jpeg",
          "size": 10.36,
          "url": "/uploads/image_b72496d27b.jpeg",
          "previewUrl": null,
          "provider": "local",
          "provider_metadata": null,
          "createdAt": "2024-12-19T18:21:17.799Z",
          "updatedAt": "2024-12-19T18:21:17.799Z",
          "publishedAt": "2024-12-19T18:21:17.800Z"
        }
      },
      {
        "id": 1788,
        "documentId": "jf6w8nditpa2slrnfi0qbowd",
        "link": "https://www.wikidata.org/wiki/Q12873648",
        "createdAt": "2024-12-19T18:21:32.663Z",
        "updatedAt": "2024-12-19T18:21:32.703Z",
        "publishedAt": "2024-12-19T18:21:32.720Z",
        "speaker_name": "ΑΝΔΡΕΑΣ ΛΕΝΤΑΚΗΣ",
        "speaker_id": "andreas_lentakis",
        "description": "Έλληνας πολιτικός και συγγραφέας 1934-1997",
        "gender": "άνδρας",
        "date_of_birth": "Δευτέρα 1 Ιανουαρίου 1934",
        "place_of_birth": "Αντίς Αμπέμπα",
        "educated_at": "National and Kapodistrian University of Athens",
        "website": null,
        "occupation": "συγγραφέας, πολιτικός",
        "languages": "νέα ελληνική γλώσσα",
        "date_of_death": "Τετάρτη 1 Ιανουαρίου 1997",
        "image": {
          "id": 269,
          "documentId": "yc2wztglixuexk4p6h6yufzf",
          "name": "image.jpeg",
          "alternativeText": null,
          "caption": null,
          "width": 4896,
          "height": 3672,
          "formats": {
            "thumbnail": {
              "name": "thumbnail_image.jpeg",
              "hash": "thumbnail_image_57a04ba5b2",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 208,
              "height": 156,
              "size": 10.61,
              "sizeInBytes": 10613,
              "url": "/uploads/thumbnail_image_57a04ba5b2.jpeg"
            },
            "small": {
              "name": "small_image.jpeg",
              "hash": "small_image_57a04ba5b2",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 500,
              "height": 375,
              "size": 49.83,
              "sizeInBytes": 49834,
              "url": "/uploads/small_image_57a04ba5b2.jpeg"
            },
            "medium": {
              "name": "medium_image.jpeg",
              "hash": "medium_image_57a04ba5b2",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 750,
              "height": 563,
              "size": 103.8,
              "sizeInBytes": 103798,
              "url": "/uploads/medium_image_57a04ba5b2.jpeg"
            },
            "large": {
              "name": "large_image.jpeg",
              "hash": "large_image_57a04ba5b2",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 1000,
              "height": 750,
              "size": 170.74,
              "sizeInBytes": 170742,
              "url": "/uploads/large_image_57a04ba5b2.jpeg"
            }
          },
          "hash": "image_57a04ba5b2",
          "ext": ".jpeg",
          "mime": "image/jpeg",
          "size": 2588.63,
          "url": "/uploads/image_57a04ba5b2.jpeg",
          "previewUrl": null,
          "provider": "local",
          "provider_metadata": null,
          "createdAt": "2024-12-19T18:21:31.114Z",
          "updatedAt": "2024-12-19T18:21:31.114Z",
          "publishedAt": "2024-12-19T18:21:31.115Z"
        }
      },
      {
        "id": 1776,
        "documentId": "r2cx7yyfd8izi7edc8llhxlw",
        "link": "https://www.wikidata.org/wiki/Q451135",
        "createdAt": "2024-12-19T18:21:24.842Z",
        "updatedAt": "2024-12-19T18:21:24.883Z",
        "publishedAt": "2024-12-19T18:21:24.894Z",
        "speaker_name": "ΔΗΜΗΤΡΙΟΣ ΣΙΟΥΦΑΣ",
        "speaker_id": "dimitrios_sioufas",
        "description": "Έλληνας πολιτικός, πρόεδρος της Βουλής των Ελλήνων (2007-2009)",
        "gender": "άνδρας",
        "date_of_birth": "Τρίτη 15 Αυγούστου 1944",
        "place_of_birth": "Ελληνόπυργος Καρδίτσας",
        "educated_at": "Aristotle University of Thessaloniki (bachelor's degree in jurisprudence), Panteion University (bachelor's degree in public administration), Panteion University (bachelor's degree in political science)",
        "website": null,
        "occupation": "δικηγόρος, πολιτικός",
        "languages": "νέα ελληνική γλώσσα",
        "date_of_death": "Παρασκευή 11 Ιανουαρίου 2019",
        "image": {
          "id": 266,
          "documentId": "zx7rkhmc9rvd8lkmw13sdtxh",
          "name": "image.jpeg",
          "alternativeText": null,
          "caption": null,
          "width": 294,
          "height": 473,
          "formats": {
            "thumbnail": {
              "name": "thumbnail_image.jpeg",
              "hash": "thumbnail_image_894ff7703f",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 97,
              "height": 156,
              "size": 3.51,
              "sizeInBytes": 3507,
              "url": "/uploads/thumbnail_image_894ff7703f.jpeg"
            }
          },
          "hash": "image_894ff7703f",
          "ext": ".jpeg",
          "mime": "image/jpeg",
          "size": 17.2,
          "url": "/uploads/image_894ff7703f.jpeg",
          "previewUrl": null,
          "provider": "local",
          "provider_metadata": null,
          "createdAt": "2024-12-19T18:21:23.529Z",
          "updatedAt": "2024-12-19T18:21:23.529Z",
          "publishedAt": "2024-12-19T18:21:23.529Z"
        }
      },
      {
        "id": 1758,
        "documentId": "z6agn7t3lfghy8xio504zlq8",
        "link": "https://www.wikidata.org/wiki/Q12881714",
        "createdAt": "2024-12-19T18:21:20.543Z",
        "updatedAt": "2024-12-19T18:21:20.594Z",
        "publishedAt": "2024-12-19T18:21:20.606Z",
        "speaker_name": "Νικήτας Βενιζέλος",
        "speaker_id": "nikitas_benizelos",
        "description": "Έλληνας πολιτικός",
        "gender": "άνδρας",
        "date_of_birth": "Τετάρτη 1 Ιανουαρίου 1930",
        "place_of_birth": "Αθήνα",
        "educated_at": "",
        "website": null,
        "occupation": "πολιτικός",
        "languages": "νέα ελληνική γλώσσα",
        "date_of_death": "Τετάρτη 12 Φεβρουαρίου 2020",
        "image": {
          "id": 263,
          "documentId": "ukux20xf4f0mp6o9dmpkt3w9",
          "name": "image.jpeg",
          "alternativeText": null,
          "caption": null,
          "width": 280,
          "height": 365,
          "formats": {
            "thumbnail": {
              "name": "thumbnail_image.jpeg",
              "hash": "thumbnail_image_b72496d27b",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 120,
              "height": 156,
              "size": 4.04,
              "sizeInBytes": 4037,
              "url": "/uploads/thumbnail_image_b72496d27b.jpeg"
            }
          },
          "hash": "image_b72496d27b",
          "ext": ".jpeg",
          "mime": "image/jpeg",
          "size": 10.36,
          "url": "/uploads/image_b72496d27b.jpeg",
          "previewUrl": null,
          "provider": "local",
          "provider_metadata": null,
          "createdAt": "2024-12-19T18:21:17.799Z",
          "updatedAt": "2024-12-19T18:21:17.799Z",
          "publishedAt": "2024-12-19T18:21:17.800Z"
        }
      },
      {
        "id": 1788,
        "documentId": "jf6w8nditpa2slrnfi0qbowd",
        "link": "https://www.wikidata.org/wiki/Q12873648",
        "createdAt": "2024-12-19T18:21:32.663Z",
        "updatedAt": "2024-12-19T18:21:32.703Z",
        "publishedAt": "2024-12-19T18:21:32.720Z",
        "speaker_name": "ΑΝΔΡΕΑΣ ΛΕΝΤΑΚΗΣ",
        "speaker_id": "andreas_lentakis",
        "description": "Έλληνας πολιτικός και συγγραφέας 1934-1997",
        "gender": "άνδρας",
        "date_of_birth": "Δευτέρα 1 Ιανουαρίου 1934",
        "place_of_birth": "Αντίς Αμπέμπα",
        "educated_at": "National and Kapodistrian University of Athens",
        "website": null,
        "occupation": "συγγραφέας, πολιτικός",
        "languages": "νέα ελληνική γλώσσα",
        "date_of_death": "Τετάρτη 1 Ιανουαρίου 1997",
        "image": {
          "id": 269,
          "documentId": "yc2wztglixuexk4p6h6yufzf",
          "name": "image.jpeg",
          "alternativeText": null,
          "caption": null,
          "width": 4896,
          "height": 3672,
          "formats": {
            "thumbnail": {
              "name": "thumbnail_image.jpeg",
              "hash": "thumbnail_image_57a04ba5b2",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 208,
              "height": 156,
              "size": 10.61,
              "sizeInBytes": 10613,
              "url": "/uploads/thumbnail_image_57a04ba5b2.jpeg"
            },
            "small": {
              "name": "small_image.jpeg",
              "hash": "small_image_57a04ba5b2",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 500,
              "height": 375,
              "size": 49.83,
              "sizeInBytes": 49834,
              "url": "/uploads/small_image_57a04ba5b2.jpeg"
            },
            "medium": {
              "name": "medium_image.jpeg",
              "hash": "medium_image_57a04ba5b2",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 750,
              "height": 563,
              "size": 103.8,
              "sizeInBytes": 103798,
              "url": "/uploads/medium_image_57a04ba5b2.jpeg"
            },
            "large": {
              "name": "large_image.jpeg",
              "hash": "large_image_57a04ba5b2",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 1000,
              "height": 750,
              "size": 170.74,
              "sizeInBytes": 170742,
              "url": "/uploads/large_image_57a04ba5b2.jpeg"
            }
          },
          "hash": "image_57a04ba5b2",
          "ext": ".jpeg",
          "mime": "image/jpeg",
          "size": 2588.63,
          "url": "/uploads/image_57a04ba5b2.jpeg",
          "previewUrl": null,
          "provider": "local",
          "provider_metadata": null,
          "createdAt": "2024-12-19T18:21:31.114Z",
          "updatedAt": "2024-12-19T18:21:31.114Z",
          "publishedAt": "2024-12-19T18:21:31.115Z"
        }
      },
      {
        "id": 1776,
        "documentId": "r2cx7yyfd8izi7edc8llhxlw",
        "link": "https://www.wikidata.org/wiki/Q451135",
        "createdAt": "2024-12-19T18:21:24.842Z",
        "updatedAt": "2024-12-19T18:21:24.883Z",
        "publishedAt": "2024-12-19T18:21:24.894Z",
        "speaker_name": "ΔΗΜΗΤΡΙΟΣ ΣΙΟΥΦΑΣ",
        "speaker_id": "dimitrios_sioufas",
        "description": "Έλληνας πολιτικός, πρόεδρος της Βουλής των Ελλήνων (2007-2009)",
        "gender": "άνδρας",
        "date_of_birth": "Τρίτη 15 Αυγούστου 1944",
        "place_of_birth": "Ελληνόπυργος Καρδίτσας",
        "educated_at": "Aristotle University of Thessaloniki (bachelor's degree in jurisprudence), Panteion University (bachelor's degree in public administration), Panteion University (bachelor's degree in political science)",
        "website": null,
        "occupation": "δικηγόρος, πολιτικός",
        "languages": "νέα ελληνική γλώσσα",
        "date_of_death": "Παρασκευή 11 Ιανουαρίου 2019",
        "image": {
          "id": 266,
          "documentId": "zx7rkhmc9rvd8lkmw13sdtxh",
          "name": "image.jpeg",
          "alternativeText": null,
          "caption": null,
          "width": 294,
          "height": 473,
          "formats": {
            "thumbnail": {
              "name": "thumbnail_image.jpeg",
              "hash": "thumbnail_image_894ff7703f",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 97,
              "height": 156,
              "size": 3.51,
              "sizeInBytes": 3507,
              "url": "/uploads/thumbnail_image_894ff7703f.jpeg"
            }
          },
          "hash": "image_894ff7703f",
          "ext": ".jpeg",
          "mime": "image/jpeg",
          "size": 17.2,
          "url": "/uploads/image_894ff7703f.jpeg",
          "previewUrl": null,
          "provider": "local",
          "provider_metadata": null,
          "createdAt": "2024-12-19T18:21:23.529Z",
          "updatedAt": "2024-12-19T18:21:23.529Z",
          "publishedAt": "2024-12-19T18:21:23.529Z"
        }
      },
      {
        "id": 1758,
        "documentId": "z6agn7t3lfghy8xio504zlq8",
        "link": "https://www.wikidata.org/wiki/Q12881714",
        "createdAt": "2024-12-19T18:21:20.543Z",
        "updatedAt": "2024-12-19T18:21:20.594Z",
        "publishedAt": "2024-12-19T18:21:20.606Z",
        "speaker_name": "Νικήτας Βενιζέλος",
        "speaker_id": "nikitas_benizelos",
        "description": "Έλληνας πολιτικός",
        "gender": "άνδρας",
        "date_of_birth": "Τετάρτη 1 Ιανουαρίου 1930",
        "place_of_birth": "Αθήνα",
        "educated_at": "",
        "website": null,
        "occupation": "πολιτικός",
        "languages": "νέα ελληνική γλώσσα",
        "date_of_death": "Τετάρτη 12 Φεβρουαρίου 2020",
        "image": {
          "id": 263,
          "documentId": "ukux20xf4f0mp6o9dmpkt3w9",
          "name": "image.jpeg",
          "alternativeText": null,
          "caption": null,
          "width": 280,
          "height": 365,
          "formats": {
            "thumbnail": {
              "name": "thumbnail_image.jpeg",
              "hash": "thumbnail_image_b72496d27b",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 120,
              "height": 156,
              "size": 4.04,
              "sizeInBytes": 4037,
              "url": "/uploads/thumbnail_image_b72496d27b.jpeg"
            }
          },
          "hash": "image_b72496d27b",
          "ext": ".jpeg",
          "mime": "image/jpeg",
          "size": 10.36,
          "url": "/uploads/image_b72496d27b.jpeg",
          "previewUrl": null,
          "provider": "local",
          "provider_metadata": null,
          "createdAt": "2024-12-19T18:21:17.799Z",
          "updatedAt": "2024-12-19T18:21:17.799Z",
          "publishedAt": "2024-12-19T18:21:17.800Z"
        }
      },
      {
        "id": 1788,
        "documentId": "jf6w8nditpa2slrnfi0qbowd",
        "link": "https://www.wikidata.org/wiki/Q12873648",
        "createdAt": "2024-12-19T18:21:32.663Z",
        "updatedAt": "2024-12-19T18:21:32.703Z",
        "publishedAt": "2024-12-19T18:21:32.720Z",
        "speaker_name": "ΑΝΔΡΕΑΣ ΛΕΝΤΑΚΗΣ",
        "speaker_id": "andreas_lentakis",
        "description": "Έλληνας πολιτικός και συγγραφέας 1934-1997",
        "gender": "άνδρας",
        "date_of_birth": "Δευτέρα 1 Ιανουαρίου 1934",
        "place_of_birth": "Αντίς Αμπέμπα",
        "educated_at": "National and Kapodistrian University of Athens",
        "website": null,
        "occupation": "συγγραφέας, πολιτικός",
        "languages": "νέα ελληνική γλώσσα",
        "date_of_death": "Τετάρτη 1 Ιανουαρίου 1997",
        "image": {
          "id": 269,
          "documentId": "yc2wztglixuexk4p6h6yufzf",
          "name": "image.jpeg",
          "alternativeText": null,
          "caption": null,
          "width": 4896,
          "height": 3672,
          "formats": {
            "thumbnail": {
              "name": "thumbnail_image.jpeg",
              "hash": "thumbnail_image_57a04ba5b2",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 208,
              "height": 156,
              "size": 10.61,
              "sizeInBytes": 10613,
              "url": "/uploads/thumbnail_image_57a04ba5b2.jpeg"
            },
            "small": {
              "name": "small_image.jpeg",
              "hash": "small_image_57a04ba5b2",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 500,
              "height": 375,
              "size": 49.83,
              "sizeInBytes": 49834,
              "url": "/uploads/small_image_57a04ba5b2.jpeg"
            },
            "medium": {
              "name": "medium_image.jpeg",
              "hash": "medium_image_57a04ba5b2",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 750,
              "height": 563,
              "size": 103.8,
              "sizeInBytes": 103798,
              "url": "/uploads/medium_image_57a04ba5b2.jpeg"
            },
            "large": {
              "name": "large_image.jpeg",
              "hash": "large_image_57a04ba5b2",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 1000,
              "height": 750,
              "size": 170.74,
              "sizeInBytes": 170742,
              "url": "/uploads/large_image_57a04ba5b2.jpeg"
            }
          },
          "hash": "image_57a04ba5b2",
          "ext": ".jpeg",
          "mime": "image/jpeg",
          "size": 2588.63,
          "url": "/uploads/image_57a04ba5b2.jpeg",
          "previewUrl": null,
          "provider": "local",
          "provider_metadata": null,
          "createdAt": "2024-12-19T18:21:31.114Z",
          "updatedAt": "2024-12-19T18:21:31.114Z",
          "publishedAt": "2024-12-19T18:21:31.115Z"
        }
      },
      {
        "id": 1776,
        "documentId": "r2cx7yyfd8izi7edc8llhxlw",
        "link": "https://www.wikidata.org/wiki/Q451135",
        "createdAt": "2024-12-19T18:21:24.842Z",
        "updatedAt": "2024-12-19T18:21:24.883Z",
        "publishedAt": "2024-12-19T18:21:24.894Z",
        "speaker_name": "ΔΗΜΗΤΡΙΟΣ ΣΙΟΥΦΑΣ",
        "speaker_id": "dimitrios_sioufas",
        "description": "Έλληνας πολιτικός, πρόεδρος της Βουλής των Ελλήνων (2007-2009)",
        "gender": "άνδρας",
        "date_of_birth": "Τρίτη 15 Αυγούστου 1944",
        "place_of_birth": "Ελληνόπυργος Καρδίτσας",
        "educated_at": "Aristotle University of Thessaloniki (bachelor's degree in jurisprudence), Panteion University (bachelor's degree in public administration), Panteion University (bachelor's degree in political science)",
        "website": null,
        "occupation": "δικηγόρος, πολιτικός",
        "languages": "νέα ελληνική γλώσσα",
        "date_of_death": "Παρασκευή 11 Ιανουαρίου 2019",
        "image": {
          "id": 266,
          "documentId": "zx7rkhmc9rvd8lkmw13sdtxh",
          "name": "image.jpeg",
          "alternativeText": null,
          "caption": null,
          "width": 294,
          "height": 473,
          "formats": {
            "thumbnail": {
              "name": "thumbnail_image.jpeg",
              "hash": "thumbnail_image_894ff7703f",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 97,
              "height": 156,
              "size": 3.51,
              "sizeInBytes": 3507,
              "url": "/uploads/thumbnail_image_894ff7703f.jpeg"
            }
          },
          "hash": "image_894ff7703f",
          "ext": ".jpeg",
          "mime": "image/jpeg",
          "size": 17.2,
          "url": "/uploads/image_894ff7703f.jpeg",
          "previewUrl": null,
          "provider": "local",
          "provider_metadata": null,
          "createdAt": "2024-12-19T18:21:23.529Z",
          "updatedAt": "2024-12-19T18:21:23.529Z",
          "publishedAt": "2024-12-19T18:21:23.529Z"
        }
      },
      {
        "id": 1758,
        "documentId": "z6agn7t3lfghy8xio504zlq8",
        "link": "https://www.wikidata.org/wiki/Q12881714",
        "createdAt": "2024-12-19T18:21:20.543Z",
        "updatedAt": "2024-12-19T18:21:20.594Z",
        "publishedAt": "2024-12-19T18:21:20.606Z",
        "speaker_name": "Νικήτας Βενιζέλος",
        "speaker_id": "nikitas_benizelos",
        "description": "Έλληνας πολιτικός",
        "gender": "άνδρας",
        "date_of_birth": "Τετάρτη 1 Ιανουαρίου 1930",
        "place_of_birth": "Αθήνα",
        "educated_at": "",
        "website": null,
        "occupation": "πολιτικός",
        "languages": "νέα ελληνική γλώσσα",
        "date_of_death": "Τετάρτη 12 Φεβρουαρίου 2020",
        "image": {
          "id": 263,
          "documentId": "ukux20xf4f0mp6o9dmpkt3w9",
          "name": "image.jpeg",
          "alternativeText": null,
          "caption": null,
          "width": 280,
          "height": 365,
          "formats": {
            "thumbnail": {
              "name": "thumbnail_image.jpeg",
              "hash": "thumbnail_image_b72496d27b",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 120,
              "height": 156,
              "size": 4.04,
              "sizeInBytes": 4037,
              "url": "/uploads/thumbnail_image_b72496d27b.jpeg"
            }
          },
          "hash": "image_b72496d27b",
          "ext": ".jpeg",
          "mime": "image/jpeg",
          "size": 10.36,
          "url": "/uploads/image_b72496d27b.jpeg",
          "previewUrl": null,
          "provider": "local",
          "provider_metadata": null,
          "createdAt": "2024-12-19T18:21:17.799Z",
          "updatedAt": "2024-12-19T18:21:17.799Z",
          "publishedAt": "2024-12-19T18:21:17.800Z"
        }
      },
      {
        "id": 1788,
        "documentId": "jf6w8nditpa2slrnfi0qbowd",
        "link": "https://www.wikidata.org/wiki/Q12873648",
        "createdAt": "2024-12-19T18:21:32.663Z",
        "updatedAt": "2024-12-19T18:21:32.703Z",
        "publishedAt": "2024-12-19T18:21:32.720Z",
        "speaker_name": "ΑΝΔΡΕΑΣ ΛΕΝΤΑΚΗΣ",
        "speaker_id": "andreas_lentakis",
        "description": "Έλληνας πολιτικός και συγγραφέας 1934-1997",
        "gender": "άνδρας",
        "date_of_birth": "Δευτέρα 1 Ιανουαρίου 1934",
        "place_of_birth": "Αντίς Αμπέμπα",
        "educated_at": "National and Kapodistrian University of Athens",
        "website": null,
        "occupation": "συγγραφέας, πολιτικός",
        "languages": "νέα ελληνική γλώσσα",
        "date_of_death": "Τετάρτη 1 Ιανουαρίου 1997",
        "image": {
          "id": 269,
          "documentId": "yc2wztglixuexk4p6h6yufzf",
          "name": "image.jpeg",
          "alternativeText": null,
          "caption": null,
          "width": 4896,
          "height": 3672,
          "formats": {
            "thumbnail": {
              "name": "thumbnail_image.jpeg",
              "hash": "thumbnail_image_57a04ba5b2",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 208,
              "height": 156,
              "size": 10.61,
              "sizeInBytes": 10613,
              "url": "/uploads/thumbnail_image_57a04ba5b2.jpeg"
            },
            "small": {
              "name": "small_image.jpeg",
              "hash": "small_image_57a04ba5b2",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 500,
              "height": 375,
              "size": 49.83,
              "sizeInBytes": 49834,
              "url": "/uploads/small_image_57a04ba5b2.jpeg"
            },
            "medium": {
              "name": "medium_image.jpeg",
              "hash": "medium_image_57a04ba5b2",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 750,
              "height": 563,
              "size": 103.8,
              "sizeInBytes": 103798,
              "url": "/uploads/medium_image_57a04ba5b2.jpeg"
            },
            "large": {
              "name": "large_image.jpeg",
              "hash": "large_image_57a04ba5b2",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 1000,
              "height": 750,
              "size": 170.74,
              "sizeInBytes": 170742,
              "url": "/uploads/large_image_57a04ba5b2.jpeg"
            }
          },
          "hash": "image_57a04ba5b2",
          "ext": ".jpeg",
          "mime": "image/jpeg",
          "size": 2588.63,
          "url": "/uploads/image_57a04ba5b2.jpeg",
          "previewUrl": null,
          "provider": "local",
          "provider_metadata": null,
          "createdAt": "2024-12-19T18:21:31.114Z",
          "updatedAt": "2024-12-19T18:21:31.114Z",
          "publishedAt": "2024-12-19T18:21:31.115Z"
        }
      },
      {
        "id": 1776,
        "documentId": "r2cx7yyfd8izi7edc8llhxlw",
        "link": "https://www.wikidata.org/wiki/Q451135",
        "createdAt": "2024-12-19T18:21:24.842Z",
        "updatedAt": "2024-12-19T18:21:24.883Z",
        "publishedAt": "2024-12-19T18:21:24.894Z",
        "speaker_name": "ΔΗΜΗΤΡΙΟΣ ΣΙΟΥΦΑΣ",
        "speaker_id": "dimitrios_sioufas",
        "description": "Έλληνας πολιτικός, πρόεδρος της Βουλής των Ελλήνων (2007-2009)",
        "gender": "άνδρας",
        "date_of_birth": "Τρίτη 15 Αυγούστου 1944",
        "place_of_birth": "Ελληνόπυργος Καρδίτσας",
        "educated_at": "Aristotle University of Thessaloniki (bachelor's degree in jurisprudence), Panteion University (bachelor's degree in public administration), Panteion University (bachelor's degree in political science)",
        "website": null,
        "occupation": "δικηγόρος, πολιτικός",
        "languages": "νέα ελληνική γλώσσα",
        "date_of_death": "Παρασκευή 11 Ιανουαρίου 2019",
        "image": {
          "id": 266,
          "documentId": "zx7rkhmc9rvd8lkmw13sdtxh",
          "name": "image.jpeg",
          "alternativeText": null,
          "caption": null,
          "width": 294,
          "height": 473,
          "formats": {
            "thumbnail": {
              "name": "thumbnail_image.jpeg",
              "hash": "thumbnail_image_894ff7703f",
              "ext": ".jpeg",
              "mime": "image/jpeg",
              "path": null,
              "width": 97,
              "height": 156,
              "size": 3.51,
              "sizeInBytes": 3507,
              "url": "/uploads/thumbnail_image_894ff7703f.jpeg"
            }
          },
          "hash": "image_894ff7703f",
          "ext": ".jpeg",
          "mime": "image/jpeg",
          "size": 17.2,
          "url": "/uploads/image_894ff7703f.jpeg",
          "previewUrl": null,
          "provider": "local",
          "provider_metadata": null,
          "createdAt": "2024-12-19T18:21:23.529Z",
          "updatedAt": "2024-12-19T18:21:23.529Z",
          "publishedAt": "2024-12-19T18:21:23.529Z"
        }
      },
    ],
    political_parties: [
      {
        "id": 130,
        "documentId": "pbwe305muz2tov5gcvysmep5",
        "name": "Κομμουνιστικό Κόμμα Ελλάδας",
        "createdAt": "2024-12-19T18:21:16.066Z",
        "updatedAt": "2024-12-19T18:21:16.066Z",
        "publishedAt": "2024-12-19T18:21:16.070Z",
        "image": {
          "id": 262,
          "documentId": "yhttfku2ffvmatv86b139oa1",
          "name": "image.svg",
          "alternativeText": null,
          "caption": null,
          "width": 324,
          "height": 276,
          "formats": null,
          "hash": "image_9f9da13ab6",
          "ext": ".svg",
          "mime": "image/svg+xml",
          "size": 6.04,
          "url": "/uploads/image_9f9da13ab6.svg",
          "previewUrl": null,
          "provider": "local",
          "provider_metadata": null,
          "createdAt": "2024-12-19T18:21:15.967Z",
          "updatedAt": "2024-12-19T18:21:15.967Z",
          "publishedAt": "2024-12-19T18:21:15.967Z"
        }
      },
      {
        "id": 132,
        "documentId": "feobgki33vei7zhrx29zv6n5",
        "name": "Πολιτική Άνοιξη",
        "createdAt": "2024-12-19T18:21:19.300Z",
        "updatedAt": "2024-12-19T18:21:19.300Z",
        "publishedAt": "2024-12-19T18:21:19.303Z",
        "image": {
          "id": 264,
          "documentId": "mhwhb2ubqmp26v1v63p7v8j0",
          "name": "image.svg",
          "alternativeText": null,
          "caption": null,
          "width": 1032,
          "height": 426,
          "formats": null,
          "hash": "image_2bbf3459f7",
          "ext": ".svg",
          "mime": "image/svg+xml",
          "size": 3.94,
          "url": "/uploads/image_2bbf3459f7.svg",
          "previewUrl": null,
          "provider": "local",
          "provider_metadata": null,
          "createdAt": "2024-12-19T18:21:19.193Z",
          "updatedAt": "2024-12-19T18:21:19.193Z",
          "publishedAt": "2024-12-19T18:21:19.193Z"
        }
      },
      {
        "id": 134,
        "documentId": "qepfby89dgx6orb2qdzfch87",
        "name": "Ένωση Δημοκρατικού Κέντρου",
        "createdAt": "2024-12-19T18:21:20.460Z",
        "updatedAt": "2024-12-19T18:21:20.460Z",
        "publishedAt": "2024-12-19T18:21:20.464Z",
        "image": {
          "id": 265,
          "documentId": "y1tesheofy49hdrdyl2k1im2",
          "name": "image.svg",
          "alternativeText": null,
          "caption": null,
          "width": 512,
          "height": 512,
          "formats": null,
          "hash": "image_7b83b21010",
          "ext": ".svg",
          "mime": "image/svg+xml",
          "size": 24.65,
          "url": "/uploads/image_7b83b21010.svg",
          "previewUrl": null,
          "provider": "local",
          "provider_metadata": null,
          "createdAt": "2024-12-19T18:21:20.370Z",
          "updatedAt": "2024-12-19T18:21:20.370Z",
          "publishedAt": "2024-12-19T18:21:20.371Z"
        }
      },
      {
        "id": 136,
        "documentId": "m68wgzitmpymwwvods561x4g",
        "name": "Κόμμα Φιλελευθέρων (νεότερο)",
        "createdAt": "2024-12-19T18:21:20.499Z",
        "updatedAt": "2024-12-19T18:21:20.499Z",
        "publishedAt": "2024-12-19T18:21:20.502Z",
        "image": null
      },
      {
        "id": 138,
        "documentId": "o3sd2abed83zjvr4ihlqbybu",
        "name": "Νέα Δημοκρατία",
        "createdAt": "2024-12-19T18:21:24.781Z",
        "updatedAt": "2024-12-19T18:21:24.781Z",
        "publishedAt": "2024-12-19T18:21:24.787Z",
        "image": {
          "id": 267,
          "documentId": "xyn208flszb3ypdp87wwc8vx",
          "name": "image.svg",
          "alternativeText": null,
          "caption": null,
          "width": 378,
          "height": 264,
          "formats": null,
          "hash": "image_6523665e8a",
          "ext": ".svg",
          "mime": "image/svg+xml",
          "size": 1.77,
          "url": "/uploads/image_6523665e8a.svg",
          "previewUrl": null,
          "provider": "local",
          "provider_metadata": null,
          "createdAt": "2024-12-19T18:21:24.696Z",
          "updatedAt": "2024-12-19T18:21:24.696Z",
          "publishedAt": "2024-12-19T18:21:24.696Z"
        }
      },
      {
        "id": 140,
        "documentId": "s11l5et0xhgfdmb7halkpipo",
        "name": "Πανελλήνιο Σοσιαλιστικό Κίνημα",
        "createdAt": "2024-12-19T18:21:26.630Z",
        "updatedAt": "2024-12-19T18:21:26.630Z",
        "publishedAt": "2024-12-19T18:21:26.634Z",
        "image": {
          "id": 268,
          "documentId": "r0z2up3dy2x1p5xab5zqtykt",
          "name": "image.svg",
          "alternativeText": null,
          "caption": null,
          "width": 716,
          "height": 496,
          "formats": null,
          "hash": "image_64595a7af5",
          "ext": ".svg",
          "mime": "image/svg+xml",
          "size": 5,
          "url": "/uploads/image_64595a7af5.svg",
          "previewUrl": null,
          "provider": "local",
          "provider_metadata": null,
          "createdAt": "2024-12-19T18:21:26.536Z",
          "updatedAt": "2024-12-19T18:21:26.536Z",
          "publishedAt": "2024-12-19T18:21:26.536Z"
        }
      },
      {
        "id": 142,
        "documentId": "r1yhcfmrw54fhpokjealru1c",
        "name": "Συνασπισμός της Αριστεράς, των Κινημάτων και της Οικολογίας",
        "createdAt": "2024-12-19T18:21:32.610Z",
        "updatedAt": "2024-12-19T18:21:32.610Z",
        "publishedAt": "2024-12-19T18:21:32.614Z",
        "image": {
          "id": 270,
          "documentId": "f3jm43kvbj6u6osp6cfpnggj",
          "name": "image.svg",
          "alternativeText": null,
          "caption": null,
          "width": 640,
          "height": 405,
          "formats": null,
          "hash": "image_4ecd765e4a",
          "ext": ".svg",
          "mime": "image/svg+xml",
          "size": 11.82,
          "url": "/uploads/image_4ecd765e4a.svg",
          "previewUrl": null,
          "provider": "local",
          "provider_metadata": null,
          "createdAt": "2024-12-19T18:21:32.518Z",
          "updatedAt": "2024-12-19T18:21:32.518Z",
          "publishedAt": "2024-12-19T18:21:32.518Z"
        }
      },
      {
        "id": 142,
        "documentId": "r1yhcfmrw54fhpokjealru1c",
        "name": "Συνασπισμός της Αριστεράς, των Κινημάτων και της Οικολογίας",
        "createdAt": "2024-12-19T18:21:32.610Z",
        "updatedAt": "2024-12-19T18:21:32.610Z",
        "publishedAt": "2024-12-19T18:21:32.614Z",
        "image": {
          "id": 270,
          "documentId": "f3jm43kvbj6u6osp6cfpnggj",
          "name": "image.svg",
          "alternativeText": null,
          "caption": null,
          "width": 640,
          "height": 405,
          "formats": null,
          "hash": "image_4ecd765e4a",
          "ext": ".svg",
          "mime": "image/svg+xml",
          "size": 11.82,
          "url": "/uploads/image_4ecd765e4a.svg",
          "previewUrl": null,
          "provider": "local",
          "provider_metadata": null,
          "createdAt": "2024-12-19T18:21:32.518Z",
          "updatedAt": "2024-12-19T18:21:32.518Z",
          "publishedAt": "2024-12-19T18:21:32.518Z"
        }
      },
      {
        "id": 138,
        "documentId": "o3sd2abed83zjvr4ihlqbybu",
        "name": "Νέα Δημοκρατία",
        "createdAt": "2024-12-19T18:21:24.781Z",
        "updatedAt": "2024-12-19T18:21:24.781Z",
        "publishedAt": "2024-12-19T18:21:24.787Z",
        "image": {
          "id": 267,
          "documentId": "xyn208flszb3ypdp87wwc8vx",
          "name": "image.svg",
          "alternativeText": null,
          "caption": null,
          "width": 378,
          "height": 264,
          "formats": null,
          "hash": "image_6523665e8a",
          "ext": ".svg",
          "mime": "image/svg+xml",
          "size": 1.77,
          "url": "/uploads/image_6523665e8a.svg",
          "previewUrl": null,
          "provider": "local",
          "provider_metadata": null,
          "createdAt": "2024-12-19T18:21:24.696Z",
          "updatedAt": "2024-12-19T18:21:24.696Z",
          "publishedAt": "2024-12-19T18:21:24.696Z"
        }
      },

    ],
  };

  console.log("Debate data: ", debateData);


  // if (loading) return <p>Loading...</p>;
  if (!debateData) return <p>No data available</p>

  // Destructuring
  const {
    title,
    session,
    topics,
    openingSection,
    speakers,
    summary,
    political_parties,
  } = debateData;


  return (
    <div className={styles.pageLayout}>
      <div className={styles.sections}>

        <div className={styles.edgeSection} style={{top: 0, left: 0, borderRadius: "0 1.5rem 1.5rem 0"}}>
          <div className={styles.backgroundImageContainer2}></div>
        </div>


        {/* Left Section: Speaker Information */}
        <div className={styles.middleSection}>

          {/* Header Section */}
          <div className={styles.headerContent}>
            <div className={styles.textContent} style={{width: "100%", textAlign: "center"}}>
              {title && <h1 className={styles.speakerName}>{title}</h1>}
              {openingSection && <p className={styles.description}>{openingSection}</p>}
            </div>
          </div>

          {/*<div className="buttonContainer">*/}
          {/*  <button className="button">View Debate Content</button>*/}
          {/*  <button className="button">Go Back</button>*/}
          {/*</div>*/}

          <div>
            {/* Education Section */}
            {session && (
              <div>
                <strong className="dynamic-content">Parliament Session:</strong>
                <ul className={styles.list}>
                  <li><strong className="dynamic-content">Session Date:</strong> {session.session_date}</li>
                  <li><strong className="dynamic-content">Period:</strong> {session.period}</li>
                  <li><strong className="dynamic-content">Session:</strong> {session.session}</li>
                  <li><strong className="dynamic-content">Meeting:</strong> {session.meeting}</li>
                </ul>
              </div>
            )}
          </div>

          {/* Topics */}
          <div className={styles.aboutSection}>
            {topics && (
              <p><strong className="dynamic-content">Topics:</strong> {topics.join(", ")}</p>
            )}
          </div>


          {/*Extra Details*/}
          <div className={styles.partyDetails}>
            {political_parties && political_parties.length > 0 && (
              <div>
                <p>
                  <strong className="dynamic-content">Political Party: </strong>
                  {political_parties.map((party) => party.name).join(", ")}
                </p>
              </div>
            )}
            <div className={styles.partyImages}>
              {political_parties && political_parties.length > 0 && (
                political_parties.map((party, index) => {

                  const partyImage = party.image?.formats?.large?.url
                    ? `${STRAPI_URL}${party.image.formats.large.url}`
                    : party.image?.url
                      ? `${STRAPI_URL}${party.image.url}`
                      : null;

                  // If no image exists, return null
                  if (!partyImage) return null;

                  return (
                    <div className={styles.imageContainer} key={index}>
                      <img
                        src={partyImage} // TODO: Add fallback image
                        alt={`${party.name || "Political party"} photo`}
                        className={styles.partyImage}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Summary */}
          <div className={styles.aboutSection}>
            {summary && (
              <div>
                <strong className="dynamic-content">Summary</strong>
                <div>{summary}</div>
              </div>
            )}
          </div>


          {/* Speakers */}
          <div className={styles.aboutSection}>
            {speakers && (
              <p><strong className="dynamic-content">Speakers</strong></p>
            )}

            <div className={metadataStyles.speakersSection}>
              <div className={metadataStyles.grid}>
                {speakers.map((speaker, index) => {
                  const imageUrl = speaker.image?.formats?.large?.url
                    ? `${STRAPI_URL}${speaker.image.formats.large.url}`
                    : speaker.image?.url
                      ? `${STRAPI_URL}${speaker.image.url}`
                      : null;

                  return (
                    <SpeakerCard
                      key={index}
                      documentId={speaker.documentId}
                      image={imageUrl}
                      speaker_name={speaker.speaker_name}
                      containerStyle={{width: "5rem", height: "7.5rem", borderRadius: "1rem"}}
                      textStyle={{fontSize: ".5rem"}}
                    />
                  );
                })}
              </div>
            </div>

          </div>


          <div className="buttonContainer">
            <button className="button">View Debate Content</button>
            <button className="button">Go Back</button>
          </div>


        </div>

        {/* Right Section: Image */}
        <div className={styles.edgeSection} style={{borderRadius: "1.5rem 0 0 1.5rem"}}>
          <div className={styles.backgroundImageContainer}></div>
        </div>
      </div>
    </div>
  );
};

export default DebateMetadata;
