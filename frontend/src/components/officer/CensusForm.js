// components/officer/CensusForm.js
import * as chrono from 'chrono-node'; // ✅ CORRECT
import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/CensusForm.css';
import VoiceInput from './VoiceInput';

function convertKannadaNumberToDigit(text) {
  const map = {
    "ಸೊನ್ನೆ": "0",
    "ಒಂದು": "1",
    "ಎರಡು": "2",
    "ಮೂರು": "3",
    "ನಾಲ್ಕು": "4",
    "ಐದು": "5",
    "ಆರು": "6",
    "ಏಳು": "7",
    "ಎಂಟು": "8",
    "ಒಂಬತ್ತು": "9",
    "ಹತ್ತು": "10",
    "ಹನ್ನೊಂದು": "11",
    "ಹನ್ನೆರಡು": "12",
    "ಹದಿಮೂರು": "13",
    "ಹದಿನಾಲ್ಕು": "14",
    "ಹದಿನೈದು": "15",
    "ಹದಿನಾರು": "16",
    "ಹದಿನೇಳು": "17",
    "ಹದಿನೆಂಟು": "18",
    "ಹತ್ತೊಂಬತ್ತು": "19",
    "ಇಪ್ಪತ್ತು": "20"
  };

  text = text.trim().toLowerCase();
  return map[text] || text.replace(/\D/g, ""); // fallback to digits if user says "1 2 3"
}


const CensusForm = () => {
  const langMap = {
  en: "en-IN",
  kn: "kn-IN"
};

  const translations = {
    aadhaarPrompt: {
    en: "Please say your twelve digit Aadhaar number",
    kn: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹನ್ನೆರಡು ಅಂಕಿಗಳ ಆದಾರ್ ಸಂಖ್ಯೆಯನ್ನು ಹೇಳಿ"
  },
  aadhaarError: {
    en: "Please say a valid 12-digit Aadhaar number",
    kn: "ದಯವಿಟ್ಟು ಸರಿಯಾದ 12 ಅಂಕಿಯ ಆದಾರ್ ಸಂಖ್ಯೆಯನ್ನು ಹೇಳಿ"
  },
  genderLabel: {
    en: "Gender",
    kn: "ಲಿಂಗ"
  },
  male: {
    en: "Male",
    kn: "ಗಂಡು"
  },
  female: {
    en: "Female",
    kn: "ಹೆಣ್ಣು"
  },
  other: {
    en: "Other",
    kn: "ಇತರರು"
  },
  genderPrompt: {
    en: "Please say your gender: male, female, or other.",
    kn: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಲಿಂಗವನ್ನು ಹೇಳಿ: ಗಂಡು, ಹೆಣ್ಣು ಅಥವಾ ಇತರರು."
  },
  genderError: {
    en: "Sorry, I didn't catch that. Please say male, female, or other.",
    kn: "ಕ್ಷಮಿಸಿ, ನಾನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಗಂಡು, ಹೆಣ್ಣು ಅಥವಾ ಇತರರು ಎಂದು ಹೇಳಿ."
  },
  // Add other fields similarly...
};

const startVoiceInput = (callback, langCode = "en") => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  const langMap = {
    en: "en-IN",
    kn: "en-IN" // fallback to English for Kannada until Kannada is supported
  };

  recognition.lang = langMap[langCode] || "en-IN";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.continuous = false;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    callback(transcript.trim());
    recognition.stop();
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    alert("Voice input failed: " + event.error);
  };

  recognition.start();
};


const mapToMaritalStatus = (spoken) => {
  const text = spoken.toLowerCase();

  if (text.includes("single")) return "single";
  if (text.includes("married") || text.includes("merit")) return "married";
  if (text.includes("divorced") || text.includes("divorce")) return "divorced";
  if (text.includes("widowed") || text.includes("window") || text.includes("widow")) return "widowed";

  return null;
};

    
    // ------------------- Helper Functions ----------------------
function speak(text, lang = "en") {
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langMap[lang] || "en-IN"; // ✅ proper voice locale
    utterance.onend = resolve;
    speechSynthesis.speak(utterance);
  });
}

