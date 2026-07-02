const fs = require('fs');
const path = require('path');

const targetName = "मिठ्ठो चिया & Tiffin घर";

const replacements = [
  { regex: /मिठ्ठो चिया & Tiffin घर/g, replace: targetName },
  { regex: /मिठ्ठो चिया & Tiffin घर/gi, replace: targetName },
  { regex: /मिठ्ठो चिया & Tiffin घर/g, replace: targetName },
  { regex: /मिठ्ठो चिया & Tiffin घर/g, replace: targetName },
  { regex: /मिठ्ठो चिया & Tiffin घर/g, replace: targetName },
  { regex: /मिठ्ठो चिया & Tiffin घर/gi, replace: targetName },
  { regex: /मिठ्ठो चिया & Tiffin घर/g, replace: targetName },
  { regex: /restaurant_backup/g, replace: "restaurant_backup" },
  { regex: /@aslenix\.com/g, replace: "@restaurant.com" },
  { regex: /www\.aslenix\.com/g, replace: "www.restaurant.com" }
];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('dist')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.html') || file.endsWith('.json')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(__dirname);
let changedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  replacements.forEach(rule => {
    content = content.replace(rule.regex, rule.replace);
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${file}`);
    changedFiles++;
  }
});

console.log(`Replacement complete! Modified ${changedFiles} files.`);
