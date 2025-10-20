const fs = require('fs');
const path = require('path');

// Read the English translation file as the template
const englishFile = path.join(__dirname, '../locales/en/translation.json');
const englishData = JSON.parse(fs.readFileSync(englishFile, 'utf8'));

// List of all language codes
const languages = [
  'zh', 'hi', 'es', 'fr', 'ar', 'bn', 'pt', 'ru', 'ur',
  'id', 'de', 'ja', 'sw', 'it', 'ko', 'vi', 'pl', 'th', 'nl', 'fa',
  'tl', 'ta', 'pa', 'ms', 'uk', 'he', 'el', 'my', 'tr'
];

// Function to recursively merge objects, preserving existing translations
function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) {
        target[key] = {};
      }
      deepMerge(target[key], source[key]);
    } else {
      // Always update with the source value to ensure complete structure
      target[key] = source[key];
    }
  }
  return target;
}

// Function to create complete translation structure
function createCompleteStructure(langCode, existingData = {}) {
  // Start with a deep copy of the English structure
  const completeStructure = JSON.parse(JSON.stringify(englishData));
  
  // If there's existing data, merge it while preserving the complete structure
  if (existingData && Object.keys(existingData).length > 0) {
    // First, merge the existing data into the complete structure
    deepMerge(completeStructure, existingData);
  }
  
  return completeStructure;
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
    
    // Create complete structure with existing translations preserved
    const newData = createCompleteStructure(langCode, existingData);
    
    // Write the updated file
    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), 'utf8');
    
    // Count lines for verification
    const lines = fs.readFileSync(filePath, 'utf8').split('\n').length;
    console.log(`✅ Updated ${langCode}/translation.json (${lines} lines)`);
    
  } catch (error) {
    console.error(`❌ Error updating ${langCode}/translation.json:`, error.message);
  }
});

console.log('🎉 Final translation structure update completed!');
