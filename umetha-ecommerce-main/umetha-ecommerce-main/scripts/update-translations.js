const fs = require('fs');
const path = require('path');

// Read the English translation file as the template
const englishFile = path.join(__dirname, '../locales/en/translation.json');
const englishData = JSON.parse(fs.readFileSync(englishFile, 'utf8'));

// List of all language codes
const languages = [
  'zh', 'hi', 'es', 'fr', 'ar', 'bn', 'pt', 'ru', 'ur',
  'id', 'de', 'ja', 'sw', 'it', 'ko', 'vi', 'pl', 'th', 'nl', 'fa',
  'tl', 'ta', 'pa', 'ms', 'uk', 'he', 'el', 'my'
];

// Function to create a basic translation structure
function createTranslationStructure(langCode, existingData = {}) {
  const structure = JSON.parse(JSON.stringify(englishData));
  
  // If there's existing data, merge it with the structure
  if (existingData && Object.keys(existingData).length > 0) {
    // Merge existing translations while preserving the structure
    function mergeTranslations(target, source) {
      for (const key in target) {
        if (source[key] !== undefined) {
          if (typeof target[key] === 'object' && typeof source[key] === 'object') {
            mergeTranslations(target[key], source[key]);
          } else {
            target[key] = source[key];
          }
        }
      }
    }
    mergeTranslations(structure, existingData);
  }
  
  return structure;
}

// Update each language file
languages.forEach(langCode => {
  const filePath = path.join(__dirname, `../locales/${langCode}/translation.json`);
  
  try {
    // Read existing file if it exists
    let existingData = {};
    if (fs.existsSync(filePath)) {
      const existingContent = fs.readFileSync(filePath, 'utf8');
      existingData = JSON.parse(existingContent);
    }
    
    // Create new structure with existing translations
    const newData = createTranslationStructure(langCode, existingData);
    
    // Write the updated file
    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), 'utf8');
    console.log(`✅ Updated ${langCode}/translation.json`);
    
  } catch (error) {
    console.error(`❌ Error updating ${langCode}/translation.json:`, error.message);
  }
});

console.log('🎉 Translation update completed!');
