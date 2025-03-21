#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs');
const path = require('path');
const quicktype = require('quicktype-core');
const chalk = require('chalk');
const ora = require('ora');
const https = require('https');
const http = require('http');
const figlet = require('figlet');
const version = require('../package.json').version;

// Display ASCII art banner
console.log(
  chalk.cyan(
    figlet.textSync('trainxm', { horizontalLayout: 'full' })
  )
);

program
  .name('trainxm')
  .description('CLI tool to generate types from JSON data')
  .version(version);

program
  .command('generate')
  .description('Generate types from JSON source (file or URL)')
  .requiredOption('-s, --source <source>', 'JSON source (local file path or URL)')
  .option('-o, --output <directory>', 'Output directory for generated types', './types')
  .option('-n, --name <n>', 'Name for the generated types', 'ApiTypes')
  .option('-l, --lang <language>', 'Target language', 'typescript')
  .option('-h, --headers <headers>', 'HTTP headers in JSON format (only for URL sources)', '{}')
  .action(async (options) => {
    const spinner = ora('Processing JSON data...').start();
    try {
      let jsonData;
      
      // Determine if source is a URL or a local file
      if (options.source.startsWith('http://') || options.source.startsWith('https://')) {
        // Parse headers if provided
        const headers = JSON.parse(options.headers);
        
        // Fetch the JSON data from URL using native http/https
        spinner.text = 'Fetching JSON from URL...';
        jsonData = await fetchJsonFromUrl(options.source, headers);
      } else {
        // Read from local file
        spinner.text = 'Reading local JSON file...';
        const filePath = path.resolve(process.cwd(), options.source);
        if (!fs.existsSync(filePath)) {
          spinner.fail(`File not found: ${filePath}`);
          process.exit(1);
        }
        jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      }
      
      spinner.text = 'Generating types...';
      
      // Ensure output directory exists
      if (!fs.existsSync(options.output)) {
        fs.mkdirSync(options.output, { recursive: true });
      }
      
      // Generate types with quicktype
      const jsonInput = quicktype.jsonInputForTargetLanguage(options.lang);
      await jsonInput.addSource({
        name: options.name,
        samples: [JSON.stringify(jsonData)]
      });
      
      const inputData = new quicktype.InputData();
      inputData.addInput(jsonInput);
      
      const qtOptions = {
        lang: options.lang,
        renderOptions: {
          just_types: options.lang === 'typescript',
          runtime_typecheck: true,
        }
      };
      
      const result = await quicktype.quicktype(inputData, qtOptions);
      
      // Write the generated types to a file
      const outputFilename = path.join(
        options.output, 
        `${options.name}.${getFileExtension(options.lang)}`
      );
      fs.writeFileSync(outputFilename, result.lines.join('\n'));
      
      spinner.succeed(chalk.green(`Types generated successfully: ${outputFilename}`));
    } catch (error) {
      spinner.fail(chalk.red('Error generating types'));
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

program
  .command('batch')
  .description('Generate types from multiple JSON sources defined in a config file')
  .requiredOption('-c, --config <file>', 'Config file path (JSON)')
  .option('-o, --output <directory>', 'Base output directory for generated types', './types')
  .action(async (options) => {
    try {
      // Read and parse config file
      const configPath = path.resolve(process.cwd(), options.config);
      if (!fs.existsSync(configPath)) {
        console.error(chalk.red(`Config file not found: ${configPath}`));
        process.exit(1);
      }
      
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      
      if (!Array.isArray(config.sources)) {
        console.error(chalk.red('Config file must contain a "sources" array'));
        process.exit(1);
      }
      
      // Process each source
      for (const source of config.sources) {
        const spinner = ora(`Processing ${source.name}...`).start();
        
        try {
          let jsonData;
          
          // Determine if source is a URL or a local file
          if (source.source.startsWith('http://') || source.source.startsWith('https://')) {
            // Parse headers if provided
            const headers = source.headers || {};
            
            // Fetch the JSON data from URL
            spinner.text = 'Fetching JSON from URL...';
            jsonData = await fetchJsonFromUrl(source.source, headers);
          } else {
            // Read from local file
            spinner.text = 'Reading local JSON file...';
            const filePath = path.resolve(process.cwd(), source.source);
            if (!fs.existsSync(filePath)) {
              spinner.fail(`File not found: ${filePath}`);
              continue;
            }
            jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          }
          
          // Ensure output directory exists
          const outputDir = path.join(options.output, source.outputDir || '');
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }
          
          // Generate types with quicktype
          const lang = source.lang || 'typescript';
          const jsonInput = quicktype.jsonInputForTargetLanguage(lang);
          await jsonInput.addSource({
            name: source.name,
            samples: [JSON.stringify(jsonData)]
          });
          
          const inputData = new quicktype.InputData();
          inputData.addInput(jsonInput);
          
          const qtOptions = {
            lang: lang,
            renderOptions: {
              just_types: lang === 'typescript',
              runtime_typecheck: true,
            }
          };
          
          const result = await quicktype.quicktype(inputData, qtOptions);
          
          // Write the generated types to a file
          const outputFilename = path.join(
            outputDir, 
            `${source.name}.${getFileExtension(lang)}`
          );
          fs.writeFileSync(outputFilename, result.lines.join('\n'));
          
          spinner.succeed(chalk.green(`Types for ${source.name} generated: ${outputFilename}`));
        } catch (error) {
          spinner.fail(chalk.red(`Error processing ${source.name}`));
          console.error('Error:', error.message);
        }
      }
      
    } catch (error) {
      console.error(chalk.red('Error processing batch config:'), error.message);
      process.exit(1);
    }
  });

// Helper function to get the appropriate file extension based on language
function getFileExtension(language) {
  const extensions = {
    typescript: 'ts',
    javascript: 'js',
    flow: 'js',
    swift: 'swift',
    kotlin: 'kt',
    java: 'java',
    go: 'go',
    rust: 'rs',
    csharp: 'cs',
    python: 'py',
    ruby: 'rb',
    dart: 'dart',
  };
  
  return extensions[language] || 'txt';
}

// Helper function to fetch JSON from a URL using native http/https
function fetchJsonFromUrl(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers
    };
    
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (error) {
            reject(new Error('Invalid JSON response'));
          }
        } else {
          reject(new Error(`Request failed with status code: ${res.statusCode}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

// Parse command line arguments
program.parse(process.argv);

// If no arguments provided, show help
if (!process.argv.slice(2).length) {
  program.help();
}