const askAndSetField = async (
  promptText,
  fieldPath,
  processText = (text) => text,
  validate = () => true,
  errorMessage = "Invalid input. Please try again."
) => {
  const synth = window.speechSynthesis;
  const utter = new SpeechSynthesisUtterance(promptText);
  utter.lang = language === "kn" ? "kn-IN" : "en-IN";
  synth.speak(utter);

  await new Promise((resolve) => (utter.onend = resolve));

  const recognition = new window.webkitSpeechRecognition() || new window.SpeechRecognition();
  recognition.lang = language === "kn" ? "kn-IN" : "en-IN";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = (event) => {
    const spoken = event.results[0][0].transcript;
    const processed = processText(spoken);
    if (validate(processed)) {
      setFormData((prevData) => {
        const updated = { ...prevData };
        const keys = fieldPath.split(".");
        let ref = updated;
        for (let i = 0; i < keys.length - 1; i++) {
          ref = ref[keys[i]];
        }
        ref[keys[keys.length - 1]] = processed;
        return updated;
      });
    } else {
      const errorUtter = new SpeechSynthesisUtterance(errorMessage);
      errorUtter.lang = language === "kn" ? "kn-IN" : "en-IN";
      synth.speak(errorUtter);
    }
  };

  recognition.onerror = (event) => {
    const errorUtter = new SpeechSynthesisUtterance(
      language === "kn"
        ? "ದೋಷ ಉಂಟಾಯಿತು. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ."
        : "An error occurred. Please try again."
    );
    errorUtter.lang = language === "kn" ? "kn-IN" : "en-IN";
    synth.speak(errorUtter);
  };
};

    const [formData, setFormData] = useState({
        aadhaarNumber: '',
        personalDetails: {
            fullName: '',
            gender: '',
            dateOfBirth: '',
            maritalStatus: '',
            nationality: ''
        },
        contactInformation: {
            phoneNumber: '',
            email: '',
            permanentAddress: '',
            temporaryAddress: ''
        },
        employmentEducation: {
            employmentStatus: '',
            occupation: '',
            highestQualification: ''
        },
        demographicDetails: {
            state: '',
            districtCity: '',
            pincode: ''
        },
        familyDetails: {
            headOfFamily: '',
            familyMembers: '',
            dependentMembers: ''
        },
        additionalInfo: {
            disabilities: 'None',
            annualIncome: ''
        }
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [language, setLanguage] = useState("en"); // "en" or "kn"

    const handleSubmit = async (e) => {
        e.preventDefault();

        
        setLoading(true);
        setError('');
        setSuccess('');

        try {
          const token = localStorage.getItem('officerToken');
          console.log('Submitting with token:', token); // Debug log

          const response = await axios.post(
              'http://localhost:5000/api/census',
              formData,
              {
                  headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json'
                  }
              }
          );

          console.log('Submission response:', response.data); // Debug log
          setSuccess('Census data submitted successfully');
            // Reset form
            setFormData({
                aadhaarNumber: '',
                personalDetails: {
                    fullName: '',
                    gender: '',
                    dateOfBirth: '',
                    maritalStatus: '',
                    nationality: ''
                },
                contactInformation: {
                    phoneNumber: '',
                    email: '',
                    permanentAddress: '',
                    temporaryAddress: ''
                },
                employmentEducation: {
                    employmentStatus: '',
                    occupation: '',
                    highestQualification: ''
                },
                demographicDetails: {
                    state: '',
                    districtCity: '',
                    pincode: ''
                },
                familyDetails: {
                    headOfFamily: '',
                    familyMembers: '',
                    dependentMembers: ''
                },
                additionalInfo: {
                    disabilities: 'None',
                    annualIncome: ''
                }
            });
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to submit census data');
        } finally {
            setLoading(false);
        }
    };

    
    const handleClear = () => {
        if (window.confirm('Are you sure you want to clear all fields?')) {
            setFormData({
                aadhaarNumber: '',
                personalDetails: {
                    fullName: '',
                    gender: '',
                    dateOfBirth: '',
                    maritalStatus: '',
                    nationality: ''
                },
                contactInformation: {
                    phoneNumber: '',
                    email: '',
                    permanentAddress: '',
                    temporaryAddress: ''
                },
                employmentEducation: {
                    employmentStatus: '',
                    occupation: '',
                    highestQualification: ''
                },
                demographicDetails: {
                    state: '',
                    districtCity: '',
                    pincode: ''
                },
                familyDetails: {
                    headOfFamily: '',
                    familyMembers: '',
                    dependentMembers: ''
                },
                additionalInfo: {
                    disabilities: 'None',
                    annualIncome: ''
                }
            });
        }
    };


    return (
      

        <div className="census-form-container">

          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
          <label style={{ marginRight: "10px" }}>Language / ಭಾಷೆ:</label>
           <button onClick={() => setLanguage(language === "en" ? "kn" : "en")}>
                Switch to {language === "en" ? "Kannada" : "English"}
              </button>
          </div>

         

            <h2>Enter User Details</h2>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleSubmit}>
               <div className="form-field">
  <label>{language === "en" ? "Aadhaar/ID Number" : "ಆಧಾರ್ / ಗುರುತಿನ ಸಂಖ್ಯೆ"}</label>
  <input
    type="text"
    placeholder={
      language === "en" ? "Enter Aadhaar/ID number" : "ಆಧಾರ್ / ಗುರುತಿನ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ"
    }
    value={formData.aadhaarNumber}
    onChange={(e) =>
      setFormData({
        ...formData,
        aadhaarNumber: e.target.value,
      })
    }
    maxLength={12}
    pattern="\d{12}"
    required
  />
  <button
    type="button"
    className="mic-btn"
    onClick={() =>
      askAndSetField(
        language === "en"
          ? "Please say your twelve digit Aadhaar number"
          : "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹನ್ನೆರಡು ಅಂಕಿಗಳ ಆದಾರ್ ಸಂಖ್ಯೆಯನ್ನು ಹೇಳಿ",
        "aadhaarNumber",
        (text) => text.replace(/\D/g, ""), // digits only
        (val) => val.length === 12,
        language === "en"
          ? "Please say a valid 12-digit Aadhaar number"
          : "ದಯವಿಟ್ಟು ಸರಿಯಾದ 12 ಅಂಕಿಯ ಆದಾರ್ ಸಂಖ್ಯೆಯನ್ನು ಹೇಳಿ"
      )
    }
  >
    🎤
  </button>
</div>


                <h3 className="section-title">1. Personal Details</h3>
                <div className="form-field">
  <label>{language === "en" ? "Full Name" : "ಪೂರ್ಣ ಹೆಸರು"}</label>
  <input
    type="text"
    placeholder={
      language === "en" ? "Enter full name" : "ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ"
    }
    value={formData.personalDetails.fullName}
    onChange={(e) =>
      setFormData({
        ...formData,
        personalDetails: {
          ...formData.personalDetails,
          fullName: e.target.value,
        },
      })
    }
    required
  />
  <button
    type="button"
    className="mic-btn"
    onClick={() =>
      askAndSetField(
        language === "en"
          ? "Please say your full name"
          : "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ಹೇಳಿ",
        "personalDetails.fullName"
      )
    }
  >
    🎤
  </button>
</div>


                <div className="form-field">
                <label>{translations.genderLabel[language]}</label>
                <select
                  value={formData.personalDetails.gender}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      personalDetails: {
                        ...formData.personalDetails,
                        gender: e.target.value,
                      },
                    })
                  }
                  required
                >
                  <option value="">{language === "en" ? "Select Gender" : "ಲಿಂಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ"}</option>
                  <option value="male">{translations.male[language]}</option>
                  <option value="female">{translations.female[language]}</option>
                  <option value="other">{translations.other[language]}</option>
                </select>

                <button
                  type="button"
                  className="mic-btn"
                  onClick={() =>
                    askAndSetField(
                      translations.genderPrompt[language],
                      "personalDetails.gender",
                      (text) => {
                        const clean = text.toLowerCase();
                        if (clean.includes("male") || clean.includes("mail") || clean.includes("ಗಂಡು")) return "male";
                        if (clean.includes("female") || clean.includes("femail") || clean.includes("ಹೆಣ್ಣು")) return "female";
                        if (clean.includes("other") || clean.includes("author") || clean.includes("mother") || clean.includes("ಇತರರು")) return "other";
                        return "";
                      },
                      (val) => ["male", "female", "other"].includes(val),
                      translations.genderError[language]
                    )
                  }
                >
                  🎤
                </button>

                </div>

<div className="form-field">
  <label>{language === "en" ? "Date of Birth" : "ಹುಟ್ಟಿದ ದಿನಾಂಕ"}</label>
  <input
    type="date"
    value={formData.personalDetails.dateOfBirth}
    onChange={(e) =>
      setFormData({
        ...formData,
        personalDetails: {
          ...formData.personalDetails,
          dateOfBirth: e.target.value,
        },
      })
    }
    required
  />
  <button
    type="button"
    className="mic-btn"
    onClick={() =>
      askAndSetField(
       language === "en"
  ? "Please say your date of birth like twenty second March two thousand one"
  : "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹುಟ್ಟಿದ ದಿನಾಂಕವನ್ನು ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಹೇಳಿ: twenty second March two thousand one",
        "personalDetails.dateOfBirth",
        (spoken) => {
          const parsedDate = chrono.parseDate(spoken);
          if (parsedDate) {
            return parsedDate.toISOString().split("T")[0];
          }
          return "";
        },
        (val) => /^\d{4}-\d{2}-\d{2}$/.test(val),
        language === "en"
          ? "Sorry, I couldn't understand the date."
          : "ಕ್ಷಮಿಸಿ, ದಿನಾಂಕವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲಾಗಲಿಲ್ಲ."
      )
    }
  >
    🎤
  </button>
</div>


             <div className="form-field">
  <label>
    {language === "en" ? "Marital Status" : "ವೈವಾಹಿಕ ಸ್ಥಿತಿ"}
  </label>
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <select
      value={formData.personalDetails.maritalStatus}
      onChange={(e) =>
        setFormData({
          ...formData,
          personalDetails: {
            ...formData.personalDetails,
            maritalStatus: e.target.value,
          },
        })
      }
      required
    >
      <option value="">
        {language === "en" ? "Select Status" : "ಸ್ಥಿತಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ"}
      </option>
      <option value="single">
        {language === "en" ? "Single" : "ಅವಿವಾಹಿತ"}
      </option>
      <option value="married">
        {language === "en" ? "Married" : "ವಿವಾಹಿತ"}
      </option>
      <option value="divorced">
        {language === "en" ? "Divorced" : "ವಿಚ್ಛೇದಿತ"}
      </option>
      <option value="widowed">
        {language === "en" ? "Widowed" : "ವಿಧವೆ"}
      </option>
    </select>

    <button
      type="button"
      className="mic-btn"
      onClick={() =>
        askAndSetField(
          language === "en"
            ? "Please say your marital status: single, married, divorced, or widowed."
            : "ದಯವಿಟ್ಟು ನಿಮ್ಮ ವೈವಾಹಿಕ ಸ್ಥಿತಿಯನ್ನು ಹೇಳಿ: ಅವಿವಾಹಿತ, ವಿವಾಹಿತ, ವಿಚ್ಛೇದಿತ ಅಥವಾ ವಿಧವೆ.",
          "personalDetails.maritalStatus",
          (text) => {
            const clean = text.toLowerCase();
            if (
              clean.includes("single") ||
              clean.includes("ಅವಿವಾಹಿತ")
            )
              return "single";
            if (
              clean.includes("married") ||
              clean.includes("ವಿವಾಹಿತ")
            )
              return "married";
            if (
              clean.includes("divorced") ||
              clean.includes("ವಿಚ್ಛೇದಿತ")
            )
              return "divorced";
            if (
              clean.includes("widowed") ||
              clean.includes("window") ||
              clean.includes("ವಿಧವೆ")
            )
              return "widowed";
            return "single";
          },
          (val) =>
            ["single", "married", "divorced", "widowed"].includes(val),
          language === "en"
            ? "Sorry, I didn't catch that. Please say: single, married, divorced, or widowed."
            : "ಕ್ಷಮಿಸಿ, ನಾನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಹೇಳಿ: ಅವಿವಾಹಿತ, ವಿವಾಹಿತ, ವಿಚ್ಛೇದಿತ ಅಥವಾ ವಿಧವೆ."
        )
      }
    >
      🎤
    </button>
  </div>
</div>

           <div className="form-field">
  <label>
    {language === "en" ? "Nationality" : "ರಾಷ್ಟ್ರತೆ"}
  </label>
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <input
      type="text"
      placeholder={
        language === "en" ? "Enter nationality" : "ನಿಮ್ಮ ರಾಷ್ಟ್ರತೆ ನಮೂದಿಸಿ"
      }
      value={formData.personalDetails.nationality}
      onChange={(e) =>
        setFormData({
          ...formData,
          personalDetails: {
            ...formData.personalDetails,
            nationality: e.target.value,
          },
        })
      }
      required
    />

    <button
      type="button"
      className="mic-btn"
      onClick={() =>
        askAndSetField(
          language === "en"
            ? "Please say your nationality."
            : "ದಯವಿಟ್ಟು ನಿಮ್ಮ ರಾಷ್ಟ್ರತೆಯನ್ನು ಹೇಳಿ.",
          "personalDetails.nationality",
          (spoken) => spoken.trim(),
          (val) => val.length > 0,
          language === "en"
            ? "Sorry, I couldn't understand the nationality. Please try again."
            : "ಕ್ಷಮಿಸಿ, ರಾಷ್ಟ್ರತೆಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಪುನಃ ಪ್ರಯತ್ನಿಸಿ."
        )
      }
    >
      🎤
    </button>
  </div>
</div>

               <h3 className="section-title">2. Contact Information</h3>

<div className="form-field">
  <label>
    {language === "en" ? "Phone Number" : "ದೂರವಾಣಿ ಸಂಖ್ಯೆ"}
  </label>
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <input
      type="tel"
      placeholder={
        language === "en"
          ? "Enter phone number"
          : "ದಯವಿಟ್ಟು ನಿಮ್ಮ ದೂರವಾಣಿ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ"
      }
      value={formData.contactInformation.phoneNumber}
      onChange={(e) =>
        setFormData({
          ...formData,
          contactInformation: {
            ...formData.contactInformation,
            phoneNumber: e.target.value,
          },
        })
      }
      required
    />
    <button
      type="button"
      className="mic-btn"
      onClick={() =>
        askAndSetField(
          language === "en"
            ? "Please say your phone number."
            : "ದಯವಿಟ್ಟು ನಿಮ್ಮ ದೂರವಾಣಿ ಸಂಖ್ಯೆಯನ್ನು ಹೇಳಿ.",
          "contactInformation.phoneNumber",
          (spoken) => spoken.replace(/\D/g, ""), // keep only digits
          (val) => /^\d{10}$/.test(val), // validate 10 digits
          language === "en"
            ? "Sorry, I couldn't understand. Please say a valid 10-digit phone number."
            : "ಕ್ಷಮಿಸಿ, ದೂರವಾಣಿ ಸಂಖ್ಯೆಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು 10 ಅಂಕಿಯ ಸಂಖ್ಯೆಯನ್ನು ಹೇಳಿ."
        )
      }
    >
      🎤
    </button>
  </div>
</div>

<div className="form-field optional">
  <label>
    {language === "en" ? "Email Address" : "ಇಮೇಲ್ ವಿಳಾಸ"}
  </label>
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <input
      type="email"
      placeholder={
        language === "en"
          ? "Enter email address"
          : "ಇಮೇಲ್ ವಿಳಾಸ ನಮೂದಿಸಿ"
      }
      value={formData.contactInformation.email}
      onChange={(e) =>
        setFormData({
          ...formData,
          contactInformation: {
            ...formData.contactInformation,
            email: e.target.value,
          },
        })
      }
    />
    <button
      type="button"
      className="mic-btn"
      onClick={() =>
        askAndSetField(
          language === "en"
            ? "Please say your email address like example at gmail dot com"
            : "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ಹೇಳಿ. ಉದಾಹರಣೆಗೆ: ಉದಾಹರಣೆ ಅಟ್ ಗ್ಮೇಲ್ ಡಾಟ್ ಕಾಮ್",
          "contactInformation.email",
          (spoken) =>
            spoken
              .toLowerCase()
              .replace(/\s+at\s+/g, "@")
              .replace(/\s+dot\s+/g, ".")
              .replace(/\s+/g, ""),
          (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
          language === "en"
            ? "Sorry, I couldn't understand the email address. Please try again like: example at gmail dot com."
            : "ಕ್ಷಮಿಸಿ, ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು 'example at gmail dot com' ಎನ್ನುವಂತೆ ಹೇಳಿ."
        )
      }
    >
      🎤
    </button>
  </div>
</div>


              <div className="form-field">
  <label>
    {language === "en" ? "Permanent Address" : "ಶಾಶ್ವತ ವಿಳಾಸ"}
  </label>
  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
    <textarea
      placeholder={
        language === "en"
          ? "Enter permanent address"
          : "ಶಾಶ್ವತ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ"
      }
      value={formData.contactInformation.permanentAddress}
      onChange={(e) =>
        setFormData({
          ...formData,
          contactInformation: {
            ...formData.contactInformation,
            permanentAddress: e.target.value,
          },
        })
      }
      required
    />
    <button
      type="button"
      className="mic-btn"
      onClick={() =>
        askAndSetField(
          language === "en"
            ? "Please say your permanent address."
            : "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಶಾಶ್ವತ ವಿಳಾಸವನ್ನು ಹೇಳಿ.",
          "contactInformation.permanentAddress",
          (spoken) => spoken,
          (val) => val.trim().length > 10,
          language === "en"
            ? "Sorry, the address was too short or unclear. Please try again."
            : "ಕ್ಷಮಿಸಿ, ವಿಳಾಸ ಚಿಕ್ಕದಾಗಿತ್ತು ಅಥವಾ ಅಸ್ಪಷ್ಟವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ."
        )
      }
    >
      🎤
    </button>
  </div>
</div>

<div className="form-field">
  <label>
    {language === "en" ? "Temporary Address" : "ತಾತ್ಕಾಲಿಕ ವಿಳಾಸ"}
  </label>

  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
    <textarea
      placeholder={
        language === "en"
          ? "Enter temporary address (if applicable)"
          : "ತಾತ್ಕಾಲಿಕ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ (ಅವಶ್ಯಕವಿದ್ದಲ್ಲಿ)"
      }
      value={formData.contactInformation.temporaryAddress}
      onChange={(e) =>
        setFormData({
          ...formData,
          contactInformation: {
            ...formData.contactInformation,
            temporaryAddress: e.target.value,
          },
        })
      }
      required
    />

    <button
      type="button"
      className="mic-btn"
      onClick={() =>
        askAndSetField(
          language === "en"
            ? "Please say your temporary address or say not applicable."
            : "ದಯವಿಟ್ಟು ನಿಮ್ಮ ತಾತ್ಕಾಲಿಕ ವಿಳಾಸವನ್ನು ಹೇಳಿ ಅಥವಾ 'ಅನ್ವಯವಾಗದು' ಎಂದು ಹೇಳಿ.",
          "contactInformation.temporaryAddress",
          (spoken) => spoken.trim(),
          (val) =>
            val.toLowerCase() === "not applicable" ||
            val === "ಅನ್ವಯವಾಗದು" ||
            val.trim().length > 5,
          language === "en"
            ? "Sorry, the address was too short or unclear. Please try again."
            : "ಕ್ಷಮಿಸಿ, ವಿಳಾಸ ಚಿಕ್ಕದಾಗಿದೆ ಅಥವಾ ಅಸ್ಪಷ್ಟವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ."
        )
      }
    >
      🎤
    </button>
  </div>
</div>

<h3 className="section-title">3. Employment and Education</h3>
<div className="form-field">
  <label>{language === "en" ? "Employment Status" : "ಉದ್ಯೋಗ ಸ್ಥಿತಿ"}</label>

  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
    <select
      value={formData.employmentEducation.employmentStatus}
      onChange={(e) =>
        setFormData({
          ...formData,
          employmentEducation: {
            ...formData.employmentEducation,
            employmentStatus: e.target.value,
          },
        })
      }
      required
    >
      <option value="">{language === "en" ? "Select Status" : "ಸ್ಥಿತಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ"}</option>
      <option value="employed">{language === "en" ? "Employed" : "ಉದ್ಯೋಗದಲ್ಲಿರುವವರು"}</option>
      <option value="unemployed">{language === "en" ? "Unemployed" : "ಉದ್ಯೋಗವಿಲ್ಲದವರು"}</option>
      <option value="self-employed">{language === "en" ? "Self Employed" : "ಸ್ವ ಉದ್ಯೋಗ"}</option>
      <option value="student">{language === "en" ? "Student" : "ವಿದ್ಯಾರ್ಥಿ"}</option>
    </select>

    <button
      type="button"
      className="mic-btn"
      onClick={() =>
        askAndSetField(
          language === "en"
            ? "Please say your employment status: employed, unemployed, self-employed, or student."
            : "ದಯವಿಟ್ಟು ಉದ್ಯೋಗ ಸ್ಥಿತಿಯನ್ನು ಹೇಳಿ: ಉದ್ಯೋಗದಲ್ಲಿರುವವರು, ಉದ್ಯೋಗವಿಲ್ಲದವರು, ಸ್ವ ಉದ್ಯೋಗ ಅಥವಾ ವಿದ್ಯಾರ್ಥಿ.",
          "employmentEducation.employmentStatus",
          (text) => {
            const clean = text.toLowerCase();
            if (
              clean.includes("employed") ||
              clean.includes("ಉದ್ಯೋಗ") && !clean.includes("ವಿಲ್ಲ")
            )
              return "employed";
            if (
              clean.includes("unemployed") ||
              clean.includes("ಉದ್ಯೋಗವಿಲ್ಲ") ||
              clean.includes("ಕೆಲಸವಿಲ್ಲ")
            )
              return "unemployed";
            if (clean.includes("self") || clean.includes("ಸ್ವ ಉದ್ಯೋಗ"))
              return "self-employed";
            if (clean.includes("student") || clean.includes("study") || clean.includes("ವಿದ್ಯಾರ್ಥಿ"))
              return "student";
            return "";
          },
          (val) =>
            ["employed", "unemployed", "self-employed", "student"].includes(val),
          language === "en"
            ? "Sorry, please say employed, unemployed, self-employed, or student."
            : "ಕ್ಷಮಿಸಿ, ಉದ್ಯೋಗ ಸ್ಥಿತಿಗೆ: ಉದ್ಯೋಗದಲ್ಲಿರುವವರು, ಉದ್ಯೋಗವಿಲ್ಲದವರು, ಸ್ವ ಉದ್ಯೋಗ ಅಥವಾ ವಿದ್ಯಾರ್ಥಿ ಎಂದು ಹೇಳಿ."
        )
      }
    >
      🎤
    </button>
  </div>
</div>

<div className="form-field">
  <label>{language === "en" ? "Occupation" : "ವೃತ್ತಿ"}</label>

  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
    <input
      type="text"
      placeholder={language === "en" ? "Enter occupation" : "ನಿಮ್ಮ ವೃತ್ತಿಯನ್ನು ನಮೂದಿಸಿ"}
      value={formData.employmentEducation.occupation}
      onChange={(e) =>
        setFormData({
          ...formData,
          employmentEducation: {
            ...formData.employmentEducation,
            occupation: e.target.value,
          },
        })
      }
      required
    />
    <button
      type="button"
      className="mic-btn"
      onClick={() =>
        askAndSetField(
          language === "en"
            ? "Please say your occupation."
            : "ದಯವಿಟ್ಟು ನಿಮ್ಮ ವೃತ್ತಿಯನ್ನು ಹೇಳಿ.",
          "employmentEducation.occupation",
          (spoken) => spoken.trim(),
          (val) => val.trim().length > 2,
          language === "en"
            ? "Sorry, occupation not clear. Please try again."
            : "ಕ್ಷಮಿಸಿ, ವೃತ್ತಿ ಸ್ಪಷ್ಟವಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ."
        )
      }
    >
      🎤
    </button>
  </div>
</div>

<div className="form-field">
  <label>{language === "en" ? "Highest Qualification" : "ಅತ್ಯುಚ್ಚ ಶೈಕ್ಷಣಿಕ ಅರ್ಹತೆ"}</label>

  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
    <select
      value={formData.employmentEducation.highestQualification}
      onChange={(e) =>
        setFormData({
          ...formData,
          employmentEducation: {
            ...formData.employmentEducation,
            highestQualification: e.target.value,
          },
        })
      }
      required
    >
      <option value="">
        {language === "en" ? "Select Qualification" : "ಅರ್ಹತೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ"}
      </option>
      <option value="primary">
        {language === "en" ? "Primary" : "ಪ್ರಾಥಮಿಕ"}
      </option>
      <option value="secondary">
        {language === "en" ? "Secondary" : "ಮಾಧ್ಯಮಿಕ"}
      </option>
      <option value="graduate">
        {language === "en" ? "Graduate" : "ಸ್ನಾತಕ"}
      </option>
      <option value="postgraduate">
        {language === "en" ? "Post Graduate" : "ಸ್ನಾತಕೊತ್ತರ"}
      </option>
    </select>

    <button
      type="button"
      className="mic-btn"
      onClick={() =>
        askAndSetField(
          language === "en"
            ? "Please say your highest qualification: primary, secondary, graduate, or postgraduate."
            : "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಶೈಕ್ಷಣಿಕ ಅರ್ಹತೆಯನ್ನು ಹೇಳಿ: ಪ್ರಾಥಮಿಕ, ಮಾಧ್ಯಮಿಕ, ಸ್ನಾತಕ ಅಥವಾ ಸ್ನಾತಕೊತ್ತರ.",
          "employmentEducation.highestQualification",
          (text) => {
            const clean = text.toLowerCase();
            if (
              clean.includes("primary") ||
              clean.includes("prathamik") ||
              clean.includes("ಪ್ರಾಥಮಿಕ")
            )
              return "primary";
            if (
              clean.includes("secondary") ||
              clean.includes("madhyamik") ||
              clean.includes("ಮಾಧ್ಯಮಿಕ")
            )
              return "secondary";
            if (
              (clean.includes("graduate") && !clean.includes("post")) ||
              clean.includes("snaataka") ||
              clean.includes("ಸ್ನಾತಕ")
            )
              return "graduate";
            if (
              clean.includes("postgraduate") ||
              clean.includes("post graduate") ||
              clean.includes("pg") ||
              clean.includes("ಸ್ನಾತಕೊತ್ತರ")
            )
              return "postgraduate";
            return "";
          },
          (val) =>
            ["primary", "secondary", "graduate", "postgraduate"].includes(val),
          language === "en"
            ? "Sorry, please say: primary, secondary, graduate, or postgraduate."
            : "ಕ್ಷಮಿಸಿ, ದಯವಿಟ್ಟು ಈವುಗಳಲ್ಲಿ ಒಂದನ್ನು ಹೇಳಿ: ಪ್ರಾಥಮಿಕ, ಮಾಧ್ಯಮಿಕ, ಸ್ನಾತಕ ಅಥವಾ ಸ್ನಾತಕೊತ್ತರ."
        )
      }
    >
      🎤
    </button>
  </div>
</div>

<h3 className="section-title">4. Demographic Details</h3>
<div className="form-field">
  <label>{language === "en" ? "State" : "ರಾಜ್ಯ"}</label>
  <input
    type="text"
    value="Karnataka"
    disabled
    className="disabled-input"
    required
  />
</div>

<div className="form-field">
  <label>{language === "en" ? "District/City" : "ಜಿಲ್ಲೆ ಅಥವಾ ನಗರ"}</label>
  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
    <input
      type="text"
      placeholder={
        language === "en"
          ? "Enter district/city"
          : "ಜಿಲ್ಲೆ ಅಥವಾ ನಗರದ ಹೆಸರು ನಮೂದಿಸಿ"
      }
      value={formData.demographicDetails.districtCity}
      onChange={(e) =>
        setFormData({
          ...formData,
          demographicDetails: {
            ...formData.demographicDetails,
            districtCity: e.target.value,
          },
        })
      }
      required
    />
    <button
      type="button"
      className="mic-btn"
      onClick={() =>
        askAndSetField(
          language === "en"
            ? "Please say your district or city name."
            : "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಜಿಲ್ಲೆಯ ಅಥವಾ ನಗರದ ಹೆಸರನ್ನು ಹೇಳಿ.",
          "demographicDetails.districtCity",
          (spoken) => spoken.trim(),
          (val) => val.length > 2,
          language === "en"
            ? "District name not recognized. Please try again."
            : "ಜಿಲ್ಲೆ ಅಥವಾ ನಗರ ಪತ್ತೆಯಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮರುಪ್ರಯತ್ನಿಸಿ."
        )
      }
    >
      🎤
    </button>
  </div>
</div>

<div className="form-field">
  <label>{language === "en" ? "Pincode/Zip Code" : "ಪಿನ್‌ಕೋಡ್ / ಜಿಪ್ ಕೋಡ್"}</label>
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <input
      type="text"
      placeholder={
        language === "en" ? "Enter pincode" : "ಪಿನ್‌ಕೋಡ್ ನಮೂದಿಸಿ"
      }
      value={formData.demographicDetails.pincode}
      onChange={(e) =>
        setFormData({
          ...formData,
          demographicDetails: {
            ...formData.demographicDetails,
            pincode: e.target.value,
          },
        })
      }
      required
    />
    <button
      type="button"
      className="mic-btn"
      onClick={() =>
        askAndSetField(
          language === "en"
            ? "Please say your pincode digit by digit."
            : "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪಿನ್‌ಕೋಡ್ ಅನ್ನು ಅಂಕೆಗಣನೆಯಾಗಿ ಹೇಳಿ.",
          "demographicDetails.pincode",
          (text) => text.replace(/\D/g, ""),
          (val) => /^\d{6}$/.test(val),
          language === "en"
            ? "Sorry, I didn't get a 6-digit pincode. Please try again."
            : "ಕ್ಷಮಿಸಿ, ಪಿನ್‌ಕೋಡ್ 6 ಅಂಕೆಗಳಲ್ಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ."
        )
      }
    >
      🎤
    </button>
  </div>
</div>


<h3 className="section-title">5. Family Details</h3>


<div className="form-field">
  <label>{language === "en" ? "Head of the Family" : "ಕುಟುಂಬದ ಮುಖ್ಯಸ್ಥರು"}</label>
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <input
      type="text"
      placeholder={language === "en" ? "Enter head of the family" : "ಕುಟುಂಬದ ಮುಖ್ಯಸ್ಥರ ಹೆಸರನ್ನು ನಮೂದಿಸಿ"}
      value={formData.familyDetails.headOfFamily}
      onChange={(e) =>
        setFormData({
          ...formData,
          familyDetails: {
            ...formData.familyDetails,
            headOfFamily: e.target.value,
          },
        })
      }
      required
    />
    <button
      type="button"
      className="mic-btn"
      onClick={() =>
        askAndSetField(
          language === "en"
            ? "Please say the name of the head of the family."
            : "ದಯವಿಟ್ಟು ಕುಟುಂಬದ ಮುಖ್ಯಸ್ಥರ ಹೆಸರನ್ನು ಹೇಳಿ.",
          "familyDetails.headOfFamily",
          (text) => text.trim(),
          (val) => val.length >2,
          language === "en"
            ? "Sorry, I couldn't understand the name. Please try again."
            : "ಕ್ಷಮಿಸಿ, ಹೆಸರನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ."
        )
      }
    >
      🎤
    </button>
  </div>
</div>


<div className="form-field">
  <label>{language === "en" ? "Number of Family Members" : "ಕುಟುಂಬದ ಸದಸ್ಯರ ಸಂಖ್ಯೆ"}</label>
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <input
      type="number"
      placeholder={language === "en" ? "Enter number of family members" : "ಕುಟುಂಬದ ಸದಸ್ಯರ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ"}
      value={formData.familyDetails.familyMembers}
      onChange={(e) =>
        setFormData({
          ...formData,
          familyDetails: {
            ...formData.familyDetails,
            familyMembers: e.target.value,
          },
        })
      }
      required
    />
    <button
      type="button"
      className="mic-btn"
      onClick={() =>
        askAndSetField(
          language === "en"
            ? "Please say the number of family members."
            : "ದಯವಿಟ್ಟು ಕುಟುಂಬದ ಸದಸ್ಯರ ಸಂಖ್ಯೆಯನ್ನು ಹೇಳಿ.",
          "familyDetails.familyMembers",
          (text) => {
            const num = parseInt(text);
            return isNaN(num) ? "" : num.toString();
          },
          (val) => /^\d+$/.test(val),
          language === "en"
            ? "Sorry, I couldn't understand the number. Please try again."
            : "ಕ್ಷಮಿಸಿ, ಸಂಖ್ಯೆಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ."
        )
      }
    >
      🎤
    </button>
  </div>
</div>


  <div className="form-field">
  <label>
    {language === "kn" ? "ಆಧಾರಿತ ಸದಸ್ಯರ ಸಂಖ್ಯೆ" : "Number of Dependent Members"}
  </label>
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <input
      type="number"
      placeholder={
        language === "kn"
          ? "ಆಧಾರಿತ ಸದಸ್ಯರ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ"
          : "Enter number of dependent members"
      }
      value={formData.familyDetails.dependentMembers}
      onChange={(e) =>
        setFormData({
          ...formData,
          familyDetails: {
            ...formData.familyDetails,
            dependentMembers: e.target.value,
          },
        })
      }
      required
    />
    <button
      type="button"
      className="mic-btn"
      onClick={() =>
        askAndSetField(
          language === "kn"
            ? "ದಯವಿಟ್ಟು ಅವಲಂಬಿತ ಸದಸ್ಯರ ಸಂಖ್ಯೆಯನ್ನು ಹೇಳಿ."
            : "Please say the number of dependent members.",
          "familyDetails.dependentMembers",
          (text) => {
            const num = convertKannadaNumberToDigit(text);
            return /^\d+$/.test(num) ? num : "";
          },
          (val) => /^\d+$/.test(val),
          language === "kn"
            ? "ಕ್ಷಮಿಸಿ, ಸಂಖ್ಯೆಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ."
            : "Sorry, I couldn't understand the number. Please try again."
        )
      }
    >
      🎤
    </button>
  </div>
</div>

<h3 className="section-title">6. Additional Information</h3>
<div className="form-field">
  <label>
    {language === "kn" ? "ವಿಕಲಚೇತನತೆ (ಇದಿದ್ದರೆ)" : "Disabilities (if any)"}
  </label>
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <select
      value={formData.additionalInfo.disabilities}
      onChange={(e) =>
        setFormData({
          ...formData,
          additionalInfo: {
            ...formData.additionalInfo,
            disabilities: e.target.value,
          },
        })
      }
      required
    >
      <option value="None">{language === "kn" ? "ಯಾವುದೂ ಇಲ್ಲ" : "None"}</option>
      <option value="physical">{language === "kn" ? "ಶಾರೀರಿಕ" : "Physical"}</option>
      <option value="visual">{language === "kn" ? "ದೃಷ್ಟಿ" : "Visual"}</option>
      <option value="hearing">{language === "kn" ? "ಶ್ರವಣ" : "Hearing"}</option>
      <option value="other">{language === "kn" ? "ಇತರೆ" : "Other"}</option>
    </select>

    <button
      type="button"
      className="mic-btn"
      onClick={() =>
        askAndSetField(
          language === "kn"
            ? "ದಯವಿಟ್ಟು ನಿಮ್ಮ ವಿಕಲಚೇತನ ಸ್ಥಿತಿಯನ್ನು ಹೇಳಿ: ಯಾವುದೂ ಇಲ್ಲ, ಶಾರೀರಿಕ, ದೃಷ್ಟಿ, ಶ್ರವಣ ಅಥವಾ ಇತರೆ."
            : "Please say your disability status: none, physical, visual, hearing, or other.",
          "additionalInfo.disabilities",
          (text) => {
            const clean = text.toLowerCase();

            if (language === "kn") {
              if (clean.includes("ಯಾವುದೂ") || clean.includes("ಇಲ್ಲ")) return "None";
              if (clean.includes("ಶಾರೀರಿಕ")) return "physical";
              if (clean.includes("ದೃಷ್ಟಿ")) return "visual";
              if (clean.includes("ಶ್ರವಣ")) return "hearing";
              if (clean.includes("ಇತರೆ")) return "other";
            } else {
              if (clean.includes("none")) return "None";
              if (clean.includes("physical")) return "physical";
              if (clean.includes("visual")) return "visual";
              if (clean.includes("hearing")) return "hearing";
              if (clean.includes("other")) return "other";
            }

            return "";
          },
          (val) =>
            ["None", "physical", "visual", "hearing", "other"].includes(val),
          language === "kn"
            ? "ಕ್ಷಮಿಸಿ, ಸ್ಪಷ್ಟವಲ್ಲ. ದಯವಿಟ್ಟು ಪುನಃ ಪ್ರಯತ್ನಿಸಿ: ಯಾವುದೂ ಇಲ್ಲ, ಶಾರೀರಿಕ, ದೃಷ್ಟಿ, ಶ್ರವಣ ಅಥವಾ ಇತರೆ."
            : "Sorry, I didn't catch that. Please say: none, physical, visual, hearing, or other."
        )
      }
    >
      🎤
    </button>
  </div>
</div>
<div className="form-field">
  <label>
    {language === "kn" ? "ವಾರ್ಷಿಕ ಆದಾಯ" : "Annual Income"}
  </label>
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <input
      type="number"
      placeholder={
        language === "kn"
          ? "ವಾರ್ಷಿಕ ಆದಾಯವನ್ನು ನಮೂದಿಸಿ"
          : "Enter annual income"
      }
      value={formData.additionalInfo.annualIncome}
      onChange={(e) =>
        setFormData({
          ...formData,
          additionalInfo: {
            ...formData.additionalInfo,
            annualIncome: e.target.value,
          },
        })
      }
      suppressContentEditableWarning
      required
    />

    <button
      type="button"
      className="mic-btn"
      onClick={() =>
        askAndSetField(
          language === "kn"
            ? "ದಯವಿಟ್ಟು ನಿಮ್ಮ ವಾರ್ಷಿಕ ಆದಾಯವನ್ನು ಸಂಖ್ಯೆಯಲ್ಲಿ ಹೇಳಿ."
            : "Please say your annual income in numbers.",
          "additionalInfo.annualIncome",
          (text) => {
            const num = parseInt(text.replace(/[^\d]/g, ""));
            return isNaN(num) ? "" : num.toString();
          },
          (val) => /^\d+$/.test(val),
          language === "kn"
            ? "ಕ್ಷಮಿಸಿ, ಮೊತ್ತ ಸ್ಪಷ್ಟವಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು ಸಂಖ್ಯೆಯಲ್ಲಿ ಹೇಳಿ ಉದಾಹರಣೆಗೆ ಐದು ಲಕ್ಷ ಅಥವಾ ನಲವತ್ತು ಸಾವಿರ."
            : "Sorry, I couldn't understand the amount. Please say a number like five lakh or fifty thousand."
        )
      }
    >
      🎤
    </button>
  </div>
</div>

                <div className="form-actions">
                    <button 
                        type="submit" 
                        className="submi-btn"
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                    <button 
                        type="button" 
                        className="clear-btn"
                        onClick={handleClear}
                    >
                        Clear
                    </button>
                </div>
            </form>
        </div>
    );
};
export default CensusForm;